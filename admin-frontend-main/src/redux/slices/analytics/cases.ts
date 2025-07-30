import { AnalysisPropsType } from '@/types/analytics';
import { ChatDataDataResponseType, ChatDataResponseType, DashboardPropsType } from '@/types/dashboard';
import { AnalyticsState } from '@/types/redux';
import { ActionReducerMapBuilder, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { getAnalyticsRequest, getChatDataDataRequest, getChatDataRequest, getChatFeedback, getDashboardStatRequest, getFavoriteCharts, getInboxDataRequest, sendBatchRequest, updateFavoriteCharts } from './request';
import {  InboxMessageType, TransferredConversation } from '@/types/chat';


export const handleDashboardCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addCase(getDashboardStatRequest.pending.type, (state: AnalyticsState) => {
      state.dashboard.loading = true;
      state.dashboard.error = '';
    })
    .addCase(getDashboardStatRequest.rejected.type, (state: AnalyticsState, action: PayloadAction<{ message: string }>) => {
      state.dashboard.loading = false;
      state.dashboard.error = action.payload.message;
    })
    .addCase(getDashboardStatRequest.fulfilled.type, (state: AnalyticsState, action: PayloadAction<DashboardPropsType>) => {
      state.dashboard.loading = false;
      if (typeof action.payload !== 'string') {
        state.dashboard.data = action.payload;
      }
    });
};


export const handleAnalyticsCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addCase(getAnalyticsRequest.pending.type, (state: AnalyticsState) => {
      state.analytics.loading = true;
    })
    .addCase(getAnalyticsRequest.rejected.type, (state: AnalyticsState) => {
      state.analytics.loading = false;
    })
    .addCase(getAnalyticsRequest.fulfilled.type, (state: AnalyticsState, action: PayloadAction<AnalysisPropsType>) => {
      state.analytics.loading = false;
      if (typeof action.payload !== 'string') {
        state.analytics.data = action.payload;
      }
    });
};


export const handleChatCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addCase(getChatDataRequest.pending.type, (state: AnalyticsState) => {
      state.chat.loading = true;
    })
    .addCase(getChatDataRequest.rejected.type, (state: AnalyticsState) => {
      state.chat.loading = false;
    })
    .addCase(getChatDataRequest.fulfilled.type, (state: AnalyticsState, action: PayloadAction<ChatDataResponseType>) => {
      state.chat.loading = false;      
      if (Array.isArray(action.payload.pageRecords)) {        
        state.chat.data = action.payload.pageRecords;
        state.chat.totalRecords = action.payload.totalRecords        
      }
    })
    .addCase(getChatFeedback.pending.type, (state: AnalyticsState) => {
      state.chat.loading = true;
    } )
    .addCase(getChatFeedback.rejected.type, (state: AnalyticsState) => {
      state.chat.loading = false;
    })
    .addCase(getChatFeedback.fulfilled.type, (state: AnalyticsState, action: PayloadAction<ChatDataResponseType>) => {  
      state.chat.loading = false;
      if (Array.isArray(action.payload.pageRecords)) {
        state.chat.data = action.payload.pageRecords;
        state.chat.totalRecords = action.payload.totalRecords
      }
    });
};

export const handleInboxCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addCase(getInboxDataRequest.pending.type, (state: AnalyticsState) => {
      state.liveChat.loading = true;
    })
    .addCase(getInboxDataRequest.rejected.type, (state: AnalyticsState) => {
      state.liveChat.loading = false;
    })
    .addCase(getInboxDataRequest.fulfilled.type, (state: AnalyticsState, action: PayloadAction<TransferredConversation[]>) => {
      state.liveChat.loading = false;
      if (Array.isArray(action.payload)) {
        state.liveChat.inbox = action.payload;
      }
    });
};


export const handleBatchSendCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addCase(sendBatchRequest.pending.type, (state: AnalyticsState) => {
      state.liveChat.loading = true;
    })
    .addCase(sendBatchRequest.rejected.type, (state: AnalyticsState) => {
      state.liveChat.loading = false;
    })
    .addCase(getInboxDataRequest.fulfilled.type, (state: AnalyticsState, action: PayloadAction<InboxMessageType[]>) => {
      state.liveChat.loading = false;
      // if (Array.isArray(action.payload)) {
      //   state.liveChat.inbox = action.payload;
      // }
    });
};

export const handleCompletedSessionsCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addCase(getChatDataDataRequest.pending.type, (state: AnalyticsState) => {
      state.chatData.loading = true
    })
    .addCase(getChatDataDataRequest.rejected.type, (state: AnalyticsState) => {
      state.chatData.loading = false;
    })
    .addCase(getChatDataDataRequest.fulfilled.type, (state: AnalyticsState, action: PayloadAction<ChatDataDataResponseType>) => {
      state.chatData.loading = false;
      if (Array.isArray(action.payload.pageRecords)) {
        state.chatData.data = action.payload.pageRecords;
        state.chatData.totalRecords = action.payload.totalRecords
      }
    });
};

export const handleFavoriteChartCases = (builder: ActionReducerMapBuilder<AnalyticsState>) => {
  builder
    .addMatcher(isAnyOf(getFavoriteCharts.fulfilled, updateFavoriteCharts.fulfilled), (state, action) => {
      state.favoriteCharts = action.payload;
    })
};