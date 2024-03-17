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

  // Functions
  setConfig: (payload: ConfigEntity) => void
  setMediaDialog: (payload: boolean) => void
  setTabActivated: (payload: TabItemType) => void
  setListMedia: (payload: MediaEntity[]) => void
  setMediaSelectedID: (payload: string) => void
  setMediaSelectedData: (payload: GetDetailMediaResponse | null) => void
  setListMediaQueries: (payload: Partial<GetListMediaRequest>) => void
  setListCategories: (payload: Category[]) => void
  setSelectMultiMode: (payload: boolean) => void
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
  setConfig: (payload: ConfigEntity) => set(() => ({ config: payload })),
  /**
   * Set media dialog on/off
   * @param payload boolean
   */
  setMediaDialog: (payload: boolean) => set(() => ({ openMedia: payload })),

  /**
   * Switch tab media [video/image]
   * @param payload TabItemType
   */
  setTabActivated: (payload: TabItemType) => set(() => ({ tabActivated: payload })),

  /**
   * Set list media
   * @param payload Array<MediaEntity>
   */
  setListMedia: (payload: MediaEntity[]) => set(() => ({ listMedia: payload })),

  /**
   * Set media selected
   * @param payload string
   */
  setMediaSelectedID: (payload: string) => set(() => ({ mediaSelectedID: payload })),

  /**
   * Set media selected data
   * @param payload GetDetailMediaResponse
   */
  setMediaSelectedData: (payload: GetDetailMediaResponse | null) =>
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
  setSelectMultiMode: payload => set(() => ({ selectMultiMode: payload })),
}))

export default useAppStore
