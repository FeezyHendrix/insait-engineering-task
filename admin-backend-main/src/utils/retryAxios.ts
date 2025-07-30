import axios from 'axios';
import axiosRetry from 'axios-retry';

const retryAxios = axios.create();

axiosRetry(retryAxios, {
  retries: 3,
  retryCondition: (error) => {
    const status = error.response?.status ?? 0;
    return axiosRetry.isNetworkError(error) || [503, 500].includes(status);
  },
  retryDelay: (retryCount) => retryCount * 1000,
});

export default retryAxios;
