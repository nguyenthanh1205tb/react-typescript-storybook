import Modal from 'antd/es/modal/Modal'
import React from 'react'

interface ImageEditorModalProps {
  open: boolean
  onClose: () => void
}

const ImageEditorModal = ({ open, onClose }: ImageEditorModalProps) => {
  return (
    <Modal open={open} onCancel={onClose} onOk={onClose}>
      <div>Image Editor</div>
    </Modal>
  )
}

export default ImageEditorModal
