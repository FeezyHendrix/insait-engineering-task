export interface ISeedingParams {
  customerCount: number;
  interactionCount: number;
  percentOfConversationsEnded: number;
  unansweredQsCount: number;
  ticketCount: number;
  kbDocumentCount: number;
  clusterCount: number;
  questionsPerCluster: number;
}

export interface DashboardFinalResponse {
  earliestInteractionTimestamp: Date | null;
}

export interface AdminFinalResponse {
  peakTimeData: object;
  interactionDuration: string;
  userQueries: string;
  earliestInteractionTimestamp: any;
  ABConversionData: object;
  costPerConversationData: object;
  userMessagesPerConversationData: object;
  averageLengthOfClientMessages: number;
  averageLengthOfBotMessages: number;
  policyCounter: number;
  securityModuleCost: object;
  dataForMainContainer: object;
  averageLengthOfUserAndBotMessages: object;
}

export interface AdvancedAnalyticsFinalResponse {
  earliestInteractionTimestamp: object | null;
  sentimentDonutData: object;
  userPersonaData: object;
  conversationDepthBarData: object;
  userReturnData: object;
}

export interface Chat {
  conversation_id: string;
  messages?: Message[];
}

export interface Message {
  pov: 'bot' | 'user';
  text: string;
  time: string;
}

export interface ReceivedCustomer {
  id: string;
  firstName?: string;
  lastName?: string;
  personaClassification?: string;
  createdAt?: Date;
  isTestUser?: boolean;
  userAgent?: string;
}

enum LinkEnum {
  url = 'URL',
  email = 'EMAIL',
  phone = 'PHONE',
}
export interface Link {
        linkId: string;
        url: string;
        type: LinkEnum;
        count: number;
}
export interface ReceivedConfigType {
  chartName: string;
  active: boolean;
}

export interface InteractionObject {
  conversationId: string;
  userId: string;
  productId: string | null;
  startedTime: Date;
}

export interface Week {
  name: string;
  value: number;
  year: number;
  month: number;
}

export interface PeakTimeData {
  name: string;
  data: { x: string; y: number }[];
}

export interface StepCount {
  value: number;
  name: string;
  step: string;
  fill: string;
}

export type ChatChannel = 'SMS' | 'WHATSAPP' | 'WEB';


export interface ReceivedChat {
  id: string;
  customer_id: string;
  product_name: string;
  started_time: string;
  end_time: string;
  avg_response_time_per_query: number;
  end_status: string;
  positiveness_score: number;
  complexity_score: number;
  speed: number;
  messages: any;
  comment: string;
  bot_success: boolean;
  total_completion_tokens_used: number;
  total_prompt_tokens_used: number;
  query_knowledgebase: number;
  security_violations: number;
  security_prompt_tokens: number;
  security_completion_tokens: number;
  conversation_completion_tokens: number;
  conversation_prompt_tokens: number;
  security_violation_messages: any[];
  user_feedback: string;
  user_rating: number;
  form_data?: string | null;
  message_count?: number | null;
  history?: string | null;
  sentiment?: string | null;
  persona?: string | null;
  nodes?: string[];
  request_id?: string | null;
  external_id?: string | null;
  chat_channel?: ChatChannel | null;
  user_agent?: string | null;
  flow_id?: string | null;
  flow_name?: string | null;
}

export interface TestConversation {
  conversationId: string;
  userId: string;
  startedTime: Date;
  avgResponseTimePerQuery: number;
  endStatus: string;
  positivenessScore: number;
  complexityScore: number;
  speed: number;
  messages: any;
  comment: string;
  productId: string;
}

export interface Template {
  templateId: number;
  title: string;
  text: string;
}

export interface UnansweredQType {
  unansweredQId: string;
  conversationId: string;
  question: string;
  answer: string;
  reason: string;
  createdAt: string;
  archive: boolean;
}

export interface KnowledgeType {
  id: string;
  question: string;
  answer?: string | null;
  url?: string | null;
  createdAt: string;
  product: string;
  active: boolean | null;
}

export interface MessageType {
  id: string;
  pov: string;
  file: string;
  text: string;
  time: string;
  response_time: number;
}

export interface ChatbotConversationType {
  chat_language: string;
  chat_product: string;
  chat_status: string;
  company: string;
  conversation_id: string;
  bot_success: boolean;
  created_at: string;
  current_git_sha: string;
  history: string;
  messages: {
    file: string | null;
    id: string;
    pov: 'bot' | 'user';
    response_time: number | null;
    text: string;
    time: string;
  }[];
  total_completion_tokens_used: number;
  total_prompt_tokens_used: number;
  updated_at: string;
  user_id: string;
  queryKnowledgebase?: number | null;
  securityViolations?: number | null;
  securityModuleCost?: number | null;
  securityPromptTokens?: number | null;
  securityCompletionTokens?: number | null;
  conversationCompletionTokens?: number | null;
  conversationPromptTokens?: number | null;
  averageLengthOfUserAndBotMessages?: number | null;
  responseTimeFromAClient?: number | null;
}
export interface CompanyData {
  clickupName: string;
  assignees: string[];
  productName?: string
}
export interface AdminConversationType {
  conversationId: string;
  chatProduct: string | null;
  userId: string;
  startedTime: Date;
  endTime: Date | null;
  avgResponseTimePerQuery: number;
  endStatus: string;
  positivenessScore: number;
  complexityScore: number;
  speed: number;
  messages: any;
  comment: string;
  productId: string | null;
  botSuccess: boolean | null;
  totalCompletionTokensUsed: number | null;
  totalPromptTokensUsed: number | null;
  queryKnowledgebase?: number | null;
  securityViolations?: number | null;
  securityModuleCost?: number | null;
  securityPromptTokens?: number | null;
  securityCompletionTokens?: number | null;
  conversationCompletionTokens?: number | null;
  conversationPromptTokens?: number | null;
  averageLengthOfUserAndBotMessages?: number | null;
  responseTimeFromAClient?: number | null;
  securityViolationMessages?: any;
  userFeedback?: string | null;
  userRating?: number | null;
  dataObject?: any;
  chatChannel: ChatChannel | null;
  User?: {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
    personaClassification?: string | null;
    chatbotVisible?: boolean | null;
    signedUp?: boolean | null;
  } | null;
  Product?: {
    id: string;
    name: string;
    available?: boolean | null;
  } | null;
  flowId?: string | null;
  Flow?: {
    name: string;
  } | null;
}
export interface AdminUserType {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  personaClassification: string | null;
  chatbotVisible: boolean | null;
  signedUp: boolean | null;
}

export interface ProductType {
  id: string;
  name: string;
  available: boolean;
}

export interface FAQType {
  id: number;
  amount: number;
  productId: string;
  text: string;
}

export interface ChartsFinalResponse {
  responseTimeFromAClient?: object;
}

export interface chatPageConversationType {
  id: number;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  product: {
    title: string;
  };
  userRating?: number | null;
  createdAt: number;
  updatedAt: string | Date;
  chatId: string;
  endStatus: string;
  messageCount: string;
  messages: Message[];
  comment: string | null;
  dataObject?: string | null;
  botSuccess: boolean | null;
  userFeedback?: string | null;
  chatChannel: ChatChannel | null;
  flowName?: string | null;
  flowId?: string | null;
}

export interface PaginationResult {
  allConversations: chatPageConversationType[];
  totalRecords: number;
}

export interface ValidationResult {
  isDataValid: boolean;
  error: string;
}

export interface ConversationFilterType {
  endTime?: {
    lte?: Date;
    gte?: Date;
  };
  botSuccess?: boolean;
}

export interface PaginationData {
  generatedPage: number;
  generatedLimit: number;
  generatedOrder: string;
  generatedOrderBy: string;
  generatedSearchQuery: string;
  generatedStartTime?: string;
  generatedEndTime?: string;
}

export interface PaginationParams {
  pageNumber: number;
  limitNumber: number;
  order: string;
  orderBy: string;
  minimumMessageCount?: number;
  botSuccessOnlyBool: boolean;
  search: string;
  sentiment?: string;
  persona?: string;
  node?: string;
  startTime?: string | undefined;
  endTime?: string | undefined;
  rating?: string | undefined;
  hasFeedbackOnlyBool?: boolean;
  flowId?: string | null;
}

export enum TicketPriority {
  urgent = 'urgent',
  high = 'high',
  normal = 'normal',
  low = 'low',
}

export enum TicketRequestType {
  bug = 'bug',
  feature = 'feature',
}

export enum TicketStatus {
  toDo = 'toDo',
  onHold = 'onHold',
  inProgress = 'inProgress',
  completed = 'completed',
  deprecated = 'deprecated',
}
export interface TicketTypeResponse {
  id: string;
  name:string;
}

export interface ClickupCustomItemsResponse {
  custom_items: TicketTypeResponse[];
}
export interface TaskData{
  name: string;
  description: string;
  assignees: string[];
  status: string;
  priority: number;
  tags: (string | undefined)[];
  custom_fields: { id: string; value: number | string | undefined }[];
  custom_item_id?: string | null;
}
export interface CreateReportEmailType {
  id?: number;
  subject: string;
  message: string;
  chatURL?: string;
  companyName: string;
  ticketURL?: string | null;
  startDate: number;
  sender?: string;
  priority?: TicketPriority;
  requestType?: TicketRequestType;
  status?: TicketStatus;
  userRecipientEmail?: string;
  notificationEmails?: string[];
  comments?: string;
  existingTicket?: any;
  newComment?: string;
  changedValues?: ChangedValueType;
  username?: string;
  commentHistory?: string;
  clickupUrl?: string | null;
  assigneeOverride?: string[];
}

export interface ClickupUser {
  id: string,
  username: string
}
export interface ClickupMember {
  user: ClickupUser
}
export interface ClickupTeam{
  name: string,
  id: string,
  members: ClickupMember[];

}
export interface SearchReportType {
  id?: number,
  subject: string,
  message: string,
  chatURL?: string | null,
  ticketURL?: string | null;
  updatedAt?:Date;
  comments?: {
    id: number;
    text: string;
    sender: string;
    createdAt: Date;
    supportId: number;
  }[];
  commentHistory?: string | null;
}

export interface ChangedValueType {
  [key: string]: {
    old: string;
    new: string;
  };
}

export interface TicketType {
  data: CreateReportEmailType | null;
  status: boolean;
  message: string;
  statusCode: number;
}

export interface CreateSupportCommentType {
  id?: string;
  supportId: number;
  sender: string;
  text: string;
  ticketCommentUrl?: string;
  files?: MulterFile[];
}

export interface ReportEmailResponseType {
  status: boolean;
  message: string;
  result?: any;
}

export interface FeedbackPagePaginationParams {
  generatedPage: number;
  generatedLimit: number;
  generatedOrder: string;
  generatedOrderBy: string;
}

export interface ConversationFilter {
  messageCount?: {
    gt: number;
  };
  AND: {
    OR?: {
      conversationId?: {
        contains: string | undefined;
        mode: 'insensitive';
      };
      userId?: {
        contains: string | undefined;
        mode: 'insensitive';
      };
      messages?: {
        array_contains: string | undefined;
      };
      history?: {
        contains: string | undefined;
        mode: 'insensitive';
      };
      dataObject?: {
        contains: string | undefined;
        mode: 'insensitive';
      };
      requestId?: {
        contains: string | undefined;
        mode: 'insensitive';
      };
      externalId?: {
        contains: string | undefined;
        mode: 'insensitive';
      };
      User?: {
          firstName?: {
            contains: string | undefined;
            mode: 'insensitive';
          };
          lastName?: {
            contains: string | undefined;
            mode: 'insensitive';
          };
      }
      userFeedback?: {
        not: null;
      };
      userRating?: {
        not: null;
      };
    }[];
    dataObject?: {
      not: null;
    };
    botSuccess?: boolean;
    userRating?: {
      equals: number;
    };
    sentiment?: {
      equals: string;
      mode: 'insensitive';
    };
    persona?: {
      equals: string;
      mode: 'insensitive';
    };
    nodes?: {
      has: string;
    };
    flowId?: {
      equals: string | null;
    }
  }[];
}

export interface SuccessfulConversationStatType {
  success: number;
  total?: number;
  startDate: Date;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface DocumentData {
  name: string;
  key: string;
  size: number;
  hash: string;
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ReportPaginationResult {
  totalRecords: number;
  allReports : SearchReportType[];
}
export interface ReportPaginationParams{
  pageNumber: number,
  limitNumber: number,
  order: string,
  orderBy: string,
  search: string,
  status?: string,
  priority?: string,
}
export interface ReportFilter {
  messageCount?: {
    gt: number;
  };
    OR?: [
      {
        id?: {
          contains: string | undefined;
          mode: 'insensitive';
        };
      },
      {
        message?: {
          array_contains: string | undefined;
        };
      },
      {
        subject?: {
          contains: string | undefined;
          mode: 'insensitive';
        };
      },
      {
        priority?: {
          contains: TicketPriority;
          mode: 'insensitive';
        };
      },
      {
        status?: {
          contains: TicketStatus;
          mode: 'insensitive';
        };
      },
      {
        chatURL?: {
          contains: string | undefined;
          mode: 'insensitive';
        };
      },
      {
        ticketURL?: {
          contains: string | undefined;
          mode: 'insensitive';
        };
      },
      {
        commentHistory?: {
          contains: string | undefined;
          mode: 'insensitive';
        };
      },
      {
        comments?: {
          contains: string | undefined;
          mode: 'insensitive';
        };
      }
    ];
}

export interface TestScenarioQAResponse {
  testRunBotConversation: {
    responseData: {
      messages: {
        content: string;
        role: string;
      }[]
    }
  };
  testRunStatus: 'SUCCESS' | 'ERROR' | 'FAILURE';
}

export type TestScenarioType = 'QA' | 'SESSION';

export interface TestRunType {
  testRunId: string;
  status: 'SUCCESS' | 'ERROR' | 'FAILURE' | 'PENDING';
  runDate: Date;
  testScenarioId: string | null;
  Interaction: {
    conversationId: string;
    messages: any;
    startedTime: Date;
  } | null
};

export interface TestScenarioQuestion {
  message: string;
  answer: string;
}

export type tableOptions = 'tickets' | 'conversations' | 'testScenarios' | 'knowledge';

export interface ScenarioPaginationParams{
  pageNumber: number,
  limitNumber: number,
  order: string,
  orderBy: string,
  search: string,
};

export type DocumentStatus = 'PENDING' | 'COMPLETED' | 'ERROR' | 'SCRAPING';

export type favoriteChartAction = 'add' | 'remove';

export type favoriteChartRequest = {
  chartType: string;
  action: favoriteChartAction;
}

export const LoginProviderOptions = ['microsoft', 'google', 'other'] as const;
export type LoginProviderOptionType = typeof LoginProviderOptions[number];

export interface PreferenceType {
  provider: LoginProviderOptionType;
  clientId?: string | null;
  clientSecret?: string | null;
  tenantId?: string | null;
  hostedDomain?: string | null;
  realm?: string | null;
  keycloakUrl?: string | null;
  status?: LoginPreferenceStatus;
  prefectFlowId?: string | null;
  username?: string | null;
};

export type LoginPreferenceStatus = 'PENDING' |'COMPLETED' | 'ERROR' | 'LOADING';

export interface KnowledgePaginationParams{
  pageNumber: number,
  limitNumber: number,
  order: string,
  orderBy: string,
  search: string,
};

export interface KnowledgePaginationResult{
  totalRecords: number;
  allKnowledges : KnowledgeType[];
}

export interface UpdateAgentConfigPayload {
  agentAppearance?: object;
  agentSettings?: object;
}

export interface QuestionType {
  id: string;
  clusterId: string;
  question: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId?: string | null;
}

export interface ClusterType {
  id: string;
  representativeQuestion: string;
  createdAt: Date;
  updatedAt: Date;
  questions?: QuestionType[];
}

export interface KeycloakToken {
  exp?: number;
  iat?: number;
  auth_time?: number;
  jti?: string;
  iss?: string;
  aud?: string | string[];
  sub?: string;
  typ?: string;
  azp?: string;
  session_state?: string;
  sid?: string;
  acr?: string;
  scope?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [resource: string]: {
      roles: string[];
    };
  };
  [key: string]: any;
}