import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor: Tự động đính kèm JWT Bearer Token nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jlpt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để unwrap data hoặc bắt lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Lỗi kết nối máy chủ';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
