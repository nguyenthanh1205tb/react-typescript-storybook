import React, { PropsWithChildren } from 'react';
import Image from '@/src/components/common/image';
import { cn } from '@/src/lib/utils/merge-class';
import useAppStore from '@/src/stores/useAppStore';
import { MediaEntity, MediaStatus } from '@/src/types';
import { avatarUrl } from '@/src/lib/utils/media';

interface Props {
  data: MediaEntity;
}
function Item({ data }: PropsWithChildren<Props>) {
  const { setMediaSelectedID } = useAppStore();

  return (
    <div
      className="tw-border tw-p-2 tw-rounded-lg tw-relative"
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
        className={cn('tw-flex tw-flex-col tw-gap-1 tw-cursor-pointer', {
          'tw-opacity-50 !tw-cursor-default': data.status !== MediaStatus.Done,
        })}
      >
        <Image src={avatarUrl(data.avatar_thumb)} />
        <p className="tw-text-sm tw-line-clamp-2" title={data.name}>
          {data.name}
        </p>
      </div>
    </div>
  );
}
export default Item;
