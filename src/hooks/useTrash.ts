import { useQuery } from '@tanstack/react-query'
import { request } from '../lib/request'
import { APIConfigs } from '../lib/request/core/ApiConfig'
import { MediaEntity } from '../types'

export const useListMediaDeleted = () => {
  const getListMediaDeleted = () =>
    useQuery<MediaEntity[]>({
      queryKey: ['getListMediaDeleted'],
      queryFn: () =>
        request<MediaEntity[]>(APIConfigs(), {
          url: '/media/files-deleted',
          method: 'GET',
        }),
    })

  return { getListMediaDeleted }
}
