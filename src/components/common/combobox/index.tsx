import React, { useMemo, useState } from 'react'
import { Dot, ChevronsUpDown, LibraryBig, Eraser } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/src/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import Each from '@/src/hooks/each'
import { ScrollArea } from '../../ui/scroll-area'
import { ComboboxOption } from '@/src/types'
import { flatArray } from '@/src/lib/utils/array'
import _find from 'lodash/find'
import If from '@/src/hooks/if'
import { cn } from '@/src/lib/utils'

interface Props {
  options: Array<ComboboxOption>
  placeholder?: string
  value?: string
  onChange?: (val: string) => void
}
export function Combobox(props: Props) {
  const { options, placeholder, value, onChange } = props
  const [open, setOpen] = React.useState(false)

  const search = (list: Array<ComboboxOption>, text: string) => {
    const textNor = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    if (textNor === '') return list

    const newList = []
    for (const val of list) {
      const labelNor = val.label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
      if (labelNor.includes(textNor)) {
        newList.push(val)
      }
    }
    return newList
  }

  const withChild = (d: ComboboxOption) => {
    return (
      <>
        <CommandGroup>
          <CommandItem className="tw-cursor-pointer" value={d.value} onSelect={onChange}>
            <LibraryBig className="tw-mr-2 tw-h-4 tw-w-4" />
            <span>{d.label}</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading={d.label}>
          <Each
            of={d.children as Array<ComboboxOption>}
            render={item => (
              <CommandItem className="tw-cursor-pointer" value={item.value} onSelect={onChange}>
                <Dot className="tw-mr-2 tw-h-4 tw-w-4" />
                <span>{item.label}</span>
              </CommandItem>
            )}
          />
        </CommandGroup>
        <CommandSeparator />
      </>
    )
  }

  const optionsExtract = (list: Array<ComboboxOption>): any[] => {
    return list.map(item => (item.children ? [item, ...optionsExtract(item.children)] : item))
  }

  const optionsFlatten = useMemo(() => {
    return flatArray(optionsExtract(options))
  }, [options])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="tw-w-full tw-justify-between">
          <div className="tw-flex tw-items-center tw-gap-2 tw-relative">
            <If
              isShow={typeof value !== 'undefined' && value !== ''}
              element={
                <div
                  className="tw-absolute hover:tw-text-red-500 tw-transition-colors"
                  onClick={() => onChange && onChange('')}>
                  <Eraser size={16} />
                </div>
              }
            />
            <span className={cn({ 'tw-text-blue-500 tw-pl-6': value })}>
              {value ? optionsFlatten.find(item => item.value === value)?.label : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="tw-ml-2 tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tw-w-full tw-p-0">
        <Command
          filter={(value, text) => {
            const item = search(optionsFlatten, text)
            const listIds = item.map(o => o.value)
            if (listIds.includes(value)) {
              return 1
            }
            return 0
          }}>
          <CommandInput placeholder="Tìm kiếm..." />
          <CommandList>
            <ScrollArea className="tw-h-64 tw-pr-2 tw-overflow-auto">
              <Each
                of={options}
                render={item =>
                  item.children ? (
                    withChild(item)
                  ) : (
                    <CommandItem className="tw-cursor-pointer" value={item.value} onSelect={onChange}>
                      <LibraryBig className="tw-mr-2 tw-h-4 tw-w-4" />
                      <span>{item.label}</span>
                    </CommandItem>
                  )
                }
              />
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
