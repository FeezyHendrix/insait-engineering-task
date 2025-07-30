import React, { useState, useEffect, MouseEventHandler } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FiMessageSquare } from 'react-icons/fi'
import Title from '../components/Title'
import { NodeComponentProps } from '@/types/agent-builder'
import EditorInput from '../components/EditorInput'
import { isEmptySlateValue } from '@/utils/botBuilder'

const MessageNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: NodeComponentProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const [nodeLabel, setNodeLabel] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleLabelClick: MouseEventHandler<HTMLElement> = e => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeLabel(e.target.value)
  }

  const handleStopEditing = () => {
    setIsEditing(false)
    updateNodeData(id, { label: nodeLabel })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setNodeLabel(e.currentTarget.value)
      handleStopEditing()
    }
  }

  useEffect(() => {
    if (data && typeof data?.label === 'string') {
      setNodeLabel(data.label)
    }
    setMessage(
      isEmptySlateValue(data?.label) ? 'Enter agent message' : data?.message ?? ''
    )
  }, [data])

  return (
    <div
      className={`ps-2 pt-0 pb-4 border-2 border-[#F5F2F2] rounded-lg font-normal shadow-lg w-[300px] flex flex-col justify-between relative bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      <Title
        isEditing={isEditing}
        label={nodeLabel}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleStopEditing()}
        Icon={FiMessageSquare}
      />

      <div className='bg-white p-2 rounded-md mt-2 me-2 border-2 border-[#F5F2F2] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] relative'>
        <EditorInput key={message} value={message} readOnly />
        <>
          <Handle
            type='source'
            position={Position.Right}
            className='absolute top-2/4 -right-2 z-10 w-4 h-4 rounded-full bg-gray-300 opacity-0'
          />
          <Handle
            type='source'
            position={Position.Right}
            className='absolute top-2/4 -right-2 z-10 w-4 h-4 rounded-full bg-gray-300'
          />
        </>
        {data?.isFirstNodeType !== true && (
          <>
            <Handle
              type='target'
              position={Position.Left}
              className='absolute top-1/3 left-1 z-10 w-4 h-4 rounded-full bg-gray-300'
            />
          </>
        )}
      </div>
    </div>
  )
}

export default MessageNode
