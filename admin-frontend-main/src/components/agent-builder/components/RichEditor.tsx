import React, { useState, useCallback } from 'react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaStrikethrough,
  FaLink,
} from 'react-icons/fa'
import EditorInput from './EditorInput'
import {  Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

interface ToolbarButtonProps {
  active?: boolean
  onMouseDown: (e: React.MouseEvent) => void
  children: React.ReactNode
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active,
  onMouseDown,
  children,
}) => {
  return (
    <button
      className={`p-2 rounded hover:bg-gray-100 ${
        active ? 'text-blue-500' : 'text-gray-700'
      }`}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  )
}

const RichEditor: React.FC<{
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder: string
  characters?: string[]
  className?: string
}> = ({
  value,
  onChange,
  onBlur,
  placeholder = '',
  characters = [],
  className = '',
}) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [editorRef, setEditorRef] = useState<ReactEditor | null>(null)

  const getEditor = useCallback(() => {
    return editorRef
  }, [editorRef])

  const toggleMark = (
    format: 'bold' | 'italic' | 'underline' | 'strikethrough'
  ) => {
    const editor = getEditor()
    if (!editor) return

    const isActive = isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const isMarkActive = (editor: ReactEditor, format: string) => {
    const marks: any = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }

  const insertLink = () => {
    const editor = getEditor()
    if (!editor || !linkUrl) return

    const { selection } = editor
    if (!selection) return

    const link: any = {
      type: 'link',
      url: linkUrl,
      children: [{ text: Editor.string(editor, selection) }],
    }

    Transforms.insertNodes(editor, link)
    setIsLinkDialogOpen(false)
    setLinkUrl('')
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      <div className='flex items-center gap-2 p-2 border-b border-gray-300'>
        <ToolbarButton
          active={(editorRef && isMarkActive(editorRef, 'bold')) || false}
          onMouseDown={e => {
            e.preventDefault()
            toggleMark('bold')
          }}
        >
          <FaBold />
        </ToolbarButton>
        <ToolbarButton
          active={(editorRef && isMarkActive(editorRef, 'italic')) || false}
          onMouseDown={e => {
            e.preventDefault()
            toggleMark('italic')
          }}
        >
          <FaItalic />
        </ToolbarButton>
        <ToolbarButton
          active={(editorRef && isMarkActive(editorRef, 'underline')) || false}
          onMouseDown={e => {
            e.preventDefault()
            toggleMark('underline')
          }}
        >
          <FaUnderline />
        </ToolbarButton>
        <ToolbarButton
          active={
            (editorRef && isMarkActive(editorRef, 'strikethrough')) || false
          }
          onMouseDown={e => {
            e.preventDefault()
            toggleMark('strikethrough')
          }}
        >
          <FaStrikethrough />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={e => {
            e.preventDefault()
            setIsLinkDialogOpen(true)
          }}
        >
          <FaLink />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={e => {
            e.preventDefault()
            // Add numbered list handling
          }}
        >
          <FaListOl />
        </ToolbarButton>
      </div>

      <EditorInput
        ref={(editor: any) => setEditorRef(editor)}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        characters={characters}
        className='!min-h-[160px] outline-none'
      />

      {isLinkDialogOpen && (
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-4 rounded-lg'>
            <input
              type='text'
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder='Enter URL'
              className='border p-2 rounded'
            />
            <div className='flex gap-2 mt-2'>
              <button
                onClick={insertLink}
                className='px-4 py-2 bg-blue-500 text-white rounded'
              >
                Insert
              </button>
              <button
                onClick={() => setIsLinkDialogOpen(false)}
                className='px-4 py-2 bg-gray-300 rounded'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RichEditor
