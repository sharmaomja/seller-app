import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.201.252.136:8000'
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;