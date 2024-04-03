import { useMutation, useQuery } from '@tanstack/react-query'
import { request } from '../lib/request'
import { APIConfigs } from '../lib/request/core/ApiConfig'

export interface WatchFile {
  isDirectory: boolean
  name: string
  size: number
  mime: string
  modifiedDate: number
  requestPath: string
  used: boolean
}

export interface GetWatchFolderResponse {
  data: WatchFile[]
  success: boolean
}

export interface SyncRequest {
  organizationId: string
  templateId: string
  paths: string[]
}

export const useWatchFolder = () => {
  const getWatchFolderFiles = (payload?: { folder?: string[]; fileName?: string }) => {
    const f = payload?.folder?.join('/').trim() ?? ''
    const n = payload?.fileName ?? ''
    return useQuery<GetWatchFolderResponse>({
      refetchOnWindowFocus: false,
      staleTime: 0,
      queryKey: ['getWatchFolderFiles', payload],
      queryFn: () =>
        request<GetWatchFolderResponse>(APIConfigs(), {
          url: '/files',
          method: 'GET',
          query: {
            folder: f,
            filterName: n,
          },
        }),
    })
  }

  const sync = () => {
    return useMutation({
      mutationKey: ['sync-watch-folder'],
      mutationFn: (payload: SyncRequest) =>
        request(APIConfigs(), {
          url: '/sync',
          method: 'POST',
          body: payload,
        }),
    })
  }

  return {
    getWatchFolderFiles,
    sync,
  }
}
