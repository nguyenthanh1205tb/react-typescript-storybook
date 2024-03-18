import Image from '@/src/components/common/image'
import { avatarUrl } from '@/src/lib/utils/media'
import { cn } from '@/src/lib/utils/merge-class'
import useAppStore from '@/src/stores/useAppStore'
import { FileAdded } from '@/src/types'
import React, { PropsWithChildren } from 'react'

interface Props {
  data: FileAdded
}

import { Loader2 } from 'lucide-react'

export const Icons = {
  spinner: Loader2,
}

export const getClassNameLoading = (percent: number) => {
  if (percent <= 20) {
    return 'ten'
  }

  if (percent > 20 && percent <= 40) {
    return 'thirty'
  }

  if (percent > 40 && percent <= 60) {
    return 'fifty'
  }

  if (percent > 60 && percent <= 90) {
    return 'seventy'
  }

  if (percent > 90) {
    return 'hundred'
  }
}

function LoadingItem({ data }: PropsWithChildren<Props>) {
  const { setMediaSelectedID, listFileProgress } = useAppStore()

  const percent = listFileProgress?.filter(f => f.id === data?.id)[0].percent

  return (
    <div className="tw-border tw-p-2 tw-rounded-lg tw-relative" onClick={() => setMediaSelectedID(data.id)}>
      <div className="tw-absolute tw-left-3 tw-top-3 tw-z-10">
        <div className={`loading-cirle ${getClassNameLoading(percent)} tw-border-white`}></div>
      </div>
      <div className={cn('tw-flex tw-flex-col tw-gap-1 tw-cursor-pointer')}>
        <Image src={avatarUrl()} />
        <p className="tw-text-sm tw-line-clamp-2" title={data.name}>
          {data.name}
        </p>
      </div>
    </div>
  )
}
export default LoadingItem
