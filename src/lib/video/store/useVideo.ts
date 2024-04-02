import { create } from 'zustand'
import { TimelineData, VideoState } from '../video'

export const findXLargest = (arr: Array<{ index: number; end: number }>, x: number) => {
  arr.sort((a, b) => b.end - a.end)
  return arr.slice(0, x)
}

const defaultState = {
  listSlice: [],
  sliceSelected: null,
  maxTimelineWidth: 0,
  player: null,
  barTime: [],
  barTimePlayed: null,
  title: '',
  draggingDirection: null,
  playerViewAt: null,
}

const useTimelineVideo = create<VideoState>(set => ({
  ...defaultState,

  addNewSlice: (payload: TimelineData) =>
    set(state => {
      const _list = state.listSlice.slice(0)
      const start = payload.x ?? 0
      const sliceFlag = state.listSlice
        .map((o, i) => ({ index: i, end: (o.x ?? 0) + (o.width ?? 0) }))
        .filter(o => start > o.end)
      const slice = findXLargest(sliceFlag, 1)[0]
      if (!slice) return { listSlice: [payload, ...state.listSlice] }
      const idx = slice.index + 1
      _list.splice(idx, 0, payload)
      return { listSlice: _list }
    }),

  updateSlice: (payload: TimelineData) =>
    set(state => {
      const _slice = state.listSlice.slice(0)
      const idx = _slice.findIndex(o => o.id === payload.id)
      if (idx < 0) return state
      _slice[idx] = { ..._slice[idx], ...payload }
      state.listSlice = _slice
      return { listSlice: _slice }
    }),

  setSliceSelected: (payload: TimelineData | null) =>
    set(state => ({ sliceSelected: payload ? { ...state.sliceSelected, ...payload } : null })),

  removeSlice: (id: string) =>
    set(state => {
      const newList = state.listSlice.slice(0).filter(o => o.id !== id)
      return { listSlice: newList }
    }),

  setMaxTimelineWidth: num => set(() => ({ maxTimelineWidth: num })),

  setPlayer: payload => set(() => ({ player: payload })),

  setBarTime: payload => set(() => ({ barTime: payload })),

  setTitle: text => set(() => ({ title: text })),

  setBarTimePlayed: id =>
    set(state => {
      const idx = state.barTime.findIndex(o => o.id === id)
      if (idx >= 0) {
        return { barTimePlayed: state.barTime[idx] }
      }
      return state
    }),

  setPlayerViewAt: dir =>
    set(state => {
      if (state.playerViewAt === dir) return state
      return { playerViewAt: dir }
    }),

  resetToDefault: () => set(() => defaultState),
}))

export { useTimelineVideo }
