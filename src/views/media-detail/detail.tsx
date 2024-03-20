/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from '@/src/components/common/image'
import Typo from '@/src/components/common/typo'
import VideoPlayer from '@/src/components/common/video-player'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { UPLOAD_ENDPOINT } from '@/src/configs'
import Each from '@/src/hooks/each'
import If from '@/src/hooks/if'
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useForm from 'antd/es/form/hooks/useForm'
import Modal from 'antd/es/modal/Modal'
import notification from 'antd/es/notification'
import cn from 'classnames'
import {
  Ban,
  CalendarFold,
  CircleFadingPlus,
  Code,
  Download,
  Frame,
  Images,
  Loader,
  MoreVertical,
  NotebookText,
  Ruler,
  Scissors,
  X,
} from 'lucide-react'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useDetailMedia } from '../../hooks/useMedia'
import { formatBytes } from '../../lib/utils/media'
import useAppStore from '../../stores/useAppStore'
import { MediaCodec, MediaEntity, MediaPackageType, MediaPacks, MediaStatus, Video } from '../../types'
import DetailMediaForm from './detail-form'
import ListThumb from './list-thumb'

interface Props {
  type: MediaPackageType
  onExportData?: (data: MediaEntity[]) => void
}

export const videoUrl = (d?: Video) => {
  if (!d) return
  const defaultUri = d?.uri
  const hls = d.play_url.hls
  if (!hls || !hls.length) return defaultUri
  const item = hls.find(val => val.codec === MediaCodec.H264 && val.pack === MediaPacks.HLS)
  if (!item) return defaultUri
  return item.uri
}

export const getUrlThumb = (url: string, config: any) => {
  const orgId = config?.organizationId
  const pattern = new RegExp(`${orgId}.*`)
  const match = url.match(pattern)
  return match ? match[0] : url
}

const Detail = ({ type, onExportData }: Props) => {
  const [form] = useForm()

  const [showModal, setShowModal] = React.useState(false)
  const [avatarSelected, setAvatarSelected] = React.useState<string>('')
  const { mediaSelectedID, mediaSelectedData, setMediaSelectedData, config } = useAppStore()
  const { response, getDetailMedia } = useDetailMedia()

  const onUploadThumb = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mf-token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setAvatarSelected(data.url)
      })
  }

  // 1. Define your form.

  const mediaAccords = [
    {
      headerName: 'Chi tiết',
    },
    {
      headerName: 'Lịch sử',
      hide: true,
    },
    {
      headerName: 'Sử dụng',
      hide: true,
    },
    {
      headerName: 'Liên quan',
      hide: true,
    },
    {
      headerName: 'Thông tin quảng cáo',
      hide: true,
    },
  ]

  const haveMediaSelectedID = useMemo(() => mediaSelectedID !== null && mediaSelectedID !== '', [mediaSelectedID])

  useEffect(() => {
    if (mediaSelectedID) {
      getDetailMedia(mediaSelectedID)
    }
  }, [mediaSelectedID])

  const queryClient = useQueryClient()

  const { mutateAsync: onSubmitMedia } = useMutation({
    mutationFn: (values: any) =>
      request<any>(APIConfigs(), {
        url: `/media/${mediaSelectedID}`,
        method: 'PUT',
        body: values,
      }),
    onSuccess: () => {
      notification.success({
        message: 'Cập nhật thành công',
      })
      queryClient.invalidateQueries({
        queryKey: ['getListMedia'],
      })
    },
  })

  const handleUpdateMedia = useCallback((values: any) => {
    onSubmitMedia({
      name: values?.name,
      description: values?.description,
      categoryIds: values?.categoryIds,
      tags: values?.tags,
    })
  }, [])

  const onSubmitThumb = useCallback(() => {
    if (avatarSelected) {
      onSubmitMedia({
        avatar: getUrlThumb(avatarSelected, config),
      }).then(() => {
        setAvatarSelected('')
        setShowModal(false)
      })
    } else {
      notification.info({
        message: 'Chưa chọn ảnh',
      })
    }
  }, [avatarSelected, config, mediaSelectedData])

  const overlayActivated = useMemo(() => {
    if (!mediaSelectedData) return true
    switch (type) {
      case MediaPackageType.VIDEO:
        return mediaSelectedData.data.status !== MediaStatus.Done
      case MediaPackageType.IMAGE:
        return mediaSelectedData.data.status !== MediaStatus.Uploaded
    }
  }, [mediaSelectedData])

  const overlayStatusTypeName = useMemo(() => {
    switch (type) {
      case MediaPackageType.VIDEO:
        return 'Video'
      case MediaPackageType.IMAGE:
        return 'Hình ảnh'
    }
  }, [type])

  useEffect(() => {
    if (mediaSelectedData?.data) {
      form.setFieldsValue({
        name: mediaSelectedData.data.name,
        description: mediaSelectedData.data.description,
        categoryIds: mediaSelectedData.data.categories?.map(item => item.id) ?? [],
        tags: mediaSelectedData.data.tags || [],
      })
    }
  }, [response.data?.data])

  return (
    <div
      className={cn(
        'tw-bg-slate-800 tw-text-white tw-relative tw-h-full tw-w-full tw-flex-none tw-transition-all tw-max-h-[658px]',
        {
          'tw-max-w-[450px]': haveMediaSelectedID,
          'tw-max-w-0': !haveMediaSelectedID,
        },
      )}>
      <div
        className={cn(
          'tw-absolute -tw-left-8 tw-top-1/2 tw-bg-slate-800 tw-w-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-tl-lg tw-rounded-bl-lg tw-cursor-pointer',
          {
            '!tw-hidden': !haveMediaSelectedID || response.loading,
          },
        )}
        onClick={() => setMediaSelectedData(null)}>
        <X color="#ffffff" size={18} />
      </div>
      <If
        isShow={response.loading}
        element={
          <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-50 tw-bg-slate-600/20 tw-backdrop-blur-md tw-flex tw-flex-col tw-items-center tw-justify-center">
            <Loader className="tw-animate-spin" size={30} />
            <p className="tw-mt-2">Đang lấy dữ liệu</p>
          </div>
        }
      />
      <If
        isShow={haveMediaSelectedID}
        element={() => (
          <div className="tw-flex tw-flex-col">
            <div className="tw-relative">
              <If
                isShow={overlayActivated ?? true}
                element={
                  <div className="tw-absolute tw-w-full tw-h-full tw-bg-black/20 tw-backdrop-blur-md tw-top-0 tw-left-0 tw-z-10 tw-flex tw-items-center tw-justify-center">
                    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-10 tw-text-center tw-gap-1">
                      <If
                        isShow={mediaSelectedData?.data.status === MediaStatus.Transcoding}
                        element={
                          <>
                            <Loader size={30} className="tw-animate-spin" />
                            <Typo.H2>{overlayStatusTypeName} đang được xử lý</Typo.H2>
                            <Typo.Paragraph>
                              Bản xem trước sẽ được hiển thị sau khi quá trình xử lý hoàn tất
                            </Typo.Paragraph>
                          </>
                        }
                      />

                      <If
                        isShow={mediaSelectedData?.data.status === MediaStatus.Error}
                        element={
                          <>
                            <Ban size={30} />
                            <Typo.H2>{overlayStatusTypeName} bị lỗi</Typo.H2>
                            <Typo.Paragraph>Bản xem trước không khả dụng</Typo.Paragraph>
                          </>
                        }
                      />
                    </div>
                  </div>
                }
              />
              <If
                isShow={type === MediaPackageType.VIDEO}
                element={
                  <VideoPlayer
                    videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
                    thumbnailUrl={mediaSelectedData?.data.avatar_thumb?.uri || ''}
                  />
                }
              />

              <If
                isShow={type === MediaPackageType.IMAGE && mediaSelectedData !== null}
                element={
                  <Image
                    src={mediaSelectedData?.data.avatar_thumb.uri || ''}
                    height="253px"
                    containerClassName="!tw-rounded-none"
                  />
                }
              />
            </div>

            <div className="tw-flex tw-gap-2 tw-justify-between tw-bg-slate-600 tw-p-3">
              <div className="tw-flex tw-gap-4">
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Frame size={16} />
                  <span className="tw-text-xs">{`${mediaSelectedData?.data.width}x${mediaSelectedData?.data?.height}`}</span>
                  <span className="tw-text-xs">{`${mediaSelectedData?.data.width}x${mediaSelectedData?.data?.height}`}</span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Ruler size={16} />
                  <span className="tw-text-xs">{formatBytes(mediaSelectedData?.data?.size as number)}</span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <CalendarFold size={16} />
                  <span className="tw-text-xs tw-capitalize">
                    {moment(mediaSelectedData?.data?.createdAt).format('dddd, DD/MM/YYYY HH:mm:ss')}
                  </span>
                </div>
              </div>

              <div className="tw-flex tw-gap-1 tw-items-center">
                <NotebookText size={16} />
              </div>
            </div>

            <div className="tw-flex tw-justify-between tw-px-3 tw-py-2">
              <div className="tw-gap-2 tw-flex">
                <Badge
                  onClick={() => setShowModal(true)}
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400">
                  <Images size={16} />
                  <span>Thay thumbnail</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400">
                  <Code size={16} />
                  <span>Mã nhúng</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400">
                  <Scissors size={16} />
                  <span>Cắt</span>
                </Badge>
              </div>
              <div className="tw-flex tw-gap-2">
                <div className="tw-transition-all tw-w-[30px] tw-h-[30px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-slate-600 hover:tw-bg-slate-400 tw-cursor-pointer">
                  <Download size={16} />
                </div>
                <div className="tw-transition-all tw-w-[30px] tw-h-[30px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-slate-600 hover:tw-bg-slate-400 tw-cursor-pointer">
                  <MoreVertical size={16} />
                </div>
              </div>
            </div>
            <div className="tw-h-[1px] tw-bg-slate-700 tw-w-full"></div>
            <div className="tw-px-3 tw-py-2">
              <Accordion type="multiple" className="w-full">
                <Each
                  of={mediaAccords}
                  render={item => (
                    <If
                      isShow={!item.hide}
                      element={
                        <AccordionItem value={`item-${item.headerName}`} className="tw-border-slate-700">
                          <AccordionTrigger className="hover:tw-no-underline !tw-py-2">
                            {item.headerName}
                          </AccordionTrigger>
                          <AccordionContent className="tw-text-sm">
                            <ScrollArea className="tw-h-[210px] tw-pr-4">
                              <DetailMediaForm form={form} handleUpdateMedia={handleUpdateMedia} />
                            </ScrollArea>
                          </AccordionContent>
                        </AccordionItem>
                      }
                    />
                  )}
                />
              </Accordion>
            </div>
            <div className="tw-absolute tw-gap-3 tw-bottom-0 tw-w-full tw-flex tw-items-center tw-justify-center">
              <Button onClick={() => form.submit()}>Submit</Button>
              <Button
                onClick={() => {
                  if (onExportData) {
                    if (!mediaSelectedData) return onExportData([])
                    return onExportData([mediaSelectedData.data])
                  }
                }}>
                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
                  <CircleFadingPlus size={16} />
                  <span>Chèn</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      />
      <Modal
        centered
        footer={
          <div className="!tw-justify-center !tw-py-2 tw-items-center !tw-flex-row !tw-flex tw-gap-3">
            <Button onClick={() => setShowModal(false)}>Huỷ bỏ</Button>
            <Button onClick={onSubmitThumb} className="!tw-bg-green-600 !hover:tw-bg-green-700">
              Hoàn Thành
            </Button>
          </div>
        }
        classNames={{ content: '!tw-p-0', header: '!tw-p-2' }}
        open={showModal}
        onCancel={() => setShowModal(false)}
        title="Thay Thumbnail"
        className="tw-max-w-[90vw] tw-min-w-[90vw] tw-max-h-[800px]">
        <div className="!tw-block">
          {/* <div className="tw-px-3 tw-pt-2 tw-flex tw-justify-between tw-items-center">
              <X size={20} className="tw-cursor-pointer" onClick={() => setShowModal(false)} />
            </div> */}
          <div>
            <div className=" tw-bg-black">
              <div className="tw-max-w-[60%] tw-mx-auto !tw-pb-[1px]">
                <If
                  isShow={type === MediaPackageType.VIDEO}
                  element={
                    <VideoPlayer
                      videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
                      thumbnailUrl={avatarSelected || mediaSelectedData?.data?.avatar_thumb?.uri || ''}
                    />
                  }
                />
              </div>
            </div>

            <div className="tw-max-w-[70vw] tw-bg-[#434242] tw-pt-5">
              <div className="tw-flex">
                <div className="tw-flex tw-max-w-[70vw]">
                  <ListThumb
                    onUploadThumb={onUploadThumb}
                    onSelectThumb={url => setAvatarSelected(url)}
                    avatarSelected={avatarSelected}
                    items={mediaSelectedData?.data?.avatar_thumb?.url_list || []}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Detail
