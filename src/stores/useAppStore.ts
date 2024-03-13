import { create } from 'zustand';
import { GetDetailMediaResponse, MediaEntity } from '../types';

export enum TabItemType {
  VIDEO = 'video',
  IMAGE = 'image',
}

type State = {
  // Vars
  openMedia: boolean;
  listMedia: MediaEntity[];
  tabActivated: TabItemType;
  mediaSelectedID: string | null;
  mediaSelectedData: GetDetailMediaResponse | null;

  // Functions
  setMediaDialog: (payload: boolean) => void;
  setTabActivated: (payload: TabItemType) => void;
  setListMedia: (payload: MediaEntity[]) => void;
  setMediaSelectedID: (payload: string) => void;
  setMediaSelectedData: (payload: GetDetailMediaResponse | null) => void;
};

const useAppStore = create<State>((set) => ({
  // Vars
  openMedia: false,
  listMedia: [],
  tabActivated: TabItemType.VIDEO,
  mediaSelectedID: null,
  mediaSelectedData: null,

  // Functions
  /**
   * Set media dialog on/off
   * @param payload boolean
   * @returns void
   */
  setMediaDialog: (payload: boolean) => set(() => ({ openMedia: payload })),

  /**
   * Switch tab media [video/image]
   * @param payload TabItemType
   * @returns void
   */
  setTabActivated: (payload: TabItemType) =>
    set(() => ({ tabActivated: payload })),

  /**
   * Set list media
   * @param payload Array<MediaEntity>
   * @returns void
   */
  setListMedia: (payload: MediaEntity[]) => set(() => ({ listMedia: payload })),

  /**
   * Set media selected
   * @param payload string
   * @returns void
   */
  setMediaSelectedID: (payload: string) =>
    set(() => ({ mediaSelectedID: payload })),

  /**
   * Set media selected data
   * @param payload GetDetailMediaResponse
   * @returns void
   */
  setMediaSelectedData: (payload: GetDetailMediaResponse | null) =>
    set((state) => ({
      mediaSelectedData: payload,
      mediaSelectedID: payload ? state.mediaSelectedID : payload,
    })),
}));

export default useAppStore;
