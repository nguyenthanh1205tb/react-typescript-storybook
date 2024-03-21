import useAppStore from '@/src/stores/useAppStore'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import ImgageEditor from './img-editor'

interface ImageEditorModalProps {
  open: boolean
  onClose: () => void
}

const ImageEditorModal = ({ open, onClose }: ImageEditorModalProps) => {
  const { mediaSelectedData } = useAppStore()
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      className="xl:tw-max-w-[80vw] 2xl:tw-max-w-[60vw] 2xl:tw-min-w-[60vw] tw-min-w-[80vw]"
      classNames={{ content: '!tw-p-0 xl:tw-max-h-[750px] 2xl:tw-max-h-[800px]', header: '!tw-p-2' }}>
      <div className="">
        <ImgageEditor src={mediaSelectedData?.data?.avatar_thumb?.uri || ''} />
      </div>
    </Modal>
  )
}

export default ImageEditorModal
