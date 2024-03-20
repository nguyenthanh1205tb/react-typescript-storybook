import LoadingItem from '@/src/components/common/media-loading-item/loading-item'
import Paginate from '@/src/components/common/paginate'
import { SkeletonCard } from '@/src/components/common/skeleton-card'
import Typo from '@/src/components/common/typo'
import { PAGINATE_LIMIT } from '@/src/configs'
import Each from '@/src/hooks/each'
import If from '@/src/hooks/if'
import { useListMedia } from '@/src/hooks/useMedia'
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'
import { cn } from '@/src/lib/utils'
import useAppStore from '@/src/stores/useAppStore'
import { ConfigResponse, FileType } from '@/src/types'
import { useQuery } from '@tanstack/react-query'
import { CheckCheck, PackageOpen, X } from 'lucide-react'
import React, { PropsWithChildren, useEffect, useMemo } from 'react'
import Item from './item'

interface Props {
  type: FileType
  isFilterOpen?: boolean
}
function ListMedia({ type, isFilterOpen }: PropsWithChildren<Props>) {
  const {
    listMedia,
    listMediaQueries,
    selectMultiMode,
    listMediaSelected,
    listFileAdded,
    mediaSelectedID,
    setListMedia,
    setListMediaQueries,
    setConfig,
    setMediaSelectedID,
    setSelectMultiMode,
    setListMediaSelected,
  } = useAppStore()
  const { getListMedia, totalCount, setTotalCount, onChangePagination, onNextPagination, onPrevPagination } =
    useListMedia()

  const { data, isLoading } = getListMedia({ fileType: type })

  const selectAllMediaInPage = () => {
    const _list = [...listMediaSelected]
    for (const media of listMedia) {
      const m = _list.filter(o => o.id === media.id)
      if (m.length <= 0) {
        _list.push(media)
      }
    }
    setListMediaSelected(_list)
  }

  useEffect(() => {
    setListMediaQueries({
      ...listMediaQueries,
      fileType: type,
    })
  }, [type])

  useEffect(() => {
    if (!isLoading && data) {
      setListMedia(data.data)
      setTotalCount(data.meta.itemCount)
      if (data.data.length) {
        setMediaSelectedID(data.data[0].id)
      }
    }
  }, [data, isLoading])

  const colNum = useMemo(() => {
    if ((mediaSelectedID || listMediaSelected.length) && isFilterOpen) return 4
    if (mediaSelectedID || listMediaSelected.length) return 5
    if (isFilterOpen) return 6
    return 8
  }, [mediaSelectedID, listMediaSelected, isFilterOpen])

  const { data: configResponse } = useQuery<ConfigResponse>({
    queryKey: ['getConfigs'],
    queryFn: () =>
      request<ConfigResponse>(APIConfigs(), {
        url: '/media/package/configs',
        method: 'GET',
      }),
  })

  useEffect(() => {
    if (configResponse) {
      setConfig(configResponse.data)
    }
  }, [configResponse])

  const listMediaItem = useMemo(() => {
    return <Each of={listMedia || []} render={item => <Item type={type} key={item?.id} data={item} />} />
  }, [listMedia, type])

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <div className="tw-flex tw-items-center tw-justify-between tw-w-full tw-pb-2 tw-z-40 tw-sticky tw-top-0 tw-bg-white">
        <div>
          <If
            isShow={!selectMultiMode}
            element={
              <Typo.Paragraph className="tw-text-red-500 tw-cursor-pointer" onClick={() => setSelectMultiMode(true)}>
                Chọn nhiều
              </Typo.Paragraph>
            }
          />
          <If
            isShow={selectMultiMode}
            element={
              <div className="tw-flex tw-items-center tw-space-x-4">
                <div className="tw-flex tw-items-center tw-gap-1 tw-text-emerald-500" onClick={selectAllMediaInPage}>
                  <CheckCheck size={18} />
                  <Typo.Paragraph className="tw-cursor-pointer">Chọn tất cả trong trang</Typo.Paragraph>
                </div>
                <div
                  className="tw-flex tw-items-center tw-gap-1 tw-text-red-500"
                  onClick={() => setSelectMultiMode(false)}>
                  <X size={18} />
                  <Typo.Paragraph className="tw-cursor-pointer">Huỷ</Typo.Paragraph>
                </div>
              </div>
            }
          />
        </div>
        <div className="tw-flex tw-items-center tw-gap-2">
          <Paginate
            totalCount={totalCount}
            limit={listMediaQueries.take ?? PAGINATE_LIMIT}
            current={listMediaQueries.page ?? 1}
            onChangePage={onChangePagination}
            onNext={onNextPagination}
            onPrev={onPrevPagination}
          />
        </div>
      </div>
      <div className={cn('tw-grid tw-gap-4 tw-w-full tw-transition-all', `tw-grid-cols-${colNum}`)}>
        <If isShow={isLoading} element={<Each of={new Array(20)?.fill(0)} render={() => <SkeletonCard />} />} />
        <If
          isShow={!!listFileAdded}
          element={<Each of={listFileAdded} render={item => <LoadingItem key={item?.contentId} data={item} />} />}
        />
        <If
          isShow={!listMedia.length && !isLoading}
          element={
            <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-absolute tw-left-0 tw-top-0">
              <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-gray-400">
                <PackageOpen size={120} />
                <Typo.H2>Không có dữ liệu</Typo.H2>
              </div>
            </div>
          }
        />
        <If isShow={!isLoading && data !== null} element={listMediaItem} />
      </div>
    </div>
  )
}
export default ListMedia
