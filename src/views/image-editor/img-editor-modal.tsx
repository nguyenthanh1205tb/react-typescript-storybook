/* eslint-disable @typescript-eslint/no-explicit-any */
import useAppStore from '@/src/stores/useAppStore'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import ImageEditor from 'tui-image-editor'
import BaseImageEditor from './img-editor'

interface ImageEditorModalProps {
  open: boolean
  onClose: () => void
}

const ImageEditorModal = ({ open, onClose }: ImageEditorModalProps) => {
  const { mediaSelectedData } = useAppStore()
  const [instant, setInstant] = React.useState<ImageEditor>()
  const getInstance = (i: any) => setInstant(i)
  return (
    <Modal
      focusTriggerAfterClose={false}
      open={open}
      onCancel={onClose}
      onOk={onClose}
      // className="xl:tw-max-w-[80vw] 2xl:tw-max-w-[60vw] 2xl:tw-min-w-[60vw] tw-min-w-[80vw]"
      // classNames={{ content: '!tw-p-0 xl:tw-max-h-[750px] 2xl:tw-max-h-[800px]', header: '!tw-p-2' }}
    >
      <div className="">
        <BaseImageEditor getInstance={getInstance} src={mediaSelectedData?.data?.download_addr.uri || ''} />
        <div className="" onClick={() => console.log(instant?.toDataURL())}>
          DOWNLOAD
        </div>
      </div>
    </Modal>
  )
}

export default ImageEditorModal
