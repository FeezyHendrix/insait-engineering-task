import { BuilderState, CurrentFlowDataType } from '@/types/agent-builder'
import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import { handleFlowCases } from './cases'

const builderInitialState: BuilderState = {
  flows: [],
  loading: false,
  currentFlowData: null,
  currentFlowId: '',
  selectedNodeId: '',
  botLoaded: false,
  sanity: {
    success: false,
    errors: [],
  },
  botUserId: '',
}

export const builderSlice = createSlice({
  name: 'builder',
  initialState: builderInitialState,
  reducers: {
    setCurrentFlowId: (state, action: PayloadAction<string>) => {
      state.currentFlowId = action.payload
    },
    setSelectedNodeId: (state, action: PayloadAction<string>) => {
      state.selectedNodeId = action.payload
    },
    setBotLoadState: (state, action: PayloadAction<boolean>) => {
      state.botLoaded = action.payload
    },
    setCurrentFlowData: (
      state,
      action: PayloadAction<CurrentFlowDataType | null>
    ) => {
      state.currentFlowData = action.payload
    },
    setBotUserId: (state, action: PayloadAction<string>) => {
      state.botUserId = action.payload
    },
  },
  extraReducers(builder: ActionReducerMapBuilder<BuilderState>) {
    handleFlowCases(builder)
    builder.addDefaultCase(() => {})
  },
})

export const {
  setCurrentFlowId,
  setCurrentFlowData,
  setBotLoadState,
  setSelectedNodeId,
  setBotUserId,
} = builderSlice.actions

export default builderSlice.reducer
