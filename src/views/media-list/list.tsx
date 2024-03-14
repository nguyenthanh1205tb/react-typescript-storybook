import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Item from './item';
import useAppStore from '@/src/stores/useAppStore';
import { useListMedia } from '@/src/hooks/useMedia';
import If from '@/src/hooks/if';
import { SkeletonCard } from '@/src/components/common/skeleton-card';
import Each from '@/src/hooks/each';
import { cn } from '@/src/lib/utils';
import Paginate from '@/src/components/common/paginate';
import { PAGINATE_LIMIT } from '@/src/configs';

const BASE_ITEM_WIDTH = 239;
interface Props {}
function ListMedia({}: PropsWithChildren<Props>) {
  const listRef = useRef<HTMLDivElement>(null);
  const [colNum, setColNum] = useState(5);
  const { listMedia, setListMedia } = useAppStore();
  const {
    getListMedia,
    totalCount,
    requestData,
    setTotalCount,
    onChangePagination,
    onNextPagination,
    onPrevPagination,
  } = useListMedia();

  const { data, isLoading } = getListMedia({});

  const showPaginateMeta = useMemo(() => {
    const currentPage = requestData.page ?? 1;
    const first =
      currentPage === 1 ? 1 : currentPage * PAGINATE_LIMIT - PAGINATE_LIMIT + 1;
    const end =
      currentPage === 1 ? PAGINATE_LIMIT : currentPage * PAGINATE_LIMIT;
    return `Hiển thị ${first} - ${
      end > totalCount ? totalCount : end
    } / ${totalCount}`;
  }, [requestData, totalCount]);

  const listResize = () => {
    if (!listRef || !listRef.current) return;
    const w = listRef.current.offsetWidth;
    const c = w / BASE_ITEM_WIDTH;
    const num = Math.ceil(c);
    if (colNum !== num) {
      setColNum(num <= 0 ? 1 : num);
    }
  };

  useEffect(() => {
    if (!isLoading && data) {
      setListMedia(data.data);
      setTotalCount(data.meta.itemCount);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (listRef && listRef.current) {
      new ResizeObserver(listResize).observe(listRef.current);
    }
  }, [listRef]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-2">
      <div className="tw-flex tw-items-center tw-justify-between tw-w-full">
        <div className="tw-text-sm tw-font-semibold">{showPaginateMeta}</div>
        <Paginate
          totalCount={totalCount}
          limit={requestData.take ?? PAGINATE_LIMIT}
          current={requestData.page ?? 1}
          onChangePage={onChangePagination}
          onNext={onNextPagination}
          onPrev={onPrevPagination}
        />
      </div>
      <div
        className={cn('tw-grid tw-gap-4 tw-w-full', `tw-grid-cols-${colNum}`)}
        ref={listRef}
      >
        <If
          isShow={isLoading}
          element={
            <Each of={new Array(20).fill(0)} render={() => <SkeletonCard />} />
          }
        />
        <If
          isShow={!isLoading && data !== null}
          element={
            <Each of={listMedia} render={(item) => <Item data={item} />} />
          }
        />
      </div>
    </div>
  );
}
export default ListMedia;
