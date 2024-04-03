import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { request } from '../lib/request'
import { APIConfigs } from '../lib/request/core/ApiConfig'

export interface WatchFile {
  fileFormat: string
  fileName: string
  fileSize: string
  key: string
  time: string
  isDirectory: boolean
  name: string
  size: number
  mime: string
  modifiedDate: number
  requestPath: string
}

export interface GetS3FolderResponse {
  data: WatchFile[]
  success: boolean
}

export interface SyncRequest {
  organizationId: string
  templateId: string
  keys: string[]
}

export interface RowSelectionFile extends WatchFile {
  key: string
}

export const useWatchS3Folder = ({ enable }: { enable: boolean }) => {
  const [filesSelected, setFilesSelected] = useState<RowSelectionFile[]>([])

  const getWatchS3Folder = (payload?: { folder?: string[]; organizationId?: string }) => {
    const f = payload?.folder?.join('/').trim() ?? ''
    return useQuery<GetS3FolderResponse>({
      refetchOnWindowFocus: false,
      staleTime: 0,
      queryKey: ['getWatchS3Folder', payload],
      enabled: enable,
      queryFn: () =>
        request<GetS3FolderResponse>(APIConfigs(), {
          url: '/objects',
          method: 'GET',
          query: {
            prefix: f === '' ? f : f + '/',
            organizationId: payload?.organizationId,
          },
        }),
    })
  }

  const sync = () => {
    return useMutation({
      mutationKey: ['sync-s3-folder'],
      mutationFn: (payload: SyncRequest) =>
        request(APIConfigs(), {
          url: '/getObject',
          method: 'POST',
          body: payload,
        }),
      onSuccess: () => {
        setFilesSelected([])
        getWatchS3Folder().refetch()
      },
    })
  }

  return {
    getWatchS3Folder,
    sync,
    filesSelected,
    setFilesSelected,
  }
}
