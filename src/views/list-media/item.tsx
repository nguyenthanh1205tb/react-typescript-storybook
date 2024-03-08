import Image from '@/src/components/image';
import React, { PropsWithChildren } from 'react';

interface Props {}
function Item({}: PropsWithChildren<Props>) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-1 tw-border tw-p-2 tw-rounded-lg">
      <Image src="https://picsum.photos/300/200" />
      <p className="text-sm tw-line-clamp-2">Lorem ipsum dolor sit amet</p>
      <p className="tw-line-clamp-1 tw-text-xs tw-text-blue-500">
        <a
          href="https://www.youtube.com/watch?v&feature=youtu.be"
          target="_blank"
        >
          https://www.youtube.com/watch?v&feature=youtu.be
        </a>
      </p>
    </div>
  );
}
export default Item;
