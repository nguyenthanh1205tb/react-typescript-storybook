/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'

interface Props {
  items: string[]
  avatarSelected: string
  onSelectThumb: (url: string) => void
  onUploadThumb?: (file: File) => void
}

const ListThumb = ({ items, avatarSelected, onSelectThumb, onUploadThumb }: Props) => {
  const [slider, setSli] = React.useState<HTMLDivElement | any>()
  const onChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      onUploadThumb && onUploadThumb(file)
      const reader = new FileReader()
      reader.onload = () => {
        onSelectThumb(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  useEffect(() => {
    setSli(document.getElementById('slider') as HTMLDivElement)
  }, [])

  let mouseDown = false

  let startX: any, scrollLeft: any

  const startDragging = (e: any) => {
    mouseDown = true
    startX = e.pageX - slider?.offsetLeft
    scrollLeft = slider?.scrollLeft
  }

  const stopDragging = () => {
    mouseDown = false
  }

  const move = (e: any) => {
    e.preventDefault()
    if (!mouseDown) {
      return
    }
    const x = e.pageX - slider.offsetLeft
    const scroll = x - startX
    slider.scrollLeft = scrollLeft - scroll
  }
  return (
    <div
      id="slider"
      className="tw-flex tw-overflow-x-scroll tw-py-5 "
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseMove={move}
      onMouseLeave={stopDragging}>
      <div className="tw-flex tw-gap-5 tw-flex-nowrap tw-ml-5">
        <div className="tw-bg-[#303232] tw-relative tw-w-[184px] tw-rounded-lg tw-h-[118px] tw-aspect-video tw-border-2 tw-border-[#a3a3a3]">
          <input onChange={onChangeInputFile} type="file" className="tw-absolute tw-h-full tw-w-full tw-opacity-0" />
          <Plus className="tw-absolute !tw-left-[50%] !tw-top-[50%] tw-translate-x-[-50%] tw-translate-y-[-50%]" />
        </div>

        {items?.map((_, index) => (
          <div
            onClick={() => onSelectThumb(_)}
            key={'thubmnail' + index}
            className={`tw-cursor-pointer tw-border-2  ${avatarSelected === _ ? 'tw-border-red-400' : 'tw-border-[#a3a3a3]'} tw-rounded-lg`}>
            <img
              loading="lazy"
              src={_}
              className="tw-w-[184px] tw-h-[118px] tw-aspect-video tw-max-w-xs tw-rounded-lg tw-shadow-md tw-hover:tw-shadow-xl"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListThumb
