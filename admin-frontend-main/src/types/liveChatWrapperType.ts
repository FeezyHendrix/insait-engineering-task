import { ReactNode } from 'react'

export interface LiveChatWrapperType {
    conversationId: string
    open: boolean
    children: ReactNode
    onClose: () => void
    handleTemplateClick: ( message: string ) => void
  }