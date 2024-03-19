import React from 'react'
import App from '@/src/views/index'
import ReactDom from 'react-dom/client'
import { MediaPackageType } from './types'
class Init {
  constructor() {}

  video(id: string) {
    if (!id || id === '') return
    this.appendVideoMediaPackage(id)
  }

  image(id: string) {
    if (!id || id === '') return
    this.appendImageMediaPackage(id)
  }

  private appendVideoMediaPackage(ID: string) {
    if (!ID) return
    const place = document.querySelector(ID)
    if (!place) return
    const dom = ReactDom.createRoot(place)
    dom.render(<App type={MediaPackageType.VIDEO} />)
  }

  private appendImageMediaPackage(ID: string) {
    if (!ID) return
    const place = document.querySelector(ID)
    if (!place) return
    const dom = ReactDom.createRoot(place)
    dom.render(<App type={MediaPackageType.IMAGE} />)
  }
}

export default Init
