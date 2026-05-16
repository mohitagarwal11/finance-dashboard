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
