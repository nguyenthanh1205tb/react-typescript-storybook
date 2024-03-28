import VideoPlayer from '@/src/components/common/video-player'
import { Input } from '@/src/components/ui/input'
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import Player from 'video.js/dist/types/player'
import { convertDuration } from '../utils/date'
import { useTimelineVideo } from './store/useVideo'
import TimeLine from './timeline'
import { Button } from '@/src/components/ui/button'
import { Play } from 'lucide-react'
import { BarTime, TimelineData } from './video'

interface Props {
  src: string
  thumb: string
  durations?: number
}
function VideoEditor({ src, thumb, durations }: PropsWithChildren<Props>) {
  const {
    sliceSelected,
    maxTimelineWidth,
    listSlice,
    barTimePlayed,
    setPlayer,
    setBarTime,
    setTitle,
    setSliceSelected,
    setBarTimePlayed,
  } = useTimelineVideo()
  const [plInstance, setPlInstance] = useState<Player>()

  const isLastSlice = useMemo(() => {
    const idx = listSlice.findIndex(o => o.id === sliceSelected?.id)
    if (idx >= 0) {
      return listSlice.length - 1 === idx
    }
    return true
  }, [sliceSelected, listSlice])

  const startTime = (d: TimelineData) => {
    if (d && typeof durations === 'number') {
      const x = d.x ?? 0
      const xPercent = (x * 100) / maxTimelineWidth
      const xDuration = (xPercent * durations) / 100
      return xDuration
    }
    return 0
  }

  const endTime = (d: TimelineData, x?: number) => {
    if (d && typeof durations === 'number') {
      const w = d?.width ?? 0
      const playedPercent = (w * 100) / maxTimelineWidth
      const playedDuration = (playedPercent * durations) / 100
      const eT = (x ?? 0) + playedDuration
      return eT
    }
    return 0
  }

  const onPreview = () => {
    if (!plInstance) return
    if (isLastSlice) {
      setSliceSelected(listSlice[0])
    }
    plInstance.play()
  }

  useEffect(() => {
    const list: BarTime[] = listSlice.map(slice => {
      const sT = startTime(slice)
      return { id: slice.id, start: sT, end: endTime(slice, sT) }
    })
    setBarTime(list)
  }, [listSlice])

  useEffect(() => {
    if (plInstance) {
      setPlayer(plInstance)
    }
  }, [plInstance])

  useEffect(() => {
    if (sliceSelected) {
      setBarTimePlayed(sliceSelected.id)
      if (plInstance) plInstance.currentTime(startTime(sliceSelected))
    }
  }, [sliceSelected, plInstance])

  return (
    <div className="tw-overflow-hidden">
      <VideoPlayer videoUrl={src} thumbnailUrl={thumb} setPlayerInstance={d => setPlInstance(d)} />
      <div className="tw-bg-slate-800 tw-p-4 tw-pb-8">
        <TimeLine />
        <div className="tw-flex tw-items-center tw-justify-between tw-mt-2">
          <div className="tw-bg-slate-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-md">
            {convertDuration(barTimePlayed?.start ?? 0)}
          </div>
          <div className="tw-bg-slate-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-md">
            {convertDuration(barTimePlayed?.end ?? 0)}
          </div>
        </div>
        <div className="tw-mt-4 tw-flex tw-items-center tw-gap-2">
          <Button className="tw-flex tw-items-center" onClick={onPreview}>
            <Play className="tw-mr-2" size={14} />
            <span>Preview</span>
          </Button>
          <Input
            className="tw-bg-slate-700 tw-border-none tw-text-white no-outline"
            placeholder="Nhập tên video muốn cắt"
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
export default VideoEditor
