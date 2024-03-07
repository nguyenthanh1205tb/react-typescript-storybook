import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import { AUTH_TOKEN, UPLOAD_ENDPOINT } from '.';
import Vietnamese from './uppy.locale';

export const createUppyInstance = (options?: any) => {
  // TODO: Add English locale
  return new Uppy({
    locale: Vietnamese,
  })
    .use(Dashboard, {
      inline: true,
      target: '#uppy-target',
      hideUploadButton: true,
    })
    .use(Tus, {
      removeFingerprintOnSuccess: true,
      resume: true,
      endpoint: UPLOAD_ENDPOINT,
      async onBeforeRequest(req) {
        const token = AUTH_TOKEN;
        req.setHeader('Authorization', `Bearer ${token}`);
      },
      ...(options || {}),
    });
};
