import { TimelineData } from '@/src/lib/video/useVideo'
import React, { useState } from 'react'
import { Rnd } from 'react-rnd'

interface Props extends TimelineData {
  updateSlice: (data: TimelineData) => void
}
const TimelineSlice = ({ width = 100, height = 50, x = 0, y = 0, id, ...props }: Props) => {
  const [slice, setSlice] = useState<TimelineData>({
    width: width,
    height: height,
    x: x,
    y: y,
    id: id,
  })
  return (
    <Rnd
      className="drag--child"
      size={{ width: slice.width ?? 0, height: slice.height ?? 0 }}
      position={{ x: slice.x ?? 0, y: slice.y ?? 0 }}
      bounds="parent"
      enableResizing={{ left: true, right: true }}
      resizeHandleClasses={{
        right: 'drag--handle--right',
        left: 'drag--handle--left',
      }}
      onDragStop={(e, d) => {
        const _d = { ...slice, x: d.x, y: d.y }
        setSlice(_d)
        props.updateSlice(_d)
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const u = {
          ...slice,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        }
        setSlice(u)
        props.updateSlice(u)
      }}
    />
  )
}

export default TimelineSlice
