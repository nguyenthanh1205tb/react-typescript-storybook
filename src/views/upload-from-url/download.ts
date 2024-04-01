import { REACT_APP_DOWNLOAD_ENDPOINT } from '@/src/configs'
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'

export const createDownloadClient = (payload: { organizationId: string; templateId: string; urls: Array<string> }) => {
  return request(APIConfigs(REACT_APP_DOWNLOAD_ENDPOINT as string), {
    url: '/download',
    method: 'POST',
    body: payload,
  })
}

export const downloadClientRequest = createDownloadClient
