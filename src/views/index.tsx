import React, { useMemo, useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Search, Video, Trash, Image as ImageIcon, FileText } from 'lucide-react'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { TooltipProvider } from '../components/ui/tooltip'
import If from '../hooks/if'
import useAppStore, { VideoTabItemType } from '../stores/useAppStore'
import { FileType, MediaPackageType, SideMenu, SideMenuActive } from '../types'
import Filter from './filter'
import MediaDetail from './media-detail/detail'
import MenuUpload from './upload/menu'
import { Toaster } from '../components/ui/toaster'
import { useListMedia } from '../hooks/useMedia'
import moment from 'moment'
import MediaMultiSelected from './media-multi-selected'
import ListMedia from './media-list/list'

type State = {
  sideMenu: SideMenu
}
const queryClient = new QueryClient()

interface Props {
  type: MediaPackageType
}
function Main({ type }: Props) {
  moment.locale('vi-VN')
  const { onSearchByText } = useListMedia()
  const { setMediaDialog, openMedia, tabActivated, setTabActivated, selectMultiMode } = useAppStore()
  const [state, setState] = useState<State>({
    sideMenu: {
      active: SideMenuActive.FILTER,
    },
  })

  const onChangeMenu = (k: SideMenuActive) => {
    setState(prev => ({
      ...prev,
      sideMenu: { ...prev.sideMenu, active: k },
    }))
  }

  const exposeFileType = useMemo(() => {
    switch (type) {
      case MediaPackageType.IMAGE:
        return FileType.IMAGE
      case MediaPackageType.DOCUMENT:
        return FileType.DOCUMENT
      case MediaPackageType.VIDEO:
      default:
        return FileType.VIDEO
    }
  }, [type])

  const exposeTitle = useMemo(() => {
    switch (type) {
      case MediaPackageType.IMAGE:
        return {
          icon: <ImageIcon size={18} className="tw-mr-2" />,
          name: 'Hình ảnh',
        }
      case MediaPackageType.DOCUMENT:
        return {
          icon: <FileText size={18} className="tw-mr-2" />,
          name: 'Tài liệu',
        }
      case MediaPackageType.VIDEO:
      default:
        return {
          icon: <Video size={18} className="tw-mr-2" />,
          name: 'Video',
        }
    }
  }, [type])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <div className="tw-grid-cols-1 tw-grid-cols-2 tw-grid-cols-3 tw-grid-cols-4 tw-grid-cols-5 tw-grid-cols-6 tw-grid-cols-7 tw-grid-cols-8 tw-grid-cols-9"></div>
        <Toaster />

        <Button onClick={() => setMediaDialog(true)}>
          <If isShow={type === MediaPackageType.VIDEO} element="Quản lý video" />
          <If isShow={type === MediaPackageType.IMAGE} element="Quản lý hình ảnh" />
        </Button>
        <Dialog open={openMedia} onOpenChange={open => setMediaDialog(open)}>
          <DialogContent className="!tw-max-w-[95vw] !tw-flex tw-flex-col tw-min-h-[800px] tw-max-h-[800px] tw-overflow-hidden">
            <DialogHeader>
              <DialogTitle>Quản lý Media</DialogTitle>
            </DialogHeader>
            <div className="tw-flex tw-flex-col tw-h-full tw-flex-1">
              <Tabs
                defaultValue={tabActivated}
                className="w-[400px] tw-h-full tw-overflow-hidden tw-flex tw-flex-col tw-flex-1">
                <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-py-2 tw-flex-none">
                  <TabsList>
                    <TabsTrigger
                      value={VideoTabItemType.VIDEO}
                      className="!tw-px-14"
                      onClick={() => setTabActivated(VideoTabItemType.VIDEO)}>
                      <div className="tw-flex tw-items-center">
                        {exposeTitle.icon}
                        <p>{exposeTitle.name}</p>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value={VideoTabItemType.TRASH}
                      className="!tw-px-14"
                      onClick={() => setTabActivated(VideoTabItemType.TRASH)}>
                      <div className="tw-flex tw-items-center">
                        <Trash size={18} className="tw-mr-2" />
                        <p>Thùng Rác</p>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <div className="tw-relative tw-pr-1 tw-w-[300px]">
                      <Search
                        size={16}
                        className="tw-absolute tw-left-2 tw-top-[52%] -tw-translate-y-1/2 tw-transform tw-text-gray-600"
                      />
                      <Input
                        placeholder="Tìm kiếm"
                        className="tw-pl-8"
                        onChange={e => onSearchByText(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                </div>
                <Separator className="tw-flex-none" />
                <div className="tw-flex tw-flex-1">
                  <div className="tw-py-2 tw-w-[350px] tw-pr-2 tw-border-r tw-flex-none tw-flex">
                    <MenuUpload onChangeMenu={onChangeMenu} active={state.sideMenu.active} />
                    <div className="tw-flex-1 tw-pl-2">
                      <If isShow={state.sideMenu.active === SideMenuActive.FILTER} element={<Filter type={type} />} />
                      {/* <If
                        isShow={
                          state.sideMenu.active === SideMenuActive.LOCAL_FILES
                        }
                        element={<LocalFilesUpload />}
                      /> */}
                      {/* <If isShow={state.sideMenu.active === SideMenuActive.LINK} element={<LinkUpload />} />
                      <If
                        isShow={state.sideMenu.active === SideMenuActive.WATCH_FOLDER}
                        element={<WatchFolderUpload />}
                      />
                      <If isShow={state.sideMenu.active === SideMenuActive.S3_STORAGE} element={<S3StorageUpload />} /> */}
                    </div>
                  </div>

                  <TabsContent value={VideoTabItemType.VIDEO} className="!tw-mt-0 tw-flex-1 tw-pl-2 tw-pt-2 tw-flex">
                    <ScrollArea className="tw-pr-4 tw-max-h-[650px] tw-border-r tw-flex-1">
                      <ListMedia type={exposeFileType} />
                    </ScrollArea>
                    <If isShow={selectMultiMode} element={<MediaMultiSelected />} />
                    <If isShow={!selectMultiMode} element={<MediaDetail type={type} />} />
                  </TabsContent>
                  <TabsContent value={VideoTabItemType.TRASH} className="!tw-mt-0"></TabsContent>
                </div>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default Main
