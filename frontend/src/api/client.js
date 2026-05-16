import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

let refreshRequest = null;
let handleAuthExpired = () => {};

export function setAuthExpiredHandler(handler) {
  handleAuthExpired = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url === "/users/refreshToken";

    if (!isUnauthorized || originalRequest?._retry || isRefreshRequest) {
      if (isUnauthorized && isRefreshRequest) {
        handleAuthExpired();
      }

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= api.post("/users/refreshToken");
      await refreshRequest;
      return api(originalRequest);
    } catch (refreshError) {
      handleAuthExpired();
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  },
);
