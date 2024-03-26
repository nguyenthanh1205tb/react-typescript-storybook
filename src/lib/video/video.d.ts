export interface TimelineData {
  id: string
  width?: number
  height?: number
  x?: number
  y?: number
}

interface VideoState {
  listSlice: TimelineData[]
  sliceSelected: TimelineData | null
  maxTimelineWidth: number
  addNewSlice: (payload: TimelineData) => void
  updateSlice: (payload: TimelineData) => void
  setSliceSelected: (payload: TimelineData | null) => void
  removeSlice: (id: string) => void
  setMaxTimelineWidth: (payload: number) => void
  resetToDefault: () => void
}
