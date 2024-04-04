import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'

export const createDownloadClient = (
  payload: { organizationId: string; templateId: string; urls: Array<string> },
  endpoint: string,
) => {
  return request(APIConfigs(endpoint), {
    url: '/download',
    method: 'POST',
    body: payload,
  })
}

export const downloadClientRequest = createDownloadClient
