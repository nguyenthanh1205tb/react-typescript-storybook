import React from 'react'
import MediaContainer from '@/src/views/index'
import { MediaPackageType } from '../types'

export default { title: 'Video Package' }

export const basic = () => {
  return <MediaContainer type={MediaPackageType.VIDEO} />
}
