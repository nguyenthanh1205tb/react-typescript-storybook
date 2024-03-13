import {
  AuthTokenType,
  getAuthToken,
  getOrganizationId,
} from '@/src/lib/utils/auth';
import type { ApiRequestOptions } from './ApiRequestOptions';
import { APP_API_URL } from '@/src/configs';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type APIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  TOKEN: string;
  ORGANIZATION_ID: string;
  USERNAME?: string | Resolver<string>;
  PASSWORD?: string | Resolver<string>;
  HEADERS?: Headers | Resolver<Headers>;
  ENCODE_PATH?: (path: string) => string;
};

export const APIConfigs = (
  baseUrl?: string,
  options?: { [key: string]: string }
) =>
  ({
    BASE: baseUrl ?? APP_API_URL,
    VERSION: '1.0.0',
    WITH_CREDENTIALS: false,
    CREDENTIALS: 'same-origin',
    TOKEN: getAuthToken(AuthTokenType.ACCESS),
    USERNAME: undefined,
    PASSWORD: undefined,
    HEADERS: undefined,
    ENCODE_PATH: undefined,
    ORGANIZATION_ID: getOrganizationId(),
    ...options,
  } as APIConfig);
