import { GroupedLiveMessagesDataType } from '@/types/chat'

export interface LiveChatListType {
    list: GroupedLiveMessagesDataType[]
    conversationId: string
    openTemplate: boolean
    setOpenTemplate: (open: boolean) => void
    handleTemplateClick: ( message: string ) => void
  }