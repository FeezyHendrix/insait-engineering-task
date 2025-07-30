import { BarChartType, HeatMapType, LineChartType, PieChartType, MultiBarChartType, } from "./chart"

// API Request
export interface DashboardPropsType {
  userInteractionData: Array<BarChartType>
  productPopularityData: Array<BarChartType>
  errorAnalysisData: Array<BarChartType>
  completionRateData: PieChartType,
  peakTimeData: Array<HeatMapType>,
  interactionDuration: string,
  userQueries: string,
  completionRateTableBody: CompletionTableBodyType[]
  earliestInteractionTimestamp: any,
  ABConversionData: Array<LineChartType>,
  costPerConversationData: Array<BarChartType>,
  userMessagesPerConversationData: Array<BarChartType>,
  averageLengthOfClientMessages: string,
  averageLengthOfBotMessages: string,
  answeredAndUnanswered: Array<BarChartType>,
  thumbsUpAndDownCountMonthly: Array<BarChartType>,
  policyCounter: number,
  securityModuleCost: Array<BarChartType>,
  averageResponseTimeFromClient: string,
  averageLengthOfUserAndBotMessages: Array<BarChartType>,
  responseTimeFromAClient: Array<BarChartType>,

  dataForMainContainer: Array<BarChartType>,
  dropoffQuestionsData: Array<BarChartType>,
  conversationDepthBarData: Array<MultiBarChartType>,
  topQuestionsData: Array<QuestionRenderPropsType>,
  averageLengthOfClientMessagesActive?: boolean, 
  averageLengthOfBotMessagesActive?: boolean, 
  companyCharts?: any,
}

// Sub Components
export interface QuestionRenderPropsType {
  id: number
  text: string
}

export interface UserInteractionPropsType {
  chartData?: Array<BarChartType>
}

export interface ProductPopularityPropsType {
  chartData?: Array<BarChartType>
  
}

export interface ErrorAnalysisPropsType {
  chartData?: Array<BarChartType>
  
}

export interface PeakTimePropType {
  chartData?: Array<HeatMapType>
  
}

export interface CompletionRateProps {
  chartData?: PieChartType
  
}

export interface MeasurementPropsType {
  interactionDuration?: string
  userQueries?: string
  interactionDurationActive?: boolean
  userQueriesActive?: boolean
}

export interface CompletionTableBodyType {
  id: number
  user: {
    id: number
    name: string
    firstName?: string | null
    lastName?: string | null
  }
  product: {
    title: string
  }
  userRating?: number | null
  createdAt: number
  updatedAt: number
  endStatus: string
  messageCount?: number
  comment?: string
  botSuccess?: boolean
  chatId: string
  messages?: Array<ChatType>
  userFeedback?: string | null
  chatChannel?: string | null
  dataObject?: string
}

export interface ChatDataResponseType {
  pageRecords: CompletionTableBodyType[]
  totalRecords: number
}

export interface MessagesType {
  id: string
  createdAt: number | string
  data: ChatType[]
  comment?: string
}

export interface ChatType {
  id: string,
  text: string,
  pov?: 'bot' | 'user'
  sender?: string
  time?: string
  image?: string
  createdAt?: string
  file?: string | null | string[]
  rating?: null | 'positive' | 'negative'
}

export type CompletionDisplayValueType = 'table' | 'message' | ''

export interface CompletionDisplayType {
  id: string | null
  value: CompletionDisplayValueType
}

export interface ObjectType {
  [key: string]: number | string | null | boolean;
}

export interface StringObjectType {
  [key: string]: string;
}

export interface ABConversionsProps {
  chartData?: Array<LineChartType>
}

export interface CostPerConversationProps {
  chartData?: Array<BarChartType>
}

export interface UserMessagesPerConversationProps {
  chartData?: Array<BarChartType>
  includeUpdate?: boolean
  isPercent?: boolean
  title?: string
  description?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

export interface AverageLengthOfMessagesPropsType {
  averageLengthOfClientMessages?: string;
  averageLengthOfBotMessages?: string
  averageLengthOfClientMessagesActive?: boolean
  averageLengthOfBotMessagesActive?: boolean
}

export interface ThumbsUpAndDownCountPropsType {
  chartData?: Array<BarChartType>
}

export interface PolicyCounterPropsType {
  policyCounter?: number;
  companyCharts: string[]
}

export interface SecurityModuleCostPropsType {
  chartData?: Array<BarChartType>
}

export interface AverageResponseTimeFromClientPropsType {
  averageResponseTimeFromClient?: string;
  companyCharts: string[]
}

export interface ChatDataDataResponseType {
  pageRecords: ChatDataTableBodyType[]
  totalRecords: number
}

export interface ChatDataTableBodyType {
  id: number
  userId: string
  updatedAt: number
  createdAt: number
  chatId: string
  messages?: Array<ChatType>
  comment?: string
  botSuccess?: boolean | null
  dataObject: {
    interest: string
    email: string
    name: string
    country: string
    botSuccess: boolean;
    chatLanguage: string;
    chatProduct: string;
    chatStatus: string;
    chatbotJson: string;
    company: string;
    companyId: string;
    conversationId: string;
    createdAt: string;
    currentGitSha: string;
    history: string;
    messages: any;
    sessionStatus: string;
    totalCompletionTokensUsed: number;
    totalPromptTokensUsed: number;
    updatedAt: string;
    userFeedback: string | null;
    userId: string;
    userRating: number | null;
  }
  user?: {
    id?: string;
    firstName?: string;
    lastName?: string;
  }
}


export interface AverageLengthOfUserAndBotMessagesPropsType {
  chartData?: Array<BarChartType>
}

export interface ResponseTimeFromAClientProps {
  chartData?: Array<BarChartType>
}

interface DailyInteraction {
  name: string;
  value: number;
}

interface WeeklyInteraction {
  name: string;
  value: number;
}

export interface UserInteractionPropsType {
  userInteractionWeekly: WeeklyInteraction[];
  userInteractionDaily: DailyInteraction[];
}

interface WeeklyPolicyCounter {
  name: string;
  value: number;
}

export interface PolicyCounterWeeklyPropsType {
  chartData: WeeklyPolicyCounter[];
}

interface AnsweredAndNotAnswered {
  name: string;
  valueAnswered: number;
  valueNotAnswered: number;
}

export interface AnsweredAndNotAnsweredPropsType {
  chartData: Array<BarChartType>;
}

export interface ResponseTimeFromAClientProps {
  chartData?: Array<BarChartType>
}

export interface conversationMessageType {
  file?: any;
  id: string;
  pov: string;
  rating?: string | null;
  responseTime: number | null;
  text: string;
  time: string;
}
export interface PageDataBodyType {
  chatId: string;
  createdAt: number;
  dataObject: string;
  endStatus: string;
  id: number;
  messageCount: number;
  messages: conversationMessageType[];
  comment?: string;
  product: {
    title: string
  };
  updatedAt: string;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  botSuccess: boolean;
}

export interface ChatDataModalType {
  chatId: string | null
  userId: string | null
  toggle: () => void
  isOpen: boolean
  source?: 'chatData' | 'chat'
}
