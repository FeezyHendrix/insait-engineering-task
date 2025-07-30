import axios from "axios"

export const axiosInstance = axios.create({
  // Enable credentials (cookies, authorization headers) to be sent with requests
  withCredentials: false,
  // Set common headers
  headers: {
    'Content-Type': 'application/json',
  },
  // Timeout for requests
  timeout: 30000,
});

// Add response interceptor to handle CORS errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS or network error:', error);
      // You could add custom CORS error handling here
    }
    return Promise.reject(error);
  }
);
