import React, { useState, useEffect, Fragment, MouseEventHandler } from 'react'
import { Handle, Position } from '@xyflow/react'
import { DiJavascript1 } from 'react-icons/di'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { RxCross2 } from 'react-icons/rx'
import Title from '../components/Title'
import { FiCode } from 'react-icons/fi'
import { NodeComponentProps } from '@/types/agent-builder'

const JavascriptNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: NodeComponentProps) => {
  const [nodeData, setNodeData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)

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
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative w-[220px] border-2 border-[#f5f2f2] shadow-lg bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='bg-gray-300 absolute top-[20px] left-1 transition-colors duration-300 ease w-3 h-3 rounded-full z-[1]'
      />
      <Title
        isEditing={isEditing}
        label={nodeData.label}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={FiCode}
      />

      <div className='bg-white rounded me-2 mt-2'>
        {/* Main code display */}
        <div className='flex items-center gap-2 p-3 border-b border-gray-100'>
          <DiJavascript1 className='text-yellow-500' size={20} />
          <div>
            <h4>
              {nodeData?.javascript?.length > 0
                ? 'Javascript Code'
                : 'Add javascript'}
            </h4>
          </div>
        </div>

        {/* Default path */}
        <div className='relative flex items-center p-3 border-b border-gray-100 group'>
          <IoCheckmarkCircleOutline className='text-green-500' size={16} />
          <span className='ml-2 text-sm'>Default</span>
          <Handle
            type='source'
            position={Position.Right}
            id='default'
            className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
          />
        </div>

        {/* Paths path */}
        {nodeData?.paths &&
          nodeData?.paths?.length > 0 &&
          nodeData?.paths.map(path => (
            <Fragment key={path.id}>
              {path?.value?.length > 0 && (
                <div className='relative flex items-center p-3 border-b border-gray-100 group'>
                  <span className='ml-2 text-sm'>{path.value}</span>
                  <Handle
                    type='source'
                    position={Position.Right}
                    id={`path-${path.id}`}
                    className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
                  />
                </div>
              )}
            </Fragment>
          ))}

        {/* Fail path */}
        <div className='relative flex items-center p-3 group'>
          <RxCross2 className='text-red-500' size={16} />
          <span className='ml-2 text-sm'>Fail</span>
          <Handle
            type='source'
            position={Position.Right}
            id='fail'
            className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
          />
        </div>
      </div>
    </div>
  )
}

export default JavascriptNode
