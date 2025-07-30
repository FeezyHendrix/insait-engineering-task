import { BaseMessageTemplate } from "./baseMessageTemplate"

export interface AddTemplateModalType {
    isOpen: boolean
    toggle: () => void
    onSubmit: ( data: BaseMessageTemplate ) => void 
  }
  