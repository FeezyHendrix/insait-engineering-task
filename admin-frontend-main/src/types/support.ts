export interface TicketDataType {
  id: string
  subject: string
  sender: string
  companyName: string
  message: string
  chatURL?: string
  ticketURL?: string
  priority: string
  requestType: string
  status: string
  createdAt: string
  updatedAt: string
  commentCount: number;
  commentHistory: string;
  comments: TicketComment[];
  notificationEmails?: string[]
  fileURLs?: string[]
}

export interface CreateTicketFormType {
  subject: string;
  message: string;
  chatLink: string;
  priority: string;
  status: string;
  requestType: string
  notificationEmails: string[];
}

export interface TicketComment {
  id: string;
  text: string;
  createdAt?: string;
  supportId: string;
}

export type SupportFetchTypes = "refresh" | "reload" | "none"
export type SupportModalTypes = "comment" | "detail" | 'create' | "delete" | "none"

export type FileWithPreview = (File & { preview?: string }) | string;

export interface CreateContactSupportProp {
  isOpen: boolean
  toggle: (value?: boolean) => void
  selectedTicket: TicketDataType | null
  fetchNewData: (type: SupportFetchTypes) => void
}