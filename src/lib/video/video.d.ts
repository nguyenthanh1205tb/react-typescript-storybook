import Player from 'video.js/dist/types/player'

export interface TimelineData {
  id: string
  width?: number
  height?: number
  x?: number
  y?: number
}

export type BarTime = { id: string; start: number; end: number }

export interface VideoState {
  listSlice: TimelineData[]
  sliceSelected: TimelineData | null
  maxTimelineWidth: number
  player: Player | null
  barTime: BarTime[]
  title: string
  barTimePlayed: BarTime | null
  addNewSlice: (payload: TimelineData) => void
  updateSlice: (payload: TimelineData) => void
  setSliceSelected: (payload: TimelineData | null) => void
  removeSlice: (id: string) => void
  setMaxTimelineWidth: (payload: number) => void
  resetToDefault: () => void
  setPlayer: (payload: Player | null) => void
  setBarTime: (payload: BarTime[]) => void
  setTitle: (text: string) => void
  setBarTimePlayed: (id: string) => void
}
