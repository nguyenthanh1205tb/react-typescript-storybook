export const getErrorCode = (errorResponse: any) => {
  const errorCode = errorResponse?.response?.errors?.[0]?.errorCode;
  return errorCode;
};
