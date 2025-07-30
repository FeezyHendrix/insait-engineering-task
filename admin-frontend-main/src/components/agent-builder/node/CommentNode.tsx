import React, { useState, useEffect, MouseEventHandler } from 'react'
import Title from '../components/Title'
import { FaRegStickyNote } from 'react-icons/fa'
import { NodeComponentProps } from '@/types/agent-builder'

const CommentNode = ({
  id,
  data,
  selected,
  onClick,
  updateNodeData,
}: NodeComponentProps) => {
  const [nodeData, setNodeData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)
  const threadCount = data.comments?.length || 0

  useEffect(() => {
    if (data) {
      setNodeData(data)
    }
  }, [data])

  const handleLabelClick: MouseEventHandler<HTMLElement> = e => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeData(prevNodeData => ({
      ...prevNodeData,
      label: e.target.value,
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newNodeData = {
        ...nodeData,
        label: e.currentTarget.value,
      }
      updateNodeData(id, newNodeData)
    }
  }

  const handleSubmitData = () => {
    updateNodeData(id, nodeData)
  }

  // Collapsed view (just the number)
  if (!selected) {
    return (
      <div onClick={onClick} className='cursor-pointer'>
        <div className='flex items-center justify-center bg-blue-500 text-white rounded-full w-8 h-8 text-base'>
          {threadCount}
        </div>
      </div>
    )
  }

  // Expanded view
  return (
    <div
      style={{
        border: '2px solid rgb(245, 242, 242)',
        backgroundColor: `${data.style?.backgroundColor || '#fff'}`,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
      }}
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative overflow-hidden w-[280px]`}
      onClick={onClick}
    >
      <Title
        isEditing={isEditing}
        label={nodeData.label}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={FaRegStickyNote}
      />

      <div className='bg-white rounded me-2 mt-2'>
        {/* New Thread Input */}
        <div className='p-3 bg-gray-50 flex items-center gap-2'>
          <div className='w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm'>
            U
          </div>
          <p>
            {data?.comments?.length || 0}{' '}
            {data?.comments && data?.comments?.length > 1
              ? 'Comments'
              : 'Comment'}{' '}
            on this Thread
          </p>
        </div>
      </div>
    </div>
  )
}

export default CommentNode
