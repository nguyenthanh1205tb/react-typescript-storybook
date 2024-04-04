import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import Image from '@/src/components/common/image'
import If from '@/src/hooks/if'
import { useDeleteMedia } from '@/src/hooks/useMedia'
import useTranscodePercent from '@/src/hooks/useTranscode'
import { convertDuration } from '@/src/lib/utils/date'
import { cn } from '@/src/lib/utils/merge-class'
import useAppStore from '@/src/stores/useAppStore'
import { FileType, MediaEntity, MediaProfileStatus, MediaStatus, MenuImgEditorType } from '@/src/types'
import Popconfirm from 'antd/es/popconfirm'
import { CalendarFold, Crop, EllipsisVertical, ImageIcon, Pencil, Trash2 } from 'lucide-react'
import moment from 'moment'
import Popover from 'antd/es/popover'
import notification from 'antd/es/notification'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  type: FileType
  data: MediaEntity
  onOpenImageEditor?: (initMenu?: MenuImgEditorType) => void
}

const getClassNameLoading = (percent: number) => {
  if (percent <= 20) {
    return 'ten-yl'
  }

  if (percent > 20 && percent <= 40) {
    return 'thirty-yl'
  }

  if (percent > 40 && percent <= 60) {
    return 'fifty-yl'
  }

  if (percent > 60 && percent <= 90) {
    return 'seventy-yl'
  }

  if (percent > 90) {
    return 'hundred-yl'
  }
}

function Item({ data, type, onOpenImageEditor }: PropsWithChildren<Props>) {
  const clientQueries = useQueryClient()
  const { deleteMedia } = useDeleteMedia()
  const {
    mediaSelectedID,
    selectMultiMode,
    listMediaSelected,
    config,
    setMediaSelectedID,
    setListMediaSelected,
    setCutVideoModal,
  } = useAppStore()
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const { mutate: deleteMediaMutation, isPending, data: deleteMediaData, error } = deleteMedia()

  const { transcodePercentMap } = useTranscodePercent({ profiles: data?.profiles, type })

  const transcodePercent = useMemo(() => {
    const totalProfilesPercent = Object.values(transcodePercentMap).reduce((total, percent) => {
      return total + (percent || 0)
    }, 0)

    const averagePercent = totalProfilesPercent / (Object.values(transcodePercentMap)?.length || 1)

    return Math.ceil(averagePercent)
  }, [transcodePercentMap])

  const selectHandler = (media: MediaEntity) => {
    switch (selectMultiMode) {
      case true:
        setMediaSelectedID(null)
        return setListMediaSelected(media)
      case false:
      default:
        return setMediaSelectedID(media.id)
    }
  }

  const activated = (media: MediaEntity) => {
    switch (selectMultiMode) {
      case true:
        return listMediaSelected.filter(o => o.id === media.id).length >= 1
      case false:
      default:
        return mediaSelectedID === media.id
    }
  }

  const status = useMemo(() => {
    switch (type) {
      case FileType.VIDEO:
        return MediaStatus.Done
      case FileType.IMAGE:
        return MediaStatus.Uploaded
    }
  }, [type])

  useEffect(() => {
    if (!isPending && !error && deleteMediaData) {
      setDeleteConfirm(false)
      notification.success({ message: 'Xoá media thành công' })
      clientQueries.invalidateQueries({ queryKey: ['getListMedia'] })
    }
  }, [deleteMediaData, isPending, error])

  const btnActions = useMemo(() => {
    return (
      <div className="tw-flex tw-flex-col tw-gap-1 ">
        <If
          isShow={type === FileType.IMAGE}
          element={
            <div
              onClick={() => onOpenImageEditor && onOpenImageEditor('resize')}
              className="tw-flex tw-gap-2 !tw-items-center tw-cursor-pointer hover:tw-bg-slate-200 tw-transition-all tw-px-3 tw-py-2 tw-rounded-md">
              <Pencil size={16} color="#404040" /> <span>Chỉnh sửa</span>
            </div>
          }
        />
        <If
          isShow={type === FileType.IMAGE}
          element={
            <div
              onClick={() => onOpenImageEditor && onOpenImageEditor('crop')}
              className="tw-flex tw-gap-2 !tw-items-center tw-cursor-pointer hover:tw-bg-slate-200 tw-transition-all tw-px-3 tw-py-2 tw-rounded-md">
              <Crop size={16} color="#404040" />
              <span>Cắt ảnh</span>
            </div>
          }
        />
        <If
          isShow={type === FileType.VIDEO}
          element={
            <div
              className="tw-flex tw-gap-2 !tw-items-center tw-cursor-pointer hover:tw-bg-slate-200 tw-transition-all tw-px-3 tw-py-2 tw-rounded-md"
              onClick={() => setCutVideoModal(true)}>
              <Crop size={16} color="#404040" />
              <span>Cắt video</span>
            </div>
          }
        />

        <If
          isShow={config?.uid === data.author.uid}
          element={
            <Popconfirm
              onCancel={() => setDeleteConfirm(false)}
              open={deleteConfirm}
              title="Xoá media"
              okType="danger"
              description={`Bạn có đồng ý xoá ${type === FileType.VIDEO ? 'video' : 'hình ảnh'} này không?`}
              onConfirm={() => deleteMediaMutation(data.id)}
              okText="Xoá"
              cancelText="Không"
              okButtonProps={{ loading: isPending }}>
              <div
                className="tw-flex tw-gap-2 !tw-items-center tw-cursor-pointer hover:tw-bg-slate-200 tw-transition-all tw-px-3 tw-py-2 tw-rounded-md tw-text-red-500"
                onClick={() => setDeleteConfirm(true)}>
                <Trash2 size={16} />
                <span>Xoá</span>
              </div>
            </Popconfirm>
          }
        />
      </div>
    )
  }, [deleteConfirm, type, data, config])

  return (
    <>
      <div
        className={cn('tw-border-2 group tw-p-3 tw-rounded-lg tw-relative', {
          'tw-border-red-400': activated(data),
        })}
        onClick={() => selectHandler(data)}>
        <Popover trigger="click" placement="bottomRight" content={btnActions}>
          <div className="tw-z-40 tw-cursor-pointer tw-absolute tw-right-3 tw-top-4">
            <EllipsisVertical color="#fff" size={20} />
          </div>
        </Popover>
        {data?.status !== MediaProfileStatus.TRANSCODING && data?.status !== MediaStatus.Uploading ? (
          <div className="tw-absolute tw-left-4 tw-top-4 tw-z-10">
            <div
              className={cn('tw-w-4 tw-h-4 tw-rounded-full tw-border tw-border-white', {
                'tw-bg-emerald-500': data.status === status,
                'tw-bg-red-500': data.status !== status,
              })}></div>
          </div>
        ) : null}
        {data?.status === MediaProfileStatus.TRANSCODING ? (
          <div
            className={`loading-cirle-yl tw-absolute tw-left-4 tw-top-4 tw-z-10 ${getClassNameLoading(transcodePercent)} tw-border-white`}></div>
        ) : null}

        {/* {data?.status === MediaStatus.Uploading ? (
          <div
            className={`loading-cirle tw-absolute tw-left-4 tw-top-4 tw-z-10 ${getClassNameLoading(percentUpload)} tw-border-white`}></div>
        ) : null} */}
        <div
          className={cn(' tw-gap-1 tw-cursor-pointer tw-justify-between tw-h-full', {
            'tw-opacity-50': data.status !== status,
          })}>
          <div className="tw-mb-2 tw-gap-1">
            <div className="tw-relative">
              <Image
                key={data?.id}
                alt={data?.id}
                src={
                  data?.avatar_thumb?.uri ||
                  (data?.avatar_thumb?.url_list?.length ? data?.avatar_thumb?.url_list[0] : '')
                }
              />
              <div className="tw-absolute tw-left-1 tw-bg-black/20 tw-text-xs tw-text-white tw-bottom-3 tw-py-1 tw-px-2 tw-rounded-md tw-backdrop-blur-sm">
                <If isShow={type === FileType.VIDEO} element={convertDuration(data.durations)} />
                <If isShow={type === FileType.IMAGE} element={<ImageIcon size={18} />} />
              </div>
            </div>

            <p className="tw-text-sm tw-line-clamp-2 tw-mt-1" title={data.name}>
              {data.name}
            </p>
          </div>
          <p className="tw-flex tw-items-center tw-gap-1 tw-text-xs tw-text-gray-600">
            <CalendarFold size={16} />
            <span className="tw-capitalize">{moment(data.createdAt).format('dddd, DD/MM/YYYY')}</span>
          </p>
        </div>
      </div>
    </>
  )
}
export default Item
