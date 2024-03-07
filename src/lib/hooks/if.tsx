import { PropsWithChildren, ReactNode } from 'react';

interface Props {
  isShow?: boolean;
  element: ReactNode | string;
}
function If({ isShow, element }: PropsWithChildren<Props>) {
  return isShow ? element : null;
}
export default If;
