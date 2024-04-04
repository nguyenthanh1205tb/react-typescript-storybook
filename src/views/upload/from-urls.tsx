import { FB_YT_IN_STRING_REGEX } from '@/src/configs'
import useAppStore from '@/src/stores/useAppStore'
import { MediaPackageType } from '@/src/types'
import notification from 'antd/es/notification'
import Form from 'antd/es/form'
import FormItem from 'antd/es/form/FormItem'
import TextArea from 'antd/es/input/TextArea'
import Modal from 'antd/es/modal/Modal'
import React, { useCallback, useState } from 'react'
import { createDownloadClient } from '../../utils/download'
import { Button } from '@/src/components/ui/button'
interface Props {
  isOpen: boolean
  onCancel: () => void
  type?: MediaPackageType
}

const UploadFromUrlModal = (props: Props) => {
  const { isOpen, onCancel, type } = props
  const [form] = Form.useForm()
  const links = Form.useWatch('urls', form)
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

  const handleSubmit = useCallback(
    // NOTE need remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (values: any) => {
      const urlStr: string = values?.urls
      if (!urlStr) return
      if (!config?.organizationId || !urlStr || urlStr === '' || form.getFieldError('urls')?.length) return

      const urls = urlStr
        ?.trim()
        ?.split('\n')
        ?.map((url: string) => url?.trim())

      await createDownloadClient(
        {
          organizationId: config?.organizationId,
          templateId: config.templateId,
          urls,
        },
        config.downloadEndpoint,
      )
        .then(() => {
          notification.success({
            message: 'Tải lên thành công',
          })
          onCancel()
          setIsLoading(false)
          form.resetFields()
        })
        .catch(() => {
          notification.error({
            message: 'Lỗi không xác định',
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [config, createDownloadClient],
  )
  const footer = (
    <div className="tw-gap-3 tw-flex tw-justify-center tw-items-center tw-pb-3">
      <Button
        className="!tw-bg-slate-400 !tw-border-none hover:!tw-bg-slate-500 hover:!tw-text-black hover:!tw-border-none"
        key={'cancel-upload-url'}>
        <div
          onClick={() => {
            onCancel()
            form.resetFields()
          }}>
          Huỷ
        </div>
      </Button>
      <Button disabled={!links} className="!tw-text-white !tw-bg-lime-500 hover:!tw-bg-lime-600" key={'ok-upload-url'}>
        <div onClick={() => form.submit()}>Hoàn thành</div>
      </Button>
    </div>
  )
  return (
    <Modal footer={footer} open={isOpen} onCancel={onCancel} title={'Upload từ URL'}>
      <Form layout="vertical" disabled={isLoading} form={form} onFinish={handleSubmit}>
        <FormItem
          name="urls"
          label={'URL'}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập URL',
            },
            {
              validator: async (_, value) => {
                const isOk = validateNotFbAndYt(value)
                if (isOk) {
                  return Promise.resolve()
                }
                return Promise.reject('Không hỗ trợ định dạng URL này')
              },
            },
          ]}>
          <TextArea
            rows={type === MediaPackageType.VIDEO ? 8 : 12}
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
