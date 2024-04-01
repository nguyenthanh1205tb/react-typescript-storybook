import useAppStore from '@/src/stores/useAppStore'
import { MediaPackageType } from '@/src/types'
import { Button, Form, notification } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import TextArea from 'antd/es/input/TextArea'
import Modal from 'antd/es/modal/Modal'
import React, { useState } from 'react'
import { createDownloadClient } from './download'
interface Props {
  isOpen: boolean
  onCancel: () => void
  type?: MediaPackageType
}

const UploadFromUrlModal = (props: Props) => {
  const { isOpen, onCancel, type } = props
  const [form] = Form.useForm()
  const links = Form.useWatch('urls', form)
  const transcodeTemplateId = Form.useWatch('transcodeTemplate', form)
  const { config } = useAppStore()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const validateNotFbAndYt = (text: string) => {
    const urls = text
      .trim()
      .split('\n')
      .map((url: string) => url.trim())

    for (let url of urls) {
      url = url.trim()
      if (FB_YT_IN_STRING_REGEX.test(url)) {
        return false
      }
    }

    return true
  }

  const handleSubmit = async (values: any) => {
    const urlStr: string = values?.urls
    if (!urlStr) return
    if (!config?.organizationId || !urlStr || urlStr === '' || form.getFieldError('urls')?.length) return

    const urls = urlStr
      ?.trim()
      ?.split('\n')
      ?.map((url: string) => url?.trim())

    await createDownloadClient({
      organizationId: config?.organizationId,
      templateId: transcodeTemplateId,
      urls,
    })
      .then(() => {
        notification.success({
          message: 'Tải lên thành công',
        })
        onCancel()
      })
      .catch(() => {
        notification.error({
          message: 'Lỗi không xác định',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })

    setIsLoading(true)
  }
  const footer = (
    <div className="tw-gap-3 tw-flex tw-justify-center tw-items-center tw-pb-3">
      <Button className="!tw-bg-slate-400 hover:!tw-bg-slate-500" key={'cancel-edit-img'}>
        <div
          onClick={() => {
            console.log('first')
          }}>
          Huỷ
        </div>
      </Button>
      <Button className="!tw-bg-lime-500 hover:!tw-bg-lime-600" key={'ok-edit-img'}>
        <div onClick={() => console.log('sda')}>Hoàn thành</div>
      </Button>
    </div>
  )
  return (
    <Modal footer={footer} open={isOpen} onCancel={onCancel} title={'Upload từ URL'}>
      <Form layout="vertical" form={form} onFinish={value => console.log(value)}>
        <FormItem name="urls" label={'URL'}>
          <TextArea
            rows={10}
            placeholder={
              type === MediaPackageType.VIDEO
                ? 'Nhập một hoặc nhiều URL, cách nhau bằng cách xuống dòng\nLoại URL được hỗ trợ: Mp4,jpg,jpeg,png\nTối đa 10 link.\n\n\n\n\n\n\n'
                : 'Nhập một hoặc nhiều URL, cách nhau bằng cách xuống dòng\nLoại URL được hỗ trợ: Mp4,jpg,jpeg,png\nTối đa 10 link.\n\n\n\n\n\n\n'
            }
          />
        </FormItem>
      </Form>
    </Modal>
  )
}

export default UploadFromUrlModal
