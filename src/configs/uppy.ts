/* eslint-disable @typescript-eslint/no-explicit-any */
import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import Tus from '@uppy/tus'
import { AuthTokenType, getAuthToken } from '../lib/utils/auth'
import Vietnamese from './uppy.locale'

export const createUppyInstance = (options: any, baseUrl: string) => {
  // TODO: Add English locale
  return new Uppy({
    locale: Vietnamese,
  })
    .use(Dashboard, {
      inline: true,
      target: '#browser-files',
      hideUploadButton: true,
    })
    .use(Tus, {
      removeFingerprintOnSuccess: true,
      resume: true,
      endpoint: baseUrl + '/files',
      async onBeforeRequest(req) {
        const token = getAuthToken(AuthTokenType.ACCESS)
        req.setHeader('Authorization', `Bearer ${token}`)
      },
      ...(options || {}),
    })
}
