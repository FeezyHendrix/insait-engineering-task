import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { IoIosGitMerge } from 'react-icons/io'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { RxCross1 } from 'react-icons/rx'
import { AiFillApi } from 'react-icons/ai'
import Title from '../components/Title'
import { NodeComponentProps } from '@/types/agent-builder'
import { useTranslation } from 'react-i18next'

const APINode = ({ id, data, onClick, updateNodeData }: NodeComponentProps) => {
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
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative border-2 border-[#F5F2F2] font-normal shadow-lg bg-gray-300 w-[220px] overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='absolute top-2/4 left-1 z-10 w-3 h-3 rounded-full bg-gray-300'
      />
      <Title
        isEditing={isEditing}
        label={nodeData.label}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={AiFillApi}
      />
      <div className='bg-white rounded me-2 mt-2'>
        <div className='flex gap-3 items-center px-2 py-1 border-b border-gray-300'>
          <IoIosGitMerge size={20} />
          <div>
            <h4>{data?.method ?? 'GET'}</h4>
            <p className='text-xs text-ellipsis overflow-hidden whitespace-nowrap w-36'>
              {data?.url ?? t('agentBuilder.enterRequestURL')}
            </p>
          </div>
        </div>
        <div className='flex gap-3 items-center px-2 py-3 border-b border-gray-300 text-green-500 relative'>
          <IoCheckmarkOutline />
          <p className='text-sm'>{t('general.success')}</p>
          <Handle
            id='success'
            className='absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500'
            type='source'
            position={Position.Right}
          />
        </div>
        <div className='flex gap-3 items-center px-2 py-3 text-red-400 relative'>
          <RxCross1 />
          <p className='text-sm flex-1'>{t('general.fail')}</p>
          <Handle
            id='fail'
            className='absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500'
            type='source'
            position={Position.Right}
          />
        </div>
      </div>
    </div>
  )
}

export default APINode
