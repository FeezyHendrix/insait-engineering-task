import React, { useState, useEffect, MouseEventHandler } from 'react'
import { Handle, Position } from '@xyflow/react'
import Title from '../components/Title'
import { FaRegCommentDots } from 'react-icons/fa'
import { NodeComponentProps } from '@/types/agent-builder'
import { useTranslation } from 'react-i18next'

const CaptureNode = ({
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
      className={`ps-2 pt-0 pb-4 border-2 border-[#f5f2f2] rounded-xl font-normal shadow-lg w-[220px] flex flex-col justify-between relative bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='bg-gray-300 absolute top-10 left-1 transition-all duration-300 ease-in-out w-3 h-3 rounded-full z-10'
      />
      <Title
        isEditing={isEditing}
        label={nodeData.label}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={FaRegCommentDots}
      />
      <div className='pe-2'>
        {nodeData?.entities && nodeData?.entities?.length > 0 ? (
          nodeData.entities.map((item, index) => (
            <div
              key={index}
              className='bg-white p-2.5 rounded-sm mt-2.5 border-2 border-[#f5f2f2] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] relative'
            >
              <p className='m-0 text-[0.95rem] text-[#808080] relative pr-[30px] text-ellipsis overflow-hidden whitespace-nowrap w-52'>
                {item.value}
              </p>
              {nodeData.entities && index === nodeData.entities.length - 1 && (
                <>
                  <Handle
                    type='source'
                    position={Position.Right}
                    id='entities'
                    className='bg-gray-300 absolute right-2 w-3 h-3 rounded-full'
                  />
                </>
              )}
            </div>
          ))
        ) : (
          <div className='bg-gray-100 p-2.5 rounded-md mt-2.5 border-2  shadow-[0px_2px_4px_rgba(0,0,0,0.1)] relative'>
            <p className='m-0 text-xs text-gray relative'>
              {t('agentBuilder.selectEntity')}
            </p>
            <Handle
              type='source'
              position={Position.Right}
              id='entities'
              className='bg-gray-300 absolute right-2 w-3 h-3 rounded-full'
            />
          </div>
        )}

        {nodeData?.scenarios && nodeData?.scenarios?.length > 0 && (
          <div className='bg-white p-2 rounded-[5px] mt-2 border-[2px] border-[#f5f2f2] shadow-[0px_2px_4px_rgba(0,_0,_0,_0.1)] relative'>
            <p className='m-0 text-[0.95rem] text-[#808080] relative pr-[30px] '>
              {t('agentBuilder.scenario.exit')}
            </p>
            {nodeData?.exitScenarioPath === true && (
              <>
                <Handle
                  type='source'
                  position={Position.Right}
                  id='exitScenarioPath'
                  className='bg-[#dd7bdd] absolute right-2 w-3 h-3 rounded-full z-10'
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default CaptureNode
