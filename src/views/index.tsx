/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/src/components/ui/button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ConfigProvider from 'antd/es/config-provider'
import Modal from 'antd/es/modal/Modal'
import { FileText, Image as ImageIcon, MoveLeft, Search, Trash, Video } from 'lucide-react'
import moment from 'moment'
import 'moment/locale/vi'
import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../components/ui/input'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Toaster } from '../components/ui/toaster'
import { TooltipProvider } from '../components/ui/tooltip'
import Each from '../hooks/each'
import If from '../hooks/if'
import { useListMedia } from '../hooks/useMedia'
import useAppStore, { VideoTabItemType } from '../stores/useAppStore'
import { FileType, MediaEntity, MediaPackageType, SideMenu, SideMenuActive } from '../types'
import { fetchToken } from '../utils/fetchToken'
import Filter from './filter'
import MediaDetail from './media-detail/detail'
import ListMedia from './media-list/list'
import MediaMultiSelected from './media-multi-selected'
import UploadFromUrlModal from './upload-from-url'
import MenuUpload from './upload/menu'
type State = {
  sideMenu: SideMenu
}
const queryClient = new QueryClient()

interface Props {
  type: MediaPackageType[]
  onExportData?: (data: MediaEntity[]) => void
}
function Main({ type, onExportData }: Props) {
  moment.locale('vi')
  const { onSearchByText } = useListMedia()
  const {
    setMediaDialog,
    openMedia,
    tabActivated,
    setTabActivated,
    selectMultiMode,
    packageEnabled,
    setPackageEnabled,
    resetAppState,
  } = useAppStore()
  const [state, setState] = useState<State>({
    sideMenu: {
      active: SideMenuActive.NULL,
    },
  })

  useEffect(() => {
    fetchToken()
  }, [])

  const onChangeMenu = (k: SideMenuActive) => {
    setState(prev => ({
      ...prev,
      sideMenu: { ...prev.sideMenu, active: k },
    }))
  }

  const exportFileType = useMemo(() => {
    switch (packageEnabled) {
      case MediaPackageType.IMAGE:
        return FileType.IMAGE
      case MediaPackageType.DOCUMENT:
        return FileType.DOCUMENT
      case MediaPackageType.VIDEO:
      default:
        return FileType.VIDEO
    }
  }, [packageEnabled])

  const exportTitle = useMemo(() => {
    switch (packageEnabled) {
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
  }, [packageEnabled])

  useEffect(() => {
    if (!openMedia) {
      setTimeout(() => resetAppState(), 300)
    }
  }, [openMedia])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <ConfigProvider>
          <div className="tw-grid-cols-1 tw-grid-cols-2 tw-grid-cols-3 tw-grid-cols-4 tw-grid-cols-5 tw-grid-cols-6 tw-grid-cols-7 tw-grid-cols-8 tw-grid-cols-9"></div>
          <Toaster />

          <div className="tw-flex tw-items-center tw-space-x-2">
            <Each
              of={type}
              render={name => (
                <Button
                  onClick={() => {
                    setPackageEnabled(name as MediaPackageType)
                    setMediaDialog(true)
                  }}>
                  {name}
                </Button>
              )}
            />
          </div>

          <Modal
            centered
            destroyOnClose
            open={openMedia}
            onCancel={() => setMediaDialog(false)}
            title="Quản lý media"
            footer={null}
            className="tw-max-w-[95vw] tw-min-w-[95vw] xl:tw-min-h-[600px]  2xl:tw-min-h-[800px] 2xl:tw-max-h-[800px] tw-overflow-hidden">
            <div className="tw-flex tw-flex-col tw-h-full tw-flex-1">
              <Tabs
                defaultValue={tabActivated}
                className="w-[400px] tw-h-full tw-overflow-hidden tw-flex tw-flex-col tw-flex-1">
                <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-py-2 tw-flex-none">
                  <TabsList>
                    <TabsTrigger
                      value={VideoTabItemType.CONTENT}
                      className="!tw-px-14"
                      onClick={() => setTabActivated(VideoTabItemType.CONTENT)}>
                      <div className="tw-flex tw-items-center">
                        {exportTitle.icon}
                        <p>{exportTitle.name}</p>
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
                <div className="tw-flex tw-flex-1 ">
                  <div
                    className={`tw-pt-2 tw-w-[350px] ${state.sideMenu.active === SideMenuActive.FILTER ? '' : 'tw-w-fit'} tw-pr-2 tw-border-r tw-flex-none tw-flex`}>
                    <MenuUpload onChangeMenu={onChangeMenu} active={state?.sideMenu?.active} />
                    <div
                      className={`tw-flex-1  tw-pl-2 tw-relative ${state.sideMenu.active === SideMenuActive.FILTER ? '' : 'tw-hidden'}`}>
                      <If
                        isShow={state.sideMenu.active === SideMenuActive.FILTER}
                        element={<Filter type={packageEnabled as MediaPackageType} />}
                      />
                      <MoveLeft
                        className="tw-cursor-pointer tw-absolute tw-top-5 tw-right-3"
                        onClick={() =>
                          setState({
                            sideMenu: {
                              active: SideMenuActive.NULL,
                            },
                          })
                        }
                      />

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

                  <TabsContent value={VideoTabItemType.CONTENT} className="!tw-mt-0 tw-flex-1 tw-pl-2 tw-pt-2 tw-flex">
                    <div className="tw-pr-2 tw-max-h-[650px] tw-min-h-[650px] tw-border-r tw-flex-1 tw-overflow-x-hidden tw-overflow-y-auto">
                      <ListMedia type={exportFileType} isFilterOpen={state.sideMenu.active === SideMenuActive.FILTER} />
                    </div>
                    <If isShow={selectMultiMode} element={<MediaMultiSelected onExportData={onExportData} />} />
                    <If
                      isShow={!selectMultiMode && packageEnabled !== null}
                      element={<MediaDetail type={packageEnabled as MediaPackageType} onExportData={onExportData} />}
                    />
                  </TabsContent>
                  <TabsContent
                    value={VideoTabItemType.TRASH}
                    className="!tw-mt-0 tw-max-h-[650px] tw-min-h-[650px]"></TabsContent>
                </div>
              </Tabs>
              {
                <UploadFromUrlModal
                  isOpen={state.sideMenu.active === SideMenuActive.LINK}
                  onCancel={() =>
                    setState({
                      sideMenu: {
                        active: SideMenuActive.NULL,
                      },
                    })
                  }
                />
              }
            </div>
          </Modal>
        </ConfigProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default Main
