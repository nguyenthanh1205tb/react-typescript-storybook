import React, { PropsWithChildren } from 'react';
import Item from './item';

interface Props {}
function ListMedia({}: PropsWithChildren<Props>) {
  return (
    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 2xl:tw-grid-cols-4 tw-gap-4">
      {new Array(20).fill(0).map(() => (
        <Item />
      ))}
    </div>
  );
}
export default ListMedia;
