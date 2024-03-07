import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import React, { PropsWithChildren } from 'react';

interface Props {}
function Filter({}: PropsWithChildren<Props>) {
  return (
    <div className="tw-flex tw-flex-col tw-gap-2 tw-w-full">
      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Thời lượng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Dưới 4 phút</SelectItem>
            <SelectItem value="dark">Từ 4 - 20 phút</SelectItem>
            <SelectItem value="system">Trên 20 phút</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Độ phân giải" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">360p</SelectItem>
            <SelectItem value="dark">720p</SelectItem>
            <SelectItem value="system">1080p</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
export default Filter;
