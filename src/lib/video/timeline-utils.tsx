import { TimelineData } from '@/src/types'

const useTimelineSliceHelpers = (
  slices: TimelineData[],
  setSlices: React.Dispatch<React.SetStateAction<TimelineData[]>>,
) => {
  const showMessage = () => console.log('SHOWN MESSAGE!')

  //Removes last slice from list (TODO: NEED TO PASS ID TO REMOVE PARTICULAR)
  const removeSlice = () => {
    const _r = [...slices]
    _r.pop()
    setSlices(_r)
    alert('Removed!')
  }

  return { showMessage, removeSlice }
}

export { useTimelineSliceHelpers }
