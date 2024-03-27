/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/src/components/ui/button'
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'
import useAppStore from '@/src/stores/useAppStore'
import { MenuImgEditorType } from '@/src/types'
import { DataURIToBlob, onUploadFile } from '@/src/utils/upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React, { useCallback } from 'react'
import ImageEditor from 'tui-image-editor'
import BaseImageEditor from './img-editor'

interface ImageEditorModalProps {
  imageEditorState: {
    show: boolean
    initMenu: MenuImgEditorType
  }
  onClose: () => void
}

interface CustomUI extends tuiImageEditor.UI {
  changeMenu: (menu: MenuImgEditorType) => void
  submenu: MenuImgEditorType
}

interface ImgEditorInstance extends Omit<ImageEditor, 'ui'> {
  ui: CustomUI
}

const ImageEditorModal = ({ imageEditorState, onClose }: ImageEditorModalProps) => {
  const { mediaSelectedData, config } = useAppStore()
  const [instance, setInstance] = React.useState<ImgEditorInstance>()
  const getInstance = (i: any) => setInstance(i)

  const queryClient = useQueryClient()

  const { mutateAsync: onCreateMedia } = useMutation({
    mutationFn: (values: any) =>
      request<any>(APIConfigs(), {
        url: `/media`,
        method: 'POST',
        body: values,
      }),
    onSuccess: () => {
      notification.success({
        message: 'Cập nhật thành công',
      })
      onClose()
      queryClient.invalidateQueries({
        queryKey: ['getListMedia'],
      })
    },
  })

  const handleCancelCrop = () => {
    instance?.stopDrawingMode()
    instance?.ui.changeMenu('crop')
  }

  const handleCreateMedia = useCallback(async () => {
    const res = await onUploadFile(DataURIToBlob(instance?.toDataURL() as any), config?.organizationId as any)
    onCreateMedia({
      name: `[EDIT] ${mediaSelectedData?.data?.name}`,
      fileName: res?.filename,
      ...res,
    })
  }, [onCreateMedia, mediaSelectedData, instance, config])

  const onSubmitEditImg = useCallback(async () => {
    try {
      const currentMenu = instance?.ui.submenu
      switch (currentMenu) {
        case 'crop':
          const cropSize = instance?.getCropzoneRect()
          await instance?.crop(cropSize as any)
          handleCreateMedia()
          break
        default:
          handleCreateMedia()
          break
      }
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra',
      })
    }
  }, [instance, handleCreateMedia])

  const footer = (
    <div className="tw-gap-3 tw-flex tw-justify-center tw-items-center tw-pb-3">
      <Button className="!tw-bg-slate-400 hover:!tw-bg-slate-500" key={'cancel-edit-img'}>
        <div
          onClick={() => {
            handleCancelCrop()
            onClose()
          }}>
          Huỷ
        </div>
      </Button>
      <Button className="!tw-bg-lime-500 hover:!tw-bg-lime-600" key={'ok-edit-img'}>
        <div onClick={onSubmitEditImg}>Hoàn thành</div>
      </Button>
    </div>
  )
  return (
    <Modal
      focusTriggerAfterClose={false}
      open={imageEditorState.show}
      onCancel={onClose}
      onOk={onClose}
      rootClassName="modal-image-editor"
      className="xl:tw-max-w-[80vw] 2xl:tw-max-w-[70vw] 2xl:tw-min-w-[70vw] tw-min-w-[80vw]"
      // classNames={{ content: '!tw-p-0 xl:tw-max-h-[750px] 2xl:tw-max-h-[800px]', header: '!tw-p-2' }}
      footer={footer}>
      <div className="">
        <BaseImageEditor
          initMenu={imageEditorState.initMenu}
          getInstance={getInstance}
          src={mediaSelectedData?.data?.download_addr.uri || ''}
        />
      </div>
    </Modal>
  )
}

export default ImageEditorModal
