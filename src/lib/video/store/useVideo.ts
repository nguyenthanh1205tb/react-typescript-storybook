import { create } from 'zustand'
import { TimelineData, VideoState } from '../video'

const defaultState = {
  listSlice: [],
  sliceSelected: null,
  maxTimelineWidth: 0,
  player: null,
  barTime: { start: 0, end: 0 },
}

const useTimelineVideo = create<VideoState>(set => ({
  ...defaultState,

  addNewSlice: (payload: TimelineData) => set(state => ({ listSlice: [...state.listSlice, { ...payload, y: 0 }] })),

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

  resetToDefault: () => set(() => defaultState),
}))

export { useTimelineVideo }
