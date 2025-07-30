import { GroupedLiveMessagesDataType, TransferredConversation } from '@/types/chat'
import { Dispatch } from 'react'

export interface ConversationType {
    selectedInbox: TransferredConversation | null
    messageList :GroupedLiveMessagesDataType[]
    setMessageList : Dispatch<React.SetStateAction<GroupedLiveMessagesDataType[]>>
}