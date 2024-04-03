import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'
import { cn } from '@/src/lib/utils'
import { SideMenuActive } from '@/src/types'
import { FilterIcon, FolderOpen, Link, UploadCloud } from 'lucide-react'
import React, { PropsWithChildren } from 'react'
import LocalFilesUpload from './upload/from-local-files'

interface Props {
  onChangeMenu: (menu: SideMenuActive) => void
  active: SideMenuActive
}
function MenuUpload({ onChangeMenu, active }: PropsWithChildren<Props>) {
  return (
    <div className="tw-w-[50px] tw-flex-none tw-bg-gray-50 tw-h-full tw-rounded-lg">
      <ul className="tw-py-2 tw-flex tw-flex-col tw-gap-4">
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  'tw-w-[35px]  tw-h-[35px] tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-cursor-pointer',
                  {
                    'tw-bg-slate-600 tw-text-white': active === SideMenuActive.FILTER,
                  },
                )}
                onClick={() => onChangeMenu(SideMenuActive.FILTER)}>
                <FilterIcon size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white tw-z-[100]">
              <p>Bộ lọc</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <LocalFilesUpload />
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white">
              <p>Upload từ máy của bạn</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  'tw-w-[35px] tw-h-[35px] tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-cursor-pointer',
                  {
                    'tw-bg-slate-600 tw-text-white': active === SideMenuActive.LINK,
                  },
                )}
                onClick={() => onChangeMenu(SideMenuActive.LINK)}>
                <Link size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white">
              <p>Upload từ urls</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  'tw-w-[35px] tw-h-[35px] tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-cursor-pointer',
                  {
                    'tw-bg-slate-600 tw-text-white': active === SideMenuActive.WATCH_FOLDER,
                  },
                )}
                onClick={() => onChangeMenu(SideMenuActive.WATCH_FOLDER)}>
                <FolderOpen size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white">
              <p>Upload từ watch folder</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  'tw-w-[35px] tw-h-[35px] tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-cursor-pointer',
                  {
                    'tw-bg-slate-600 tw-text-white': active === SideMenuActive.S3_STORAGE,
                  },
                )}
                onClick={() => onChangeMenu(SideMenuActive.S3_STORAGE)}>
                <UploadCloud size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white">
              <p>Upload từ S3 storage</p>
            </TooltipContent>
          </Tooltip>
        </li>
      </ul>
    </div>
  )
}
export default MenuUpload