import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Image as ImageIcon, Search, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { TooltipProvider } from '../components/ui/tooltip';
import {
  AUTH_TOKEN,
  LS_SELECTED_ORGANIZATION_KEY,
  LS_SELECTED_TEMPLATE_KEY,
  LS_SELECTED_TOKEN_KEY,
  ORG_ID,
  TEMPLATE_ID,
} from '../configs';
import If from '../hooks/if';
import useAppStore, { TabItemType } from '../stores/useAppStore';
import { FileType, SideMenu, SideMenuActive } from '../types';
import Filter from './filter';
import MediaDetail from './media-detail/detail';
import ListMedia from './media-list/list';
import LinkUpload from './upload/link';
import MenuUpload from './upload/menu';
import S3StorageUpload from './upload/s3-storage';
import WatchFolderUpload from './upload/watch-folder';
import { Toaster } from '../components/ui/toaster';
import { useListMedia } from '../hooks/useMedia';
import moment from 'moment';

type State = {
  sideMenu: SideMenu;
};
const queryClient = new QueryClient();

function Main() {
  moment.locale('vi-VN');
  const { onSearchByText } = useListMedia();
  const { setMediaDialog, openMedia, tabActivated, setTabActivated } =
    useAppStore();
  const [state, setState] = useState<State>({
    sideMenu: {
      active: SideMenuActive.FILTER,
    },
  });

  const onChangeMenu = (k: SideMenuActive) => {
    setState((prev) => ({
      ...prev,
      sideMenu: { ...prev.sideMenu, active: k },
    }));
  };

  useEffect(() => {
    localStorage.setItem(LS_SELECTED_ORGANIZATION_KEY, ORG_ID);
    localStorage.setItem(LS_SELECTED_TOKEN_KEY, AUTH_TOKEN);
    localStorage.setItem(LS_SELECTED_TEMPLATE_KEY, TEMPLATE_ID);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>
        <div className="tw-hidden tw-grid-cols-1 tw-grid-cols-2 tw-grid-cols-3 tw-grid-cols-4 tw-grid-cols-5 tw-grid-cols-6"></div>
        <Toaster />

        <Button onClick={() => setMediaDialog(true)}>
          Open Media MefiPlatform
        </Button>
        <Dialog open={openMedia} onOpenChange={(open) => setMediaDialog(open)}>
          <DialogContent className="!tw-max-w-[95vw] !tw-flex tw-flex-col tw-min-h-[800px] tw-max-h-[800px] tw-overflow-hidden">
            <DialogHeader>
              <DialogTitle>Quản lý Media</DialogTitle>
            </DialogHeader>
            <div className="tw-flex tw-flex-col tw-h-full tw-flex-1">
              <Tabs
                defaultValue={tabActivated}
                className="w-[400px] tw-h-full tw-overflow-hidden tw-flex tw-flex-col tw-flex-1"
              >
                <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-py-2 tw-flex-none">
                  <TabsList>
                    <TabsTrigger
                      value={TabItemType.VIDEO}
                      className="!tw-px-14"
                      onClick={() => setTabActivated(TabItemType.VIDEO)}
                    >
                      <div className="tw-flex tw-items-center">
                        <Video size={18} className="tw-mr-2" />
                        <p>Video</p>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabItemType.IMAGE}
                      className="!tw-px-14"
                      onClick={() => setTabActivated(TabItemType.IMAGE)}
                    >
                      <div className="tw-flex tw-items-center">
                        <ImageIcon size={18} className="tw-mr-2" />
                        <p>Hình ảnh</p>
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
                        onChange={(e) => onSearchByText(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                </div>
                <Separator className="tw-flex-none" />
                <div className="tw-flex tw-flex-1">
                  <div className="tw-py-2 tw-w-[350px] tw-pr-2 tw-border-r tw-flex-none tw-flex">
                    <MenuUpload
                      onChangeMenu={onChangeMenu}
                      active={state.sideMenu.active}
                    />
                    <div className="tw-flex-1 tw-pl-2">
                      <If
                        isShow={state.sideMenu.active === SideMenuActive.FILTER}
                        element={<Filter />}
                      />
                      {/* <If
                        isShow={
                          state.sideMenu.active === SideMenuActive.LOCAL_FILES
                        }
                        element={<LocalFilesUpload />}
                      /> */}
                      <If
                        isShow={state.sideMenu.active === SideMenuActive.LINK}
                        element={<LinkUpload />}
                      />
                      <If
                        isShow={
                          state.sideMenu.active === SideMenuActive.WATCH_FOLDER
                        }
                        element={<WatchFolderUpload />}
                      />
                      <If
                        isShow={
                          state.sideMenu.active === SideMenuActive.S3_STORAGE
                        }
                        element={<S3StorageUpload />}
                      />
                    </div>
                  </div>

                  <div className="tw-flex-1 tw-pl-2 tw-pt-2 tw-flex">
                    <ScrollArea className="tw-pr-4 tw-max-h-[650px] tw-border-r tw-flex-1">
                      <TabsContent
                        value={TabItemType.VIDEO}
                        className="!tw-mt-0"
                      >
                        <ListMedia type={FileType.VIDEO} />
                      </TabsContent>
                      <TabsContent
                        value={TabItemType.IMAGE}
                        className="!tw-mt-0"
                      >
                        <ListMedia type={FileType.IMAGE} />
                      </TabsContent>
                    </ScrollArea>
                    <MediaDetail />
                  </div>
                </div>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default Main;
