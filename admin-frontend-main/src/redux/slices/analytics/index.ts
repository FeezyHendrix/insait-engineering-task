import { AnalyticsState } from '@/types/redux'
import {
  ActionReducerMapBuilder,
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit'
import {
  handleAnalyticsCases,
  handleDashboardCases,
  handleInboxCases,
  handleCompletedSessionsCases,
  handleChatCases,
  handleFavoriteChartCases,
} from './cases'
import { RootStateState } from '@/redux/root-reducer'
import {
  LiveChatMessageEvent,
  TransferredConversation,
} from '@/types/chat'
import { timeButtonSelectionType } from '@/types/chart'
import { StateEffect } from '@uiw/react-codemirror'

const initialState: AnalyticsState = {
  dashboard: {
    loading: false,
    error: '',
    data: null,
  },
  analytics: {
    loading: false,
    error: '',
    data: null,
  },
  chat: {
    loading: false,
    data: [],
    totalRecords: 0
  },
  liveChat: {
    loading: false,
    readyState: false,
    inbox: [],
  },
  chatData: {
    loading: false,
    data: [],
    totalRecords: 0
  },

  charts: {
    loading: false,
  },
  globalFilters: {
    startDate: (() => {
      // const startDate = new Date()
      // startDate.setHours(dayHours.start[0], dayHours.start[1], dayHours.start[2], dayHours.start[3])
      // startDate.setMonth(startDate.getMonth() - 1)
      // return startDate.toISOString() 
      // TODO set to previous month once all charts are connected. itll make the admin load faster.
      // now it needs to be set to null so that the main conatiner charts fetch all time data
      return null
    })(),
    endDate: (() => {
      // const endDate = new Date()
      // endDate.setHours(dayHours.end[0], dayHours.end[1], dayHours.end[2], dayHours.end[3])
      // return endDate.toISOString()
      // return startDate.toISOString() 
      // TODO set to previous month once all charts are connected. itll make the admin load faster.
      // now it needs to be set to null so that the main conatiner charts fetch all time data
      return null
    })(),
    button: 'allTime',
    flowId: null,
  },
  favoriteCharts: [],
}

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateLiveChatReadyState: (state, action: PayloadAction<boolean>) => {
      state.liveChat.readyState = action.payload
    },
    updateInboxItem: (
      state,
      action: PayloadAction<Partial<LiveChatMessageEvent>>
    ) => {
      const { conversation_id, messages, showNotification, last_message_time } = action.payload
      if (!messages || messages.length === 0) return
      const lastMessage = messages[messages.length - 1]
      const existingItemIndex = state.liveChat.inbox.findIndex(
        (item) => item.conversation_id === conversation_id
      )
      if (existingItemIndex === -1) return
      state.liveChat.inbox[existingItemIndex].last_message = lastMessage.text
      state.liveChat.inbox[existingItemIndex].last_message_time = last_message_time
      if (showNotification) {
        if (lastMessage.pov === 'agent') return
        const existingItem = state.liveChat.inbox[existingItemIndex]
        state.liveChat.inbox[existingItemIndex] = {
          ...existingItem,
          count: (existingItem.count || 0) + 1,
        }
      }
    },
    resetInboxItem: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const existingItemIndex = state.liveChat.inbox.findIndex(
        (item) => item.conversation_id === id
      )
      if (existingItemIndex !== -1) {
        const existingItem = state.liveChat.inbox[existingItemIndex]
        state.liveChat.inbox[existingItemIndex] = {
          ...existingItem,
          count: undefined,
        }
      }
    },
    addNewConversation: (
      state,
      action: PayloadAction<TransferredConversation>
    ) => {
      const { conversation_id } = action.payload
      const existingItemIndex = state.liveChat.inbox.findIndex(
        (item) => item.conversation_id === conversation_id
      )
      if (existingItemIndex === -1) {
        const newItem = {
          ...action.payload,
          count: 1,
        }
        state.liveChat.inbox.unshift(newItem)
      }
    },
    updateMessagesList: (
      state,
      action: PayloadAction<LiveChatMessageEvent>
    ) => {
      const { conversation_id } = action.payload
      const existingItemIndex = state.liveChat.inbox.findIndex(
        (item) => item.conversation_id === conversation_id
      )
      if (existingItemIndex !== -1) throw new Error('Conversation not found')
    },
    updateGlobalFilters: (
      state,
      action: PayloadAction<{ startDate?: string | null; endDate?: string | null; button?: timeButtonSelectionType}>
    ) => {
      state.globalFilters.startDate = action.payload.startDate !== undefined ? action.payload.startDate : state.globalFilters.startDate
      state.globalFilters.endDate = action.payload.endDate !== undefined ? action.payload.endDate : state.globalFilters.endDate
      state.globalFilters.button = action.payload.button || null
    },
    updateFlowSelection: (
      state,
      action: PayloadAction<{ flowId: string | null }>
    ) => {
      state.globalFilters.flowId = action.payload.flowId
    }
  },
  extraReducers(builder: ActionReducerMapBuilder<AnalyticsState>) {
    handleDashboardCases(builder)
    handleAnalyticsCases(builder)
    handleChatCases(builder)
    handleInboxCases(builder)
    handleCompletedSessionsCases(builder)
    handleFavoriteChartCases(builder)
    builder.addDefaultCase(() => {})
  },
})
export const {
  updateLiveChatReadyState,
  resetInboxItem,
  updateInboxItem,
  addNewConversation,
  updateMessagesList,
  updateGlobalFilters,
  updateFlowSelection,
} = analyticsSlice.actions

export const dashboardSelector = (state: RootStateState) =>
  state.analytics.dashboard
export const analyticsSelector = (state: RootStateState) =>
  state.analytics.analytics
export const chatSelector = (state: RootStateState) => state.analytics.chat
export const generalSelector = (state: RootStateState) => state.analytics
export const inboxSelector = (state: RootStateState) => state.analytics.liveChat
export const chatDataSelector = (state: RootStateState) => state.analytics.chatData

export default analyticsSlice.reducer
