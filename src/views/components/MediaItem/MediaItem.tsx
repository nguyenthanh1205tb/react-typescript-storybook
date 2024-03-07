import Image from '@/src/components/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { Badge } from '@/src/components/ui/badge';
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
} from 'lucide-react';

const MediaItem = () => {
  return (
    <div className="tw-gap-2 tw-flex tw-flex-col tw-pl-2">
      <Image className="tw-h-[200px]" src="https://picsum.photos/600/400" />
      <div className="tw-flex tw-gap-2 tw-justify-between">
        <div className="tw-flex tw-gap-4">
          <div className="tw-flex tw-gap-1 tw-items-center">
            <Frame size={16} />
            <span className="tw-text-xs">1920x1080</span>
          </div>
          <div className="tw-flex tw-gap-1 tw-items-center">
            <Ruler size={16} />
            <span className="tw-text-xs">500mb</span>
          </div>
          <div className="tw-flex tw-gap-1 tw-items-center">
            <CalendarClock size={16} />
            <span className="tw-text-xs">11:20:41 15-5-2023</span>
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
            <AccordionItem value={`item-${index}`}>
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
  );
};

export default MediaItem;
