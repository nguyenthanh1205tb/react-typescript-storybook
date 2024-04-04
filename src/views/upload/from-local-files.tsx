import React from 'react'
import UppyDashboard from '@/src/lib/uppy/dashboard'
import {} from 'react-dropzone'
import useAppStore from '@/src/stores/useAppStore'

function LocalFilesUpload() {
  const { config } = useAppStore()

  return <UppyDashboard organizationId={config?.organizationId as string} templateId={config?.templateId as string} />
}
export default LocalFilesUpload
