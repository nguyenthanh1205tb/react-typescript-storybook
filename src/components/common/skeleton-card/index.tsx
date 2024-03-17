import React from 'react'
import { Skeleton } from '@/src/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className="tw-flex tw-flex-col tw-space-y-3">
      <Skeleton className="tw-h-[125px] tw-w-full tw-rounded-xl" />
      <div className="tw-space-y-2">
        <Skeleton className="tw-h-4 tw-w-full" />
        <Skeleton className="tw-h-4 tw-w-full" />
      </div>
    </div>
  )
}
