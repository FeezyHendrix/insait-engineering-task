import { OrderSortType, TableHeaderKeyType } from "./chat"

export interface ScenarioDataType {
  questions: Array<ScenarioItem>
    testScenarioId: string
    type: ScenarioTypeOptions
    name: string
    createdAt: string
    TestRun: { 
      runDate: Date
      Interaction?: {
        messages: ScenarioMessage[]
      }
    }[]
}

export type ScenarioTypeOptions = 'session' | 'QA' | null

export type ScenarioMessage = {
  role: string
  content: string
  correct?: boolean | null
}

export interface ScenarioResponseType {
  testScenarioId: string
  type: ScenarioTypeOptions
  name: string
  createdAt: string
  TestRun: { 
    runDate: Date
    Interaction?: {
      messages: ScenarioMessage[],
    },
    testRunId:string,
  }[]
  questions: string[],
  correctAnswers: string[]
}

export interface FormattedScenarioType {
  testRuns: {
    runDate: Date
    Interaction?: {
      messages: ScenarioMessage[]
    },
    testRunId: string,
  }[]
  questions: Array<ScenarioItem>
  testScenarioId: string
  type: ScenarioTypeOptions
  name: string
  createdAt: string
  correctAnswers: (string | null)[]
}

export type ScenarioModalTypes = 'run' | 'view' | 'create' | 'delete' | 'none'

export interface ScenarioItem {
  id: string
  message: string
  answer?: string
}

export interface CreateScenarioProp {
  isOpen: boolean
  handleCloseModal: () => void
  selectedScenario: FormattedScenarioType | null
  handleSubmitForm: (form: FormattedScenarioType) => void
}

export interface CSVRow {
  message: string
  question?: string
  answer?: string
}


export interface NewScenarioType {
    type: 'QA' | 'SESSION'
    name: string
    questions: {
      message: string
      answer?: string | null
    }[]
}

export interface TestRunType {
    testRunId: string
    testScenarioId: string
    status: string
    runDate: Date
    messages: TestConversationType[]
}

export interface TestConversationType {
    user: string
    assistant: string
    correctAnswer?: string
    correct?: boolean
}

export interface ScenarioTableProp {
    data: Array<FormattedScenarioType>
    handleOpenModal: (type: ScenarioModalTypes, detail: FormattedScenarioType) => void
    loading: boolean
    totalCount: number
    fetchTableData: (
      page: number,
      order: OrderSortType,
      orderBy: TableHeaderKeyType,
      search: string,
) => Promise<void>}

export interface ViewScenarioProp {
  isOpen: boolean
  handleCloseModal: () => void
  selectedScenario: FormattedScenarioType
  showReportButton?: boolean;
}
