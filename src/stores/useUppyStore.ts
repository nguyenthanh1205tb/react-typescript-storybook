import { create } from 'zustand'

type FileStatus = {
  file: any
  bytesTotal: number
  bytesUploaded: number
  percent?: number
  organizationId: string
}

type State = {
  uploadStatusMap: Record<string, FileStatus>
  updateUploadStatusMap: (fileId: string, file: FileStatus) => void
  clearStatusMap: () => void
}

const useUppyStore = create<State>(set => ({
  uploadStatusMap: {},
  updateUploadStatusMap: (fileId: string, file: FileStatus) => {
    set(state => ({
      uploadStatusMap: { ...state.uploadStatusMap, [fileId]: file },
    }))
  },
  clearStatusMap: () => {
    set(() => ({
      uploadStatusMap: {},
    }))
  },
}))

export default useUppyStore
