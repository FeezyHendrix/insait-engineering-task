export interface InboxMessageType {
  id: number
  name: string
  category: string
  message: string
  time: number
  count?: number
}




export interface LiveMessagesDataType {
  id: number;
  pov: 'agent' | 'user' | 'bot';
  text: string;
  time: string; // Timestamp
}


export interface GroupedLiveMessagesDataType {
  time: string;
  data: LiveMessagesDataType[]
}

export interface TransferredConversation {
  conversation_id : string
  customer_id : string
  chat_product : string
  selected?  : boolean
  onClick? : () => void
  count? : number
  last_message? : string
  last_message_time?: string
  conversation_obj_string: string
}

export interface LiveChatMessageEvent {
  conversation_id : string
  messages : LiveMessagesDataType[]
  showNotification? : boolean
  last_message_time: string
}

export type OrderSortType = "asc" | "des" | "desc";

export type TableHeaderKeyType =
  | 'id'
  | 'user.id'
  | 'user.name'
  | 'user.firstName'
  | 'user.lastName'
  | 'name'
  | 'updatedAt'
  | 'createdAt'
  | 'endStatus'
  | 'messageCount'
  | 'commentCount'
  | 'chatData'
  | 'chatID'
  | 'userId'
  | 'dataObject.name'
  | 'dataObject.email'
  | 'dataObject.country'
  | 'subject'
  | 'priority'
  | 'status'
  | 'conversationId'
  | 'requestTypeColumnName'
  | 'testScenarioId'
  | 'type'
  | '';

  
export interface MessageFileProps {
    url: string
}

export interface PdfDisplayProps {
  pdfUrl: string | null
  url: string
  isLoading: boolean
  isFullScreen: boolean
  onExpand: () => void
}
export interface LabelValueType {
  label: string
  value: string
  name?: string
}

export interface LegendRowTextProps {
  text: string
  dotClass: string
}
export interface ChatTableLegendProps {
  showSuccessConvo?: boolean
}

export interface ExportByOptionsProps {
  onExport: (value: ExportDateOptions) => void
  topPadding? : boolean
  title?: string
}

export type ExportDateOptions = 'last7Days' | 'last30Days' | 'all'

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ChatTableModalType {
  value: string
  type: 'sentiment' | 'persona' | 'node'
  isOpen: boolean
  toggle: (value?: boolean) => void
}