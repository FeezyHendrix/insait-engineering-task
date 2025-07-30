export interface LiveChatInputType {
    conversationId: string
    openTemplate: boolean
    setOpenTemplate: (open: boolean) => void
    templateData: string
    setTemplateData: (open: string) => void
  }