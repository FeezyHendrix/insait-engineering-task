import { Dispatch, ReactNode, SetStateAction } from "react"
import { OrderSortType, TableHeaderKeyType } from "./chat"

export interface KnowledgeStateType {
    knowledges: KnowledgeType[]
    loading: boolean
  }

export interface KnowledgeSubmitProp {
  addKnowledge?: (data: KnowledgeType) => void
  editKnowledge?: KnowledgeType
}

export interface AddKnowledgeModalProp {
  isOpen: boolean
  handleClose: () => void
  handleAdd: (data: KnowledgeType) => void
  selectedKnowledge?: KnowledgeType | null
}

export interface KnowledgeBaseTableProps {
  openAddBtn: boolean
  toggleAddBtn: (value: boolean) => void
}

export interface ToggleSectionButtonProp {
  toggle: () => void
  isOpen: boolean
  title: string
  children?: ReactNode
}
 
  export interface KnowledgeType {
    id: string
    question: string
    answer?: string
    file?: any
    createdAt: string
    product: string
    active: boolean
    type?: string
  }
  
  export interface KnowledgeProps {
    displayData: KnowledgeType[]
    setDisplayData: Dispatch<SetStateAction<KnowledgeType[]>>
  }

  export interface KnowledgeListProps {
    knowledgeArrayData: KnowledgeType[]
    displayData: KnowledgeType[]
    setDisplayData: Dispatch<SetStateAction<KnowledgeType[]>>
  }

  export interface KnowledgeConfirmModalType {
    isOpen: boolean
    toggle: (val?: boolean) => void
    confirm: ()=> void
  }

  export interface KnowledgeFileViewModalProp {
    isOpen: boolean
    selectedFile: KnowledgeFileItemType | null
    setSelectedFile: Dispatch<SetStateAction<KnowledgeFileItemType | null>>
    closeModal: () => void
  }

  export interface KnowledgeListHeaderType {
    displayData: KnowledgeType[]
    listVisible: boolean
    setListVisible: Dispatch<SetStateAction<boolean>>
    list: string
  }

export interface KnowledgeConfirmProp {
  id: string
  title: string
  status: 'delete' | 'none' | 'update'
}

export interface KnowledgeConfirmModalProp {
  status: 'delete' | 'none' | 'update'
  loading: boolean
  id: string
  title: string
  closeModal: () => void
  handleDelete: (id: string) => void
}

export interface KnowledgeFileItemType {
  id: string
  name: string
  url: string
  key: string
  size: number
  createdAt: string
  status: string
  type?: string
  preview?: string
}

export interface FilePagination {
  currentPage: number;
  limit: number;
  totalDocuments: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FileDataProp {
  data:  Array<KnowledgeFileItemType>
  pagination?: FilePagination
}

export interface KnowledgeFileUploadProp {
  fileData: FileDataProp
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  confirmDelete: (file: KnowledgeFileItemType | 'all') => void
  fetchFileKnowledgeData: (page: number, order: OrderSortType, orderBy: TableHeaderKeyType) => Promise<void>
  uploadBoxVisible: boolean
  setUploadBoxVisible: Dispatch<React.SetStateAction<boolean>>
}

export interface QAIntegrationProps {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  qaData: KnowledgeType[]
  setQaData: React.Dispatch<React.SetStateAction<KnowledgeType[]>>
  confirmDelete: (item: KnowledgeType | 'all') => void
  searchQuery: string | null
  setSearchQuery: React.Dispatch<React.SetStateAction<string | null>>
  totalCount: number
  fetchQAKnowledgeData: (
    page: number,
    order: OrderSortType,
    orderBy: TableHeaderKeyType,
    search: string,
  ) => Promise<void>
}

export interface SourceInfoProps {
  loading: boolean
  fileCount: number
  urlCount: number
  urlChars: number
  questionCount: number
  textChars: number
}

type SourceItem = {
  id: number
  label: string
  value: string
}

export interface SourceListProp {
  data: Array<SourceItem>
  handleSelectSource: (value: SourceItem) => void
  selectedSource: SourceItem
}

export interface KnowledgeSubmitQAProp {
  editKnowledge?: KnowledgeType
  handleDelete: () => void
  fetchQAKnowledgeData: () => Promise<void>
  handleActivation: (value: string, id?: string) => void
}

export interface CrawledURLType {
  id: string
  url: string
  chars: number
  trained?: boolean
}

export interface URLCrawlingProp {
  urlData: Array<CrawledURLType>
  setUrlData: React.Dispatch<React.SetStateAction<Array<CrawledURLType>>>
  refetchItems: () => Promise<void>
};

export type KnowledgeFileModalTypes = "delete" | "none" | "view"

export type FileDocumentExtensionTypes = "pdf" | "docx" | "txt" | null

export interface KnowledgeFileListProp {
  data: Array<KnowledgeFileItemType>
  loading: boolean
  currentPage: number
  totalCount: number
  orderBy: TableHeaderKeyType
  order: OrderSortType
  handleOpenModal: (type: KnowledgeFileModalTypes, ticket: KnowledgeFileItemType | null) => void
  handleRequestSort: (field: TableHeaderKeyType) => void
  handlePageChange: (selected: number) => void 
  closeModal: () => void
  selectedFile: KnowledgeFileItemType | null
  setSelectedFile: Dispatch<SetStateAction<KnowledgeFileItemType | null>>
}

export type FileCategory =
  | 'text'
  | 'docx'
  | 'excel'
  | 'powerpoint'
  | 'url'
  | 'audio'
  | 'image'
  | 'video'
  | 'unknown'