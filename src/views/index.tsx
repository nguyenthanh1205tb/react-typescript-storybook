import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Image as ImageIcon, Search, Video } from 'lucide-react';
import { observer } from 'mobx-react';
import { useState } from 'react';
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
import If from '../lib/hooks/if';
import AppStore, { TabItemType } from '../stores/useApp';
import { SideMenu, SideMenuActive } from '../types';
import MediaItem from './components/MediaItem/MediaItem';
import Filter from './filter';
import ListMedia from './list';
import LinkUpload from './upload/link';
import LocalFilesUpload from './upload/local-files';
import MenuUpload from './upload/menu';
import S3StorageUpload from './upload/s3-storage';
import WatchFolderUpload from './upload/watch-folder';

type State = {
  sideMenu: SideMenu;
};

function Main() {
  const { setMediaDialog, openMedia, tabActivated } = AppStore;
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

  return (
    <TooltipProvider>
      <Button onClick={() => setMediaDialog(true)}>
        Open Media MefiPlatform
      </Button>
      <Dialog open={openMedia} onOpenChange={(open) => setMediaDialog(open)}>
        <DialogContent className="!tw-max-w-[90vw] tw-max-h-[90vh] !tw-flex tw-flex-col">
          <DialogHeader>
            <DialogTitle>Quản lý Media</DialogTitle>
          </DialogHeader>
          <div className="tw-flex tw-flex-col tw-h-full">
            <Tabs
              defaultValue={tabActivated}
              className="w-[400px] tw-h-full tw-overflow-hidden tw-flex tw-flex-col"
            >
              <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-py-2 tw-flex-none">
                <TabsList>
                  <TabsTrigger value={TabItemType.VIDEO} className="!tw-px-14">
                    <div className="tw-flex tw-items-center">
                      <Video size={18} className="tw-mr-2" />
                      <p>Video</p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value={TabItemType.IMAGE} className="!tw-px-14">
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
                    <Input placeholder="Tìm kiếm" className="tw-pl-8" />
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
                    <If
                      isShow={
                        state.sideMenu.active === SideMenuActive.LOCAL_FILES
                      }
                      element={<LocalFilesUpload />}
                    />
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
                  <ScrollArea className="tw-pr-4 tw-max-h-[650px] tw-border-r">
                    <TabsContent value={TabItemType.VIDEO} className="!tw-mt-0">
                      <ListMedia />
                    </TabsContent>
                    <TabsContent value={TabItemType.IMAGE} className="!tw-mt-0">
                      <ListMedia />
                    </TabsContent>
                  </ScrollArea>
                  <ScrollArea className="tw-w-[250px] xl:tw-w-[400px] tw-flex-none">
                    <MediaItem />
                  </ScrollArea>
                </div>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
export default observer(Main);
