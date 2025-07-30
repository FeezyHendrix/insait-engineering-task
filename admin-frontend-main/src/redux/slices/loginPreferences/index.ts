import { LoginPreferencesState, LoginStatePayload } from "@/types/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loginPreferencesState: LoginPreferencesState = {
  google: {
    buttonText: "Submit",
    loading: false,
  },
  microsoft: {
    buttonText: "Submit",
    loading: false,
  },
  other: {
    buttonText: "Submit",
    loading: false,
  },
  provider: null
};

export const loginPreferencesSlice = createSlice({
  name: "loginPreferences",
  initialState: loginPreferencesState,
  reducers: {
    setButtonAndLoading: (state, action: PayloadAction<LoginStatePayload>) => {
      const { provider, buttonText, loading } = action.payload;
      state[provider].buttonText = buttonText || state[provider].buttonText;
      state[provider].loading = loading === undefined ? state[provider].loading : loading;
    },
    setProvider: (state, action: PayloadAction<"google" | "microsoft" | "other" | null>) => {
      state.provider = action.payload
    },
  }
})

export const { setButtonAndLoading, setProvider } = loginPreferencesSlice.actions;
export const selectButtonTextAndLoading = (state: { loginPreferences: LoginPreferencesState }) => state.loginPreferences;

export default loginPreferencesSlice.reducer