import { ChatDataRequestParams, StatUpdateRequestType, UnansweredQArchiveRequestType, UnansweredQsRequestType, KnowledgeTypeRequestType, SupportDataRequestType, PaginationSortRequestType, CrawlDataRequestParams, AppendPageRequestParams } from '@/types/network';
import { LanguageShortType, UpdateInteractionPayload } from '@/types/redux';
import { handleNetworkError } from '@/utils';
import { Client } from '@/utils/network';
import { KnowledgeType } from '@/types/knowledge';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {socket} from '@/main'
import { PageDataBodyType } from '@/types/dashboard';
import { axiosInstance } from '@/utils/axios';
import constants from '@/utils/constants';
import { NewScenarioType } from '@/types/scenario';
import { favoriteChartAction } from '@/types/chart';
import { LoginPreferencesRequest } from '@/types/login';
import { HintActionType } from '@/lib/types';
const { BACKEND_URL } = constants


export const getDashboardStatRequest = createAsyncThunk(
  'analytics/getDashboardStatRequest',
  async (_, { rejectWithValue }) => { 
    try {

      const response = await Client({ method: 'GET', path: `analytics/dashboard` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getAdminStatRequest = createAsyncThunk(
  'analytics/getDashboardStatRequest',
  async (_, { rejectWithValue }) => { 
    try {

      const response = await Client({ method: 'GET', path: `analytics/admin` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getWhatsappTemplateTextsRequest = createAsyncThunk(
  'batch/getTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'batch/getTemplates'});
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message })
    }
  }
)

export const getChatDataRequest = createAsyncThunk(
  'analytics/getChatDataRequest',
  async (
    { page, itemsPerPage, order, orderBy, sentiment = '', persona = '', node = '', search, startDate, endDate, flowId }: ChatDataRequestParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await Client({
        method: 'GET',
        path: `conversations/conversationPages/${page}` +
          `?limit=${itemsPerPage}` +
          `&order=${order}` +
          `&orderBy=${orderBy}` +
          `&sentiment=${sentiment}` +
          `&persona=${persona}` +
          `&node=${node}` +
          `&search=${search}` +
          `${startDate ? `&startTime=${startDate}` : ''}` +
          `${endDate ? `&endTime=${endDate}` : ''}` +
          `${flowId && flowId !== 'allFlows' ? `&flowId=${flowId}` : ''}`
      });
      const pageRecords = response.data;
      const { totalRecords } = response.pagination;
      return { pageRecords, totalRecords };
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getInboxDataRequest = createAsyncThunk(
  'analytics/getInboxDataRequest',
  async (_, { rejectWithValue }) => {
    
    try {
      const response = await socket?.emitWithAck('get_all_transferred_conversations')
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getConversationDataByIdRequest = createAsyncThunk(
  'analytics/getConversationDataByIdRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = {
        agentId : 'agent',
        userRoomId: id
      }
      const response = await socket?.emitWithAck('agent_join_user_conversation', data)
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getStatUpdatedDataRequest = createAsyncThunk(
  'analytics/getStatUpdatedDataRequest',
  async (payload: StatUpdateRequestType, { rejectWithValue }) => {
    
    try {
      const { month, chartType } = payload
      const response = await Client({ method: 'GET', path: `charts/${chartType}?month=${month}` });      
      return response.data;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const updateInteractionMessagesRequest = createAsyncThunk(
  'analytics/postInteractionMessagesRequest',
  async ({ id, value }: UpdateInteractionPayload, { rejectWithValue }) => {
    const data = { comment: value }

    try {

      const response = await Client({ method: 'PUT', path: `analytics/updateInteraction/${id}`, data });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);


export const getAnalyticsRequest = createAsyncThunk(
  'analytics/getAnalyticsRequest',
  async (_, { rejectWithValue }) => {
    try {

      const response = await Client({ method: 'GET', path: `analytics/advancedAnalytics` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getGenericDataRequest = createAsyncThunk(
  'analytics/getStatUpdatedDataRequest',
  async (payload: StatUpdateRequestType, { rejectWithValue }) => {

    try {
      const { url, type } = payload
      if (!url || !type) return;
      const response = await Client({ method: 'GET', path: url });
      return response[type];
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const sendBatchRequest = createAsyncThunk(
  'batch/send',
  async (data: any, { rejectWithValue } :any) => {
    try {
      const response = await Client({ method: 'POST', path: `batch/send?individualMessages=true`,data:data });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);
export const createSupportRequest = createAsyncThunk(
  'report/send',
  async (formData: FormData, { rejectWithValue } :any) => {
    try {
      const url = `${BACKEND_URL}/report/ticket`
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const updateSupportRequest = createAsyncThunk(
  'report/send',
  async (data: SupportDataRequestType, { rejectWithValue } :any) => {
    try {
      const response = await Client({ method: 'PUT', path: `report/ticket`, data });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const sendSupportCommentRequest = createAsyncThunk(
  'report/send',
  async (formData: FormData, { rejectWithValue } :any) => {
    try {
      const url = `${BACKEND_URL}/report/comment`
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getSupportTickets = createAsyncThunk(
  'report/getSupportTickets',
  async (data: ChatDataRequestParams, { rejectWithValue }: any) => {
    try {
      const { itemsPerPage, page, order, orderBy, search, status, priority } = data
      const response = await Client({ method: 'GET', path: `report/getAll?page=${page}&limit=${itemsPerPage}&order=${order}&orderBy=${orderBy}&search=${search}&status=${status}&priority=${priority}` });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getSupportTicketDetailById = createAsyncThunk(
  'conversationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `report/${id}` });
      return response
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const deleteSupportTicket = createAsyncThunk(
  'report/getSupportTickets',
  async (id: string, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'DELETE', path: `report/delete/${id}` });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);


//Templates API
export const getAllTemplates = createAsyncThunk(
  'templates/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'templates/getAll'});
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message })
    }
  }
)

export const createTemplate = createAsyncThunk(
  'templates/add',
  async (data: object, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'POST', path: 'templates/add', data });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message })
    }
  }
)

export const deleteTemplate = createAsyncThunk(
  'templates/delete/:templateId',
  async (templateId: string, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'DELETE', path: `templates/delete/${templateId}`});
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getUnansweredQsDataRequest = createAsyncThunk(
  'unansweredQs/getUnansweredQs',
  async ({ page, limit }: UnansweredQsRequestType, { rejectWithValue }) => {
    
    try {
      const response = await Client({ method: 'GET', path: `unansweredQs/getUnansweredQs?page=${page}&limit=${limit}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const deleteUnansweredQRequest = createAsyncThunk(
  'unansweredQs/delete/:unansweredQId',
  async (unansweredQId: string, { rejectWithValue }) => {    
    try {
      const response = await Client({ method: 'DELETE', path: `unansweredQs/delete/${unansweredQId}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const putUnansweredQArchiveRequest = createAsyncThunk(
  'unansweredQs/archive/:unansweredQId',
  async (payload: UnansweredQArchiveRequestType, { rejectWithValue }) => {    
    try {
      const response = await Client({ method: 'PUT', path: `unansweredQs/archive`, data: payload });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);
export const postNewKnowledgeRequest = createAsyncThunk(
  'knowledge/uploadKnowledge',
  async (payload: KnowledgeTypeRequestType, { rejectWithValue }) => {
    const {isUpdate, data} = payload
    const route = isUpdate ? 'updateKnowledge' : 'uploadKnowledge';
    const method = isUpdate ? 'PUT' : 'POST';
    try {
      const response = await Client({ method, path: `knowledge/${route}`, data })
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const uploadMultipleKnowledgeRequest = createAsyncThunk(
    'filePreview/displayPreview',
    async (payload: KnowledgeType[], { rejectWithValue }) => {
      const results: string[] = [];
      const failures: string[] = [];
  
      for (const knowledgeItem of payload) {
        try {
          const response = await Client({ method: 'POST', path: `knowledge/uploadKnowledge`, data: knowledgeItem })

          if(response?.msg?.question) {
            results.push(response?.msg?.question);
          } else {
            failures.push(response?.error);
          }
        } catch (error: any) {
          failures.push(error?.message || `${knowledgeItem.question} upload failed`);
        }
      }
  
      if (results.length === 0) {
        return rejectWithValue({ message: 'No files were successfully uploaded', failures });
      }
  
      return results;
    }
  );

export const postNewKnowledgePDFRequest = createAsyncThunk(
  'knowledge/uploadKnowledge',
  async (data: any, { rejectWithValue }) => {
    try {
      const headers = {
            'Content-Type': 'multipart/form-data'
          }
      const response = await Client({ method: 'POST', path: 'knowledge/uploadKnowledge', data, headers })
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const deleteKnowledgeRequest = createAsyncThunk(
  'knowledge/deleteKnowledge',
  async (data: KnowledgeType, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'DELETE', path: 'knowledge/deleteKnowledge', data })
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const fetchKnowledgeRequest = createAsyncThunk(
  'knowledge/',
  async (data: ChatDataRequestParams, { rejectWithValue }: any) => {
    try {
      const { itemsPerPage, page, order, orderBy, search } = data;
      const response = await Client({ method: 'GET', path: `knowledge/?page=${page}&limit=${itemsPerPage}&order=${order}&orderBy=${orderBy}&search=${search}` });
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const startKnowledgeCrawlProcess = createAsyncThunk(
  'knowledge/',
  async (data: CrawlDataRequestParams, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'POST', path: `documentKnowledge/crawl`, data });
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  })

export const fetchKnowledgeCrawlStatusRequest = createAsyncThunk(
  'knowledge/',
  async (data: { jobId: string }, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'GET', path: `documentKnowledge/crawl/status/${data.jobId}` });
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const fetchActiveCrawlingJob = createAsyncThunk(
  'knowledge/fetchActiveJob',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'documentKnowledge/crawl/active' });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);


export const appendURLToKnowledgeBase = createAsyncThunk(
  'knowledge/',
  async (data: AppendPageRequestParams, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'POST', path: `documentKnowledge/crawl/append-url`, data });
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)


export const fetchFileKnowledgeRequest = createAsyncThunk(
  'knowledge/getKnowledges',
  async ({ page, limit, order, orderBy }: PaginationSortRequestType, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `documentKnowledge/?page=${page}&limit=${limit}&order=${order}&orderBy=${orderBy}`})
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const deleteFileKnowledgeRequest = createAsyncThunk(
  'knowledge/getKnowledges',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'DELETE', path: `documentKnowledge/${id}`})
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const toggleKnowledgeActivenessRequest = createAsyncThunk(
  'knowledge/toggleKnowledgeActivenesss',
  async (data: KnowledgeType, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'PUT', path: 'knowledge/toggleKnowledgeActiveness', data })
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const getAllMessageFeedback = createAsyncThunk(
  'analytics/thumbsMessagesData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'analytics/thumbsMessagesData'});
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message })
    }
  }
)

export const getThumbsConversation = createAsyncThunk(
  'analytics/oneThumbsConversation/:messageId',
  async (messageId: string, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `analytics/oneThumbsConversation/${messageId}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

//charts

export const getUserInteractionChartData = createAsyncThunk(
  'charts/:chartType',
  async (chartType: string,  { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `charts/${chartType}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getChartDataWithMonth = createAsyncThunk(
  'analytics/getStatUpdatedDataRequest',
  async (payload: StatUpdateRequestType, { rejectWithValue }) => {
    try {
      const { month, chartType, language } = payload
      const response = await Client({ method: 'GET', path: `charts/${chartType}?month=${month}&language=${language}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getChartDataWithDates = createAsyncThunk(
  'analytics/getStatUpdatedDataRequest',
  async (payload: StatUpdateRequestType, { rejectWithValue }) => {
    
    try {
      const { startDate, endDate, chartType, language, selectedProduct, flowId } = payload
      const response = await Client({ method: 'GET', path: `charts/${chartType}?startDate=${startDate}&endDate=${endDate}&language=${language}${selectedProduct ? `&product=${selectedProduct}` : ''}${flowId ? `&flowId=${flowId}` : ''}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getChatDataDataRequest = createAsyncThunk(
  'conversations',
  async ({ page, itemsPerPage, order, orderBy, search, startDate, endDate, flowId }: ChatDataRequestParams, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `conversations/conversationPages/${page}` +
        `?limit=${itemsPerPage}` + 
        `&order=${order}` + 
        `&orderBy=${orderBy}` + 
        `&botSuccessOnly=true` + 
        `&search=${search}` +
        `${startDate ? `&startTime=${startDate}` : ''}` +
        `${endDate ? `&endTime=${endDate}` : ''}` +
        `${flowId && flowId !== 'allFlows' ? `&flowId=${flowId}` : ''}`
      });    
      const pageData = response.data;
      const { totalRecords } = response.pagination;
      const pageRecords = pageData.map((responseItem: PageDataBodyType, index: number) => ({
        id: index,
        botSuccess: responseItem.botSuccess,
        updatedAt: responseItem.updatedAt,
        createdAt: responseItem.createdAt,
        userId: responseItem.user.id,
        chatId: responseItem.chatId,
        dataObject: JSON.parse(responseItem.dataObject),
        comment: responseItem.comment,
        messages: responseItem.messages,
        user: {
          id: responseItem.user.id,
          firstName: responseItem.user.firstName,
          lastName: responseItem.user.lastName,
        }
      }));

      
      return { pageRecords, totalRecords };
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getConversationAnswerRequest = createAsyncThunk(
  'analytics/getConversationAnswerRequest',
  async ({ id, question }: { id: string, question: string }, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `conversations/${id}` });
      
      if (response?.messages && Array.isArray(response.messages)) {
        const messages = response.messages;
        
        // Normalize the search question
        const normalizedSearchQuestion = question.toLowerCase().trim();
        
        // Find the index of the question in the conversation
        const questionIndex = messages.findIndex((msg: { pov: string; text: string }) => {
          const normalizedMsgText = msg.text.toLowerCase().trim();
          return msg.pov === 'user' && normalizedMsgText === normalizedSearchQuestion;
        });
        
        if (questionIndex === -1 || questionIndex === messages.length - 1) {
          return { answer: '' };
        }

        // Get the first bot message that follows this specific question
        let botAnswer = '';
        for (let i = questionIndex + 1; i < messages.length; i++) {
          if (messages[i].pov === 'bot') {
            botAnswer = messages[i].text;
            break;
          }
        }

        return { answer: botAnswer };
      }
      return { answer: '' };
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getConversationByIdRequest = createAsyncThunk(
  'conversationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `conversations/${id}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

//charts


export const getAllSecurityViolationMessages = createAsyncThunk(
  '/securityViolationMessages/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'securityViolationMessages/getAll'});
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message })
    }
  }
)
 
export const getChatFeedback = createAsyncThunk(
  '/conversation/conversationPages',
  async ({ page, itemsPerPage, order, orderBy, selectedRating }: ChatDataRequestParams, { rejectWithValue }) => {
    try {      
      const response = await Client({ method: 'GET', path: `conversations/conversationPages/${page}?limit=${itemsPerPage}&order=${order}&orderBy=${orderBy}&hasFeedbackOnly=true&rating=${selectedRating}` });    
      const pageRecords = response.data;
      const { totalRecords } = response.pagination;
      return { pageRecords, totalRecords };
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message })
    }
  }
);

export const fetchChatFeedbackForExport = async (totalRecords: number) => {
   try {
      const totalPages = Math.ceil(totalRecords / 500);
      const allFeedback = [];
      for (let i = 0; i < totalPages; i++) {
        const response = await Client({ method: 'GET', path: `conversations/conversationPages/${i + 1}?limit=500&order=des&orderBy=createdAt&hasFeedbackOnly=true` });
        allFeedback.push(...response.data);
      };
      return allFeedback;
    } catch (error: any) {
      const message = handleNetworkError(error);
      throw new Error(message);
    }
}

export const getChartData = createAsyncThunk(
  'charts/:chartType',
  async (chartType: string,  { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `charts/${chartType}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getPDFFile = createAsyncThunk(
  'conversation/getPDFFile',
  async (fileUrl: string, { rejectWithValue }) => {
    try {
      const encodedFileUrl = encodeURIComponent(fileUrl);
      const response = await Client({ 
        method: 'GET', 
        path: `conversations/fetchFile/${encodedFileUrl}`, 
      });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getChartDataWithLanguage = createAsyncThunk(
  'charts/:chartType',
  async ({chartType, language, daysBack}: {chartType: string, language?: string, daysBack?: number | null},  { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `charts/${chartType}?${language ? `&language=${language}` : ''}${daysBack !== null ? `&daysBack=${daysBack}` : ''}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getChartDataWithMedia = createAsyncThunk(
  'charts/:chartType',
  async ({chartType, language, media, startDate, endDate, flowId }: {chartType: string, language?: string, media: string[], startDate?: string | null, endDate?: string | null, flowId?: string | null },  { rejectWithValue }) => {
    try {
      const mediaString = media.length ? media.join(',') : '';
      const response = await Client({ method: 'GET', path: `charts/${chartType}?startDate=${startDate}&endDate=${endDate}&media=${mediaString}${language ? `&language=${language}` : ''}${flowId ? `&flowId=${flowId}` : ''}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);


export const fetchCompletedSessionData = async (startDate: string, endDate: string) => {
  try {
    let allData: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const MAX_PAGES = 10;
    
    while (hasMorePages && currentPage <= MAX_PAGES) {
      const path = `conversations/allConversations?endTime=${endDate}${startDate ? `&startTime=${startDate}` : ''}&botSuccessOnly=true&limit=500&page=${currentPage}`;
      const response = await Client({ method: 'GET', path });
      
      const { data, pagination } = response;

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response data format');
      }

      if (!pagination || typeof pagination.totalPages !== 'number') {
        throw new Error('Invalid pagination data');
      }

      allData = [...allData, ...data];

      if (
        currentPage >= pagination.totalPages || 
        data.length === 0 ||
        allData.length >= (pagination.totalRecords || 0)
      ) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }
    return allData;
  } catch (e) {
    const message = handleNetworkError(e);
    throw new Error(message);
  }
};

export const fetchUnansweredQsData = async (startDate: string, endDate: string) => {
  try {
    let allData: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    const MAX_PAGES = 10;

    while (hasMorePages && currentPage <= MAX_PAGES) {
      const path = `unansweredQs/getUnansweredQs?endTime=${endDate}${startDate ? `&startTime=${startDate}` : ''}&limit=500&page=${currentPage}`;

      const response = await Client({ method: 'GET', path });
      
      const { data, total } = response;

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response data format');
      }
      if (!total || typeof total !== 'number') {
        throw new Error('Invalid pagination data');
      }

      allData = [...allData, ...data];

      const totalPages = Math.ceil(total / 500);

      if (
        currentPage >= totalPages ||
        data.length === 0 ||
        allData.length >= total
      ) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }
    return allData;
  } catch (e) {
    const message = handleNetworkError(e);
    throw new Error(message);
  }
};


export const uploadKnowledgeDocument = async (formData: FormData) => {
  try {
    const url = `${BACKEND_URL}/documentKnowledge/upload`
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return response && response.data;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const getTestScenariosRequest = createAsyncThunk(
  'testScenario',
  async (data: ChatDataRequestParams, { rejectWithValue }: any) => {
    try {
      const { itemsPerPage, page, order, orderBy, search } = data
      const response = await Client({ method: 'GET', path: `testScenarios/pages?page=${page}&limit=${itemsPerPage}&order=${order}&orderBy=${orderBy}&search=${search}` });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getTestRunsRequest = createAsyncThunk(
  'testScenario/:testScenarioId',
  async (scenarioId: string, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'GET', path: `testScenarios/${scenarioId}` });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const runTestScenario = createAsyncThunk(
  'testScenario/testRun',
  async (data: {testScenarioId: string, companyName: string, language: LanguageShortType}, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'POST', path: 'testScenarios/testRun', data });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const createNewTestScenario = createAsyncThunk(
  'testScenario',
  async (data: NewScenarioType, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'POST', path: 'testScenarios', data });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
});

export const deleteTestScenario = createAsyncThunk(
  'testScenario',
  async (testScenarioId: string, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'DELETE', path: `testScenarios/${testScenarioId}` });
      return response;
    } catch (e) {
      let message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
});
export const fetchKnowledgeFileURL = async (fileId: string) => {
  try {
    const response = await Client({ method: 'GET', path: `documentKnowledge/${fileId}` })
    return response;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
}

export const fetchFileDocumentBuffer = async (fileId: string) => {
  try {
    const response = await axiosInstance.get(
      `${BACKEND_URL}/documentKnowledge/fetch-file/${fileId}`,
      {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/octet-stream'
        }
      }
    )
    return response.data;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get(`${BACKEND_URL}/conversations/products`)
    return response.data;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const getFavoriteCharts = createAsyncThunk(
  'userSettings',
  async (__dirname, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'userSettings' });
      const { favoriteCharts } = response;
      return favoriteCharts || [];
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const updateFavoriteCharts = createAsyncThunk(
  'userSettings/favoriteCharts',
  async ({ chartType, action }: { chartType: string, action: favoriteChartAction },
    { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'PUT', path: 'userSettings/favoriteCharts', data: {payload: {chartType, action}} });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const postLoginPreferences = async (requestPayload: LoginPreferencesRequest) => {
  try {
    const response = await Client({ method: 'POST', path: `loginPreferences`, data: requestPayload });
    if (!response.flowRunId && requestPayload.provider !== 'other') {
      throw Error('Error submitting data');
    }
    return response.flowRunId;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const getLastLoginPreferences = async (realm: string, provider?: string) => {
  try {
    const data = {
      realm, provider, keycloakUrl: constants.KEYCLOAK_URL
    }
    const response = await Client({ method: 'POST', path: `loginPreferences/currentIDPData`, data });
    return response;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const getFlowStatus = async (flowId: string) => {
  try {
    const response = await Client({ method: 'GET', path: `loginPreferences/flowStatus/${flowId}`});
    const { flowStatus } = response;
    if (!flowStatus) {
      throw Error('Error fetching flow status');
    }
    return flowStatus;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

interface PopularQuestionsRequestParams {
  sortBy: string;
  timeRange: string;
}

export const getPopularQuestionsRequest = createAsyncThunk(
  'popularQuestions/getClusters',
  async ({ sortBy, timeRange }: PopularQuestionsRequestParams, { rejectWithValue }) => {
    try {
      const response = await Client({ 
        method: 'GET', 
        path: `frequentQuestions/clusters?sortBy=${sortBy}&timeRange=${timeRange}` 
      });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const appendSingleLink = createAsyncThunk(
  'knowledge/appendSingleLink',
  async (data: { name: string; pageTitle: string; pageDescription: string; url: string }, { rejectWithValue }) => {
    try {
      const response = await Client({ 
        method: 'POST', 
        path: 'knowledge/appendSingleLink',
        data 
      });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }

  }
);

export const fetchCombinedKnowledgeRequest = createAsyncThunk(
  'knowledge/fetchCombined',
  async (params: { 
    page: number; 
    limit: number; 
    order: string; 
    orderBy: string; 
    search?: string;
    type?: string;
  }, { rejectWithValue }) => {
    try {
      const { page, limit, order, orderBy, search, type } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        order,
        orderBy,
        ...(search && { search }),
        ...(type && { type })
      }).toString();

      const response = await Client({ 
        method: 'GET', 
        path: `knowledge/combined?${queryParams}`
      });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const getFlows = async () => {
  try {
    const response = await Client({ method: 'GET', path: `conversations/flows` });
    return response;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const sendKnowledgeHint = async (documentId: string, r2rId: string, action: HintActionType, newHint: string, previousHint: string) => {
  try {
    const response = await Client({ method: 'PUT', path: `documentKnowledge/hints/${documentId}/r2r`, data: { action, newHint, previousHint, r2rId } });
    return response;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};

export const fetchCrawlHistory = createAsyncThunk(
  'knowledge/fetchCrawlHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: 'documentKnowledge/crawl/history' });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);

export const fetchCrawlJobData = createAsyncThunk(
  'knowledge/fetchCrawlJobData',
  async ({ jobId }: { jobId: string }, { rejectWithValue }) => {
    try {
      const response = await Client({ method: 'GET', path: `documentKnowledge/crawl/job/${jobId}` });
      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);
