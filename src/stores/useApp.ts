import { action, makeAutoObservable } from 'mobx';

class AppStore {
  openMedia: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setMediaDialog = (payload: boolean) => {
    this.openMedia = payload;
  };
}

export default new AppStore();
