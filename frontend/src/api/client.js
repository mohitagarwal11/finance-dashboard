import axios from "axios";
import { clearAuthStorage, getAccessToken, setAuthTokens } from "./tokenStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshRequest = null;
let handleAuthExpired = () => {};

export function setAuthExpiredHandler(handler) {
  handleAuthExpired = handler;
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken && !config.headers?.Authorization) {
    config.headers ??= {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url === "/users/refreshToken";

    if (!isUnauthorized || originalRequest?._retry || isRefreshRequest) {
      if (isUnauthorized && isRefreshRequest) {
        clearAuthStorage();
        handleAuthExpired();
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= api.post("/users/refreshToken");
      const response = await refreshRequest;
      const tokens = response.data?.data;

      if (!tokens?.accessToken) {
        throw new Error("Refresh response did not include auth tokens");
      }

      setAuthTokens(tokens);
      originalRequest.headers ??= {};
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      handleAuthExpired();
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  },
);
