import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { useTimelineVideo } from './store/useVideo'

function secondsToX(startX: number, maxWidth: number, startTime: number, currentTime: number, endTime: null | number) {
  let totalDuration
  if (endTime) {
    totalDuration = endTime - startTime
  } else {
    totalDuration = currentTime - startTime
  }

  const elapsedTime = currentTime - startTime
  const progressPercentage = elapsedTime / totalDuration
  const x = startX + progressPercentage * maxWidth
  return x
}

function TimelineBar() {
  const { sliceSelected, player, listSlice, setSliceSelected, barTimePlayed } = useTimelineVideo()
  const [barX, setBarX] = useState(0)

  const nextSlice = () => {
    const currentSliceIdx = listSlice.findIndex(o => o.id === sliceSelected?.id)
    if (typeof currentSliceIdx === 'number' && currentSliceIdx >= 0) {
      const next = listSlice[currentSliceIdx + 1]
      if (!next) return
      setSliceSelected(next)
      return next
    }
  }

  useEffect(() => {
    if (!sliceSelected) return
    if (!player) return
    player.on('timeupdate', () => {
      const currentTime = player.currentTime() ?? 0 + 0.2
      if (barTimePlayed) {
        const x = secondsToX(
          sliceSelected.x as number,
          sliceSelected.width as number,
          barTimePlayed.start,
          currentTime,
          barTimePlayed.end,
        )
        if (currentTime >= barTimePlayed.end) {
          const haveNextSlice = nextSlice()
          if (!haveNextSlice) player.pause()
        } else {
          setBarX(x)
        }
      }
    })
    return () => player.off('timeupdate')
  }, [sliceSelected, player, barTimePlayed, nextSlice])

  return (
    <Rnd
      className="drag--bar"
      size={{ width: 2, height: 20 }}
      position={{ x: barX, y: sliceSelected?.y ?? 0 }}
      bounds="parent"
      disableDragging
      enableResizing={{
        top: false,
        left: false,
        right: false,
        bottom: false,
      }}
    />
  )
}
export default TimelineBar
