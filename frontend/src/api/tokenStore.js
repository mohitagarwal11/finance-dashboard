const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getStoredUser() {
  const savedUser = localStorage.getItem(USER_DATA_KEY);

  if (!savedUser) return null;

  try {
    const parsedUser = JSON.parse(savedUser);
    return parsedUser?.data?.user || parsedUser?.user || parsedUser;
  } catch {
    localStorage.removeItem(USER_DATA_KEY);
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}
