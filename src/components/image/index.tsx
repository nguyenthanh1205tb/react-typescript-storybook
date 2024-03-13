import { cn } from '@/src/lib/utils/merge-class';
import React, { PropsWithChildren, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import If from '@/src/hooks/if';
import { Image as ImageIcon } from 'lucide-react';
import errorImg from '@/src/assets/images/error-img.png';

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  height?: string;
}
function Image({
  src,
  className,
  height = '118px',
  style,
  ...rest
}: PropsWithChildren<Props>) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className="tw-relative">
      <If
        isShow={!imgLoaded && !isError}
        element={
          <div className="tw-relative">
            <div className="tw-absolute tw-w-full tw-h-full tw-left-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
              <ImageIcon size={30} />
            </div>
            <Skeleton className="tw-w-full tw-rounded-xl" style={{ height }} />
          </div>
        }
      />

      <If
        isShow={isError}
        element={
          <div className="tw-relative">
            <div className="tw-absolute tw-w-full tw-h-full tw-left-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
              <img src={errorImg} alt="error when loading" />
            </div>
            <div
              className="tw-w-full tw-bg-gray-50 tw-rounded-xl"
              style={{ height }}
            ></div>
          </div>
        }
      />

      <If
        isShow={!isError}
        element={
          <img
            onLoad={() => setImgLoaded(true)}
            onError={() => setIsError(true)}
            loading="lazy"
            src={src}
            className={cn(
              'tw-object-cover tw-w-full tw-rounded-2xl',
              { '!tw-h-0': !imgLoaded },
              className
            )}
            style={{ height, ...style }}
            {...rest}
          />
        }
      />
    </div>
  );
}
export default Image;
