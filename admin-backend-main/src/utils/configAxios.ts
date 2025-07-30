import axios from 'axios';
import axiosRetry from 'axios-retry';
import constants from '../constants';

export const getConfigAxiosInstance = (authHeader: string) => {
  const instance = axios.create({
    baseURL: constants.COMPANY_CONFIG_BASE_URL,
    headers: {
      Authorization: authHeader,
    },
  });

  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000,
  });

  return instance;
};
