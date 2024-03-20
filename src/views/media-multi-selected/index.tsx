import React from 'react'
import Typo from '@/src/components/common/typo'
import useAppStore from '@/src/stores/useAppStore'
import Each from '@/src/hooks/each'
import { avatarUrl } from '@/src/lib/utils/media'
import Image from '@/src/components/common/image'
import { CircleFadingPlus, Trash, X } from 'lucide-react'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Button } from '@/src/components/ui/button'
import { MediaEntity } from '@/src/types'

interface Props {
  onExportData?: (data: MediaEntity[]) => void
}
function MediaMultiSelected({ onExportData }: Props) {
  const { listMediaSelected, setListMediaSelected } = useAppStore()

  return (
    <div className="tw-bg-slate-800 tw-text-white tw-relative tw-h-full tw-w-full tw-flex-none tw-transition-all tw-max-w-[450px]">
      <div className="tw-pr-0.5 tw-flex tw-flex-col tw-h-full">
        <div className="tw-mb-2 tw-flex-none tw-px-4 tw-py-2 tw-flex tw-justify-between tw-items-center">
          <Typo.H3>Danh sách đã chọn ({listMediaSelected.length})</Typo.H3>
          <div className="tw-flex tw-items-center">
            <Trash size={18} className="tw-cursor-pointer" onClick={() => setListMediaSelected([])} />
          </div>
        </div>
        <ScrollArea className="tw-h-[550px] tw-flex-none">
          <div className="tw-flex tw-flex-col tw-gap-2 tw-px-4">
            <Each
              of={listMediaSelected}
              render={item => (
                <div className="tw-flex tw-justify-between tw-items-center tw-gap-1 tw-bg-slate-700 tw-border tw-border-slate-600 tw-p-2 tw-rounded-lg">
                  <div className="tw-flex tw-gap-2">
                    <Image
                      iconLoadingSize={16}
                      src={avatarUrl(item.avatar_thumb)}
                      height="60px"
                      containerClassName="tw-w-[70px] tw-h-[60px]"
                    />
                    <Typo.Paragraph className="tw-max-w-[280px] tw-break-words tw-line-clamp-3">
                      {item.name}
                    </Typo.Paragraph>
                  </div>
                  <X className="tw-cursor-pointer" onClick={() => setListMediaSelected(item)} />
                </div>
              )}
            />
          </div>
        </ScrollArea>
        <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center">
          <Button
            onClick={() => {
              if (onExportData) return onExportData(listMediaSelected)
            }}>
            <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
              <CircleFadingPlus size={16} />
              <span>Chèn</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
export default MediaMultiSelected
