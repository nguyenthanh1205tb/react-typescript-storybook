import React from 'react'
import App from '@/src/views/index'
import ReactDom from 'react-dom/client'
import {
  AUTH_TOKEN,
  LS_SELECTED_ORGANIZATION_KEY,
  LS_SELECTED_TEMPLATE_KEY,
  LS_SELECTED_TOKEN_KEY,
  ORG_ID,
  TEMPLATE_ID,
} from './configs'

class Init {
  constructor(placeID?: string) {
    if (placeID && placeID !== '') {
      this.appendMediaComponent(placeID)
      localStorage.setItem(LS_SELECTED_ORGANIZATION_KEY, ORG_ID)
      localStorage.setItem(LS_SELECTED_TOKEN_KEY, AUTH_TOKEN)
      localStorage.setItem(LS_SELECTED_TEMPLATE_KEY, TEMPLATE_ID)
    }
  }

  private appendMediaComponent(ID: string) {
    if (!ID) return
    const place = document.getElementById(ID)
    if (!place) return
    const dom = ReactDom.createRoot(place)
    dom.render(<App />)
  }
}

export default Init
