import { PropsWithChildren, ReactNode } from 'react'

type ElementRendered = () => ReactNode | string

interface Props {
  isShow: boolean
  element: ReactNode | ElementRendered
}
function If({ isShow, element }: PropsWithChildren<Props>) {
  return isShow ? (typeof element === 'function' ? element() : element) : null
}
export default If
