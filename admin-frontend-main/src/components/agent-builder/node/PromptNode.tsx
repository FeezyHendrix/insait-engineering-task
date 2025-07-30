import React, { useState, useEffect, MouseEventHandler } from 'react'
import { Handle, Position } from '@xyflow/react'
import Title from '../components/Title'
import { RiColorFilterAiLine } from 'react-icons/ri'
import { NodeComponentProps } from '@/types/agent-builder'

const PromptNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: NodeComponentProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nodeData, setNodeData] = useState(data)

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

  return (
    <div
      className={`ps-2 pt-0 pb-4 border-2 border-[#F5F2F2] rounded-lg font-normal shadow-lg w-[220px] flex flex-col justify-between relative bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      <Title
        isEditing={isEditing}
        label={nodeData.label}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={RiColorFilterAiLine}
      />

      <div className='bg-white p-2.5 rounded-md mt-2.5 border-2 border-[#F5F2F2] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] relative me-2'>
        <p
          className='m-0 text-[0.95rem] text-gray-500 relative pr-7'
          dangerouslySetInnerHTML={{ __html: data?.message || 'Select prompt' }}
        ></p>
        <Handle
          type='target'
          position={Position.Left}
          className='bg-gray-300 absolute top-1/2 left-1 transform -translate-y-1/2 transition-colors duration-300 w-3 h-3 rounded-full z-10'
        />

        <Handle
          type='source'
          position={Position.Right}
          className='bg-gray-300 absolute top-1/2 right-[-5px] transform -translate-y-1/2 transition-colors duration-300 w-3 h-3 rounded-full z-10'
        />
      </div>
    </div>
  )
}
export default PromptNode
