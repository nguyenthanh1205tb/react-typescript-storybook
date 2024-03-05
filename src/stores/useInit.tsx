import App from '@/src/index';
import { makeAutoObservable, observable } from 'mobx';
import React from 'react';
import ReactDom from 'react-dom/client';

class Init {
  @observable private _placedID: null | string = null;

  constructor(placeID?: string) {
    makeAutoObservable(this);
    if (placeID && placeID !== '') {
      this._placedID = placeID;
      this.appendMediaComponent(placeID);
    }
  }

  private appendMediaComponent(ID: string) {
    if (!ID) return;
    const place = document.getElementById(ID);
    if (!place) return;
    const dom = ReactDom.createRoot(place);
    dom.render(<App />);
  }
}

export default Init;
