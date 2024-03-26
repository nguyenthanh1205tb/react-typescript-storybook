import { Button } from '@/src/components/ui/button'
import VideoEditor from '@/src/lib/video'
import { useTimelineVideo } from '@/src/lib/video/store/useVideo'
import Modal from 'antd/es/modal/Modal'
import React, { PropsWithChildren } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  src: string
  thumb: string
  durations?: number
}
function CutVideo({ open, onClose, ...props }: PropsWithChildren<Props>) {
  const { resetToDefault } = useTimelineVideo()
  return (
    <Modal
      destroyOnClose
      centered
      open={open}
      onCancel={() => {
        onClose()
        resetToDefault()
      }}
      footer={
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-4">
          <Button className="tw-bg-transparent !tw-text-black tw-border">Huỷ bỏ</Button>
          <Button>Hoàn thành</Button>
        </div>
      }
      title="Cắt video theo thời lượng"
      className="!tw-max-w-[60vw] !tw-w-[60vw]"
      classNames={{ content: '!tw-px-0', header: '!tw-px-2 !tw-pb-2' }}>
      <VideoEditor {...props} durations={props.durations} />
    </Modal>
  )
}
export default CutVideo
