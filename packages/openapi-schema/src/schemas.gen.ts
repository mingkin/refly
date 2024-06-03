// This file is auto-generated by @hey-api/openapi-ts

export const $WeblinkMeta = {
  type: 'object',
  description: 'Weblink metadata',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      description: 'Weblink URL',
      example: 'https://www.google.com',
    },
    title: {
      type: 'string',
      description: 'Weblink title',
      example: 'Google',
    },
    linkId: {
      type: 'string',
      description: 'Weblink ID (if it already exists)',
      example: 'l-g30e1b80b5g1itbemc0g5jj3',
    },
    storageKey: {
      type: 'string',
      description: 'Storage key for the weblink',
      deprecated: true,
    },
  },
} as const;

export const $ResourceMeta = {
  description: 'Resource metadata',
  oneOf: [
    {
      $ref: '#/components/schemas/WeblinkMeta',
    },
  ],
} as const;

export const $ResourceType = {
  type: 'string',
  description: 'Resource type',
  enum: ['weblink'],
} as const;

export const $ResourceListItem = {
  type: 'object',
  required: ['resourceId', 'resourceType', 'title', 'isPublic', 'createdAt', 'updatedAt'],
  properties: {
    resourceId: {
      type: 'string',
      description: 'Resource ID',
      example: 'r-g30e1b80b5g1itbemc0g5jj3',
    },
    resourceType: {
      description: 'Resource type',
      $ref: '#/components/schemas/ResourceType',
    },
    title: {
      type: 'string',
      description: 'Resource title',
    },
    description: {
      type: 'string',
      description: 'Resource description',
    },
    data: {
      type: 'object',
      description: 'Resource metadata',
      $ref: '#/components/schemas/ResourceMeta',
    },
    isPublic: {
      type: 'boolean',
      description: 'Whether this resource is public',
      default: false,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Collection creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Collection creation time',
    },
  },
} as const;

export const $CollectionListItem = {
  type: 'object',
  required: ['collectionId', 'title', 'createdAt', 'updatedAt'],
  properties: {
    collectionId: {
      type: 'string',
      description: 'Collection ID',
      example: 'cl-g30e1b80b5g1itbemc0g5jj3',
    },
    title: {
      type: 'string',
      description: 'Collection title',
      example: 'Default Collection',
    },
    description: {
      type: 'string',
      description: 'Collection description',
      example: 'Collection description',
    },
    isPublic: {
      type: 'boolean',
      description: 'Whether this collection is public',
      default: false,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Collection creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Collection creation time',
    },
  },
} as const;

export const $ResourceDetail = {
  allOf: [
    {
      $ref: '#/components/schemas/ResourceListItem',
    },
    {
      type: 'object',
      properties: {
        doc: {
          type: 'string',
          description: 'Document content for this resource',
        },
      },
    },
  ],
} as const;

export const $CollectionDetail = {
  allOf: [
    {
      $ref: '#/components/schemas/CollectionListItem',
    },
    {
      type: 'object',
      properties: {
        resources: {
          type: 'array',
          description: 'Collection resources',
          items: {
            $ref: '#/components/schemas/ResourceListItem',
          },
        },
      },
    },
  ],
} as const;

export const $SourceMeta = {
  type: 'object',
  description: 'Source metadata',
  required: ['pageContent', 'score'],
  properties: {
    source: {
      type: 'string',
      description: 'Source URL',
    },
    title: {
      type: 'string',
      description: 'Source title',
    },
    publishedTime: {
      type: 'string',
      format: 'date-time',
      description: 'Source publish time',
    },
    collectionId: {
      type: 'string',
      description: 'Related collection ID',
    },
    collectionName: {
      type: 'string',
      description: 'Related collection name',
    },
    resourceId: {
      type: 'string',
      description: 'Related resource ID',
    },
    resourceName: {
      type: 'string',
      description: 'Related resource name',
    },
  },
} as const;

export const $SourceSelection = {
  type: 'object',
  description: 'Source selection',
  required: ['content', 'type'],
  properties: {
    xPath: {
      type: 'string',
      description: 'Selected xPath',
      deprecated: true,
    },
    content: {
      type: 'string',
      description: 'Selected content',
    },
    type: {
      type: 'string',
      description: 'Selection type',
      enum: ['text', 'table', 'link', 'image', 'video', 'audio'],
    },
  },
} as const;

export const $Source = {
  type: 'object',
  description: 'Source of the message',
  required: ['pageContent'],
  properties: {
    url: {
      type: 'string',
      description: 'Source URL',
    },
    title: {
      type: 'string',
      description: 'Source title',
    },
    pageContent: {
      type: 'string',
      description: 'Source content',
    },
    score: {
      type: 'number',
      description: 'Relativity score',
    },
    metadata: {
      type: 'object',
      description: 'Source metadata',
      deprecated: true,
      $ref: '#/components/schemas/SourceMeta',
    },
    selections: {
      type: 'array',
      description: 'Source selections',
      items: {
        $ref: '#/components/schemas/SourceSelection',
      },
    },
  },
} as const;

export const $MessageType = {
  type: 'string',
  description: 'Chat message type',
  enum: ['ai', 'human', 'system'],
} as const;

export const $ChatMessage = {
  type: 'object',
  description: 'Chat message',
  required: ['msgId', 'type', 'content'],
  properties: {
    msgId: {
      type: 'string',
      description: 'Message ID',
      example: 'm-g30e1b80b5g1itbemc0g5jj3',
    },
    type: {
      description: 'Message type',
      $ref: '#/components/schemas/MessageType',
    },
    content: {
      type: 'string',
      description: 'Message content',
      example: 'Hello',
    },
    relatedQuestions: {
      type: 'array',
      description: 'Related questions',
      items: {
        type: 'string',
      },
    },
    sources: {
      type: 'array',
      description: 'Related sources',
      items: {
        $ref: '#/components/schemas/Source',
      },
    },
    selectedWeblinkConfig: {
      type: 'string',
      description: 'Selected weblink config (JSON)',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Message creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Message update time',
    },
  },
} as const;

export const $Conversation = {
  type: 'object',
  description: 'Conversation list item',
  properties: {
    convId: {
      type: 'string',
      description: 'Conversation ID',
      example: 'cv-g30e1b80b5g1itbemc0g5jj3',
    },
    title: {
      type: 'string',
      description: 'Conversation title',
      example: 'Default Conversation',
    },
    lastMessage: {
      type: 'string',
      description: 'Last message content',
      example: 'Hello',
    },
    messageCount: {
      type: 'number',
      description: 'Number of chat messages in this conversation',
      example: 42,
    },
    cid: {
      type: 'string',
      description: 'Related content ID',
      example: 'c-g30e1b80b5g1itbemc0g5jj3',
    },
    locale: {
      description: 'Conversation locale',
      type: 'string',
      example: 'en',
    },
    origin: {
      type: 'string',
      description: 'Origin page host',
      example: 'https://refly.ai',
    },
    originPageTitle: {
      type: 'string',
      description: 'Origin page title',
      example: 'Refly | Where knowledge thrives',
    },
    originPageUrl: {
      type: 'string',
      description: 'Origin page url',
      example: 'https://refly.ai/knowledge-base',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Conversation creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Conversation creation time',
    },
    messages: {
      type: 'array',
      description: 'Conversation messages (only returned for getConversationDetail api)',
      items: {
        $ref: '#/components/schemas/ChatMessage',
      },
    },
  },
} as const;

export const $ChatTaskType = {
  type: 'string',
  description: 'Chat task type',
  enum: ['chat', 'genTitle', 'quickAction', 'searchEnhanceKeyword', 'searchEnhanceSummarize', 'searchEnhanceAsk'],
} as const;

export const $RetrieveFilter = {
  type: 'object',
  description: 'Content retrieval filter',
  properties: {
    weblinkList: {
      type: 'array',
      description: 'List of web links',
      items: {
        $ref: '#/components/schemas/Source',
      },
      deprecated: true,
    },
    urls: {
      type: 'array',
      description: 'List of URLs to retrieve',
      items: {
        type: 'string',
        example: 'https://refly.ai',
      },
    },
    resourceIds: {
      type: 'array',
      description: 'List of resource IDs to retrieve',
      items: {
        type: 'string',
        example: 'r-g30e1b80b5g1itbemc0g5jj3',
      },
    },
    collectionIds: {
      type: 'array',
      description: 'List of collection IDs to retrieve',
      items: {
        type: 'string',
        example: 'cl-g30e1b80b5g1itbemc0g5jj3',
      },
    },
  },
} as const;

export const $ChatPayload = {
  type: 'object',
  description: 'Chat payload',
  required: ['question'],
  properties: {
    question: {
      type: 'string',
      description: 'Question',
    },
    filter: {
      type: 'object',
      description: 'Content retrieval filter',
      $ref: '#/components/schemas/RetrieveFilter',
    },
  },
} as const;

export const $QuickActionType = {
  type: 'string',
  description: 'Quick action type',
  enum: ['selection', 'summary'],
} as const;

export const $QuickActionTaskPayload = {
  type: 'object',
  description: 'Quick action task payload',
  properties: {
    question: {
      type: 'string',
      description: 'Question',
    },
    actionType: {
      description: 'Quick action type',
      $ref: '#/components/schemas/QuickActionType',
    },
    actionPrompt: {
      type: 'string',
      description: 'Prompt for this action',
    },
    reference: {
      type: 'string',
      description: 'Reference for this action',
    },
    filter: {
      description: 'Content retrieval filter',
      $ref: '#/components/schemas/RetrieveFilter',
    },
  },
} as const;

export const $ChatTask = {
  type: 'object',
  description: 'Chat task',
  required: ['taskType'],
  properties: {
    taskType: {
      description: 'Task type',
      $ref: '#/components/schemas/ChatTaskType',
    },
    dryRun: {
      description: 'Whether to dry run the task',
      type: 'boolean',
      default: false,
    },
    convId: {
      description: 'Conversation ID, a new conversation will be created if empty or non-existent',
      type: 'string',
      example: 'cv-g30e1b80b5g1itbemc0g5jj3',
    },
    createConvParam: {
      description: 'Create conversation parameters',
      $ref: '#/components/schemas/CreateConversationRequest',
    },
    locale: {
      description: 'Chat locale',
      type: 'string',
      example: 'en',
    },
    data: {
      description: 'Chat data',
      oneOf: [
        {
          $ref: '#/components/schemas/ChatPayload',
        },
        {
          $ref: '#/components/schemas/QuickActionTaskPayload',
        },
      ],
    },
  },
} as const;

export const $ChatTaskResponse = {
  type: 'object',
  description: 'Chat task response',
  required: ['sources', 'answer'],
  properties: {
    sources: {
      type: 'array',
      description: 'List of web links',
      items: {
        $ref: '#/components/schemas/Source',
      },
    },
    answer: {
      type: 'string',
      description: 'Chat Answer',
    },
    relatedQuestions: {
      type: 'array',
      description: 'Related questions',
      items: {
        type: 'string',
      },
    },
  },
} as const;

export const $IndexStatus = {
  type: 'string',
  description: 'Resource index status',
  enum: ['init', 'processing', 'finish', 'failed', 'unavailable'],
} as const;

export const $ParseSource = {
  type: 'string',
  description: 'Weblink parse source',
  enum: ['serverCrawl', 'clientUpload'],
} as const;

export const $PingWeblinkData = {
  type: 'object',
  properties: {
    linkId: {
      type: 'string',
      description: 'Weblink ID',
      example: 'l-g30e1b80b5g1itbemc0g5jj3',
    },
    parseStatus: {
      description: 'Weblink parse status',
      $ref: '#/components/schemas/IndexStatus',
    },
    chunkStatus: {
      description: 'Weblink chunking status',
      $ref: '#/components/schemas/IndexStatus',
    },
    summary: {
      type: 'string',
      description: 'Summary of the weblink',
      example: 'The summary of the weblink',
    },
    relatedQuestions: {
      type: 'array',
      description: 'Related questions for this weblink summary',
      items: {
        type: 'string',
        example: 'What is the summary of the weblink?',
      },
    },
    parseSource: {
      description: 'Weblink parse source',
      $ref: '#/components/schemas/ParseSource',
    },
  },
} as const;

export const $Weblink = {
  type: 'object',
  properties: {
    linkId: {
      type: 'string',
      description: 'Weblink ID',
      example: 'l-g30e1b80b5g1itbemc0g5jj3',
    },
    url: {
      type: 'string',
      description: 'Weblink URL',
      example: 'https://www.google.com',
    },
    title: {
      type: 'string',
      description: 'Weblink title',
      example: 'Google',
    },
    storageKey: {
      type: 'string',
      description: 'Weblink document storage key',
    },
    origin: {
      type: 'string',
      description: 'Origin page host',
      example: 'https://refly.ai',
    },
    originPageTitle: {
      type: 'string',
      description: 'Origin page title',
      example: 'Refly | Where knowledge thrives',
    },
    originPageUrl: {
      type: 'string',
      description: 'Origin page url',
      example: 'https://refly.ai/knowledge-base',
    },
    originPageDescription: {
      type: 'string',
      description: 'Origin page description',
      example: 'The knowledge base for developers',
    },
    visitCount: {
      type: 'number',
      description: 'Weblink visit count',
      example: 1,
    },
    lastVisitTime: {
      type: 'number',
      description: 'UNIX timestamp for last visit time',
    },
    readTime: {
      type: 'number',
      description: 'Read time in seconds',
      example: 60,
    },
    indexStatus: {
      description: 'Weblink index status',
      $ref: '#/components/schemas/IndexStatus',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Weblink creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Weblink update time',
    },
  },
} as const;

export const $Content = {
  type: 'object',
  required: ['cid', 'contentId', 'title', 'createdAt', 'updatedAt'],
  properties: {
    cid: {
      type: 'string',
      description: 'Content ID',
      example: 'c-g30e1b80b5g1itbemc0g5jj3',
    },
    contentId: {
      type: 'string',
      description: 'Content ID',
      example: 'c-g30e1b80b5g1itbemc0g5jj3',
    },
    title: {
      type: 'string',
      description: 'Content title',
    },
    abstract: {
      type: 'string',
      description: 'Content abstract',
    },
    meta: {
      type: 'string',
      description: 'Content metadata',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Content creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Content update time',
    },
  },
} as const;

export const $ContentMetaRecord = {
  type: 'object',
  required: ['key', 'name', 'score', 'reason'],
  properties: {
    key: {
      type: 'string',
      description: 'Meta key',
      example: 'startup_product_research',
    },
    name: {
      type: 'string',
      description: 'Meta name',
      example: 'Startup Product Research',
    },
    score: {
      type: 'number',
      description: 'Meta relativity score',
      example: 0.9,
    },
    reason: {
      type: 'string',
      description: 'Reason for classification',
      example: 'The content is related to startup product research',
    },
  },
} as const;

export const $ContentMeta = {
  type: 'object',
  properties: {
    topics: {
      type: 'array',
      description: 'Topic list',
      items: {
        $ref: '#/components/schemas/ContentMetaRecord',
      },
    },
    contentType: {
      type: 'array',
      description: 'Content type list',
      items: {
        $ref: '#/components/schemas/ContentMetaRecord',
      },
    },
    formats: {
      type: 'array',
      description: 'Content format list',
      items: {
        $ref: '#/components/schemas/ContentMetaRecord',
      },
    },
  },
} as const;

export const $ContentDetail = {
  allOf: [
    {
      $ref: '#/components/schemas/Content',
    },
    {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Content',
          example: 'The actual content',
        },
        sources: {
          type: 'string',
          description: 'Content source list (JSON)',
        },
        inputs: {
          type: 'array',
          description: 'Content input list',
          items: {
            $ref: '#/components/schemas/ContentDetail',
          },
        },
        meta: {
          description: 'Content metadata',
          $ref: '#/components/schemas/ContentMeta',
        },
      },
    },
  ],
} as const;

export const $Digest = {
  allOf: [
    {
      $ref: '#/components/schemas/Content',
    },
    {
      type: 'object',
      required: ['topicKey', 'date'],
      properties: {
        topicKey: {
          type: 'string',
          description: 'Topic key',
        },
        uid: {
          type: 'string',
          description: 'User ID',
        },
        date: {
          type: 'string',
          description: 'Digest date',
        },
      },
    },
  ],
} as const;

export const $Feed = {
  allOf: [
    {
      $ref: '#/components/schemas/Content',
    },
    {
      type: 'object',
      properties: {
        readCount: {
          type: 'number',
          description: 'Read count',
        },
        askFollow: {
          type: 'number',
          description: 'Ask follow count',
        },
      },
    },
  ],
} as const;

export const $UserSettings = {
  type: 'object',
  required: ['uid', 'avatar', 'name', 'email'],
  properties: {
    uid: {
      type: 'string',
      description: 'User ID',
      example: 'u-g30e1b80b5g1itbemc0g5jj3',
    },
    avatar: {
      type: 'string',
      description: 'User avatar',
      example: 'https://www.gstatic.com/webp/gallery/1.jpg',
    },
    name: {
      type: 'string',
      description: 'User name',
      example: 'John Doe',
    },
    email: {
      type: 'string',
      description: 'User email',
      example: '6XJpZ@example.com',
    },
    emailVerified: {
      type: 'boolean',
      description: 'Whether email is verified',
      default: false,
    },
    uiLocale: {
      type: 'string',
      description: 'User UI locale',
      example: 'en',
    },
    outputLocale: {
      type: 'string',
      description: 'User output locale',
      example: 'en',
    },
  },
} as const;

export const $TopicMeta = {
  type: 'object',
  properties: {
    topicId: {
      type: 'string',
      description: 'Topic ID',
      example: 't-g30e1b80b5g1itbemc0g5jj3',
    },
    key: {
      type: 'string',
      description: 'Topic key',
      example: 'startup_product_research',
    },
    name: {
      type: 'string',
      description: 'Topic name',
    },
    description: {
      type: 'string',
      description: 'Topic description',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Topic creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Topic update time',
    },
  },
} as const;

export const $Topic = {
  type: 'object',
  required: ['score', 'topicKey', 'topic', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'number',
      description: 'Topic ID',
      deprecated: true,
    },
    score: {
      type: 'number',
      description: 'Topic score',
    },
    topicKey: {
      type: 'string',
      description: 'Topic key',
    },
    topic: {
      description: 'Topic meta',
      $ref: '#/components/schemas/TopicMeta',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Topic creation time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Topic update time',
    },
  },
} as const;

export const $UserTopics = {
  type: 'object',
  required: ['topics', 'total'],
  properties: {
    list: {
      type: 'array',
      description: 'Topic list',
      items: {
        $ref: '#/components/schemas/Topic',
      },
    },
    total: {
      type: 'number',
      description: 'Total count of topics',
    },
  },
} as const;

export const $BaseResponse = {
  type: 'object',
  required: ['success'],
  properties: {
    success: {
      type: 'boolean',
      description: 'Whether the operation was successful',
      example: true,
    },
    errMsg: {
      type: 'string',
      description: 'Error message',
      example: 'Operation failed',
    },
  },
} as const;

export const $UpsertResourceRequest = {
  type: 'object',
  required: ['resourceType', 'data'],
  properties: {
    resourceType: {
      description: 'Resource type',
      $ref: '#/components/schemas/ResourceType',
    },
    title: {
      type: 'string',
      description: 'Resource title',
      example: 'My Resource',
    },
    resourceId: {
      type: 'string',
      description: 'Resource ID (only used for update)',
      example: 'r-g30e1b80b5g1itbemc0g5jj3',
    },
    collectionId: {
      type: 'string',
      description: 'Collection ID (will create new collection if empty)',
      example: 'cl-g30e1b80b5g1itbemc0g5jj3',
    },
    collectionName: {
      type: 'string',
      description: 'Collection name',
      example: 'New Collection',
    },
    data: {
      description: 'Resource metadata',
      $ref: '#/components/schemas/ResourceMeta',
    },
    storageKey: {
      type: 'string',
      description: 'Storage key for the resource',
    },
    content: {
      type: 'string',
      description: 'Resource content (this will be ignored if storageKey was set)',
    },
    isPublic: {
      type: 'boolean',
      description: 'Whether this resource is public',
      default: false,
    },
  },
} as const;

export const $UpsertResourceResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          $ref: '#/components/schemas/ResourceListItem',
        },
      },
    },
  ],
} as const;

export const $DeleteResourceRequest = {
  type: 'object',
  required: ['resourceId'],
  properties: {
    resourceId: {
      type: 'string',
      description: 'Resource ID to delete',
      example: 'r-g30e1b80b5g1itbemc0g5jj3',
    },
  },
} as const;

export const $ListResourceResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Resource list',
          items: {
            $ref: '#/components/schemas/ResourceListItem',
          },
        },
      },
    },
  ],
} as const;

export const $GetResourceDetailResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Resource data',
          $ref: '#/components/schemas/ResourceDetail',
        },
      },
    },
  ],
} as const;

export const $UpsertCollectionRequest = {
  type: 'object',
  properties: {
    collectionId: {
      type: 'string',
      description: 'Collection ID (only used for update)',
      example: 'cl-g30e1b80b5g1itbemc0g5jj3',
    },
    title: {
      type: 'string',
      description: 'Collection title',
      example: 'My Collection',
    },
    description: {
      type: 'string',
      description: 'Collection description',
      example: 'Collection description',
    },
    isPublic: {
      type: 'boolean',
      description: 'Whether this collection is public',
      default: false,
    },
  },
} as const;

export const $UpsertCollectionResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          $ref: '#/components/schemas/CollectionListItem',
        },
      },
    },
  ],
} as const;

export const $DeleteCollectionRequest = {
  type: 'object',
  required: ['collectionId'],
  properties: {
    collectionId: {
      type: 'string',
      description: 'Collection ID to delete',
      example: 'cl-g30e1b80b5g1itbemc0g5jj3',
    },
  },
} as const;

export const $ListCollectionResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Collection list',
          items: {
            $ref: '#/components/schemas/CollectionListItem',
          },
        },
      },
    },
  ],
} as const;

export const $GetCollectionDetailResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Collection data',
          $ref: '#/components/schemas/CollectionDetail',
        },
      },
    },
  ],
} as const;

export const $CreateConversationRequest = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Conversation title',
      example: 'My Conversation',
    },
    cid: {
      type: 'string',
      description: 'Related content ID',
      example: 'c-g30e1b80b5g1itbemc0g5jj3',
    },
    linkId: {
      type: 'string',
      description: 'Related link ID',
      example: 'l-g30e1b80b5g1itbemc0g5jj3',
    },
    locale: {
      type: 'string',
      description: 'Conversation locale',
      example: 'en',
    },
    origin: {
      type: 'string',
      description: 'Origin page host',
      example: 'https://refly.ai',
    },
    originPageTitle: {
      type: 'string',
      description: 'Origin page title',
      example: 'Refly | Where knowledge thrives',
    },
    originPageUrl: {
      type: 'string',
      description: 'Origin page url',
      example: 'https://refly.ai/knowledge-base',
    },
  },
} as const;

export const $CreateConversationResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Created conversation',
          $ref: '#/components/schemas/Conversation',
        },
      },
    },
  ],
} as const;

export const $ListConversationResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Conversation list',
          items: {
            $ref: '#/components/schemas/Conversation',
          },
        },
      },
    },
  ],
} as const;

export const $ChatRequest = {
  type: 'object',
  properties: {
    task: {
      description: 'chat task config',
      $ref: '#/components/schemas/ChatTask',
    },
  },
} as const;

export const $GetConversationDetailResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Conversation data',
          $ref: '#/components/schemas/Conversation',
        },
      },
    },
  ],
} as const;

export const $PingWeblinkResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Weblink ping result',
          $ref: '#/components/schemas/PingWeblinkData',
        },
      },
    },
  ],
} as const;

export const $StoreWeblinkRequest = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      description: 'Weblink list',
      items: {
        $ref: '#/components/schemas/Weblink',
      },
    },
  },
} as const;

export const $ListWeblinkResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Weblink list',
          items: {
            $ref: '#/components/schemas/Weblink',
          },
        },
      },
    },
  ],
} as const;

export const $ListFeedResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Feed list',
          items: {
            $ref: '#/components/schemas/Feed',
          },
        },
      },
    },
  ],
} as const;

export const $ListDigestRequest = {
  type: 'object',
  properties: {
    page: {
      type: 'number',
      description: 'Page number',
      default: 1,
    },
    pageSize: {
      type: 'number',
      description: 'Page size',
      default: 10,
    },
    filter: {
      type: 'object',
      description: 'Digest query filter',
      properties: {
        date: {
          type: 'object',
          description: 'Date filter',
          properties: {
            year: {
              type: 'number',
              description: 'Year',
            },
            month: {
              type: 'number',
              description: 'Month',
            },
            day: {
              type: 'number',
              description: 'Day',
            },
          },
        },
        topic: {
          type: 'string',
          description: 'Topic filter',
        },
      },
    },
  },
} as const;

export const $ListDigestResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Digest list',
          items: {
            $ref: '#/components/schemas/Digest',
          },
        },
      },
    },
  ],
} as const;

export const $GetContentDetailResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Content data',
          $ref: '#/components/schemas/ContentDetail',
        },
      },
    },
  ],
} as const;

export const $UpdateUserSettingsRequest = {
  type: 'object',
  properties: {
    uiLocale: {
      type: 'string',
      description: 'UI locale',
      example: 'en',
    },
    outputLocale: {
      type: 'string',
      description: 'Output locale',
      example: 'en',
    },
  },
} as const;

export const $GetUserSettingsResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'User settings data',
          $ref: '#/components/schemas/UserSettings',
        },
      },
    },
  ],
} as const;

export const $GetUserTopicsResponse = {
  allOf: [
    {
      $ref: '#/components/schemas/BaseResponse',
    },
    {
      type: 'object',
      properties: {
        data: {
          description: 'User topics',
          $ref: '#/components/schemas/UserTopics',
        },
      },
    },
  ],
} as const;
