import VideoPlayer from '@/src/components/common/video-player'
import React, { PropsWithChildren, useState } from 'react'
import TimeLine from './timeline'
import Player from 'video.js/dist/types/player'

interface Props {
  src: string
  thumb: string
}
function VideoEditor({ src, thumb }: PropsWithChildren<Props>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [plInstance, setPlInstance] = useState<Player>()

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
