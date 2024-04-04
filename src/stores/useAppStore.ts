import { create } from 'zustand'
import { LS_SELECTED_ORGANIZATION_KEY, LS_SELECTED_TEMPLATE_KEY, PAGINATE_LIMIT } from '../configs'
import {
  Category,
  ConfigEntity,
  FileAdded,
  FileProgressType,
  GetDetailMediaResponse,
  GetListMediaRequest,
  GetListMediaTimeRange,
  MediaEntity,
  MediaPackageType,
  MenuImgEditorType,
  OrderByType,
  OrderType,
} from '../types'

export enum VideoTabItemType {
  CONTENT = 'content',
  TRASH = 'trash',
}

type State = {
  // Vars
  packageEnabled: MediaPackageType | null
  showModalChangeThumbnail: boolean
  config: ConfigEntity | null
  openMedia: boolean
  listMedia: MediaEntity[]
  tabActivated: VideoTabItemType
  mediaSelectedID: string | null
  mediaSelectedData: GetDetailMediaResponse | null
  listMediaQueries: GetListMediaRequest
  listCategories: Category[]
  selectMultiMode: boolean
  listFileAdded: FileAdded[]
  listFileProgress: FileProgressType[]
  listMediaSelected: MediaEntity[]
  imgEditorState: {
    show: boolean
    initMenu: MenuImgEditorType
  }
  cutVideoModal: boolean

  // Functions
  setListFileProgress: (payload: FileProgressType[]) => void
  setListFileAdded: (payload: FileAdded[]) => void
  setConfig: (payload: ConfigEntity) => void
  setMediaDialog: (payload: boolean) => void
  setTabActivated: (payload: VideoTabItemType) => void
  setListMedia: (payload: MediaEntity[]) => void
  setMediaSelectedID: (payload: string | null) => void
  setMediaSelectedData: (payload: GetDetailMediaResponse | null) => void
  setListMediaQueries: (payload: Partial<GetListMediaRequest>) => void
  setListCategories: (payload: Category[]) => void
  setSelectMultiMode: (payload: boolean) => void
  setListMediaSelected: (payload: MediaEntity | MediaEntity[]) => void
  setPackageEnabled: (payload: MediaPackageType | null) => void
  setImgEditorState: (payload: { show: boolean; initMenu: MenuImgEditorType }) => void
  resetAppState: () => void
  setCutVideoModal: (status: boolean) => void
}

const defaultState = {
  imgEditorState: {
    show: false,
    initMenu: 'rotate' as MenuImgEditorType,
  },
  packageEnabled: null,
  showModalChangeThumbnail: false,
  listFileProgress: [],
  listFileAdded: [],
  config: null,
  openMedia: false,
  listMedia: [],
  tabActivated: VideoTabItemType.CONTENT,
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
  cutVideoModal: false,
}

const useAppStore = create<State>(set => ({
  // Vars
  ...defaultState,

  // Functions

  resetAppState: () => set(() => ({ ...defaultState })),

  setImgEditorState: payload => set(() => ({ imgEditorState: payload })),

  setListFileProgress: payload => set(() => ({ listFileProgress: payload })),

  setListFileAdded: payload => set(() => ({ listFileAdded: payload })),

  setConfig: payload =>
    set(() => {
      localStorage.setItem(LS_SELECTED_ORGANIZATION_KEY, payload.organizationId)
      localStorage.setItem(LS_SELECTED_TEMPLATE_KEY, payload.templateId)
      return { config: payload }
    }),

  setMediaDialog: payload => set(() => ({ openMedia: payload })),

  setTabActivated: payload => set(() => ({ tabActivated: payload })),

  setListMedia: payload => set(() => ({ listMedia: payload })),

  setMediaSelectedID: payload => set(() => ({ mediaSelectedID: payload })),

  setMediaSelectedData: payload =>
    set(state => ({
      mediaSelectedData: payload,
      mediaSelectedID: payload ? state.mediaSelectedID : payload,
    })),

  setListMediaQueries: payload =>
    set(state => ({
      listMediaQueries: { ...state.listMediaQueries, ...payload },
    })),

  setListCategories: payload => set(() => ({ listCategories: payload })),

  setSelectMultiMode: payload => set(() => ({ selectMultiMode: payload, listMediaSelected: [] })),

  setPackageEnabled: payload => set(() => ({ packageEnabled: payload })),

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

  setCutVideoModal: status => set(() => ({ cutVideoModal: status })),
}))

export default useAppStore
