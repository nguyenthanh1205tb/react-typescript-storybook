import { Calendar as CalendarIcon } from 'lucide-react'
import moment from 'moment'
import React from 'react'

import { Button } from '@/src/components/ui/button'
import { Calendar } from '@/src/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import { cn } from '@/src/lib/utils'

interface Props {
  onChange: (val: Date | undefined) => void
  value: Date | undefined
  placeholder?: string
}
export function DatePicker(props: Props) {
  const { onChange, value, placeholder } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'tw-w-[280px] tw-justify-start tw-text-left tw-font-normal',
            !value && 'tw-text-muted-foreground',
          )}>
          <CalendarIcon className="tw-mr-2 tw-h-4 tw-w-4" />
          {typeof value !== 'undefined' ? (
            moment(value).format('DD/MM/YYYY')
          ) : (
            <span>{placeholder ?? 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="tw-w-auto tw-p-0">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
