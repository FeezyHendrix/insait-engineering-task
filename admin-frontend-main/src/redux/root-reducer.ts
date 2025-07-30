import { combineReducers } from '@reduxjs/toolkit';
import { analyticsSlice } from './slices/analytics';
import { authSlice } from './slices/auth';
import { companyConfigSlice } from './companyConfig';
import { settingsSlice } from './slices/settings';
import { builderSlice } from './slices/agentBuilder';
import { loginPreferencesSlice } from './slices/loginPreferences';
import popularQuestionsReducer from './slices/analytics/popularQuestionsSlice';

const rootReducer = combineReducers({
  analytics: analyticsSlice.reducer,
  auth: authSlice.reducer,
  companyConfig: companyConfigSlice.reducer,
  settings: settingsSlice.reducer,
  builder: builderSlice.reducer,
  loginPreferences: loginPreferencesSlice.reducer,
  popularQuestions: popularQuestionsReducer
});

export type RootStateState = ReturnType<typeof rootReducer>;

export default rootReducer;
