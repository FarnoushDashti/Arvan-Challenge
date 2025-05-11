import axios from 'axios';

// رویداد ساده برای نمایش toast
const toastEvent = new EventTarget();
export function onToast(callback) {
  toastEvent.addEventListener('toast', callback);
}
function showToast(message, type = 'success', options = {}) {
  toastEvent.dispatchEvent(new CustomEvent('toast', { detail: { message, type, ...options } }));
}

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  // baseURL: 'https://api.realworld.io/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// افزودن توکن به هدر درخواست‌ها
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// اضافه کردن interceptor برای پاسخ‌ها
instance.interceptors.response.use(
  response => {
    if (
      response.config.method === 'post' &&
      response.config.url.endsWith('/articles')
    ) {
      showToast('Article created successfully', 'success');
    }
    if (
      response.config.method === 'put' &&
      /\/articles\//.test(response.config.url)
    ) {
      showToast('Article updated successfully', 'success');
    }
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 530) {
        return Promise.reject(new Error('Service temporarily unavailable. Please try again later.'));
      }
      if (
        error.response.data?.errors?.body?.[0] === 'Article with this title already exists'
      ) {
        showToast('Article with this title already exists', 'error', { persistent: true });
      }
    } else if (error.request) {
      return Promise.reject(new Error('No response received from server. Please check your internet connection.'));
    } else {
      return Promise.reject(new Error('An error occurred while setting up the request.'));
    }
    if (
      error.config &&
      error.config.url &&
      error.config.url.endsWith('/users/login')
    ) {
      let msg = 'Username and/or Password is invalid';
      if (error.response?.data?.errors?.body?.[0]) {
        msg = error.response.data.errors.body[0];
      }
      showToast(msg, 'error');
    }
    return Promise.reject(error);
  }
);

export default instance;