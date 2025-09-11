import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  getAccessToken,
  isTokenExpired,
  clearAuthTokens,
  redirectToLogin,
  saveTokens
} from './token-utils';
import { ErrorHandlingService } from '@/services/error-handling.service';
import { createRetryInterceptor } from './retry';

export const clientService = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  // withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];

// 🔄 Gọi refresh token
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
    
    if (response.status === 200 && response.data?.accessToken) {
      // Save the new tokens
      saveTokens(response.data.accessToken);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Token refresh failed:', err);
    const errorService = ErrorHandlingService.getInstance();
    errorService.handleAuthError(err, { showToast: false });
    return false;
  }
}

// 🔄 Xử lý hàng đợi các request đang chờ
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
}

// 🟠 Hàm xóa token và chuyển hướng đến trang đăng nhập
function clearTokensAndRedirect() {
  const errorService = ErrorHandlingService.getInstance();
  errorService.handleAuthError(new Error('Session expired'), { showToast: true });
}

clientService.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = getAccessToken();

      if (accessToken) {
        // Kiểm tra token sắp hết hạn (trước 5 phút)
        if (isTokenExpired(accessToken)) {
          // Nếu token đã hết hạn, thử refresh trước khi gửi request
          refreshAccessToken().catch(() => {
            // Nếu refresh thất bại, xóa token và chuyển hướng
            clearTokensAndRedirect();
          });
        }
        
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Interceptor xử lý lỗi 401 và retry
clientService.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const errorService = ErrorHandlingService.getInstance();

    // Handle network errors
    if (!error.response && error.request) {
      errorService.handleNetworkError(error);
      return Promise.reject(error);
    }

    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${token}`;
          return clientService(original);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const success = await refreshAccessToken();
        
        if (success) {
          // Lấy token mới
          const newToken = getAccessToken();
          processQueue(null, newToken);
          
          // Cập nhật header và retry request
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return clientService(original);
        } else {
          // Refresh token thất bại, xóa token và chuyển hướng
          processQueue(new Error('Refresh token failed'));
          clearTokensAndRedirect();
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err);
        clearTokensAndRedirect();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý lỗi 403 (Forbidden) - có thể do token không hợp lệ
    if (status === 403) {
      clearTokensAndRedirect();
    }

    // Handle other errors with the error handling service
    if (status && status !== 401 && status !== 403) {
      errorService.handleApiError(error);
    }

    return Promise.reject(error);
  }
);

// Add retry interceptor for network failures
clientService.interceptors.response.use(
  (response: AxiosResponse) => response,
  createRetryInterceptor({
    maxAttempts: 3,
    delayMs: 1000,
    backoffFactor: 2,
  })
);
