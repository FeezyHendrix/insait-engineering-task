import { ChatDataTableBodyType, CompletionTableBodyType, MessagesType } from "./dashboard"

export interface UnansweredQsType {
    unansweredQId: string
    conversationId: string
    answer: string
    question: string
    archive: boolean
    createdAt: string
}

export interface ConversationModalType {
  chatId: string | null
  toggle: () => void
  isOpen: boolean
  showReportButton?: boolean
  tableData?: Array<CompletionTableBodyType | ChatDataTableBodyType>
}