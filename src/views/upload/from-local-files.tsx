import React from 'react'
import { ORG_ID, TEMPLATE_ID } from '@/src/configs'
import UppyDashboard from '@/src/lib/uppy/dashboard'
import {} from 'react-dropzone'

function LocalFilesUpload() {
  return <UppyDashboard organizationId={ORG_ID} templateId={TEMPLATE_ID} />
}
export default LocalFilesUpload
