import { useTimelineVideo } from '@/src/lib/video/store/useVideo'
import React, { PropsWithChildren } from 'react'
import { Rnd } from 'react-rnd'
import { TimelineData } from './video'
import { cn } from '../utils'

interface Props {
  data: TimelineData
  className?: string
  enableresize?: { left: boolean; right: boolean }
  onMouseDown?: () => void
}
const TimelineSlice = ({ data, ...props }: PropsWithChildren<Props>) => {
  const { sliceSelected, setSliceSelected, updateSlice } = useTimelineVideo()
  const { width, height, x, y, id } = data

  return (
    <Rnd
      className={cn('drag--child', { 'drag--child--activated': sliceSelected?.id === data.id })}
      size={{ width: width ?? 0, height: height ?? 0 }}
      position={{ x: x ?? 0, y: y ?? 0 }}
      bounds="parent"
      enableResizing={{ left: true, right: true, ...props.enableresize }}
      onMouseDown={props.onMouseDown}
      resizeHandleClasses={{
        right: 'drag--handle--right',
        left: 'drag--handle--left',
      }}
      onDragStop={(e, d) => {
        const _d = { id, x: d.x, y: d.y }
        updateSlice(_d)
        if (sliceSelected?.id === data.id) {
          setSliceSelected(_d)
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const u = {
          id,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        }
        updateSlice(u)
        if (sliceSelected?.id === data.id) {
          setSliceSelected(u)
        }
      }}
      {...props}>
      {props.children ? props.children : null}
    </Rnd>
  )
}

export default TimelineSlice
