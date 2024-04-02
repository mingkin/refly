import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Source } from '../types/weblink';
import { ContentMeta } from '../llm/dto';

export class Content {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  abstract: string;

  @ApiPropertyOptional()
  content?: string; // only returns in detail page

  @ApiProperty()
  meta: ContentMeta;

  @ApiProperty({ type: [Source] })
  source: Source[];
}

export class DigestFilter {
  @ApiPropertyOptional()
  date?: {
    year: number;
    month: number;
    day: number;
  };

  @ApiPropertyOptional()
  topic?: string;
}

export class DigestListRequest {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  pageSize?: number;

  @ApiProperty()
  filter: DigestFilter;
}

export class ContentDTO {
  id: string;
  title: string;
  abstract: string;
  contentId: string;
  meta: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Digest extends ContentDTO {
  topicKey: string;
  userId: string;
  date: string;
}

export class Feed extends ContentDTO {
  // 增加一些指标
  readCount?: number; // 阅读次数
  askFollow?: number; // 追问次数
}

export class FeedResponse {
  @ApiProperty({ type: [Feed] })
  data: Feed[];
}

export class DigestListResponse {
  data: Digest[];
}
