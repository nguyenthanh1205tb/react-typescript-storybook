import React, { useEffect, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { Badge } from '@/src/components/ui/badge';
import { useDetailMedia } from '@/src/hooks/useMedia';
import useAppStore from '@/src/stores/useAppStore';
import {
  CalendarClock,
  Code,
  Download,
  Frame,
  Images,
  Loader,
  MoreVertical,
  NotebookText,
  Ruler,
  Scissors,
  X,
} from 'lucide-react';
import { avatarUrl, formatBytes } from '@/src/lib/utils/media';
import { cn } from '@/src/lib/utils/merge-class';
import VideoPlayer from '@/src/components/common/video-player';
import If from '@/src/hooks/if';
import { MediaCodec, MediaPacks, Video } from '@/src/types';
import { formatDate } from '@/src/lib/utils/date';

const Detail = () => {
  const { mediaSelectedID, mediaSelectedData, setMediaSelectedData } =
    useAppStore();
  const { response, getDetailMedia } = useDetailMedia();

  const mediaAccords = [
    {
      headerName: 'Chi tiết',
    },
    {
      headerName: 'Lịch sử',
      hide: true,
    },
    {
      headerName: 'Sử dụng',
      hide: true,
    },
    {
      headerName: 'Liên quan',
      hide: true,
    },
    {
      headerName: 'Thông tin quảng cáo',
      hide: true,
    },
  ];

  const videoUrl = (d?: Video) => {
    if (!d) return;
    const defaultUri = d?.uri;
    const hls = d.play_url.hls;

    const item = hls.find(
      (val) => val.codec === MediaCodec.H264 && val.pack === MediaPacks.HLS
    );
    if (!item) return defaultUri;
    return item.uri;
  };

  const haveMediaSelectedID = useMemo(
    () => mediaSelectedID !== null && mediaSelectedID !== '',
    [mediaSelectedID]
  );

  useEffect(() => {
    if (mediaSelectedID) {
      getDetailMedia(mediaSelectedID);
    }
  }, [mediaSelectedID]);

  return (
    <div
      className={cn(
        'tw-bg-slate-800 tw-text-white tw-relative tw-h-full tw-w-full tw-flex-none tw-transition-all',
        {
          'tw-max-w-[450px]': haveMediaSelectedID,
          'tw-max-w-0': !haveMediaSelectedID,
        }
      )}
    >
      <div
        className={cn(
          'tw-absolute -tw-left-8 tw-top-1/2 tw-bg-slate-800 tw-w-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-tl-lg tw-rounded-bl-lg tw-cursor-pointer',
          {
            '!tw-hidden': !haveMediaSelectedID || response.loading,
          }
        )}
        onClick={() => setMediaSelectedData(null)}
      >
        <X color="#ffffff" size={18} />
      </div>
      <If
        isShow={response.loading}
        element={
          <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-50 tw-bg-slate-600/20 tw-backdrop-blur-md tw-flex tw-flex-col tw-items-center tw-justify-center">
            <Loader className="tw-animate-spin" size={30} />
            <p className="tw-mt-2">Đang lấy dữ liệu</p>
          </div>
        }
      />
      <If
        isShow={haveMediaSelectedID}
        element={() => (
          <div className="tw-flex tw-flex-col">
            <VideoPlayer
              videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
              thumbnailUrl={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
            />
            <div className="tw-flex tw-gap-2 tw-justify-between tw-bg-slate-600 tw-p-3">
              <div className="tw-flex tw-gap-4">
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Frame size={16} />
                  <span className="tw-text-xs">{`${mediaSelectedData?.data?.video?.width}x${mediaSelectedData?.data?.video?.height}`}</span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Ruler size={16} />
                  <span className="tw-text-xs">
                    {formatBytes(mediaSelectedData?.data?.size as number)}
                  </span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <CalendarClock size={16} />
                  <span className="tw-text-xs">
                    {formatDate(mediaSelectedData?.data?.createdAt as string)}
                  </span>
                </div>
              </div>

              <div className="tw-flex tw-gap-1 tw-items-center">
                <NotebookText size={16} />
              </div>
            </div>

            <div className="tw-flex tw-justify-between tw-px-3 tw-py-2">
              <div className="tw-gap-2 tw-flex">
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400"
                >
                  <Images size={16} />
                  <span>Thay thumbnail</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400"
                >
                  <Code size={16} />
                  <span>Mã nhúng</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400"
                >
                  <Scissors size={16} />
                  <span>Cắt</span>
                </Badge>
              </div>
              <div className="tw-flex tw-gap-2">
                <div className="tw-transition-all tw-w-[30px] tw-h-[30px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-slate-600 hover:tw-bg-slate-400 tw-cursor-pointer">
                  <Download size={16} />
                </div>
                <div className="tw-transition-all tw-w-[30px] tw-h-[30px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-slate-600 hover:tw-bg-slate-400 tw-cursor-pointer">
                  <MoreVertical size={16} />
                </div>
              </div>
            </div>
            <div className="tw-h-[1px] tw-bg-slate-700 tw-w-full"></div>
            <div className="tw-px-3 tw-py-2">
              <Accordion type="multiple" className="w-full">
                {mediaAccords.map((item, index: number) =>
                  !item.hide ? (
                    <AccordionItem
                      value={`item-${index}`}
                      key={index}
                      className="tw-border-slate-700"
                    >
                      <AccordionTrigger className="hover:tw-no-underline !tw-py-2">
                        {item.headerName}
                      </AccordionTrigger>
                      <AccordionContent className="tw-px-2 tw-text-sm">
                        Yes. It adheres to the WAI-ARIA design pattern.
                      </AccordionContent>
                    </AccordionItem>
                  ) : null
                )}
              </Accordion>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Detail;
