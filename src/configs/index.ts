const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haWFuaG5ndXllbjA2MTA4NkBnbWFpbC5jb20iLCJmdWxsTmFtZSI6Ik1haSBBbmggQWRtaW4iLCJfaWQiOiI2NWFmMjI1OGQ3Mzg5ZWNiZTY3OWE2MGQiLCJpYXQiOjE3MTAxNTE2MzEsImV4cCI6MTcxMDIzODAzMX0.VPB1vD5eQfFuhRCHgNw_Uu8CC5w_GzFr62sSpmyrASI';
const UPLOAD_ENDPOINT = 'https://uat.upload.plcplatform.net/files/';
const MEDIA_BASE_ENDPOINT = 'https://uat.upload.plcplatform.net/media';
const ORG_ID = '65bc649a1f2422e6c787898c';
const TEMPLATE_ID = '65bc649a1f2422e6c787898d';
const APP_API_URL = 'https://uat.api.plcplatform.net';

const LS_SELECTED_ORGANIZATION_KEY = 'mf-id';
const LS_SELECTED_TOKEN_KEY = 'mf-token';
const LS_SELECTED_TOKEN_REFRESH_KEY = 'mf-rfstoken';
const LS_SELECTED_TEMPLATE_KEY = 'mf-template';

const SERVER_ERROR = {
  USER_NOT_ACTIVE: 'USER_NOT_ACTIVE',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  TWO_FACTOR_AUTHENTICATION: 'TWO_FACTOR_AUTHENTICATION',
};

export {
  AUTH_TOKEN,
  ORG_ID,
  TEMPLATE_ID,
  UPLOAD_ENDPOINT,
  MEDIA_BASE_ENDPOINT,
  LS_SELECTED_ORGANIZATION_KEY,
  LS_SELECTED_TOKEN_KEY,
  LS_SELECTED_TEMPLATE_KEY,
  LS_SELECTED_TOKEN_REFRESH_KEY,
  SERVER_ERROR,
  APP_API_URL,
};
