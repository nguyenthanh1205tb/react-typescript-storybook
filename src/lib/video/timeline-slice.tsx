import { useTimelineVideo } from '@/src/lib/video/store/useVideo'
import React, { PropsWithChildren, useMemo, useState } from 'react'
import { Rnd } from 'react-rnd'
import { TimelineData } from './video'
import { cn } from '../utils'
import { DragDirection } from '@/src/types'

interface Props {
  data: TimelineData
  className?: string
  enableresize?: { left: boolean; right: boolean }
  onMouseDown?: (e: MouseEvent) => void
}
const TimelineSlice = ({ data, ...props }: PropsWithChildren<Props>) => {
  const { sliceSelected, setSliceSelected, updateSlice, listSlice } = useTimelineVideo()
  const { width, height, x, y, id } = data
  const [dynamicX, setDynamicX] = useState(0)

  const dragDirection = useMemo(() => {
    return dynamicX - (x ?? 0) < 0 ? DragDirection.LEFT : DragDirection.RIGHT
  }, [x, dynamicX])

  const disableDragging = useMemo(() => {
    const idx = listSlice.findIndex(o => o.id === sliceSelected?.id)

    if (idx < 0) return false
    const slice = listSlice[idx]
    const prevSlice = listSlice[idx - 1]
    const nextSlice = listSlice[idx + 1]

    if (!prevSlice && !nextSlice) return false
    if (!slice) return false

    const maxStart = (prevSlice?.x ?? 0) + (prevSlice?.width ?? 0)
    const maxEnd = nextSlice?.x ?? 0

    if (dragDirection === DragDirection.LEFT) {
      if (maxStart === 0) return false
      return dynamicX <= maxStart
    } else {
      if (maxEnd === 0) return false
      return dynamicX + (slice.width ?? 0) >= maxEnd
    }
  }, [listSlice, sliceSelected, dragDirection, dynamicX])

  return (
    <Rnd
      disableDragging={disableDragging}
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
      onDrag={(e, data) => {
        const { x } = data
        setDynamicX(x)
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
