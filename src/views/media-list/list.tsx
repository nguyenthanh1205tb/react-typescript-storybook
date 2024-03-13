import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import Item from './item';
import useAppStore from '@/src/stores/useAppStore';
import { useListMedia } from '@/src/hooks/useMedia';
import If from '@/src/hooks/if';
import { SkeletonCard } from '@/src/components/common/skeleton-card';
import Each from '@/src/hooks/each';
import { cn } from '@/src/lib/utils';

const BASE_ITEM_WIDTH = 239;
interface Props {}
function ListMedia({}: PropsWithChildren<Props>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [colNum, setColNum] = useState(5);
  const { listMedia, setListMedia } = useAppStore();
  const { response, getListMedia } = useListMedia();

  const listResize = () => {
    if (!listRef || !listRef.current) return;
    const w = listRef.current.offsetWidth;
    const c = w / BASE_ITEM_WIDTH;
    const num = Math.floor(c);
    if (colNum !== num) {
      setColNum(num <= 0 ? 1 : num);
    }
  };

  useEffect(() => {
    if (!response.loading && response.data) {
      setListMedia(response.data.data);
    }
  }, [response]);

  useEffect(() => {
    if (listRef && listRef.current) {
      new ResizeObserver(listResize).observe(listRef.current);
    }
  }, [listRef]);

  useEffect(() => {
    getListMedia({});
  }, []);

  return (
    <div
      className={cn('tw-grid tw-gap-4 tw-w-full', `tw-grid-cols-${colNum}`)}
      ref={listRef}
    >
      <If
        isShow={response.loading}
        element={
          <Each of={new Array(20).fill(0)} render={() => <SkeletonCard />} />
        }
      />
      <If
        isShow={!response.loading && response.data !== null}
        element={
          <Each of={listMedia} render={(item) => <Item data={item} />} />
        }
      />
    </div>
  );
}
export default ListMedia;
