import React, { useState, useRef } from 'react'
import TimelineSlice from './timeline-slice'
import { nanoid } from 'nanoid'

//Hooks
import { useTimelineSliceHelpers } from './timeline-utils'
import TimelineSliceWrap from './timeline-slice-wrap'
import { Button } from '@/src/components/ui/button'
import { TimelineData } from '@/src/lib/video/useVideo'

const TimeLine = () => {
  const parentRef = useRef<HTMLDivElement>(null)
  const [slices, setSlices] = useState<TimelineData[]>([])

  const addNewSlice = () => {
    setSlices([
      ...slices,
      {
        id: nanoid(10),
        x: 0,
        y: 0,
        width: 100,
        height: 50,
      },
    ])
  }

  const updateSlice = (data: TimelineData) => {
    const _current = [...slices]
    //get index of slice
    let idx: number | null = null
    for (const i in _current) {
      if (_current[i].id == data.id) {
        idx = parseInt(i)
      }
    }
    if (idx) {
      _current[idx] = data
      setSlices(_current)
    }
  }

  const sliceHelpers = useTimelineSliceHelpers(slices, setSlices)

  return (
    <>
      <div className="tw-flex tw-items-center tw-gap-2">
        <Button onClick={addNewSlice}>Add new Clip</Button>
        <Button onClick={sliceHelpers.removeSlice}>Remove last slice</Button>
      </div>
      {/*<pre>{JSON.stringify(slices, null, 4)}</pre> */}
      <div className="drag--parent">
        <TimelineSliceWrap parentRef={parentRef}>
          {slices.map(slice => (
            <TimelineSlice updateSlice={updateSlice} key={slice.id} {...slice} />
          ))}
        </TimelineSliceWrap>
      </div>
    </>
  )
}

export default TimeLine
