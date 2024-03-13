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
  MoreVertical,
  NotebookText,
  Ruler,
  Scissors,
  X,
} from 'lucide-react';
import {avatarUrl, formatBytes} from '@/src/lib/utils/media';
import { cn } from '@/src/lib/utils/merge-class';
import VideoPlayer from '@/src/components/video-player';
import If from '@/src/hooks/if';
import { Hl, MediaCodec, MediaPacks, Video } from '@/src/types';
import {formatDate} from "@/src/lib/utils/date";


const Detail = () => {
  const { mediaSelectedID, mediaSelectedData, setMediaSelectedData } =
    useAppStore();
  const { getDetailMedia } = useDetailMedia();

  const videoUrl = (d?: Video) => {
    if (!d) return;
    const defaultUri = d?.uri;
    const mp4 = d.play_url.mp4;

    const item = mp4.find((val) => val.codec === MediaCodec.H264);
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
          'tw-max-w-[400px]': haveMediaSelectedID,
          'tw-max-w-0': !haveMediaSelectedID,
        }
      )}
    >
      <div
        className={cn(
          'tw-absolute -tw-left-8 tw-top-1/2 tw-bg-slate-800 tw-w-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-tl-lg tw-rounded-bl-lg tw-cursor-pointer',
          {
            '!tw-hidden': !haveMediaSelectedID,
          }
        )}
        onClick={() => setMediaSelectedData(null)}
      >
        <X color="#ffffff" size={18} />
      </div>
      <If
        isShow={haveMediaSelectedID}
        element={() => (
          <div className="tw-gap-2 tw-flex tw-flex-col">
            <VideoPlayer
              videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
              thumbnailUrl={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
            />
            <div className="tw-p-2">
              <div className="tw-flex tw-gap-2 tw-justify-between">
                <div className="tw-flex tw-gap-4">
                  <div className="tw-flex tw-gap-1 tw-items-center">
                    <Frame size={16} />
                    <span className="tw-text-xs">{`${mediaSelectedData?.data?.video?.width}x${mediaSelectedData?.data?.video?.height}`}</span>
                  </div>
                  <div className="tw-flex tw-gap-1 tw-items-center">
                    <Ruler size={16} />
                    <span className="tw-text-xs">{formatBytes(mediaSelectedData?.data?.size as number)}</span>
                  </div>
                  <div className="tw-flex tw-gap-1 tw-items-center">
                    <CalendarClock size={16}/>
                    {/*<span className="tw-text-xs">11:20:41 15-5-2023</span>*/}
                    <span className="tw-text-xs">{formatDate(mediaSelectedData?.data?.createdAt as string) }</span>
                  </div>
                </div>

                <div className="tw-flex tw-gap-1 tw-items-center">
                  <NotebookText size={16} />
                </div>
              </div>

              <div className="tw-flex tw-justify-between !tw-my-5">
                <div className="tw-gap-2 tw-flex">
                  <Badge variant="secondary" className="tw-p-5">
                    <Images size={16} />
                    <span>Thay thumbnail</span>
                  </Badge>
                  <Badge variant="secondary" className="tw-p-5">
                    <Code size={16} />
                    <span>Mã nhúng</span>
                  </Badge>
                  <Badge variant="secondary" className="tw-p-5">
                    <Scissors size={16} />
                    <span>Cắt</span>
                  </Badge>
                </div>
                <div className="tw-flex tw-gap-2">
                  <Badge variant="secondary" className="tw-p-5">
                    <Download size={16} />
                  </Badge>
                  <Badge variant="secondary" className="tw-p-5">
                    <MoreVertical size={16} />
                  </Badge>
                </div>
              </div>
              <div>
                <Accordion type="multiple" className="w-full">
                  {new Array(5).fill(0).map((_, index: number) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="hover:tw-no-underline !tw-py-2">
                        Is it accessible?
                      </AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Detail;
