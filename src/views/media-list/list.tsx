import React from 'react'
import Paginate from '@/src/components/common/paginate'
import { SkeletonCard } from '@/src/components/common/skeleton-card'
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
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import LoadingItem from './LoadingItem'
import Item from './item'
import Typo from '@/src/components/common/typo'
import { PackageOpen } from 'lucide-react'

const BASE_ITEM_WIDTH = 239
interface Props {
  type: FileType
}
function ListMedia({ type }: PropsWithChildren<Props>) {
  const listRef = useRef<HTMLDivElement>(null)
  const [colNum, setColNum] = useState(5)
  const { listMedia, setListMedia, listMediaQueries, setListMediaQueries, setConfig, setMediaSelectedID } =
    useAppStore()
  const { getListMedia, totalCount, setTotalCount, onChangePagination, onNextPagination, onPrevPagination } =
    useListMedia()

  const { data, isLoading } = getListMedia({ fileType: type })

  useEffect(() => {
    setListMediaQueries({
      ...listMediaQueries,
      fileType: type,
    })
  }, [type])

  const showPaginateMeta = useMemo(() => {
    const currentPage = listMediaQueries.page ?? 1
    const first = currentPage === 1 ? 1 : currentPage * PAGINATE_LIMIT - PAGINATE_LIMIT + 1
    const end = currentPage === 1 ? PAGINATE_LIMIT : currentPage * PAGINATE_LIMIT
    return `Hiển thị ${first} - ${end > totalCount ? totalCount : end} / ${totalCount}`
  }, [listMediaQueries, totalCount])

  const listResize = () => {
    if (!listRef || !listRef.current) return
    const w = listRef.current.offsetWidth
    const c = w / BASE_ITEM_WIDTH
    const num = Math.ceil(c)
    if (colNum !== num) {
      setColNum(num <= 0 ? 1 : num)
    }
  }

  useEffect(() => {
    if (!isLoading && data) {
      setListMedia(data.data)
      setTotalCount(data.meta.itemCount)
      if (data.data.length) {
        setMediaSelectedID(data.data[0].id)
      }
    }
  }, [data, isLoading])

  useEffect(() => {
    if (listRef && listRef.current) {
      new ResizeObserver(listResize).observe(listRef.current)
    }
  }, [listRef])

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

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <div className="tw-flex tw-items-center tw-justify-between tw-w-full">
        <div>
          <Typo.Paragraph className="tw-text-red-500 tw-cursor-pointer">Chọn nhiều</Typo.Paragraph>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-text-xs">{showPaginateMeta}</div>
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
      <div className={cn('tw-grid tw-gap-4 tw-w-full', `tw-grid-cols-${colNum}`)} ref={listRef}>
        <If isShow={isLoading} element={<Each of={new Array(20)?.fill(0)} render={() => <SkeletonCard />} />} />
        <LoadingItem data={{}} />
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
        <If
          isShow={!isLoading && data !== null}
          element={<Each of={listMedia || []} render={item => <Item data={item} />} />}
        />
      </div>
    </div>
  )
}
export default ListMedia
