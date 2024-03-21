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
    <div className="tw-gap-3 tw-flex tw-justify-center tw-items-center tw-pb-3">
      <Button className="tw-bg-slate-400 hover:tw-bg-slate-500" key={'cancel-edit-img'}>
        <div onClick={() => console.log(instant?.toDataURL())}>Huỷ</div>
      </Button>
      <Button className="tw-bg-lime-500 hover:tw-bg-lime-600" key={'ok-edit-img'}>
        <div onClick={() => console.log(instant?.toDataURL())}>Hoàn thành</div>
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
