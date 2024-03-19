import React, { PropsWithChildren, useEffect, useMemo } from 'react'
import { Combobox } from '@/src/components/common/combobox'
import { DatePicker } from '@/src/components/common/date-picker'
import { MultiSelect } from '@/src/components/common/multi-select'
import Typo from '@/src/components/common/typo'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Separator } from '@/src/components/ui/separator'
import { Switch } from '@/src/components/ui/switch'
import Each from '@/src/hooks/each'
import If from '@/src/hooks/if'
import { useCategory, useListMedia } from '@/src/hooks/useMedia'
import { cn } from '@/src/lib/utils'
import useAppStore from '@/src/stores/useAppStore'
import { Category, ComboboxOption, GetListMediaTimeRange, MediaPackageType, OrderByType, OrderType } from '@/src/types'

interface Props {
  type: MediaPackageType
}

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
]

const timeRange = [
  {
    name: 'Mọi thời điểm',
    val: GetListMediaTimeRange.ALL,
  },
  {
    name: '24h gần đây',
    val: GetListMediaTimeRange['24h'],
  },
  {
    name: '7 ngày gần dây',
    val: GetListMediaTimeRange['7d'],
  },
  {
    name: '1 tháng gần đây',
    val: GetListMediaTimeRange['30d'],
  },
  {
    name: '1 năm gần đây',
    val: GetListMediaTimeRange['1y'],
  },
  {
    name: 'Tự chọn thời gian',
    val: GetListMediaTimeRange.custom,
  },
]

function Filter({ type }: PropsWithChildren<Props>) {
  const { listMediaQueries, setListCategories } = useAppStore()
  const { getListCategories } = useCategory()
  const { data: categoriesData, isLoading: isGetListCategoriesLoading } = getListCategories()

  const {
    onChangeOrder,
    onChangeCategory,
    onChangeTimeRange,
    onChangeVideoOfMine,
    onChangeTimeRangeCustom,
    timeRangeCustom,
  } = useListMedia()

  const exposeDataOfMineLabel = useMemo(() => {
    switch (type) {
      case MediaPackageType.IMAGE:
        return 'Hình ảnh của tôi'
      case MediaPackageType.DOCUMENT:
        return 'Tài liệu của tôi'
      case MediaPackageType.VIDEO:
      default:
        return 'Video của tôi'
    }
  }, [type])

  const extractCategories = (list: Category[]): Array<ComboboxOption> => {
    const result = list.map(item => {
      return {
        label: item.name,
        value: item.id,
        children: item.children ? extractCategories(item.children) : null,
      }
    })

    return result
  }

  const categoriesFiltered = useMemo(() => {
    if (!categoriesData) return []
    return extractCategories(categoriesData.data ?? [])
  }, [categoriesData])

  useEffect(() => {
    if (!isGetListCategoriesLoading && categoriesData) {
      setListCategories(categoriesData.data)
    }
  }, [isGetListCategoriesLoading, categoriesData])

  return (
    <ScrollArea className="tw-h-[650px] tw-pr-2">
      <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full tw-py-2 tw-px-1">
        <div className="tw-flex tw-flex-col tw-gap-2">
          <Typo.H2>Chuyên mục</Typo.H2>
          <Combobox
            options={categoriesFiltered}
            placeholder="Chọn chuyên mục..."
            value={listMediaQueries.categoryId}
            onChange={onChangeCategory}
          />
        </div>

        <Separator />

        <div className="tw-flex tw-justify-between tw-gap-2">
          <Typo.H2>{exposeDataOfMineLabel}</Typo.H2>
          <Switch
            id="airplane-mode"
            checked={listMediaQueries.isMyFile}
            onCheckedChange={val => onChangeVideoOfMine(val)}
            className="data-[state=checked]:tw-bg-red-500"
          />
        </div>

        <Separator />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <Typo.H2>Từ khoá</Typo.H2>
          <MultiSelect options={[]} onChange={val => console.log(val)} selected={[]} />
        </div>

        <Separator />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <Typo.H2>Sắp xếp</Typo.H2>
          <div className="tw-flex tw-flex-wrap tw-gap-2">
            <Each
              of={sorts}
              render={item => (
                <div
                  className={cn(
                    'tw-transition-all tw-h-[35px] tw-w-[120px] tw-cursor-pointer tw-bg-slate-100 tw-flex tw-items-center tw-justify-center tw-text-black tw-rounded-2xl tw-text-sm hover:tw-text-white hover:tw-bg-red-400',
                    {
                      'tw-text-white !tw-bg-red-500':
                        item.val.includes(listMediaQueries.order) && item.val.includes(listMediaQueries.orderBy),
                    },
                  )}
                  onClick={() => onChangeOrder(item.val)}>
                  <span>{item.name}</span>
                </div>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="tw-flex tw-flex-col tw-gap-2">
          <Typo.H2>Thời gian</Typo.H2>
          <div className="tw-flex tw-flex-wrap tw-gap-2">
            <Each
              of={timeRange}
              render={item => (
                <div
                  className={cn(
                    'tw-transition-all tw-h-[35px] tw-w-[120px] tw-cursor-pointer tw-bg-slate-100 tw-flex tw-items-center tw-justify-center tw-text-black tw-rounded-2xl tw-text-sm hover:tw-text-white hover:tw-bg-red-400',
                    {
                      'tw-text-white !tw-bg-red-500': item.val === listMediaQueries.timeRange,
                    },
                  )}
                  onClick={() => onChangeTimeRange(item.val)}>
                  <span>{item.name}</span>
                </div>
              )}
            />
          </div>
          <If
            isShow={listMediaQueries.timeRange === GetListMediaTimeRange.custom}
            element={
              <>
                <DatePicker
                  value={timeRangeCustom.start ? new Date(timeRangeCustom.start) : undefined}
                  onChange={val => onChangeTimeRangeCustom('start', val)}
                  placeholder="Chọn ngày bắt đầu"
                />
                <DatePicker
                  value={timeRangeCustom.end ? new Date(timeRangeCustom.end) : undefined}
                  onChange={val => onChangeTimeRangeCustom('end', val)}
                  placeholder="Chọn ngày kết thúc"
                />
              </>
            }></If>
        </div>
      </div>
    </ScrollArea>
  )
}
export default Filter
