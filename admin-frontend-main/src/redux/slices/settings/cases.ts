import { SettingsState } from '@/types/redux';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';
import { fetchAgentConfiguration, updateAgentConfiguration } from './request';
import { EditablePatch } from '@/types/configurations';

export  const handleAgentSettingsCases = (builder: ActionReducerMapBuilder<SettingsState>) => {
return  builder
    .addCase(fetchAgentConfiguration.pending.type, (state: SettingsState) => {
      state.editable = {
        ...state.editable,
      };
      state.loading = false
    })
    .addCase(fetchAgentConfiguration.fulfilled.type, (state: SettingsState, action: PayloadAction<{ message: string }>) => {
      state.editable = {
        ...state.editable,
        ...action.payload,
      };
      state.loading = false,
      state.error = action.payload.message
    })
    .addCase(fetchAgentConfiguration.rejected.type, (state: SettingsState) => {
      state.editable = {
        ...state.editable,
      };
      state.loading = false
    })
    .addCase(updateAgentConfiguration.fulfilled, (state, action) => {
      const patch = (action.meta.arg as EditablePatch).editable
      if (patch?.bot) {
        if (patch?.bot.ui) {
          const test = state.editable.bot.ui = {
            ...state.editable.bot.ui,
            ...patch.bot.ui,
          }
        }
        if (patch.bot.api) {
          state.editable.bot.api = {
            ...state.editable.bot.api,
            ...patch.bot.api,
          }
        }
      }
      if (patch.admin?.ui) {
        state.editable.admin.ui = {
          ...state.editable.admin.ui,
          ...patch.admin.ui,
        }
      }
    })
}