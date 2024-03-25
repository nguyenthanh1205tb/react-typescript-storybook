import { Button } from '@/src/components/ui/button'
import VideoEditor from '@/src/lib/video'
import Modal from 'antd/es/modal/Modal'
import React, { PropsWithChildren } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  src: string
  thumb: string
}
function CutVideo({ open, onClose, ...props }: PropsWithChildren<Props>) {
  return (
    <Modal
      centered
      open={open}
      onCancel={onClose}
      footer={
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-4">
          <Button className="tw-bg-transparent !tw-text-black tw-border">Huỷ bỏ</Button>
          <Button>Hoàn thành</Button>
        </div>
      }
      title="Cắt video theo thời lượng"
      className="!tw-max-w-[60vw] !tw-w-[60vw]"
      classNames={{ content: '!tw-px-0', header: '!tw-px-2 !tw-pb-2' }}>
      <VideoEditor {...props} />
    </Modal>
  )
}
export default CutVideo
