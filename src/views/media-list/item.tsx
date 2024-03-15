import React, { PropsWithChildren } from 'react';
import Image from '@/src/components/common/image';
import { cn } from '@/src/lib/utils/merge-class';
import useAppStore from '@/src/stores/useAppStore';
import { MediaEntity, MediaStatus } from '@/src/types';
import { avatarUrl } from '@/src/lib/utils/media';
import { convertDuration } from '@/src/lib/utils/date';
import { CalendarFold } from 'lucide-react';
import moment from 'moment';

interface Props {
  data: MediaEntity;
}
function Item({ data }: PropsWithChildren<Props>) {
  const { setMediaSelectedID, mediaSelectedID } = useAppStore();

  return (
    <div
      className={cn('tw-border-2 tw-p-2 tw-rounded-lg tw-relative', {
        'tw-border-red-400': mediaSelectedID === data.id,
      })}
      onClick={() => setMediaSelectedID(data.id)}
    >
      <div className="tw-absolute tw-left-3 tw-top-3 tw-z-10">
        <div
          className={cn(
            'tw-w-4 tw-h-4 tw-rounded-full tw-border tw-border-white',
            {
              'tw-bg-emerald-500': data.status === MediaStatus.Done,
              'tw-bg-red-500': data.status !== MediaStatus.Done,
            }
          )}
        ></div>
      </div>
      <div
        className={cn(
          'tw-flex tw-flex-col tw-gap-1 tw-cursor-pointer tw-justify-between tw-h-full',
          {
            'tw-opacity-50 !tw-cursor-default':
              data.status !== MediaStatus.Done,
          }
        )}
      >
        <div className="tw-mb-2 tw-flex tw-flex-col tw-gap-1">
          <Image src={avatarUrl(data.avatar_thumb)} />
          <div className="tw-absolute tw-left-3 tw-bg-black/50 tw-text-sm tw-text-white tw-top-[90px] tw-py-1 tw-px-2 tw-rounded-md tw-backdrop-blur-md">
            {convertDuration(data.durations)}
          </div>
          <p className="tw-text-sm tw-line-clamp-2" title={data.name}>
            {data.name}
          </p>
        </div>
        <p className="tw-flex tw-items-center tw-gap-1 tw-text-xs tw-text-gray-600">
          <CalendarFold size={16} />
          <span className="tw-capitalize">
            {moment(data.createdAt).format('dddd, DD/MM/YYYY HH:mm')}
          </span>
        </p>
      </div>
    </div>
  );
}
export default Item;
