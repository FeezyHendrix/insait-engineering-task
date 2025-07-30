import { ClientParamType } from '@/types/network';
import { axiosInstance } from '../axios';
import constants from '../constants';

const { BACKEND_URL, AGENT_BACKEND_URL } = constants
export const socketUrl = null; //TODO put back when this is active

export const Client = async (params: ClientParamType) => {  
  const { path, method, data, isFullURL, headers } = params;

  const url = isFullURL ? path : `${BACKEND_URL}/${path}`;
  let response;
  switch (method) {
    case 'GET':
      response = await axiosInstance.get(url, { headers });
      break
    case 'PUT':
      response = await axiosInstance.put(url, { data }, { headers });
      break;
    case 'POST':
      response = await axiosInstance.post(url, data, { headers });
      break
    case 'DELETE':
      response = await axiosInstance.delete(url, { data, headers });
      break
  }      
  const result = response?.data;
  return result;
}; 

export const AgentClient = async (params: ClientParamType) => {  
  const { path, method, data, isFullURL, headers } = params;

  const url = isFullURL ? path : `${AGENT_BACKEND_URL}/${path}`;
  let response;
  switch (method) {
    case 'GET':
      response = await axiosInstance.get(url, { headers });
      break
    case 'PUT':
      response = await axiosInstance.put(url, data, { headers });
      break;
    case 'POST':
      response = await axiosInstance.post(url, data, { headers });
      break
    case 'DELETE':
      response = await axiosInstance.delete(url, { data, headers });
      break
  }      
  const result = response?.data;
  return result;
}; 
