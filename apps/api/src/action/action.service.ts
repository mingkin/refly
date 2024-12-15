import { PrismaService } from '@/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { ActionResultNotFoundError } from '@refly-packages/errors';
import { GetActionResultData, User } from '@refly-packages/openapi-schema';

@Injectable()
export class ActionService {
  constructor(private readonly prisma: PrismaService) {}

  async getActionResult(user: User, param: GetActionResultData['query']) {
    const { resultId } = param;

    const result = await this.prisma.actionResult.findUnique({
      where: {
        resultId,
        uid: user.uid,
      },
    });
    if (!result) {
      throw new ActionResultNotFoundError();
    }

    // If the result is executing and the last updated time is more than 3 minutes ago,
    // mark it as failed.
    if (result.status === 'executing' && result.updatedAt < new Date(Date.now() - 1000 * 60 * 3)) {
      const updatedResult = await this.prisma.actionResult.update({
        where: { resultId, status: 'executing' },
        data: {
          status: 'failed',
          errors: `["Execution timeout"]`,
        },
      });
      return updatedResult;
    }

    const steps = await this.prisma.actionStep.findMany({
      where: { resultId, deletedAt: null },
      orderBy: { order: 'asc' },
    });
    return { ...result, steps };
  }
}
