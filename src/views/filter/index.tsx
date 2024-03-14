import Typo from '@/src/components/common/typo';
import { Badge } from '@/src/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import Each from '@/src/hooks/each';
import { useListMedia } from '@/src/hooks/useMedia';
import { cn } from '@/src/lib/utils';
import { OrderByType, OrderType } from '@/src/types';
import React, { PropsWithChildren, useEffect } from 'react';

interface Props {}
function Filter({}: PropsWithChildren<Props>) {
  const { requestData, onChangeOrder } = useListMedia();

  const sorts = [
    {
      name: 'Mới nhất',
      val: [OrderByType.CREATED_AT, OrderType.DESC],
    },
    {
      name: 'Cũ nhất',
      val: [OrderByType.CREATED_AT, OrderType.ASC],
    },
    {
      name: 'Tên A-Z',
      val: [OrderByType.NAME, OrderType.DESC],
    },
    {
      name: 'Tên Z-A',
      val: [OrderByType.NAME, OrderType.ASC],
    },
  ];

  return (
    <div className="tw-flex tw-flex-col tw-gap-2 tw-w-full tw-py-2 tw-px-1">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Typo.H2>Sắp xếp</Typo.H2>
        <div className="tw-flex tw-flex-wrap tw-gap-2">
          <Each
            of={sorts}
            render={(item) => (
              <div
                className={cn(
                  'tw-transition-all tw-h-[35px] tw-w-[120px] tw-cursor-pointer tw-bg-slate-100 tw-flex tw-items-center tw-justify-center tw-text-black tw-rounded-2xl tw-text-sm hover:tw-text-white hover:tw-bg-red-400',
                  {
                    'tw-text-white !tw-bg-red-500':
                      item.val.includes(requestData.order) &&
                      item.val.includes(requestData.orderBy),
                  }
                )}
                onClick={() => onChangeOrder(item.val)}
              >
                <span>{item.name}</span>
              </div>
            )}
          />
        </div>
      </div>
      <div>
        {/* <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Thời lượng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Dưới 4 phút</SelectItem>
            <SelectItem value="dark">Từ 4 - 20 phút</SelectItem>
            <SelectItem value="system">Trên 20 phút</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
    </div>
  );
}
export default Filter;
