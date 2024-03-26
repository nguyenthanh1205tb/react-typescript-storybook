import errorImg from '@/src/assets/images/error-img.png'
import If from '@/src/hooks/if'
import { cn } from '@/src/lib/utils/merge-class'
import { Ban, Image as ImageIcon, Loader } from 'lucide-react'
import React, { PropsWithChildren, useState } from 'react'
import { Skeleton } from '../../ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import Typo from '../typo'

interface Props extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  height?: string
  iconLoadingSize?: number
  containerClassName?: string
}
const Image = ({
  src,
  className,
  height = '118px',
  style,
  iconLoadingSize = 40,
  containerClassName,
  ...rest
}: PropsWithChildren<Props>) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  return (
    <div className={cn('tw-relative tw-bg-slate-100 tw-w-full tw-overflow-hidden tw-rounded-md', containerClassName)}>
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
            <Skeleton className={cn('tw-w-full', className)} style={{ height }} />
          </div>
        }
      />

      <If
        isShow={isError}
        element={
          <div className="tw-relative tw-w-full">
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
            <div className={cn('tw-w-full tw-bg-gray-50', className)} style={{ height }}></div>
          </div>
        }
      />

      <If
        isShow={!isError}
        element={
          <img
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              console.log('load image error')
              setIsError(true)
            }}
            loading="lazy"
            src={src}
            className={cn('tw-m-auto tw-object-cover', className, {
              '!tw-h-0': !imgLoaded,
            })}
            style={{ height, ...style }}
            {...rest}
          />
        }
      />
    </div>
  )
}
export default React.memo(Image)
