import { api } from "./client";

export function authUser(firebaseToken) {
  return api.post(
    "/auth/firebase",
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    },
  );
}

export function logoutUser() {
  return api.post("/users/logout");
}

export function refreshToken() {
  return api.post("/users/refreshToken");
}

export function getCurrentUser(config = {}) {
  return api.get("/users/me", config);
}

export function updateUserSettings(settings) {
  return api.patch("/users/settings", settings);
}

export function deleteAccount() {
  return api.delete("/users/me");
}
