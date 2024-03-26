/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { forwardRef } from 'react'
import { cn } from '../utils'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  parentRef?: React.LegacyRef<HTMLDivElement>
}
const TimelineSliceWrap = forwardRef(({ parentRef, className, ...props }: React.PropsWithChildren<Props>, _ref) => {
  return (
    <div className={cn('slice--parent tw-w-full', className)} ref={parentRef} {...props}>
      {props.children}
    </div>
  )
})

TimelineSliceWrap.displayName = 'TimelineSliceWrap'
export default TimelineSliceWrap
