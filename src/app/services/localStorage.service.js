const TOKEN_KEY = "jwt-token";
const REFRESH_KEY = "jwt-refresh-token";
const EXPIRES_KEY = "jwt-expires";
const ID_KEY = "jwt-user-id";

export function setTokens({ refreshToken, idToken, localId, expiresIn = 3600 }) {
  const expiresDate = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, idToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(ID_KEY, localId);
  localStorage.setItem(EXPIRES_KEY, expiresDate);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getUserId() {
  return localStorage.getItem(ID_KEY);
}

export function getExpiresDateToken() {
  return localStorage.getItem(EXPIRES_KEY);
}

export function removeAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export const localStorageService = {
  setTokens,
  removeAuthData,
  getAccessToken,
  getRefreshToken,
  getUserId,
  getExpiresDateToken
};

export default localStorageService;
