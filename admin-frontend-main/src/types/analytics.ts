import { AreaChartType, BarChartType, FunnelChartType, MultiBarChartType, PieChartType, EarliestInteractionType } from "./chart"

// API Request
export interface AnalysisPropsType {
  dropoffQuestionsData: Array<BarChartType>
  feedbackData: {
    averageRating: number,
    data: Array<FeedbackItemPropsType>
  }
  userReturnData: Array<BarChartType>
  topQuestionsData: Array<QuestionRenderPropsType>
  sentiment: PieChartType
  conversationDepthBarData: Array<MultiBarChartType>
  userPersonaData: PieChartType
  anomalyDetectionSeriesData: AreaChartType
  earliestInteractionTimestamp: EarliestInteractionType
  userRating: BarChartType
  messageReactionsChart: BarChartType
}

// Sub Components
export interface QuestionRenderPropsType {
  id: number
  text: string
  count?: number
}

export interface FeedbackItemPropsType {
  id: string | number
  image: string
  text: string
  username: string
  rating: number
  isNotLast?: boolean // Frontend Props
}

export interface UserAbandonmentPropsType {
  chartData?: Array<FunnelChartType>
  loading?: boolean
  title?: string
}

export interface DropOffQuestionsPropsType {
  chartData?: Array<BarChartType>
}

export interface UserFeedbackPropsType {
  averageRating?: number;
  data?: Array<FeedbackItemPropsType>
  
}

export interface TopQuestionsPropsType {
  data?: Array<QuestionRenderPropsType>
  title?: string
  description?: string
  loading?: boolean
  displayAsLink?: boolean
}

export interface UserReturnRatePropsType {
  chartData?: Array<BarChartType>
  loading?: boolean
}

export interface ConversationalDepthPropsType {
  chartData?: Array<MultiBarChartType>
  
}

export interface UserPersonaPropsType {
  chartData?: PieChartType
  loading?: boolean
}

export interface AnomalyDetectionPropsType {
  chartData?: Array<[number, number]>
  
}

export interface QuestionRenderProps {
  text: string
  count: number
  displayAsLink?: boolean
}

export interface EarliestInteractionPropsType {
  chartData?: Date
}