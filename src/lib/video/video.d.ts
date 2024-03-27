import Player from 'video.js/dist/types/player'

export interface TimelineData {
  id: string
  width?: number
  height?: number
  x?: number
  y?: number
}

export type BartTime = { start: number; end: number }

interface VideoState {
  listSlice: TimelineData[]
  sliceSelected: TimelineData | null
  maxTimelineWidth: number
  player: Player | null
  barTime: BartTime
  title: string
  addNewSlice: (payload: TimelineData) => void
  updateSlice: (payload: TimelineData) => void
  setSliceSelected: (payload: TimelineData | null) => void
  removeSlice: (id: string) => void
  setMaxTimelineWidth: (payload: number) => void
  resetToDefault: () => void
  setPlayer: (payload: Player | null) => void
  setBarTime: (payload: BartTime) => void
  setTitle: (text: string) => void
}
