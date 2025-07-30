import { ChatDataRequestParams, StatUpdateRequestType, UnansweredQArchiveRequestType, UnansweredQsRequestType, KnowledgeTypeRequestType, SupportDataRequestType, PaginationSortRequestType, CrawlDataRequestParams, AppendPageRequestParams } from '@/types/network';
import { handleNetworkError } from '@/utils';
import { Client } from '@/utils/network';
import { KnowledgeType } from '@/types/knowledge';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/utils/axios';
import constants from '@/utils/constants';
import { HintActionType } from '@/lib/types';

const { BACKEND_URL } = constants




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

type CombinedKnowledgeRequestParams = PaginationSortRequestType & {
  type?: 'document' | 'qa' | 'link';
};

export const fetchCombinedKnowledgeRequest = createAsyncThunk(
  'knowledge/fetchCombinedKnowledge',
  async (
    { page, limit, order, orderBy, search, type }: CombinedKnowledgeRequestParams,
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        order,
        orderBy,
        search: search || '',
        ...(type ? { type } : {}),
      });

      const response = await Client({
        method: 'GET',
        path: `documentKnowledge/combined-knowledge?${query.toString()}`,
      });

      return response;
    } catch (e) {
      const message = handleNetworkError(e);
      return rejectWithValue({ message });
    }
  }
);


export const appendSingleLink = createAsyncThunk(
  'knowledge/',
  async (data: any, { rejectWithValue }: any) => {
    try {
      const response = await Client({ method: 'POST', path: `documentKnowledge/link`, data });
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
});

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


export const fetchKnowledgeFileURL = async (fileId: string) => {
  try {
    const response = await Client({ method: 'GET', path: `documentKnowledge/${fileId}` })
    return response;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
}