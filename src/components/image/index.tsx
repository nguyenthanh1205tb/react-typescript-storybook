import { cn } from '@/src/lib/utils';
import React, { PropsWithChildren } from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}
function Image({ src, className, ...rest }: PropsWithChildren<Props>) {
  return (
    <img
      src={src}
      className={cn('tw-object-cover tw-w-full tw-rounded-lg', className)}
      {...rest}
    />
  );
}
export default Image;
