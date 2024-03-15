import { Combobox } from '@/src/components/common/combobox';
import { MultiSelect } from '@/src/components/common/multi-select';
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
import { useCategory, useListMedia } from '@/src/hooks/useMedia';
import { cn } from '@/src/lib/utils';
import { flatArray } from '@/src/lib/utils/array';
import useAppStore from '@/src/stores/useAppStore';
import { Category, ComboboxOption, OrderByType, OrderType } from '@/src/types';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';

interface Props {}

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
    val: [OrderByType.NAME, OrderType.ASC],
  },
  {
    name: 'Tên Z-A',
    val: [OrderByType.NAME, OrderType.DESC],
  },
];

function Filter({}: PropsWithChildren<Props>) {
  const { listMediaQueries, setListCategories } = useAppStore();
  const { getListCategories } = useCategory();
  const { data: categoriesData, isLoading: isGetListCategoriesLoading } =
    getListCategories();

  const { onChangeOrder, onChangeCategory } = useListMedia();

  const extractCategories = (list: Category[]): Array<ComboboxOption> => {
    const result = list.map((item) => {
      return {
        label: item.name,
        value: item.id,
        children: item.children ? extractCategories(item.children) : null,
      };
    });

    return result;
  };

  const categoriesFiltered = useMemo(() => {
    if (!categoriesData) return [];
    return extractCategories(categoriesData.data ?? []);
  }, [categoriesData]);

  useEffect(() => {
    if (!isGetListCategoriesLoading && categoriesData) {
      setListCategories(categoriesData.data);
    }
  }, [isGetListCategoriesLoading, categoriesData]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-8 tw-w-full tw-py-2 tw-px-1">
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Typo.H2>Chuyên mục</Typo.H2>
        <Combobox
          options={categoriesFiltered}
          placeholder="Chọn chuyên mục..."
          value={listMediaQueries.categoryId}
          onChange={onChangeCategory}
        />
      </div>
      <div className="tw-flex tw-flex-col tw-gap-2">
        <Typo.H2>Từ khoá</Typo.H2>
        <MultiSelect
          options={[
            {
              value: 'next.js',
              label: 'Next.js',
            },
            {
              value: 'sveltekit',
              label: 'SvelteKit',
            },
            {
              value: 'nuxt.js',
              label: 'Nuxt.js',
            },
            {
              value: 'remix',
              label: 'Remix',
            },
            {
              value: 'astro',
              label: 'Astro',
            },
            {
              value: 'wordpress',
              label: 'WordPress',
            },
            {
              value: 'express.js',
              label: 'Express.js',
            },
          ]}
          onChange={(val) => console.log(val)}
          selected={[]}
        />
      </div>
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
                      item.val.includes(listMediaQueries.order) &&
                      item.val.includes(listMediaQueries.orderBy),
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
