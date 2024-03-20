import MediaContainer from '@/src/views/index'
import React from 'react'
import { MediaPackageType } from '../types'

export default { title: 'Media Package' }

export const basic = () => {
  return <MediaContainer type={[MediaPackageType.VIDEO, MediaPackageType.IMAGE]} />
}
