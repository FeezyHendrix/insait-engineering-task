import Persona from '@/components/analytics/Persona'
import SentimentAnalysis from '@/components/analytics/SentimentAnalysis'
import TopLinks from '@/components/analytics/TopLinks'
import UserRating from '@/components/analytics/UserRating'
import AnsweredAndUnanswered from '@/components/dashboard/AnsweredAndUnanswered'
import AverageInteractionDuration from '@/components/dashboard/AverageInteractionDuration'
import ConversationDuration from '@/components/dashboard/ConversationDuration'
import ThumbsUpAndDownCount from '@/components/dashboard/MessageReactionsChart'
import Nodes from '@/components/dashboard/Nodes'
import PeakInteractionTime from '@/components/dashboard/PeakInteractionTime'
import PolicyCounterWeekly from '@/components/dashboard/PolicyCounterWeekly'
import SuccessfulConversation from '@/components/dashboard/SuccessfulConversation'
import SuccessfulPercentage from '@/components/dashboard/SuccessfulPercentage'
import UserInteractionsMonthlyAndDaily from '@/components/dashboard/UserInteractionsMonthlyAndDaily'
import UserMessagesPerConversation from '@/components/dashboard/UserMessagesPerConversation'
import UserResponseTime from '@/components/dashboard/UserResponseTime'
import { ExportDateOptions, TableHeaderKeyType } from '@/types/chat'
import { OptionType } from '@/types/navigation'
import { FileWithPreview } from '@/types/support'
import { MarkerType } from '@xyflow/react'
import { t } from 'i18next'
import { lazy } from 'react'
import googleImg from '@/assets/images/icons/google.svg'
import microsoftImg from '@/assets/images/icons/microsoft.svg'
import loginImg from '@/assets/images/icons/login.svg'
import UserExposureMedia from '@/components/analytics/UserExposureMedia'
import { toast } from 'react-toastify'

export const pageOptions: OptionType[] = [
  {
    id: 1,
    title: 'menu.dashboard',
    image: 'home',
    link: `/dashboard`,
    type: 'route',
  },
  {
    id: 2,
    title: 'menu.advancedAnalytics',
    image: 'analytics',
    link: `/analytics`,
    type: 'route',
  },
  {
    id: 3,
    title: 'menu.chats',
    image: 'messages',
    link: `/chats`,
    type: 'route',
  },
  {
    id: 4,
    title: 'menu.completedSessions',
    image: 'messages',
    link: `/completed-sessions`,
    type: 'route',
  },
  {
    id: 5,
    title: 'menu.settings',
    image: 'settings',
    link: `/settings`,
    type: 'route',
  },
  {
    id: 6,
    title: 'menu.logout',
    image: 'logout',
    link: `logout`,
    type: 'action',
  },
  {
    id: 7,
    title: 'menu.liveChat',
    image: 'messages',
    link: `/live-chat`,
    type: 'route',
  },
  {
    id: 8,
    title: 'menu.batchSend',
    image: 'batch',
    link: `/batch`,
    type: 'route',
  },
  {
    id: 9,
    title: 'menu.unansweredQuestions',
    image: 'un-questions',
    link: `/unanswered-questions`,
    type: 'route',
  },
  {
    id: 10,
    title: 'menu.knowledge',
    image: 'lamp',
    link: `/knowledge`,
    type: 'route',
  },
  {
    id: 11,
    title: 'menu.messageReactions',
    image: 'rating',
    link: `/message-rating`,
    type: 'route',
  },
  {
    id: 12,
    title: 'menu.admin',
    image: 'lamp',
    link: `/admin`,
    type: 'route',
  },
  {
    id: 13,
    title: 'menu.securityViolation',
    image: 'messages',
    link: `/security-violation-messages`,
    type: 'route',
  },
  {
    id: 14,
    title: 'menu.chatFeedback',
    image: 'messages',
    link: `/feedback`,
    type: 'route',
  },
  {
    id: 15,
    title: 'menu.contactSupport',
    image: 'clipboard',
    link: `/support/`,
    type: 'route',
  },
  {
    id: 16,
    title: 'menu.abTesting',
    image: 'versionControl',
    link: `/ab-testing`,
    type: 'route',
  },
  {
    id: 17,
    title: 'Agent Platform',
    image: 'messages',
    link: '/agent-builder',
    type: 'route',
  },
  {
    id: 18,
    title: 'menu.knowledge',
    image: 'lamp',
    link: '/knowledge-base',
    type: 'route',
  },
  {
    id: 19,
    title: 'menu.configuration',
    image: 'settings',
    link: '/configuration',
    type: 'route',
  },
  {
    id: 20,
    title: 'menu.scenario',
    image: 'testScenarios',
    link: '/scenario',
    type: 'route',
  },
  {
    id: 21,
    title: 'menu.agentBuilder',
    image: 'builder',
    link: '/bot-builder',
    type: 'route',
  },
  {
    id: 22,
    title: 'menu.loginPreferences',
    image: 'login',
    link: '/login-preferences',
    type: 'route',
  },
  {
    id: 23,
    title: 'menu.knowledgeHub',
    image: 'brain',
    link: '/knowledge-hub',
    type: 'brain',
  },
  {
    id: 24,
    title: 'menu.supersetAnalytics',
    image: 'superset',
    link: '/superset-analytics',
    type: 'route',
  },
]

export const routeOptions = [
  {
    id: 1,
    path: '/dashboard',
    secured: true,
    component: lazy(() => import('@/pages/secured/Dashboard')),
  },
  {
    id: 2,
    path: '/analytics',
    secured: true,
    component: lazy(() => import('@/pages/secured/Analytics')),
  },
  {
    id: 3,
    path: '/chats',
    secured: true,
    component: lazy(() => import('@/pages/secured/Chats')),
  },
  {
    id: 4,
    path: '/batch',
    secured: true,
    component: lazy(() => import('@/pages/secured/BatchSend')),
  },
  {
    id: 5,
    path: '/settings',
    secured: true,
    component: lazy(() => import('@/pages/secured/Settings')),
  },
  {
    id: 6,
    path: '/',
    secured: false,
    component: lazy(() => import('@/pages/secured/Dashboard')),
  },
  {
    id: 7,
    path: '/live-chat',
    secured: true,
    component: lazy(() => import('@/pages/secured/LiveChat')),
  },
  {
    id: 8,
    path: '/unanswered-questions/*',
    secured: true,
    component: lazy(() => import('@/pages/secured/QuestionsAnalytics')),
  },
  {
    id: 9,
    path: '/knowledge',
    secured: true,
    component: lazy(() => import('@/pages/secured/Knowledge')),
  },
  {
    id: 10,
    path: '/message-rating',
    secured: true,
    component: lazy(() => import('@/pages/secured/MessageReactions')),
  },
  {
    id: 11,
    path: '/admin',
    secured: true,
    component: lazy(() => import('@/pages/secured/Admin')),
  },
  {
    id: 12,
    path: '/completed-sessions',
    secured: true,
    component: lazy(() => import('@/pages/secured/CompletedSessions')),
  },
  {
    id: 13,
    path: '/security-violation-messages',
    secured: true,
    component: lazy(() => import('@/pages/secured/SecurityViolationMessages')),
  },
  {
    id: 14,
    path: '/feedback',
    secured: true,
    component: lazy(() => import('@/pages/secured/ChatFeedback')),
  },
  {
    id: 15,
    path: '/support/*',
    secured: true,
    component: lazy(() => import('@/pages/secured/ContactSupport')),
  },
  {
    id: 16,
    path: '/ab-testing',
    secured: true,
    component: lazy(() => import('@/pages/secured/VersionControl')),
  },
  {
    id: 17,
    path: '/agent-builder',
    secured: true,
    component: lazy(() => import('@/pages/secured/DemoAgentBuilder')),
  },
  {
    id: 18,
    path: '/knowledge-base',
    secured: true,
    component: lazy(() => import('@/pages/secured/KnowledgeBase')),
  },
  {
    id: 19,
    path: '/configuration',
    secured: true,
    component: lazy(() => import('@/pages/secured/Configuration')),
  },
  {
    id: 20,
    path: '/scenario',
    secured: true,
    component: lazy(() => import('@/pages/secured/TestScenario')),
  },
  {
    id: 21,
    path: '/bot-builder',
    secured: true,
    component: lazy(() => import('@/pages/secured/AgentBuilder')),
  },
  {
    id: 22,
    path: '/login-preferences',
    secured: true,
    component: lazy(() => import('@/pages/secured/LoginPreferences')),
  },
  {
    id: 23,
    path: '/knowledge-hub',
    secured: true,
    component: lazy(() => import('@/pages/secured/KnowledgeHub')),
  },
  {
    id: 24,
    path: '/questions-analytics/popular',
    secured: true,
    component: lazy(() => import('@/pages/secured/PopularQuestions')),
  },
  {
    id: 25,
    path: '/questions-analytics/popular/:clusterId',
    secured: true,
    component: lazy(() => import('@/pages/secured/ClusterDetails')),
  },
  {
    id: 26,
    path: '/superset-analytics',
    secured: true,
    component: lazy(() => import('@/pages/secured/SupersetAnalytics')),
  }
]

export const monthOption = [
  { label: 'Jan', value: 0 },
  { label: 'Feb', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Apr', value: 3 },
  { label: 'May', value: 4 },
  { label: 'Jun', value: 5 },
  { label: 'Jul', value: 6 },
  { label: 'Aug', value: 7 },
  { label: 'Sept', value: 8 },
  { label: 'Oct', value: 9 },
  { label: 'Nov', value: 10 },
  { label: 'Dec', value: 11 },
]

export const camelToSentenceCase = (
  str: string,
  isFirstCharUpper: boolean = false
) => {
  if (!str) return ''
  const result = str.replace(/([a-z])([A-Z])/g, '$1 $2')
  return isFirstCharUpper
    ? result.charAt(0).toUpperCase() + result.slice(1)
    : result
}

export const hasTableDataAccess = (
  type: string,
  columns: string[]
): boolean => {
  if (!columns) return false
  return columns.includes(type)
}

export const generateTableHeader = (columns?: string[]): string[] => {
  if (!columns) return []
  return columns.map((str) => `tableHeader.${str}`)
}

export const getTableHeaderKey = (header: string): TableHeaderKeyType => {
  switch (header) {
    case 'tableHeader.customerID':
      return 'user.id'
    case 'tableHeader.customerName':
      return 'user.name'
    case 'tableHeader.date':
      return 'updatedAt'
    case 'tableHeader.messages':
      return 'messageCount'
    case 'tableHeader.type':
      return 'endStatus'
    case 'tableHeader.messageCount':
      return 'messageCount'
    case 'tableHeader.completedSessions':
      return 'chatData'
    // case 'tableHeader.conversationId':
    //   return 'chatID' TODO put back when backend endpoint can sort by chatID
    case 'tableHeader.userId':
      return 'user.id'
    case 'tableHeader.firstName':
      return 'user.firstName'
    case 'tableHeader.lastName':
      return 'user.lastName'
    default:
      return ''
  }
}

export const getChatDataTableHeaderKey = (
  header: string
): TableHeaderKeyType => {
  switch (header) {
    case 'tableHeader.customerName':
      return 'user.name'
    case 'tableHeader.date':
      return 'createdAt'
    case 'tableHeader.completedSessions':
      return 'chatData'
    case 'tableHeader.chatID':
      return 'chatID'
    case 'tableHeader.userId':
      return 'userId'
    default:
      return ''
  }
}

export const getSupportTicketTableHeaderKey = (
  header: string
): TableHeaderKeyType => {
  switch (header) {
    case 'support.ticketNumber':
      return 'id'
    case 'support.subject':
      return 'subject'
    case 'support.ticketPriority':
      return 'priority'
    case 'support.ticketStatus':
      return 'status'
    case 'support.createdAt':
      return 'createdAt'
    case 'support.messages':
      return 'commentCount'
    case 'support.requestType':
      return 'requestTypeColumnName'
    case 'support.updatedAt':
      return 'updatedAt'
    default:
      return ''
  }
}

export const getKnowledgeHeaderKey = (header: string): TableHeaderKeyType => {
  switch (header) {
    case 'name':
      return 'name'
    case 'date':
      return 'createdAt'
    case 'status':
      return 'status'
    default:
      return ''
  }
}

export const chartNames: { [key: string]: React.ComponentType<any> } = {
  userInteraction: UserInteractionsMonthlyAndDaily,
  policyCounter: PolicyCounterWeekly,
  answeredAndUnanswered: AnsweredAndUnanswered,
  peakInteractionTime: PeakInteractionTime,
  userMessagesPerConversation: UserMessagesPerConversation,
  userResponseTime: UserResponseTime,
  interactionDuration: AverageInteractionDuration,
  successfulConversation: SuccessfulConversation,
  successfulPercentage: SuccessfulPercentage,
  sentiment: SentimentAnalysis,
  persona: Persona,
  userRating: UserRating,
  messageReactionsChart: ThumbsUpAndDownCount,
  topLinks: TopLinks,
  nodes: Nodes,
  conversationDuration: ConversationDuration,
  userExposureMedia: UserExposureMedia,
}

export const defaultChartConfig = {
  userInteractions: true,
  interactionDuration: true,
  userQueries: true,
  completionRate: true,
  productPopularity: true,
  errorAnalysis: true,
  peakInteractionTimes: true,
  userAbandonment: true,
  dropoffQuestions: true,
  userFeedback: true,
  userReturnRate: true,
  topQuestionsAsked: true,
  sentimentAnalysis: true,
  conversationalDepth: true,
  userPersonaClassification: true,
  anomalyDetection: true,
  successfulConversions: true,
  costPerConversation: true,
  userMessagesPerConversation: true,
  averageLengthOfClientMessages: true,
  averageLengthOfBotMessages: true,
  thumbsUpAndDownCountMonthly: true,
  queryKnowledgebase: true,
  policyCounter: true,
  securityModuleCost: true,
  averageResponseTimeFromClient: true,
  dataForMainContainer: true,
  averageLengthOfUserAndBotMessages: true,
  responseTimeFromAClient: true,
}

export const knowledgeTextLimits = {
  question: 150,
  answer: 900,
}

export const ITEMS_PER_PAGE = 15
export const AUTOMATIC_CHATS_REFRESH = {
  FREQUENCY: 15,
  OFFSET_MINUTES_FROM_PREFECT_RUN_TIME: 5,
}
export const UNANSWERED_QA_PER_PAGE = 10
export const MINIMUM_MESSAGES_TO_DISPLAY = 2
export const FEEDBACK_ITEMS_PER_PAGE = 10
export const MAX_ANSWER_LENGTH = 150
export const MAX_QUESTION_LENGTH = 90 // Maximum length for the question
export const ADMIN_USERNAME = ['support@insait.io', 'admin']
export const INSAIT_DOMAIN = 'insait.io'
export const MISC = {
  SECONDS_PER_MINUTE: 60,
}

export const prioritySelectionOptions = [
  { label: 'support.priority.urgent', value: 'urgent' },
  { label: 'support.priority.high', value: 'high' },
  { label: 'support.priority.normal', value: 'normal' },
  { label: 'support.priority.low', value: 'low' },
]

export const scenarioTypeSelectionOptions = [
  { label: 'scenario.form.qa', value: 'QA' },
  { label: 'scenario.form.session', value: 'session' },
]

export const ticketTypeSelectionOptions = [
  { label: 'support.requestType.bug', value: 'bug' },
  { label: 'support.requestType.feature', value: 'feature' },
]

export const ticketStatusSelectionOptions = [
  { label: 'support.status.todo', value: 'toDo' },
  { label: 'support.status.inProgress', value: 'inProgress' },
  { label: 'support.status.onHold', value: 'onHold' },
  { label: 'support.status.completed', value: 'completed' },
  { label: 'support.status.deprecated', value: 'deprecated' },
]

export const relatedToConversationSelectionOption = [
  { label: 'support.confirmation.yes', value: 'yes' },
  { label: 'support.confirmation.no', value: 'no' },
]

export const enableSendingOfEmailOption = [
  { label: 'support.confirmation.yes', value: 'yes' },
  { label: 'support.confirmation.no', value: 'no' },
]

export const supportTableHeader = [
  'support.ticketNumber',
  'support.subject',
  'support.requestTypeColumnName',
  'support.ticketPriority',
  'support.ticketStatus',
  'support.messages',
  'support.createdAt',
  'support.updatedAt',
  '',
]

export const supportExportHeader = [
  'support.ticketNumber',
  'support.subject',
  'support.sender',
  'support.companyName',
  'support.message',
  'support.ticketPriority',
  'support.ticketStatus',
  'support.createdAt',
  'support.updatedAt',
  'support.notificationEmails',
  'support.commentCount',
  'support.requestTypeColumnName',
  'support.ticketURL',
]

export const qaKnowledgeTableHeader = [
  'knowledge.question',
  'knowledge.answer',
  'knowledge.status',
  'knowledge.date',
  'knowledge.action',
]

export const fileListHeader = ['name', 'date', 'status', '']

export const scenarioTableHeader = [
  'scenario.table.sn',
  'scenario.table.name',
  'scenario.table.type',
  'scenario.table.createDate',
  'scenario.table.lastRunDate',
  'scenario.table.questionCount',
  'scenario.table.runCount',
  'scenario.table.lastScore',
  '',
]

export const botBuilderDataTypeOptions = [
  { label: 'Number', value: 'number' },
  { label: 'Text', value: 'text' },
  { label: 'Boolean', value: 'boolean' },
]

export const botBuilderNodeTypeOptions = [
  { label: 'Message', value: 'message' },
  { label: 'Data', value: 'data' },
  { label: 'API', value: 'api' },
]

export const edgeOptions = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#888',
  },
  style: {
    strokeWidth: 2,
    stroke: '#888',
  },
  labelStyle: {
    fill: '#888',
    fontWeight: 700,
  },
  labelBgStyle: {
    fill: '#ffffff',
    fillOpacity: 0.8,
  },
}

export const getShapeClass = (type: string | undefined, isEditing: boolean) => {
  if (isEditing) return `editing-shape ${type}`
  switch (type) {
    case 'api':
      return 'api-shape'
    case 'data':
      return 'data-shape'
    case 'message':
    default:
      return 'message-shape'
  }
}

export const sourceOptions = [
  { id: 1, label: 'knowledge.sources.url', value: 'crawling' },
  { id: 2, label: 'knowledge.sources.file', value: 'file' },
  { id: 3, label: 'knowledge.sources.text', value: 'text' },
  { id: 4, label: 'knowledge.sources.qa', value: 'qa' },
]

export const exportDateRangeOptions: Array<{
  value: ExportDateOptions
  label: string
}> = [
  { value: 'last7Days', label: 'date.last7Days' },
  { value: 'last30Days', label: 'date.last30Days' },
  { value: 'all', label: 'date.allTime' },
]

export const DEFAULT_CHAT_COLUMNS = [
  'conversationId',
  'customerID',
  'date',
  'time',
  'rating',
  'messages',
  'fullConversation',
]

export const generateSourceOptions = (source: string[]) => {
  const allowedSources = ['crawling', 'file', 'text', 'qa']

  const sourcesToUse = source.filter((item) => allowedSources.includes(item))

  return sourcesToUse.map((item, i) => ({
    id: i + 1,
    label: `knowledge.sources.${item}`,
    value: item,
  }))
}

export const donutChartColors = [
  '#1BA3F2',
  '#49DE61',
  '#F8B11B',
  '#9D4EDD',
  '#8B9467',
]

export const topLinkMaxLength = 50

export const dayHours = {
  start: [0, 0, 0, 0],
  end: [23, 59, 59, 999],
}

export const barChartYAxisFormatting = {
  percentThreshold: 70,
  roundOff: 5,
}

export const generateStatusTextColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
    case 'SUCCESS':
      return 'green'
    case 'ERROR':
    case 'FAILURE':
      return 'red'
    default:
      return 'grey'
  }
}

export const getTestScenarioTableHeaderKey = (
  header: string
): TableHeaderKeyType => {
  switch (header) {
    case 'scenario.table.sn':
      return 'testScenarioId'
    case 'scenario.table.name':
      return 'name'
    case 'scenario.table.type':
      return 'type'
    case 'scenario.table.createDate':
      return 'createdAt'

    default:
      return ''
  }
}

export const copyTimeout = (
  copied: boolean,
  setCopied: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!copied) return
  const timeout = setTimeout(() => {
    setCopied(false)
  }, 500)
  return () => clearTimeout(timeout)
}

export const loginButtonOptions = [
  {
    provider: 'google',
    title: 'Google',
    image: googleImg,
    description: 'Enable your organization to sign in with Google (OAuth).',
  },
  {
    provider: 'microsoft',
    title: 'Microsoft EntraID',
    image: microsoftImg,
    description: 'Enable your organization to sign in with Microsoft EntraID.',
  },
  {
    provider: 'other',
    title: 'Other',
    image: loginImg,
    description: 'Enable your organization to sign in with another method.',
  },
]
export const allowedMimeTypes = [
  'text/html',
  'text/plain',
  'image/png',
  'video/mp4',
  'video/webm',
]

export const processNewFiles = (
  files: FileList | null,
  maxSize: number = 10 * 1024 * 1024 // 10MB default limit
): (File & { preview?: string })[] => {
  if (!files || files.length === 0) return []

  const newFiles: (File & { preview?: string })[] = []

  Array.from(files).forEach((file) => {
    if (!allowedMimeTypes.includes(file.type)) {
      toast.error(t('support.validation.invalidFileType'))
      return
    }

    if (file.size > maxSize) {
      toast.error(t('support.validation.fileTooLarge'))
      return
    }

    const fileWithPreview = file as File & { preview?: string }
    if (file.type.startsWith('image/')) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }
    newFiles.push(fileWithPreview)
  })

  return newFiles
}

export const processFileRemove = (files: FileWithPreview[], index: number) => {
  const file = files[index]

  if (file && typeof file !== 'string' && 'preview' in file && file.preview) {
    URL.revokeObjectURL(file.preview)
  }

  return files.filter((_, i) => i !== index)
}


export const superSetAnalyticsIframes = {
  messageLogs: {

  },
  sessionClient: {

  },
  conversationSteps: {

  }
}