import { OrderSortType, TableHeaderKeyType } from "./chat"
import { ChatDataTableBodyType } from "./dashboard"

export interface ChatDataTableType {
    data: Array<ChatDataTableBodyType>
    loading: boolean
    viewData: (chatId: string | null, userId: string | null, type: ModalOpenType) => void
    isChatScreen?: boolean
    fetchTableData: (page: number, itemsPerpage: number, order: OrderSortType, orderBy: TableHeaderKeyType) => void
    searchQuery?: string | null
  }

export type ModalOpenType = 'none' | 'data' | 'conversation';
