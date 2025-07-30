import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { MdOutlineCloudUpload } from 'react-icons/md'
import Title from '../components/Title'
import { FiImage, FiFile } from 'react-icons/fi'
import { NodeComponentProps } from '@/types/agent-builder'

const ImageNode = ({
  id,
  data,
  onClick,
  updateNodeData,
  type,
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
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative w-[250px] shadow-lg bg-gray-300 overflow-hidden`}
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
        Icon={type === 'Image' ? FiImage : FiFile}
      />

      <div className='bg-white rounded me-2 mt-2'>
        <div className='flex items-center gap-3 p-3'>
          <MdOutlineCloudUpload className='text-gray-400' size={20} />
          <div className='flex flex-col'>
            <span className='text-gray-700'>{type}</span>
            <span className='text-sm text-gray-400'>
              {type === 'Image' ? 'Upload an image or GIF' : 'Upload a File'}
            </span>
          </div>
        </div>

        {data.imageUrl && (
          <div className='p-3 border-t border-gray-100'>
            <img
              src={data.imageUrl}
              alt='Uploaded'
              className='w-full h-auto rounded-md'
            />
          </div>
        )}

        <Handle
          type='source'
          position={Position.Right}
          className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
        />
      </div>
    </div>
  )
}

export default ImageNode
