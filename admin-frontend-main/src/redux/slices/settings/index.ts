import { SettingsState } from "@/types/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleAgentSettingsCases } from "./cases";

const settingsState: SettingsState = {
  editable: {
    bot: {
      ui: {
        bot_name: '',
        bot_image: null,
        disclaimer_text: null,
        color1: null,
        color2: null,
        default_open_enabled: true,
        skin_name: null,
        language: null,
        page_title: null,
        button_text: null,
        streaming_enabled: true,
        ab_test_percentage: null,
        preview_enabled: false,
        disclaimer_enabled: false,
      },
      api: {
        whitelisted_urls: [],
        blacklisted_urls: [],
        first_message: null,
        first_prompt: null,
        second_prompt: null,
        use_second: null,
        use_parse_question: null,
        use_naive_history: null,
        r2r_wrapper_params: null,
        r2r_query_params: null
      }
    },
    admin: {
      ui: {
        language: null
      }
    }
  },
  loading: false,
  error: "",
  editEnabled: false,
  showInternalPage: true,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: settingsState,
  reducers: {
    setConfigurationValue: (state, action: PayloadAction<SettingsState['editable']>) => {
      state.editable = {
        ...state.editable,
        ...action.payload,
      };
    },
    setToggleEditEnabled: (state) => {
      state.editEnabled = !state.editEnabled;
    },
    setShowInternalPage: (state, action: PayloadAction<boolean>) => {
      state.showInternalPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleAgentSettingsCases(builder);
  },
})

export const { setConfigurationValue, setToggleEditEnabled, setShowInternalPage } = settingsSlice.actions;
export const selectConfiguration = (state: { settings: SettingsState }) => state.settings.editable;
export const selectEditEnabled = (state: { settings: SettingsState }) => state.settings.editEnabled;

export default settingsSlice.reducer