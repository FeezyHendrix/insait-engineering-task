import axios from 'axios';
import constants from '../constants';

const axiosInstance = axios.create({
  baseURL: constants.BACKEND_URL,
});

export default axiosInstance;
