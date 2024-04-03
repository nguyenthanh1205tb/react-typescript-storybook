import React, { useEffect, useMemo, useState } from 'react'
import { getOrganizationId } from '@/src/lib/utils/auth'
import { convertBytesToLargerUnit } from '@/src/lib/utils/media'
import { Form, Input, Modal, Table, Tag, notification } from 'antd'
import dayjs from 'dayjs'
import _debounce from 'lodash/debounce'
import { SyncRequest, WatchFile, useWatchFolder } from 'src/hooks/useWatchFolder'
import { RefreshCcw, Undo2 } from 'lucide-react'

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

  const { getWatchFolderFiles, sync: syncWatchFolder } = useWatchFolder()
  const [transcodeSelected, setTranscodeSelected] = useState<string>()
  const [filesSelected, setFilesSelected] = useState<RowSelectionFile[]>([])
  const [filteredData, setFilteredData] = useState<{
    name?: string
    date?: string
    path?: string[]
  }>({})

  const syncMutation = syncWatchFolder()
  const getWatchFolderResult = getWatchFolderFiles({
    folder: filteredData.path,
    fileName: filteredData.name,
  })

  // const syncApproval = useMemo(() => {
  //   return (
  //     typeof organization !== undefined &&
  //     (transcodeSelected || props.type === ContentType.Image) &&
  //     filesSelected.length > 0
  //   )
  // }, [organization, transcodeSelected, filesSelected, props.type])

  const clearSyncRequest = () => {
    setFilesSelected([])
  }

  const onChangeSelectedFiles = (newFilesSelected: RowSelectionFile[]) => {
    // if (getWatchFolderResult.isLoading || syncMutation.isLoading) return
    if (getWatchFolderResult.isLoading) return
    setFilesSelected(newFilesSelected.filter(item => !item.isDirectory && item.mime.length))
  }

  // const onChangeTranscodeSelected = (transcode: string) => {
  //   if (getWatchFolderResult.isLoading) return
  //   setTranscodeSelected(transcode)
  // }

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

  // const onSyncWatchFolder = () => {
  //     if (syncApproval && !syncMutation.isLoading) {
  //       const payload: SyncRequest = {
  //         organizationId: getOrganizationId() as string,
  //         templateId: transcodeSelected as string,
  //         paths: filesSelected.map(o => o.requestPath),
  //       }
  //       syncMutation.mutate(payload)
  //     }
  //   }

  const fillTableRecord = (record: WatchFile, key: number) => {
    return {
      key: key.toString(),
      fileName: record.name,
      fileSize: record.isDirectory ? null : convertBytesToLargerUnit(record.size),
      fileFormat: record.mime,
      requestPath: record.requestPath,
      time: record.isDirectory ? null : dayjs(record.modifiedDate).format('DD MMM YYYY hh:mm'),
      status: record.isDirectory ? '' : !record.used ? 'Active' : 'Used',
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
          <div className="flex items-center justify-between">
            <span>Tên file</span>
            <RefreshCcw />
          </div>
        )
      },
      dataIndex: 'fileName',
      key: 'fileName',
      width: 300,
      ellipsis: true,
      render: (name: string, record: any) => {
        return (
          <div className="grid grid-cols-12 items-center">
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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '190px',
      render: (status: string | undefined) => {
        if (!status) return null
        if (status === 'Active') {
          return <Tag color="warning">Chưa được sử dụng</Tag>
        } else if (status === 'Used') {
          return <Tag color="red">Đã sử dụng</Tag>
        }
        return null
      },
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
      open={isOpen}
      onCancel={onClose}
      title="Tải lên từ watch folder"
      styles={{ body: { width: '100%' } }}
      classNames={{ body: 'max-w-[95vw] lg:max-w-[1200px]' }}>
      <Form layout="vertical" className="mt-4">
        <div className="grid grid-cols-12 gap-0 md:grid-cols-3 md:gap-3">
          <Form.Item className="col-span-12" name="search-file-name">
            <Input.Search
              defaultValue={filteredData.name}
              onChange={e => onChangeFileName(e.target.value)}
              placeholder="Tìm kiếm"
            />
          </Form.Item>
        </div>
      </Form>
      <div className="w-full overflow-auto">
        <Table
          scroll={{ y: 350 }}
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
                return <div className="cursor-pointer">{record.key === TURN_BACK_KEY ? <Undo2 /> : null}</div>
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
