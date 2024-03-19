import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'
import { ORG_ID, TEMPLATE_ID } from '@/src/configs'
import UppyDashboard from '@/src/lib/uppy/dashboard'
import { cn } from '@/src/lib/utils'
import { SideMenuActive } from '@/src/types'
import { FilterIcon } from 'lucide-react'
import React, { PropsWithChildren } from 'react'

interface Props {
  onChangeMenu: (menu: SideMenuActive) => void
  active: SideMenuActive
}
function MenuUpload({ onChangeMenu, active }: PropsWithChildren<Props>) {
  // const uppyRef = useRef<any>(null)
  // const [isFileAdded, setIsFileAdded] = useState(false)

  // useEffect(() => {
  //   if (isFileAdded) {
  //     uppyRef.current?.upload()
  //   }
  // }, [isFileAdded])

  // useEffect(() => {
  //   if (!ORG_ID) {
  //     return () => {}
  //   }

  //   uppyRef.current = createUppyInstance({
  //     autoProceed: false, // Set to false to manually start upload
  //   })

  //   uppyRef.current.on('file-added', (file: any) => {
  //     const contentId = getContentId(file.id) || uniqueId()
  //     saveContentIdToLocalStorage(file.id, contentId)

  //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //     console.log('File added>>>>:', file, contentId)
  //     uppyRef.current.setFileMeta(file.id, {
  //       contentId,
  //       ORG_ID,
  //       TEMPLATE_ID,
  //     })

  //     setIsFileAdded(true)
  //   })

  //   return () => {
  //     uppyRef.current.close() // Close Uppy instance when component unmounts
  //   }
  // }, [ORG_ID, TEMPLATE_ID])

  // const handleFileInputChange = (event: any) => {
  //   const files = event.target.files
  //   if (files.length > 0) {
  //     // Add selected files to Uppy instance
  //     uppyRef.current.addFiles(files)
  //     // Optionally, you can start the upload process here
  //     uppyRef.current.upload()
  //   }
  // }

  return (
    <div className="tw-w-[50px] tw-flex-none tw-bg-gray-50 tw-h-full tw-rounded-lg">
      <ul className="tw-py-2 tw-flex tw-flex-col tw-gap-4">
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  'tw-w-[35px] tw-h-[35px] tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-cursor-pointer',
                  {
                    'tw-bg-slate-600 tw-text-white': active === SideMenuActive.FILTER,
                  },
                )}
                onClick={() => onChangeMenu(SideMenuActive.FILTER)}>
                <FilterIcon size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white tw-z-50">
              <p>Bộ lọc</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li className="tw-flex tw-items-center tw-justify-center">
          <Tooltip>
            <TooltipTrigger>
              <UppyDashboard organizationId={ORG_ID} templateId={TEMPLATE_ID} />
            </TooltipTrigger>
            <TooltipContent side="right" className="tw-bg-slate-800 tw-text-white">
              <p>Upload từ máy của bạn</p>
            </TooltipContent>
          </Tooltip>
        </li>
        {/* <li className="tw-flex tw-items-center tw-justify-center">
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
        </li> */}
      </ul>
    </div>
  )
}
export default MenuUpload
