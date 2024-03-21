/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import tui from 'tui-image-editor'
import 'tui-image-editor/dist/tui-image-editor.css'

interface ImageEditorProps {
  src: string
}

const myTheme: any = {
  'header.display': 'none',
}

const imgEditorProps: tuiImageEditor.IOptions = {
  includeUI: {
    menuBarPosition: 'left',
    usageStatistics: false,
    // menu: ['shape', 'filter', 'text', 'mask', 'icon', 'draw', 'crop', 'flip', 'rotate', 'reset'],
    theme: myTheme,
    initMenu: 'rotate',
    // initMenu: 'shape',
    uiSize: {
      height: '700px',
      width: '1200px',
    },
  },
  selectionStyle: {
    rotatingPointOffset: 70,
  },
  cssMaxWidth: 700,
  cssMaxHeight: 500,
}
const BaseImageEditor = ({ src }: ImageEditorProps) => {
  const [instant, setInstant] = React.useState<any>()

  useEffect(() => {
    // const editorInstance: ImageEditorClass = ref?.current?.getInstance()

    const imageEditor = new tui('#tui-image-editor-container', {
      ...imgEditorProps,
      includeUI: {
        ...imgEditorProps.includeUI,
        loadImage: {
          path: src,
          name: 'mefi-package',
        },
      },
    })
    setInstant(imageEditor)
  }, [])

  // return <ImageEditor ref={ref} {...imgEditorProps} />
  return <div id="tui-image-editor-container"></div>
}

export default BaseImageEditor
