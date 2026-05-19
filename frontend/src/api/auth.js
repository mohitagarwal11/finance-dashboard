import { api } from "./client";

export function registerUser(userData) {
  return api.post("/users/register", userData);
}

export function loginUser(credentials) {
  return api.post("/users/login", credentials);
}

export function logoutUser() {
  return api.post("/users/logout");
}

export function refreshToken(refreshTokenValue) {
  return api.post("/users/refreshToken", { refreshToken: refreshTokenValue });
}

export function getCurrentUser(config = {}) {
  return api.get("/users/me", config);
}

export function updateUserSettings(settings) {
  return api.patch("/users/settings", settings);
}
