import React from 'react'
import App from '@/src/views/index'
import ReactDom from 'react-dom/client'
import { MediaEntity, MediaPackageType } from './types'
class Init {
  constructor() {}

  video(id: string, options?: { onSubmit: (data: MediaEntity[]) => void }) {
    if (!id || id === '') return
    this.appendVideoMediaPackage(id, options?.onSubmit)
  }

  image(id: string, options?: { onSubmit: (data: MediaEntity[]) => void }) {
    if (!id || id === '') return
    this.appendImageMediaPackage(id, options?.onSubmit)
  }

  private appendVideoMediaPackage(ID: string, onSubmit?: (data: MediaEntity[]) => void) {
    if (!ID) return
    const place = document.querySelector(ID)
    if (!place) return
    const dom = ReactDom.createRoot(place)
    dom.render(<App type={MediaPackageType.VIDEO} onExportData={onSubmit} />)
  }

  private appendImageMediaPackage(ID: string, onSubmit?: (data: MediaEntity[]) => void) {
    if (!ID) return
    const place = document.querySelector(ID)
    if (!place) return
    const dom = ReactDom.createRoot(place)
    dom.render(<App type={MediaPackageType.IMAGE} onExportData={onSubmit} />)
  }
}

export default Init
