import { createSlice } from '@reduxjs/toolkit';
import { getPopularQuestionsRequest } from './request';

export interface Question {
  id: string;
  clusterId: string;
  question: string;
  answer?: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
}

export interface Cluster {
  id: string;
  representativeQuestion: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

interface PopularQuestionsState {
  clusters: Cluster[];
  loading: boolean;
  error: string | null;
}

const initialState: PopularQuestionsState = {
  clusters: [],
  loading: false,
  error: null,
};

const popularQuestionsSlice = createSlice({
  name: 'popularQuestions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopularQuestionsRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopularQuestionsRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct array response and wrapped response
        state.clusters = Array.isArray(action.payload) ? action.payload : (action.payload.data || []);
      })
      .addCase(getPopularQuestionsRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = popularQuestionsSlice.actions;
export default popularQuestionsSlice.reducer; 