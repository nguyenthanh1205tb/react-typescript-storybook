import Image from '@/src/components/common/image'
import If from '@/src/hooks/if'
import { convertDuration } from '@/src/lib/utils/date'
import { cn } from '@/src/lib/utils/merge-class'
import useAppStore from '@/src/stores/useAppStore'
import { FileType, MediaEntity, MediaStatus } from '@/src/types'
import { CalendarFold, ImageIcon } from 'lucide-react'
import moment from 'moment'
import React, { PropsWithChildren, useMemo } from 'react'

interface Props {
  type: FileType
  data: MediaEntity
}
function Item({ data, type }: PropsWithChildren<Props>) {
  const { setMediaSelectedID, mediaSelectedID, setListMediaSelected, selectMultiMode, listMediaSelected } =
    useAppStore()

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

  return (
    <>
      <div
        className={cn('tw-border-2 tw-p-2 tw-rounded-lg tw-relative', {
          'tw-border-red-400': activated(data),
        })}
        onClick={() => selectHandler(data)}>
        <div className="tw-absolute tw-left-3 tw-top-3 tw-z-10">
          <div
            className={cn('tw-w-4 tw-h-4 tw-rounded-full tw-border tw-border-white', {
              'tw-bg-emerald-500': data.status === status,
              'tw-bg-red-500': data.status !== status,
            })}></div>
        </div>
        <div
          className={cn(' tw-gap-1 tw-cursor-pointer tw-justify-between tw-h-full', {
            'tw-opacity-50': data.status !== status,
          })}>
          <div className="tw-mb-2 tw-gap-1">
            <div className="tw-relative">
              <Image alt={data.id} src={data.avatar_thumb?.uri} />
              <div className="tw-absolute tw-left-1 tw-bg-black/20 tw-text-xs tw-text-white tw-bottom-3 tw-py-1 tw-px-2 tw-rounded-md tw-backdrop-blur-sm">
                <If isShow={type === FileType.VIDEO} element={convertDuration(data.durations)} />
                <If isShow={type === FileType.IMAGE} element={<ImageIcon size={18} />} />
              </div>
            </div>

            <p className="tw-text-sm tw-line-clamp-2" title={data.name}>
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
