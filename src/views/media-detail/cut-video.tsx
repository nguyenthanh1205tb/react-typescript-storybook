import { Button } from '@/src/components/ui/button'
import If from '@/src/hooks/if'
import { useTrimVideo } from '@/src/hooks/useMedia'
import VideoEditor from '@/src/lib/video'
import { useTimelineVideo } from '@/src/lib/video/store/useVideo'
import { MediaEntity } from '@/src/types'
import { useQueryClient } from '@tanstack/react-query'
import notification from 'antd/es/notification'
import Modal from 'antd/es/modal/Modal'
import { Loader } from 'lucide-react'
import React, { PropsWithChildren, useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  src: string
  thumb: string
  durations?: number
  data?: MediaEntity
}
function CutVideo({ open, onClose, data, ...props }: PropsWithChildren<Props>) {
  const { resetToDefault, title, barTime } = useTimelineVideo()
  const { trimVideo } = useTrimVideo()
  const queryClient = useQueryClient()

  const { mutate: trimVideoMutation, data: trimData, isPending } = trimVideo(data?.id)

  const onSubmit = () => {
    if (!data || isPending) return
    trimVideoMutation({ title, positions: barTime.map(o => ({ startTimeSeconds: o.start, endTimeSeconds: o.end })) })
  }

  useEffect(() => {
    if (trimData && trimData.success) {
      queryClient.invalidateQueries({
        queryKey: ['getListMedia'],
      })
      notification.info({ message: 'Video đang được xử lý' })
    }
  }, [trimData])

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
          <Button onClick={onSubmit}>
            <If isShow={isPending} element={<Loader size={18} className="tw-animate-spin tw-mr-2" />} /> Hoàn thành
          </Button>
        </div>
      }
      title="Cắt video theo thời lượng"
      className="!tw-max-w-[55vw] !tw-w-[55vw]"
      classNames={{ content: '!tw-px-0', header: '!tw-px-2 !tw-pb-2' }}>
      <VideoEditor {...props} durations={props.durations} />
    </Modal>
  )
}
export default CutVideo
