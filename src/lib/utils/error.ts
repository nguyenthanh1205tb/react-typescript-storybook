export const getErrorCode = (errorResponse: any) => {
  return errorResponse?.response?.errors?.[0]?.errorCode;
};
