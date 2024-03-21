/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/src/components/ui/button'
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

  const footer = (
    <div className="gap-2 gap-3 tw-flex tw-justify-center tw-items-center">
      <Button key={'cancel-edit-img'}>
        <div onClick={() => console.log(instant?.toDataURL())}>H</div>
      </Button>
      <Button key={'ok-edit-img'}>
        <div onClick={() => console.log(instant?.toDataURL())}>DOWNLOAD</div>
      </Button>
    </div>
  )
  return (
    <Modal
      focusTriggerAfterClose={false}
      open={open}
      onCancel={onClose}
      onOk={onClose}
      rootClassName="modal-image-editor"
      className="xl:tw-max-w-[80vw] 2xl:tw-max-w-[70vw] 2xl:tw-min-w-[70vw] tw-min-w-[80vw]"
      // classNames={{ content: '!tw-p-0 xl:tw-max-h-[750px] 2xl:tw-max-h-[800px]', header: '!tw-p-2' }}
      footer={footer}>
      <div className="">
        <BaseImageEditor getInstance={getInstance} src={mediaSelectedData?.data?.download_addr.uri || ''} />
      </div>
    </Modal>
  )
}

export default ImageEditorModal
