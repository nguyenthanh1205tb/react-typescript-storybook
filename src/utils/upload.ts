/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'

export function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',')
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

  return new Blob([ia], { type: mimeString })
}

export function uploadThumb(file: File, authToken: string, organizationId: string) {
  // const fileData = DataURIToBlob(file)

  const formData = new FormData()

  formData.append('file', file, `${file.name}.png`)
  formData.append('organizationId', organizationId)

  const uploadEndpoint = `https://uat.upload.plcplatform.net/upload?organizationId=${organizationId}`

  return fetch(uploadEndpoint, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(error => {
      notification.error({
        message: error || 'Upload failed',
      })
    })
}
