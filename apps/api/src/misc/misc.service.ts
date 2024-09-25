import { BadRequestException, Inject, Injectable, StreamableFile, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import {
  EntityType,
  ModelInfo,
  ScrapeWeblinkRequest,
  ScrapeWeblinkResult,
  UploadResponse,
  User,
} from '@refly/openapi-schema';
import { PrismaService } from '@/common/prisma.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { MINIO_EXTERNAL, MinioService } from '@/common/minio.service';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { scrapeWeblink } from '@refly/utils';
import { pick, QUEUE_SYNC_STORAGE_USAGE } from '@/utils';
import { SyncStorageUsageJobData } from '@/subscription/subscription.dto';

@Injectable()
export class MiscService {
  private logger = new Logger(MiscService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private subscription: SubscriptionService,
    @Inject(MINIO_EXTERNAL) private minio: MinioService,
    @InjectQueue(QUEUE_SYNC_STORAGE_USAGE) private ssuQueue: Queue<SyncStorageUsageJobData>,
  ) {}

  async scrapeWeblink(body: ScrapeWeblinkRequest): Promise<ScrapeWeblinkResult> {
    const { url } = body;
    const result = await scrapeWeblink(url);

    return {
      title: result.title,
      description: result.description,
      image: result.image,
    };
  }

  async dumpFileFromURL(user: User, url: string): Promise<UploadResponse['data']> {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();

    return await this.uploadFile(user, {
      file: {
        buffer: Buffer.from(buffer),
        mimetype: res.headers.get('Content-Type') || 'application/octet-stream',
      },
    });
  }

  async checkEntity(user: User, entityId: string, entityType: EntityType): Promise<void> {
    if (!entityId || !entityType) {
      throw new BadRequestException('Entity ID and type are required');
    }

    if (entityType === 'resource') {
      const resource = await this.prisma.resource.findUnique({
        where: {
          resourceId: entityId,
          uid: user.uid,
          deletedAt: null,
        },
      });
      if (!resource) {
        throw new BadRequestException('Resource not found');
      }
    } else if (entityType === 'collection') {
      const collection = await this.prisma.collection.findUnique({
        where: {
          collectionId: entityId,
          uid: user.uid,
          deletedAt: null,
        },
      });
      if (!collection) {
        throw new BadRequestException('Collection not found');
      }
    } else if (entityType === 'note') {
      const note = await this.prisma.note.findUnique({
        where: {
          noteId: entityId,
          uid: user.uid,
          deletedAt: null,
        },
      });
      if (!note) {
        throw new BadRequestException('Note not found');
      }
    } else {
      throw new BadRequestException('Invalid entity type');
    }
  }

  async uploadFile(
    user: User,
    param: {
      file: Pick<Express.Multer.File, 'buffer' | 'mimetype'>;
      entityId?: string;
      entityType?: EntityType;
    },
    options?: { checkEntity?: boolean; checkStorageQuota?: boolean },
  ): Promise<UploadResponse['data']> {
    const { file, entityId, entityType } = param;

    if (options?.checkEntity) {
      await this.checkEntity(user, entityId, entityType);
    }

    if (options?.checkStorageQuota) {
      const usageResult = await this.subscription.checkStorageUsage(user);
      if (!usageResult.objectStorageAvailable) {
        throw new BadRequestException('Storage quota exceeded');
      }
    }

    const objectKey = randomUUID();
    const storageKey = `static/${objectKey}`;

    await this.prisma.staticFile.create({
      data: {
        uid: user.uid,
        storageKey,
        storageSize: file.buffer.length,
        entityId,
        entityType,
      },
    });

    await this.minio.client.putObject(storageKey, file.buffer, {
      'Content-Type': file.mimetype,
    });

    await this.ssuQueue.add({
      uid: user.uid,
      timestamp: new Date(),
    });

    return {
      url: `${this.config.get('staticEndpoint')}${storageKey}`,
    };
  }

  /**
   * Remove all files associated with an entity.
   */
  async removeFilesByEntity(
    user: User,
    param: { entityId: string; entityType: EntityType },
  ): Promise<void> {
    const { entityId, entityType } = param;
    this.logger.log(`Start to remove files for entity ${entityId} of type ${entityType}`);

    const files = await this.prisma.staticFile.findMany({
      select: {
        storageKey: true,
      },
      where: {
        uid: user.uid,
        entityId,
        entityType,
        deletedAt: null,
      },
    });
    await this.minio.client.removeObjects(files.map((file) => file.storageKey));
    this.logger.log(`Removed files: ${files.map((file) => file.storageKey).join(',')}`);

    await this.prisma.staticFile.updateMany({
      where: {
        uid: user.uid,
        entityId,
        entityType,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async compareAndRemoveFiles(
    user: User,
    param: { entityId: string; entityType: EntityType; objectKeys: string[] },
  ): Promise<void> {
    const { entityId, entityType, objectKeys } = param;
    const storageKeys = objectKeys.map((key) => `static/${key}`);
    const files = await this.prisma.staticFile.findMany({
      select: {
        storageKey: true,
      },
      where: {
        uid: user.uid,
        entityId,
        entityType,
        deletedAt: null,
      },
    });
    const currentStorageKeys = files.map((file) => file.storageKey);
    const storageKeysToRemove = currentStorageKeys.filter((key) => !storageKeys.includes(key));

    await this.minio.client.removeObjects(storageKeysToRemove);
    this.logger.log(`Compare and remove files: ${storageKeysToRemove.join(',')}`);

    if (storageKeysToRemove.length > 0) {
      await this.prisma.staticFile.updateMany({
        where: {
          uid: user.uid,
          entityId,
          entityType,
          storageKey: {
            in: storageKeysToRemove,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }
  }

  async getFileStream(objectKey: string): Promise<StreamableFile> {
    const data = await this.minio.client.getObject(`static/${objectKey}`);
    return new StreamableFile(data);
  }

  async listModels(): Promise<ModelInfo[]> {
    const models = await this.prisma.modelInfo.findMany({
      where: { enabled: true },
    });

    return models.map((model) => pick(model, ['name', 'label', 'provider', 'tier']));
  }
}
