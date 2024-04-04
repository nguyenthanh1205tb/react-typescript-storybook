import React, { useEffect, useMemo, useState } from 'react'
import { convertBytesToLargerUnit } from '@/src/lib/utils/media'
import _debounce from 'lodash/debounce'
import { SyncRequest, WatchFile, useWatchFolder } from 'src/hooks/useWatchFolder'
import { RefreshCcw, Undo2 } from 'lucide-react'
import Table from 'antd/es/table'
import notification from 'antd/es/notification'
import Modal from 'antd/es/modal/Modal'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import moment from 'moment'
import useAppStore from '@/src/stores/useAppStore'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface RowSelectionFile extends WatchFile {
  key: string
}

const TURN_BACK_KEY = 'back'

const UploadFromWatchFolder = (props: Props) => {
  const { isOpen, onClose } = props
  const { config } = useAppStore()
  const { getWatchFolderFiles, sync: syncWatchFolder } = useWatchFolder()
  const [filesSelected, setFilesSelected] = useState<RowSelectionFile[]>([])
  const [filteredData, setFilteredData] = useState<{
    name?: string
    date?: string
    path?: string[]
  }>({})

  const canSync = useMemo(() => {
    if (!config) return false
    if (!config.templateId || config.templateId === '') return false
    if (!config.organizationId || config.organizationId === '') return false
    if (filesSelected.length <= 0) return false
    return true
  }, [config, filesSelected])

  const syncMutation = syncWatchFolder()
  const getWatchFolderResult = getWatchFolderFiles({
    folder: filteredData.path,
    fileName: filteredData.name,
  })

  const clearSyncRequest = () => {
    setFilesSelected([])
  }

  const onChangeSelectedFiles = (newFilesSelected: RowSelectionFile[]) => {
    if (getWatchFolderResult.isLoading || syncMutation.isPending) return
    setFilesSelected(newFilesSelected.filter(item => !item.isDirectory))
  }

  const onChangeFileName = _debounce((v: string) => {
    setFilteredData(prev => ({
      ...prev,
      name: v.trim(),
    }))
  }, 1000)

  const onOpenFolder = (folderName: string) => {
    setFilteredData(prev => ({
      ...prev,
      path: [...(prev.path ?? []), folderName],
    }))
  }

  const backFolder = () => {
    setFilteredData(prev => ({
      ...prev,
      path: prev.path?.slice(0, prev.path.length - 1),
    }))
  }

  const onSyncWatchFolder = () => {
    if (!syncMutation.isPending && canSync) {
      const payload: SyncRequest = {
        organizationId: config?.organizationId as string,
        templateId: config?.templateId as string,
        paths: filesSelected.map(o => o.requestPath),
      }
      syncMutation.mutate(payload)
    }
  }

  const fillTableRecord = (record: WatchFile, key: number) => {
    return {
      key: key.toString(),
      fileName: record.name,
      fileSize: record.isDirectory ? null : convertBytesToLargerUnit(record.size),
      fileFormat: record.mime,
      requestPath: record.requestPath,
      time: record.isDirectory ? null : moment(record.modifiedDate).format('dddd, DD/MM/YYYY HH:mm:ss'),
      isDirectory: record.isDirectory,
    }
  }

  const dataFiltered = useMemo(() => {
    if (!getWatchFolderResult.data) return []
    const list = []
    const d = getWatchFolderResult.data.data
    for (let i = 0; i < d?.length; i++) {
      if (d[i]?.isDirectory) {
        list.unshift(fillTableRecord(d[i], i))
      } else {
        list.push(fillTableRecord(d[i], i))
      }
    }
    if (filteredData.path && filteredData.path.length) {
      return [
        {
          key: TURN_BACK_KEY,
          fileName: '..',
          isDirectory: true,
        },
        ...list,
      ]
    }
    return list
  }, [getWatchFolderResult.data])

  const columns = [
    {
      title: () => {
        return (
          <div className="tw-flex tw-items-center tw-justify-between">
            <span>Tên file</span>
            <RefreshCcw size={20} className="tw-cursor-pointer" onClick={() => getWatchFolderResult.refetch()} />
          </div>
        )
      },
      dataIndex: 'fileName',
      key: 'fileName',
      width: 300,
      ellipsis: true,
      render: (name: string) => {
        return (
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <span className="col-span-11 ml-3 line-clamp-1 leading-7">{name}</span>
          </div>
        )
      },
    },
    {
      title: 'Kích thước',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 130,
    },
    {
      title: 'Định dạng',
      dataIndex: 'fileFormat',
      key: 'fileFormat',
      width: 200,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'time',
      key: 'time',
      width: '190px',
      render: (time: string) => <p className="tw-m-0 tw-p-0 tw-capitalize">{time}</p>,
    },
  ]

  useEffect(() => {
    if (syncMutation.isSuccess) {
      clearSyncRequest()
      notification.success({
        message: 'File đang được xử lý',
      })
    }
  }, [syncMutation.isSuccess])

  return (
    <Modal
      destroyOnClose
      open={isOpen}
      onCancel={onClose}
      centered
      title="Tải lên từ watch folder"
      className="tw-max-w-[95vw] xl:tw-max-w-[75vw] !tw-w-full tw-max-h-[95vh] tw-overflow-hidden"
      classNames={{ mask: 'tw-backdrop-blur-md' }}
      footer={
        <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
          <Button onClick={onClose} variant="outline">
            Huỷ
          </Button>
          <Button disabled={!canSync} onClick={onSyncWatchFolder}>
            Tải lên
          </Button>
        </div>
      }>
      <div className="tw-w-full tw-mb-4">
        <Input
          defaultValue={filteredData.name}
          onChange={e => onChangeFileName(e.target.value)}
          placeholder="Tìm kiếm"
        />
      </div>
      <div className="tw-w-full tw-overflow-auto tw-min-h-[500px]">
        <Table
          scroll={{ y: 450 }}
          loading={getWatchFolderResult.isLoading || getWatchFolderResult.isFetching}
          onRow={record => {
            return record.isDirectory
              ? {
                  onClick: () => (record.key === TURN_BACK_KEY ? backFolder() : onOpenFolder(record.fileName)),
                  className: 'cursor-pointer',
                }
              : {}
          }}
          rowSelection={{
            selectedRowKeys: filesSelected.map(o => o.key),
            onChange: (_, list) => onChangeSelectedFiles(list as unknown as RowSelectionFile[]),
            fixed: true,
            renderCell: (_value, record, _index, originNode) => {
              if (record.isDirectory)
                return <div className="tw-cursor-pointer">{record.key === TURN_BACK_KEY ? <Undo2 /> : null}</div>
              // const fileType = (record as any).fileFormat?.split('/')[0] as string
              return originNode
            },
          }}
          dataSource={dataFiltered}
          columns={columns}
          className="dashboard-table"
          id="custom-scrollbar"
          pagination={false}
        />
      </div>
    </Modal>
  )
}

export default UploadFromWatchFolder
