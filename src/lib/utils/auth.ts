import {
  LS_SELECTED_ORGANIZATION_KEY,
  LS_SELECTED_TOKEN_KEY,
  LS_SELECTED_TOKEN_REFRESH_KEY,
} from '@/src/configs';

export enum AuthTokenType {
  ACCESS = LS_SELECTED_TOKEN_KEY,
  REFRESH = LS_SELECTED_TOKEN_REFRESH_KEY,
}

export const setAuthToken = (key: AuthTokenType, value: string): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getAuthToken = (key: AuthTokenType): string | undefined => {
  const token = localStorage.getItem(key);
  if (!token) return undefined;
  return token;
};

export const getLoginStatus = () => {
  const accessToken = getAuthToken(AuthTokenType.ACCESS);
  return !!accessToken;
};

export const clearAuth = () => {
  localStorage.removeItem(AuthTokenType.ACCESS);
  localStorage.removeItem(AuthTokenType.REFRESH);
  localStorage.removeItem(LS_SELECTED_ORGANIZATION_KEY);
};

export const clearStorage = () => {
  localStorage.clear();
};

export const getOrganizationId = () => {
  return localStorage.getItem(LS_SELECTED_ORGANIZATION_KEY);
};
