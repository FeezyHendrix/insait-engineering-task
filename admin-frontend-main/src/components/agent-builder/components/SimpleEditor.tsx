import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnLink,
  Editor,
  EditorProvider,
  Toolbar,
  ContentEditableEvent,
} from 'react-simple-wysiwyg'
import { FaPlay, FaClock } from 'react-icons/fa'

interface SimpleEditorProp {
  value: string
  label?: string
  onChange: (e: ContentEditableEvent) => void
  onBlur?: () => void
  handlePlay?: () => void
  handleDelay?: () => void
}

const SimpleEditor = ({
  value,
  label,
  onChange,
  onBlur,
  handleDelay,
  handlePlay,
}: SimpleEditorProp) => {
  return (
    <div>
      {label && <label className='font-black text-md'>{label}</label>}
      <EditorProvider>
        <Editor
          className='min-h-[120px]'
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <Toolbar>
            {handlePlay && (
              <FaPlay
                onClick={handlePlay}
                className='text-white stroke-black stroke-[10px] text-sm ms-2 me-1'
              />
            )}
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <BtnLink />
            {handleDelay && (
              <div className='flex-1 flex items-center justify-between px-3'>
                <FaClock
                  onClick={handleDelay}
                  className='text-white stroke-black stroke-[10px] text-sm'
                />
              </div>
            )}
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  )
}

export default SimpleEditor
