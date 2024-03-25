/* eslint-disable @typescript-eslint/no-explicit-any */
import CorePopover from 'antd/es/popover'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type Props = React.ComponentProps<typeof CorePopover> & {
  component?: any
  content?: any
  componentProps?: Record<string, any>
  isPreventAutoHide?: boolean
}

const Popover = (props: Props) => {
  const { children, component, content, componentProps, isPreventAutoHide, ...p } = props
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const contentC = useMemo(() => {
    if (component) {
      const Component = component
      return <Component hide={hide} handleOpenChange={handleOpenChange} {...componentProps} />
    }
    return content
  }, [props])

  const closePopover = (e: MouseEvent) => {
    const el = popoverRef.current
    if (!el?.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (isPreventAutoHide) {
      return
    }

    if (popoverRef.current) {
      window.document.addEventListener('click', closePopover)
    }
  }, [popoverRef])

  return (
    <CorePopover content={contentC} open={open} onOpenChange={handleOpenChange} {...p}>
      <div ref={popoverRef}>{children}</div>
    </CorePopover>
  )
}

export default Popover
