import VideoPlayer from '@/src/components/common/video-player'
import React, { PropsWithChildren, useMemo, useState } from 'react'
import TimeLine from './timeline'
import Player from 'video.js/dist/types/player'
import { useTimelineVideo } from './store/useVideo'

interface Props {
  src: string
  thumb: string
  durations?: number
}
function VideoEditor({ src, thumb, durations }: PropsWithChildren<Props>) {
  const { sliceSelected, maxTimelineWidth } = useTimelineVideo()
  const [plInstance, setPlInstance] = useState<Player>()

  useMemo(() => {
    if (sliceSelected && plInstance && typeof durations === 'number') {
      const x = sliceSelected?.x ?? 0
      const xPercent = (x * 100) / maxTimelineWidth
      const xDuration = (xPercent * durations) / 100
      plInstance.currentTime(xDuration)
    }
  }, [sliceSelected])

  return (
    <div className="tw-overflow-hidden">
      <VideoPlayer videoUrl={src} thumbnailUrl={thumb} setPlayerInstance={d => setPlInstance(d)} />
      <div className="tw-bg-slate-800 tw-p-4 tw-pb-8">
        <TimeLine />
      </div>
    </div>
  )
}
export default VideoEditor
