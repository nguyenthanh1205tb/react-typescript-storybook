import { cn } from '@/src/lib/utils/merge-class'
import React, { PropsWithChildren, useState } from 'react'
import { Skeleton } from '../../ui/skeleton'
import If from '@/src/hooks/if'
import { Ban, Image as ImageIcon, Loader } from 'lucide-react'
import errorImg from '@/src/assets/images/error-img.png'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import Typo from '../typo'

interface Props extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  height?: string
  iconLoadingSize?: number
}
function Image({ src, className, height = '118px', style, iconLoadingSize = 40, ...rest }: PropsWithChildren<Props>) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  return (
    <div className="tw-relative">
      <If
        isShow={!imgLoaded && !isError}
        element={
          <div className="tw-relative">
            <div className="tw-absolute tw-w-full tw-h-full tw-left-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
              <Tooltip>
                <TooltipTrigger>
                  <ImageIcon size={iconLoadingSize} />
                </TooltipTrigger>
                <TooltipContent side="top" className="tw-bg-slate-800 tw-text-white tw-flex tw-items-center tw-gap-2">
                  <Loader size={16} className="tw-animate-spin" />
                  <p>Hình ảnh đang được load</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Skeleton className={cn('tw-w-full tw-rounded-lg', className)} style={{ height }} />
          </div>
        }
      />

      <If
        isShow={isError}
        element={
          <div className="tw-relative">
            <div className="tw-absolute tw-w-full tw-h-full tw-left-0 tw-top-0 tw-flex tw-justify-center tw-items-center">
              <Tooltip>
                <TooltipTrigger>
                  <img src={errorImg} alt="." />
                </TooltipTrigger>
                <TooltipContent side="top" className="tw-bg-slate-800 tw-text-white tw-flex tw-items-center tw-gap-2">
                  <Ban size={16} />
                  <Typo.Paragraph>Hình ảnh bị lỗi</Typo.Paragraph>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className={cn('tw-w-full tw-bg-gray-50 tw-rounded-lg', className)} style={{ height }}></div>
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
            className={cn('tw-object-cover tw-w-full tw-rounded-lg', { '!tw-h-0': !imgLoaded }, className)}
            style={{ height, ...style }}
            {...rest}
          />
        }
      />
    </div>
  )
}
export default Image
