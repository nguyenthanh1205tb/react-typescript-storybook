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
import React, { PropsWithChildren } from 'react';

interface Props {}
function Filter({}: PropsWithChildren<Props>) {
  const sorts = [
    {
      name: 'Mới nhất',
    },
    {
      name: 'Cũ nhất',
    },
    {
      name: 'Tên A-Z',
    },
    {
      name: 'Tên Z-A',
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
              <div className="tw-transition-all tw-h-[35px] tw-w-[120px] tw-cursor-pointer tw-bg-slate-100 tw-flex tw-items-center tw-justify-center tw-text-black tw-rounded-2xl tw-text-sm hover:tw-text-white hover:tw-bg-red-500">
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
      <div>
        {/* <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Độ phân giải" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">360p</SelectItem>
            <SelectItem value="dark">720p</SelectItem>
            <SelectItem value="system">1080p</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
    </div>
  );
}
export default Filter;
