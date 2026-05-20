let inMemoryAccessToken = null;

export function getAccessToken() {
  return inMemoryAccessToken;
}

export function setAuthTokens({ accessToken }) {
  if (accessToken) {
    inMemoryAccessToken = accessToken;
  }
}

export function clearAuthStorage() {
  inMemoryAccessToken = null;
}
