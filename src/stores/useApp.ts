import { action, makeAutoObservable } from 'mobx';

export enum TabItemType {
  VIDEO = 'video',
  IMAGE = 'image',
}
class AppStore {
  openMedia: boolean = false;
  tabActivated: TabItemType = TabItemType.VIDEO;

  constructor() {
    makeAutoObservable(this);
  }

  @action setMediaDialog = (payload: boolean) => {
    this.openMedia = payload;
  };

  @action setTabActivated = (payload: TabItemType) => {
    this.tabActivated = payload;
  };
}

export default new AppStore();
