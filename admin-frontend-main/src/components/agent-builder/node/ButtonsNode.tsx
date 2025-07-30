import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { IoIosGitMerge } from 'react-icons/io'
import { BsThreeDots } from 'react-icons/bs'
import { FaRegDotCircle } from 'react-icons/fa'
import Title from '../components/Title'
import { FiToggleRight } from 'react-icons/fi'
import { NodeComponentProps } from '@/types/agent-builder'
import { useTranslation } from 'react-i18next'

const ButtonsNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: NodeComponentProps) => {
  const { t } = useTranslation()

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
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative border-2 border-gray-200 w-[220px] shadow-lg bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='bg-gray-300 absolute top-[20px] left-1 transition-colors duration-300 ease-linear w-3 h-3 rounded-full z-[1]'
      />
      <Title
        isEditing={isEditing}
        label={nodeData.label}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={FiToggleRight}
      />
      <div className='bg-white rounded mt-2 me-2'>
        {Array.isArray(nodeData?.buttons) && nodeData?.buttons?.length > 0 ? (
          nodeData?.buttons.map((button, index) => (
            <div
              key={button.id}
              className='flex gap-3 items-center px-2 py-3 border-b border-gray-300 relative'
            >
              <FaRegDotCircle className='text-blue-500' size={14} />
              <p className='text-sm'>{button.label}</p>
              {((nodeData?.isMultiSelectEnabled === true &&
                index === nodeData?.buttons!.length - 1) ||
                nodeData?.isMultiSelectEnabled !== true) && (
                <Handle
                  className='absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500'
                  type='source'
                  position={Position.Right}
                  id={`button-${button.id}`}
                />
              )}
            </div>
          ))
        ) : (
          <div className='flex gap-3 items-center px-2 py-1 border-b border-gray-300'>
            <IoIosGitMerge size={20} />
            <div>
              <h4>Buttons</h4>
              <p className='text-xs text-gray-500'>
                {t('agentBuilder.addResponseButtons')}
              </p>
            </div>
          </div>
        )}

        {nodeData?.noMatch === true && (
          <div className='flex gap-3 items-center px-2 py-3 border-b border-gray-300 text-gray-500 relative'>
            <BsThreeDots />
            <p className='text-sm'>{t('agentBuilder.noMatch')}</p>
            <Handle
              className='absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500'
              type='source'
              position={Position.Right}
              id='no-match'
            />
          </div>
        )}

        {nodeData?.noReply === true && (
          <div className='flex gap-3 items-center px-2 py-3 text-gray-500 relative'>
            <BsThreeDots />
            <p className='text-sm flex-1'>{t('agentBuilder.noReply')}</p>
            <Handle
              className='absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500'
              type='source'
              position={Position.Right}
              id='no-reply'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ButtonsNode
