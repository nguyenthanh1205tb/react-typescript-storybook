const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const offset = -7 * 60 // Offset in minutes
  date.setMinutes(date.getMinutes() + offset)

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour24: true,
    timeZone: 'UTC',
  }

  // @ts-ignore
  return date.toLocaleString('vi-VN', options).replace(',', '')
}

function convertDuration(seconds: number) {
  // Calculate hours:
  const hours = Math.floor(seconds / 3600)

  // Calculate remaining minutes:
  const remainingMinutes = Math.floor((seconds % 3600) / 60)

  // Calculate remaining seconds:
  const remainingSeconds = Math.floor(seconds % 60)

  // Pad values with zeros for consistent formatting:
  const paddedHours = hours.toString().padStart(2, '0')
  const paddedMinutes = remainingMinutes.toString().padStart(2, '0')
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0')

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
}

export { formatDate, convertDuration }
