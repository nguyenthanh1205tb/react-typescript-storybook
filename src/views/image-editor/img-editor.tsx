import ImageEditorBase from '@toast-ui/react-image-editor'
import React, { useEffect } from 'react'
import ImageEditor from 'tui-image-editor'
import 'tui-image-editor/dist/tui-image-editor.css'

interface ImageEditorProps {
  src: string
}

const BaseImageEditor = ({ src }: ImageEditorProps) => {
  const [editImgInstant, setEditImgInstant] = React.useState<ImageEditor | null>(null)

  useEffect(() => {
    const targetElement = document.querySelector('#tui-image-editor')
    console.log('targetElement', targetElement)

    if (targetElement instanceof HTMLElement) {
      const instance = new ImageEditor(targetElement, {
        includeUI: {
          loadImage: {
            path: src,
            name: 'SampleImage',
          },
          menu: ['shape', 'filter'],
          initMenu: 'filter',
          uiSize: {
            width: '1000px',
            height: '700px',
          },
          menuBarPosition: 'bottom',
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70,
        },
      })
      console.log('instance', instance)
      setEditImgInstant(instance)
    } else {
      console.error("Target element '#tui-image-editor' not found.")
    }
  }, [])

  useEffect(() => {
    editImgInstant?.loadImageFromURL(src, 'SampleImage')
  }, [editImgInstant, src])

  const imgEditorProps = {
    includeUI: {
      initMenu: 'shape',
      uiSize: {
        height: '700px',
        width: '1000px',
      },
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
  }

  return <ImageEditorBase {...imgEditorProps} />
}

export default BaseImageEditor
