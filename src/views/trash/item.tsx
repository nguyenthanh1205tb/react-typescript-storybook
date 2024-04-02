import React, { PropsWithChildren } from 'react'
import Image from '@/src/components/common/image'
import If from '@/src/hooks/if'
import { convertDuration } from '@/src/lib/utils/date'
import { FileType, MediaEntity } from '@/src/types'
import { CalendarFold, ImageIcon } from 'lucide-react'
import moment from 'moment'

interface Props {
  type: FileType
  data: MediaEntity
}
function ItemTrash({ type, data }: PropsWithChildren<Props>) {
  return (
    <div className="tw-border-2 group tw-p-3 tw-rounded-lg tw-relative">
      {/* <Popover trigger="click" placement="bottomRight" content={btnActions}>
        <div className="tw-z-40 tw-cursor-pointer tw-absolute tw-right-3 tw-top-4">
          <EllipsisVertical color="#fff" size={20} />
        </div>
      </Popover> */}
      <div className="tw-gap-1 tw-cursor-pointer tw-justify-between tw-h-full tw-flex tw-flex-col">
        <div className="tw-mb-2 tw-gap-1">
          <div className="tw-relative">
            <Image
              key={data?.id}
              alt={data?.id}
              src={
                data?.avatar_thumb?.uri || (data?.avatar_thumb?.url_list?.length ? data?.avatar_thumb?.url_list[0] : '')
              }
            />
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
  )
}
export default ItemTrash
