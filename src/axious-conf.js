import axios from 'axios';
import router from './router';

const axiosInstance = axios.create({
  baseURL: 'http://variety.in.net/:8086',
  timeout: 5000, 
});







axiosInstance.interceptors.request.use(
  (config) => {
    const token =  localStorage.getItem('jwtToken');
    if (token && token !== undefined && token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  response => response, 
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("emailUser");
      localStorage.removeItem("userRoles");
      localStorage.removeItem("user_id");
      router.push("/login")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;