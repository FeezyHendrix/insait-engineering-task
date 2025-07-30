import { NodeComponentProps } from '@/types/agent-builder'
import React, { useState, useEffect, useRef } from 'react'

const NoteNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: NodeComponentProps) => {
  const [nodeContent, setNodeContent] = useState({
    message: data.message || '',
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setNodeContent(prev => ({ ...prev, message: newMessage }))
    adjustTextareaHeight()
    updateNodeData(id, { ...nodeContent, message: newMessage })
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [nodeContent.message])

  useEffect(() => {
    if (data) {
      setNodeContent({
        message: data.message || '',
      })
    }
  }, [data])

  return (
    <div
      className='relative group'
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
        onClick && onClick()
      }}
    >
      <div
        className='
        min-w-[300px]
        min-h-[200px]
        bg-blue-100
        resize
        overflow-hidden
        cursor-pointer
      '
      >
        <textarea
          ref={textareaRef}
          value={nodeContent.message}
          onChange={handleTextChange}
          className='
            w-full 
            h-full
            min-h-[200px]
            p-2
            bg-transparent
            text-black 
            resize-none
            overflow-hidden
            focus:outline-none
            placeholder:text-gray-500
          '
          placeholder='Enter your note here...'
        />
      </div>
    </div>
  )
}

export default NoteNode
