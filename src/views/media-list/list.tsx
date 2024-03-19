import Image from '@/src/components/common/image'
import LoadingItem from '@/src/components/common/media-loading-item/loading-item'
import Paginate from '@/src/components/common/paginate'
import { SkeletonCard } from '@/src/components/common/skeleton-card'
import Typo from '@/src/components/common/typo'
import VideoPlayer from '@/src/components/common/video-player'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { PAGINATE_LIMIT } from '@/src/configs'
import Each from '@/src/hooks/each'
import If from '@/src/hooks/if'
import { useListMedia } from '@/src/hooks/useMedia'
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'
import { cn } from '@/src/lib/utils'
import { avatarUrl } from '@/src/lib/utils/media'
import useAppStore from '@/src/stores/useAppStore'
import { ConfigResponse, FileType } from '@/src/types'
import { useQuery } from '@tanstack/react-query'
import { CheckCheck, PackageOpen, X } from 'lucide-react'
import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { videoUrl } from '../media-detail/detail'
import Item from './item'

interface Props {
  type: FileType
}
function ListMedia({ type }: PropsWithChildren<Props>) {
  const listRef = useRef<HTMLDivElement>(null)
  const [colNum, setColNum] = useState(5)
  const {
    listMedia,
    listMediaQueries,
    selectMultiMode,
    listMediaSelected,
    listFileAdded,
    mediaSelectedData,
    showModalChangeThumbnail,
    setShowModalChangeThumbnail,
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

  useEffect(() => {
    const getColums = (w: number) => {
      if (w > 1200) return 6
      if (w > 992) return 5
      if (w > 768) return 4
      if (w > 576) return 3
      return 1
    }
    const listResize = () => {
      if (!listRef || !listRef.current) return
      const w = listRef.current.offsetWidth
      const c = getColums(w)
      const num = Math.ceil(c)
      if (colNum !== num) {
        setColNum(num <= 0 ? 1 : num)
      }
    }
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

  const listMediaItem = useMemo(() => {
    return <Each of={listMedia || []} render={item => <Item data={item} />} />
  }, [listMedia])

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
        <div className="tw-flex tw-items-center tw-gap-2 ">
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
      {
        // <AlertDialog open={showModalChangeThumbnail} onOpenChange={status => setShowModalChangeThumbnail(status)}>
        //   <AlertDialogContent className="!tw-max-w-[65vw] tw-min-h-[300px] tw-h-[750px]">
        //     <AlertDialogHeader>
        //       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        //       <AlertDialogDescription>
        //         <If
        //           isShow={type === FileType.VIDEO}
        //           element={
        //             <VideoPlayer
        //               videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
        //               thumbnailUrl={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
        //             />
        //           }
        //         />
        //         <div className="tw-max-w-55vw tw-mt-5">
        //           <div className="tw-flex tw-gap-3 ">
        //             <div
        //               key={'upload-new-avatar_thumb'}
        //               className="tw-w-[180px] tw-relative tw-rounded-md tw-cursor-pointer">
        //               <Image src={''} height="120px" className="tw-rounded-md tw-aspect-video" />
        //               <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-0 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-transition tw-duration-300 tw-ease-in-out tw-hover:tw-opacity-50">
        //                 <Typo.Paragraph className="tw-text-white">Chọn</Typo.Paragraph>
        //               </div>
        //             </div>
        //             <div className="tw-flex tw-gap-3 tw-overflow-x-scroll !tw-max-w-[500px]">
        //               {mediaSelectedData?.data?.avatar_thumb?.url_list?.map((item, index) => {
        //                 return (
        //                   <div key={index} className="!tw-w-[180px] tw-relative tw-rounded-md tw-cursor-pointer">
        //                     <Image src={item} height="120px" className="tw-rounded-md tw-aspect-video" />
        //                     <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-0 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-transition tw-duration-300 tw-ease-in-out tw-hover:tw-opacity-50">
        //                       <Typo.Paragraph className="tw-text-white">Chọn</Typo.Paragraph>
        //                     </div>
        //                   </div>
        //                 )
        //               })}
        //             </div>
        //           </div>
        //         </div>
        //       </AlertDialogDescription>
        //     </AlertDialogHeader>
        //     <AlertDialogFooter>
        //       <AlertDialogCancel>Cancel</AlertDialogCancel>
        //       <AlertDialogAction>Continue</AlertDialogAction>
        //     </AlertDialogFooter>
        //   </AlertDialogContent>
        // </AlertDialog>
        <Dialog open={showModalChangeThumbnail} onOpenChange={status => setShowModalChangeThumbnail(status)}>
          <DialogContent className="!tw-max-w-[65vw] tw-min-h-[300px] tw-h-[750px]">
            <DialogHeader>
              <DialogTitle>Thay Thumbnail</DialogTitle>
            </DialogHeader>
            <div className="">
              <If
                isShow={type === FileType.VIDEO}
                element={
                  <VideoPlayer
                    videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
                    thumbnailUrl={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
                  />
                }
              />
              <If
                isShow={type === FileType.IMAGE}
                element={
                  <Image
                    src={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
                    height="253px"
                    className="tw-rounded-none"
                  />
                }
              />
            </div>
            <div className="">
              <div className="tw-flex tw-gap-3 tw-overflow-x-scroll">
                <div
                  key={'upload-new-avatar_thumb'}
                  className="tw-w-[180px] tw-relative tw-rounded-md tw-cursor-pointer">
                  <Image src={''} height="120px" className="tw-rounded-md tw-aspect-video" />
                  <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-0 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-transition tw-duration-300 tw-ease-in-out tw-hover:tw-opacity-50">
                    <Typo.Paragraph className="tw-text-white">Chọn</Typo.Paragraph>
                  </div>
                </div>
                <div className="tw-flex tw-gap-3 tw-max-w-[400px] tw-overflow-scroll">
                  {mediaSelectedData?.data?.avatar_thumb?.url_list?.map((item, index) => {
                    return (
                      <div key={index} className="tw-w-[180px] tw-relative tw-rounded-md tw-cursor-pointer">
                        <Image src={item} height="120px" className="tw-rounded-md tw-aspect-video" />
                        <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-0 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-transition tw-duration-300 tw-ease-in-out tw-hover:tw-opacity-50">
                          <Typo.Paragraph className="tw-text-white">Chọn</Typo.Paragraph>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
    </div>
  )
}
export default ListMedia
