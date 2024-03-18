import { create } from 'zustand'
import { PAGINATE_LIMIT } from '../configs'
import {
  Category,
  ConfigEntity,
  GetDetailMediaResponse,
  GetListMediaRequest,
  GetListMediaTimeRange,
  MediaEntity,
  OrderByType,
  OrderType,
} from '../types'

export enum TabItemType {
  VIDEO = 'video',
  IMAGE = 'image',
}

type State = {
  // Vars
  config: ConfigEntity | null
  openMedia: boolean
  listMedia: MediaEntity[]
  tabActivated: TabItemType
  mediaSelectedID: string | null
  mediaSelectedData: GetDetailMediaResponse | null
  listMediaQueries: GetListMediaRequest
  listCategories: Category[]
  selectMultiMode: boolean
  listMediaSelected: MediaEntity[]

  // Functions
  setConfig: (payload: ConfigEntity) => void
  setMediaDialog: (payload: boolean) => void
  setTabActivated: (payload: TabItemType) => void
  setListMedia: (payload: MediaEntity[]) => void
  setMediaSelectedID: (payload: string | null) => void
  setMediaSelectedData: (payload: GetDetailMediaResponse | null) => void
  setListMediaQueries: (payload: Partial<GetListMediaRequest>) => void
  setListCategories: (payload: Category[]) => void
  setSelectMultiMode: (payload: boolean) => void
  setListMediaSelected: (payload: MediaEntity | MediaEntity[]) => void
}

const useAppStore = create<State>(set => ({
  // Vars
  config: null,
  openMedia: false,
  listMedia: [],
  tabActivated: TabItemType.VIDEO,
  mediaSelectedID: null,
  mediaSelectedData: null,
  listCategories: [],
  listMediaSelected: [],
  selectMultiMode: false,
  listMediaQueries: {
    page: 1,
    take: PAGINATE_LIMIT,
    order: OrderType.DESC,
    orderBy: OrderByType.CREATED_AT,
    timeRange: GetListMediaTimeRange.ALL,
    isMyFile: false,
  },

  // Functions
  /**
   * Set media dialog on/off
   * @param payload boolean
   */
  setConfig: payload => set(() => ({ config: payload })),

  /**
   * Set media dialog on/off
   * @param payload boolean
   */
  setMediaDialog: payload => set(() => ({ openMedia: payload })),

  /**
   * Switch tab media [video/image]
   * @param payload TabItemType
   */
  setTabActivated: payload => set(() => ({ tabActivated: payload })),

  /**
   * Set list media
   * @param payload Array<MediaEntity>
   */
  setListMedia: payload => set(() => ({ listMedia: payload })),

  /**
   * Set media selected
   * @param payload string
   */
  setMediaSelectedID: payload => set(() => ({ mediaSelectedID: payload })),

  /**
   * Set media selected data
   * @param payload GetDetailMediaResponse
   */
  setMediaSelectedData: payload =>
    set(state => ({
      mediaSelectedData: payload,
      mediaSelectedID: payload ? state.mediaSelectedID : payload,
    })),

  /**
   * Set request for API get list media
   * @param payload Partial<GetListMediaRequest>
   */
  setListMediaQueries: payload =>
    set(state => ({
      listMediaQueries: { ...state.listMediaQueries, ...payload },
    })),

  /**
   * Set list categories
   * @param payload Array<Category>
   */
  setListCategories: payload => set(() => ({ listCategories: payload })),

  /**
   * Set select multi mode
   * @param payload Boolean
   */
  setSelectMultiMode: payload => set(() => ({ selectMultiMode: payload, listMediaSelected: [] })),

  /**
   * Set list media selected in multi mode
   * @param payload Array<MediaEntity>
   */
  setListMediaSelected: payload =>
    set(state => {
      // Add list
      if (Array.isArray(payload)) {
        return { listMediaSelected: payload }
      }

      // clone list
      const _list = [...state.listMediaSelected]

      const idRemoved = state.listMediaSelected.filter(o => o.id === payload.id)

      // Remove from list
      if (idRemoved.length) {
        const newList = _list.filter(o => o.id !== payload.id)
        return { listMediaSelected: newList }
      }
      // Add per item
      _list.push(payload)
      return { listMediaSelected: _list }
    }),
}))

export default useAppStore
