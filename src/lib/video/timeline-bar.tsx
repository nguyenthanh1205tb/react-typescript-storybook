import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { useTimelineVideo } from './store/useVideo'

function secondsToX(startX: number, maxWidth: number, startTime: number, currentTime: number, endTime: null | number) {
  let totalDuration
  if (endTime) {
    totalDuration = endTime - startTime
  } else {
    totalDuration = currentTime - startTime // Assume indefinite duration
  }

  const elapsedTime = currentTime - startTime
  const progressPercentage = elapsedTime / totalDuration
  const x = startX + progressPercentage * maxWidth
  return x
}

function TimelineBar() {
  const { sliceSelected, player, barTime } = useTimelineVideo()
  const [barX, setBarX] = useState(0)

  useEffect(() => {
    if (!sliceSelected) return
    if (!player) return
    player.on('timeupdate', () => {
      const currentTime = player.currentTime() ?? 0
      const x = secondsToX(
        sliceSelected.x as number,
        sliceSelected.width as number,
        barTime.start,
        currentTime,
        barTime.end,
      )
      if (currentTime >= barTime.end) {
        player.pause()
      } else {
        setBarX(x)
      }
    })
    return () => player.off('timeupdate')
  }, [sliceSelected, player, barTime])

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
