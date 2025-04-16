
import axios from "axios";
import { refreshAccessToken, logout } from "../slices/authSlice"

let store; // Store will be set dynamically

export const injectStore = (_store) => {//i did like this because of initialization error(to avoid circular dependency betweeen store and axiosConfig)
  store = _store;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    if (store) {
      const state = store.getState();
      if (state.auth.accessToken) {
        config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && store) {
      originalRequest._retry = true;
      const state = store.getState();
      try {
        const result = await store.dispatch(
          refreshAccessToken(state.auth.refreshToken)
        ).unwrap();
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;