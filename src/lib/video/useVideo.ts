export interface TimelineData {
  id: string
  width?: number
  height?: number
  x?: number
  y?: number
}

interface State {
  listSlice: TimelineData[]
  sliceSelected: TimelineData | null
}

class TimelineVideo {
  state: State = {
    listSlice: [],
    sliceSelected: null,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addNewTimeLine = (payload: TimelineData) => {}

  setSliceSelected = (payload: TimelineData | null) => {
    this.state.sliceSelected = payload
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeTimeline = (id: string) => {}
}

const useTimelineVideo = new TimelineVideo()

export { useTimelineVideo }
