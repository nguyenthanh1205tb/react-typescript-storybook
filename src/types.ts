export enum SideMenuActive {
  FILTER = 'filter',
  LOCAL_FILES = 'local-file',
  LINK = 'link',
  WATCH_FOLDER = 'watch-folder',
  S3_STORAGE = 's3-storage',
}
export type SideMenu = {
  active: SideMenuActive;
};
