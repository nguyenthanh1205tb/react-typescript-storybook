import VideoPlayer from '@/src/components/common/video-player'
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import TimeLine from './timeline'
import Player from 'video.js/dist/types/player'
import { useTimelineVideo } from './store/useVideo'
import { convertDuration } from '../utils/date'

interface Props {
  src: string
  thumb: string
  durations?: number
}
function VideoEditor({ src, thumb, durations }: PropsWithChildren<Props>) {
  const { sliceSelected, maxTimelineWidth, setPlayer, setBarTime } = useTimelineVideo()
  const [plInstance, setPlInstance] = useState<Player>()

  const startTime = useMemo(() => {
    if (sliceSelected && typeof durations === 'number') {
      const x = sliceSelected?.x ?? 0
      const xPercent = (x * 100) / maxTimelineWidth
      const xDuration = (xPercent * durations) / 100
      return xDuration
    }
    return 0
  }, [sliceSelected, durations])

  const endTime = useMemo(() => {
    if (sliceSelected && typeof durations === 'number') {
      const w = sliceSelected?.width ?? 0
      const playedPercent = (w * 100) / maxTimelineWidth
      const xDuration = startTime
      const playedDuration = (playedPercent * durations) / 100
      const eT = xDuration + playedDuration
      return eT
    }
    return 0
  }, [sliceSelected, durations])

  useEffect(() => {
    if (plInstance) {
      setPlayer(plInstance)
      setBarTime({ start: startTime, end: endTime })
      plInstance.currentTime(startTime)
    }
  }, [plInstance, startTime, endTime])

  return (
    <div className="tw-overflow-hidden">
      <VideoPlayer videoUrl={src} thumbnailUrl={thumb} setPlayerInstance={d => setPlInstance(d)} />
      <div className="tw-bg-slate-800 tw-p-4 tw-pb-8">
        <TimeLine />
        <div className="tw-flex tw-items-center tw-justify-between tw-mt-2">
          <div className="tw-bg-slate-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-md">
            {convertDuration(startTime)}
          </div>
          <div className="tw-bg-slate-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-md">{convertDuration(endTime)}</div>
        </div>
      </div>
    </div>
  )
}
export default VideoEditor
