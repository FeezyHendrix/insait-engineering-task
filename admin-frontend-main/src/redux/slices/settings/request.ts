import { createAsyncThunk } from '@reduxjs/toolkit'
import { Client } from '@/utils/network'
import { handleNetworkError } from '@/utils'
import { axiosInstance } from '@/utils/axios';
import constants from '@/utils/constants';
const { BACKEND_URL } = constants



export const fetchAgentConfiguration = createAsyncThunk(
  'settings/fetchAgentConfiguration',
   async (_, { rejectWithValue }) => { 
      try {
        const response = await Client({ method: 'GET', path: 'agentConfigurations' });
        return response.data.editable;
      } catch (e) {
        const message = handleNetworkError(e);
        return rejectWithValue({ message });
      }
    }
)

export const updateAgentConfiguration = createAsyncThunk(
  'settings/updateAgentConfiguration',
    async (data: object, { rejectWithValue }) => {
       try {
         const response = await Client({ method: 'PUT', path: 'agentConfigurations', data });
         return response;
       } catch (e) {
         const message = handleNetworkError(e);
         return rejectWithValue({ message });
       }
     }
)

export const uploadAgentAvatar = async (formData: FormData) => {
  try {
    const url = `${BACKEND_URL}/agentConfigurations/uploadAvatar`;
    const response = await axiosInstance.post(url, formData);
    return response.data;
  } catch (e) {
    const message = handleNetworkError(e);
    throw Error(message);
  }
};