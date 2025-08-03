import axios from 'axios';

export const clientService = axios.create({
  baseURL: process.env.BACKEND_API_URL,
  // withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: (() => void)[] = [];


// 🟠 Hàm lấy token từ cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// 🔄 Gọi refresh token
async function refreshAccessToken() {
  try {
    await axios.get('/api/auth/refresh', { withCredentials: true });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

clientService.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Ưu tiên accessToken từ cookie
      const cookieAccessToken = getCookie('accessToken');

      const accessToken = cookieAccessToken || localStorage.getItem('accessToken');

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Interceptor xử lý lỗi 401 và retry
clientService.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const success = await refreshAccessToken();

        isRefreshing = false;
        failedQueue.forEach(cb => cb());
        failedQueue = [];

        if (success) return clientService(original);
      }

      return new Promise((resolve, reject) => {
        failedQueue.push(() => {
          clientService(original).then(resolve).catch(reject);
        });
      });
    }

    return Promise.reject(error);
  }
);
