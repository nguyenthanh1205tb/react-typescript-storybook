import React from 'react'
import App from '@/src/views/index'
import ReactDom from 'react-dom/client'
import { MediaEntity, MediaPackageType } from './types'
class Init {
  private usedPackage: MediaPackageType[] = []

  constructor(options?: { type?: MediaPackageType[] }) {
    if (options) {
      this.usedPackage = options.type ?? []
    }
  }

  render(id: string, options?: { onSubmit: (data: MediaEntity[]) => void }) {
    if (!id || id === '') return
    this.appendMediaPackage(id, options?.onSubmit)
  }

  private appendMediaPackage(ID: string, onSubmit?: (data: MediaEntity[]) => void) {
    if (!ID) return
    const place = document.querySelector(ID)
    if (!place) return
    const dom = ReactDom.createRoot(place)
    return dom.render(<App type={this.usedPackage} onExportData={onSubmit} />)
  }
}

export default Init
