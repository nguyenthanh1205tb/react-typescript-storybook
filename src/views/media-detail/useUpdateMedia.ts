/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'
import useAppStore from '@/src/stores/useAppStore'
import { MediaCodec, MediaPacks, MenuImgEditorType, Video } from '@/src/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import notification from 'antd/es/notification'
import React, { useCallback } from 'react'

export const videoUrl = (d?: Video) => {
  if (!d) return
  const defaultUri = d?.uri
  const hls = d.play_url.hls
  if (!hls || !hls.length) return defaultUri
  const item = hls.find(val => val.codec === MediaCodec.H264 && val.pack === MediaPacks.HLS)
  if (!item) return defaultUri
  return item.uri
}

export const getUrlThumb = (url: string, config: any) => {
  const orgId = config?.organizationId
  const pattern = new RegExp(`${orgId}.*`)
  const match = url.match(pattern)
  return match ? match[0] : url
}

const useUpdateMedia = () => {
  const [showModal, setShowModal] = React.useState(false)
  const [avatarSelected, setAvatarSelected] = React.useState<string>('')
  const [imageEditorState, setImageEditState] = React.useState<{
    show: boolean
    initMenu: MenuImgEditorType
  }>({
    show: false,
    initMenu: 'rotate',
  })
  const { mediaSelectedID, mediaSelectedData, setMediaSelectedData, config } = useAppStore()

  // const onUploadThumb = (file: File) => {
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   fetch(UPLOAD_ENDPOINT, {
  //     method: 'POST',
  //     body: formData,
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('mf-token')}`,
  //     },
  //   }).then(response => response.json())
  // }

  const toggleImageEditor = (initMenu?: MenuImgEditorType) => {
    setImageEditState({
      show: !imageEditorState.show,
      initMenu: initMenu || 'rotate',
    })
  }

  const queryClient = useQueryClient()

  const { mutateAsync: onSubmitMedia } = useMutation({
    mutationFn: (values: any) =>
      request<any>(APIConfigs(), {
        url: `/media/${mediaSelectedID}`,
        method: 'PUT',
        body: values,
      }),
    onSuccess: () => {
      notification.success({
        message: 'Cập nhật thành công',
      })
      queryClient.invalidateQueries({
        queryKey: ['getListMedia'],
      })
    },
  })

  const handleUpdateMedia = useCallback((values: any) => {
    onSubmitMedia({
      name: values?.name,
      description: values?.description,
      categoryIds: values?.categoryIds,
      tags: values?.tags,
    })
  }, [])

  const onSubmitThumb = useCallback(() => {
    if (avatarSelected) {
      onSubmitMedia({
        avatar: getUrlThumb(avatarSelected, config),
      }).then(() => {
        setAvatarSelected('')
        setShowModal(false)
      })
    } else {
      notification.info({
        message: 'Chưa chọn ảnh',
      })
    }
  }, [avatarSelected, config, mediaSelectedData])

  return {
    showModal,
    avatarSelected,
    imageEditorState,
    mediaSelectedID,
    mediaSelectedData,
    setAvatarSelected,
    setImageEditState,
    setShowModal,
    setMediaSelectedData,
    handleUpdateMedia,
    onSubmitThumb,
    toggleImageEditor,
  }
}

export default useUpdateMedia
