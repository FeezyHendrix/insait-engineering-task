import {  TransferredConversation } from '@/types/chat'

export interface InboxType {
    setSelectedInbox: React.Dispatch<
      React.SetStateAction<TransferredConversation | null>
    >
    selectedId: string | undefined
  }