import Each from '@/src/hooks/each'
import { useListMediaDeleted } from '@/src/hooks/useTrash'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import ItemTrash from './item'
import { FileType } from '@/src/types'
import { Spin } from 'antd'
import Typo from '@/src/components/common/typo'
import If from '@/src/hooks/if'
import { wait } from '@/src/hooks/wait'

interface Props {
  type: FileType
}
function Trash({ type }: PropsWithChildren<Props>) {
  const { getListMediaDeleted } = useListMediaDeleted()
  const [ok, setOk] = useState(false)

  const { data, isLoading } = getListMediaDeleted()

  const domOk = async () => {
    await wait(500)
    setOk(true)
  }

  useEffect(() => {
    domOk()
  }, [])

  return (
    <div className="tw-h-full tw-relative">
      <If
        isShow={isLoading || !ok}
        element={
          <div className="tw-absolute tw-w-full tw-left-0 tw-top-0 tw-h-full tw-flex tw-items-center tw-justify-center tw-bg-white tw-z-50 tw-flex-col">
            <Spin size="large"></Spin>
            <Typo.H3 className="tw-text-slate-400 tw-mt-4">Đang lấy dữ liệu</Typo.H3>
          </div>
        }
      />
      <div className="tw-grid tw-gap-4 tw-w-full tw-transition-all tw-grid-cols-8 tw-pt-4">
        <Each of={data ?? []} render={item => <ItemTrash data={item} type={type} />} />
      </div>
    </div>
  )
}
export default Trash
