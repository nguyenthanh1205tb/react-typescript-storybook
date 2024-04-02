/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from 'react'
import TimelineSlice from './timeline-slice'
import { nanoid } from 'nanoid'
import _isEmpty from 'lodash/isEmpty'

//Hooks
import TimelineSliceWrap from './timeline-slice-wrap'
import { useTimelineVideo } from '@/src/lib/video/store/useVideo'
import Each from '@/src/hooks/each'
import { Plus } from 'lucide-react'
import If from '@/src/hooks/if'
import { wait } from '@/src/hooks/wait'
import { TimelineData } from './video'
import TimelineBar from './timeline-bar'

const NewSliceBtnWidth = 100
const NewSliceBtnHeight = 20
const TimeLine = () => {
  const parentRef = useRef<HTMLDivElement>(null)
  const { addNewSlice, listSlice, setSliceSelected, sliceSelected, setMaxTimelineWidth, removeSlice, setPlayerViewAt } =
    useTimelineVideo()
  const [btnNewX, setBtnNewX] = useState(0)
  const [showBtnNew, setShowBtnNew] = useState(false)

  const toggleNewBtn = (status: 'show' | 'hide') => {
    switch (status) {
      case 'show':
        return setShowBtnNew(true)
      case 'hide':
        return setShowBtnNew(false)
    }
  }

  const getMousePos = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const target = e.target as any
    const targetClassName = target.className as string
    const listDisable = ['drag--handle--right', 'drag--handle--left', 'drag--child']
    if (typeof targetClassName === 'string') {
      const firstClassName = targetClassName?.split(' ')[0] as string | undefined
      if (firstClassName && listDisable.includes(firstClassName)) {
        toggleNewBtn('hide')
      } else {
        toggleNewBtn('show')
        const rect = e.currentTarget.getBoundingClientRect()
        const targetW = e.currentTarget.clientWidth
        const x = e.clientX - rect.left
        const middleBar = NewSliceBtnWidth / 2
        const pos = x - middleBar
        const start = 0
        const end = targetW - NewSliceBtnWidth
        setBtnNewX(prev => (pos < start || pos > end || prev === pos ? prev : pos))
      }
    }
  }

  const initSlice = async (e: HTMLDivElement) => {
    await wait(100)
    const targetW = e.clientWidth
    setMaxTimelineWidth(targetW)
    const d = {
      id: nanoid(10),
      x: 0,
      width: targetW,
      height: NewSliceBtnHeight,
    }
    addNewSlice(d)
    setSliceSelected(d)
  }

  const onSelectSlice = (data: TimelineData) => {
    setSliceSelected(data)
  }

  const onRemoveSlice = (id: string) => removeSlice(id)

  useEffect(() => {
    if (parentRef.current) {
      initSlice(parentRef.current)
    }
  }, [parentRef])

  return (
    <div className="drag--parent" onContextMenu={e => e.preventDefault()}>
      <TimelineSliceWrap
        parentRef={parentRef}
        onMouseMove={getMousePos}
        onMouseLeave={() => toggleNewBtn('hide')}
        onMouseEnter={() => toggleNewBtn('show')}>
        <If
          isShow={showBtnNew}
          element={
            <TimelineSlice
              data={{
                x: btnNewX,
                y: 0,
                width: NewSliceBtnWidth,
                height: NewSliceBtnHeight,
                id: 'new-slice-btn',
              }}
              className="new-slice-btn hover:!tw-bg-[#b5b5b5]"
              enableresize={{ left: false, right: false }}>
              <div
                className="tw-flex tw-w-full tw-items-center tw-justify-center tw-h-full"
                onClick={() => {
                  addNewSlice({
                    id: nanoid(10),
                    x: btnNewX,
                    width: NewSliceBtnWidth,
                    height: NewSliceBtnHeight,
                  })
                }}>
                <Plus size={16} />
              </div>
            </TimelineSlice>
          }
        />
        <Each
          of={listSlice}
          render={slice => (
            <TimelineSlice
              key={slice.id}
              data={slice}
              onMouseDown={(e: MouseEvent) => {
                if (e.which === 3 || e.button === 2) {
                  onRemoveSlice(slice.id)
                } else {
                  onSelectSlice(slice)
                  setPlayerViewAt(null)
                }
              }}
            />
          )}
        />
        <If isShow={!_isEmpty(sliceSelected)} element={<TimelineBar />} />
      </TimelineSliceWrap>
    </div>
  )
}

export default TimeLine
