import React from 'react'
import App from '@/src/views/index'
import ReactDom from 'react-dom/client'
class Init {
  constructor(placeID?: string) {
    if (placeID && placeID !== '') {
      this.appendMediaComponent(placeID)
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
