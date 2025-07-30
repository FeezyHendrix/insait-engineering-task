import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import {
  createNewBuilderFlow,
  deleteBuilderFlow,
  duplicateExistingFlow,
  getAgentBuilderFlows,
  getFlowById,
  getFlowSanity,
  updateBuilderFlow,
} from './request'
import {
  BuilderState,
  CurrentFlowDataType,
  Flow,
  SanityValidation,
} from '@/types/agent-builder'
import { toast } from 'react-toastify'

export const handleFlowCases = (
  builder: ActionReducerMapBuilder<BuilderState>
) => {
  builder
    .addCase(getAgentBuilderFlows.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(getAgentBuilderFlows.rejected.type, (state: BuilderState) => {
      state.loading = false
    })
    .addCase(
      getAgentBuilderFlows.fulfilled.type,
      (state: BuilderState, action: PayloadAction<Flow[]>) => {
        state.loading = false
        if (Array.isArray(action.payload)) {
          state.flows = action.payload
        }
      }
    )
    .addCase(createNewBuilderFlow.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(createNewBuilderFlow.rejected.type, (state: BuilderState) => {
      state.loading = false
    })
    .addCase(
      createNewBuilderFlow.fulfilled.type,
      (state: BuilderState, action: PayloadAction<Flow>) => {
        state.currentFlowId = action.payload.id
        state.loading = false
      }
    )
    .addCase(duplicateExistingFlow.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(duplicateExistingFlow.rejected.type, (state: BuilderState) => {
      state.loading = false
    })
    .addCase(
      duplicateExistingFlow.fulfilled.type,
      (state: BuilderState, action: PayloadAction<CurrentFlowDataType>) => {
        state.currentFlowId = action.payload.flow.id
        state.loading = false
      }
    )
    .addCase(updateBuilderFlow.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(updateBuilderFlow.rejected.type, (state: BuilderState) => {
      state.loading = false
    })
    .addCase(updateBuilderFlow.fulfilled.type, (state: BuilderState) => {
      state.loading = false
    })
    .addCase(deleteBuilderFlow.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(deleteBuilderFlow.rejected.type, (state: BuilderState) => {
      toast.error('Failed to delete flow')
      state.loading = false
    })
    .addCase(deleteBuilderFlow.fulfilled.type, (state: BuilderState) => {
      state.loading = false
      state.currentFlowId = ''
      toast.success('Flow deleted successfully')
    })
    .addCase(getFlowById.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(getFlowById.rejected.type, (state: BuilderState) => {
      state.loading = false
    })
    .addCase(
      getFlowById.fulfilled.type,
      (state: BuilderState, action: PayloadAction<CurrentFlowDataType>) => {
        state.loading = false
        state.currentFlowData = action.payload
      }
    )
    .addCase(getFlowSanity.pending.type, (state: BuilderState) => {
      state.loading = true
    })
    .addCase(
      getFlowSanity.rejected.type,
      (state: BuilderState, action: PayloadAction<{ message: string }>) => {
        state.loading = false
        state.sanity = {
          success: false,
          errors: [
            action.payload?.message ||
              'Something went wrong, please try again.',
          ],
        }
      }
    )
    .addCase(
      getFlowSanity.fulfilled.type,
      (state: BuilderState, action: PayloadAction<SanityValidation>) => {
        state.loading = false
        state.sanity = action.payload
      }
    )
}
