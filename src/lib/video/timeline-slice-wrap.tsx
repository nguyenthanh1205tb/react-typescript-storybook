/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { forwardRef } from 'react'

interface Props {
  parentRef?: React.LegacyRef<HTMLDivElement>
}
const TimelineSliceWrap = forwardRef((props: React.PropsWithChildren<Props>, _ref) => {
  return (
    <div className="slice--parent" ref={props.parentRef}>
      {props.children}
    </div>
  )
})

TimelineSliceWrap.displayName = 'TimelineSliceWrap'
export default TimelineSliceWrap
