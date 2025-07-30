import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { GiChoice } from 'react-icons/gi'
import { FaRegDotCircle } from 'react-icons/fa'
import Title from '../components/Title'
import { AgentNodeComponentProps } from '@/types/agent-builder'
import { useAppSelector } from '@/hook/useReduxHooks'

const DecisionNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: AgentNodeComponentProps) => {
  const { currentFlowData } = useAppSelector(state => state.builder)

  const [nodeData, setNodeData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)

  const nodeExits = (currentFlowData?.node_exits || []).filter(
    ne => ne.node_id === id
  )

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
      name: e.target.value,
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newNodeData = {
        ...nodeData,
        name: e.currentTarget.value,
      }
      updateNodeData && updateNodeData(id, newNodeData)
    }
  }

  const handleSubmitData = () => {
    updateNodeData && updateNodeData(id, nodeData)
  }

  return (
    <div
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative border-2 border-gray-200 w-[220px] shadow-lg bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      {!nodeData.is_root_node && (
        <Handle
          type='target'
          position={Position.Left}
          className='bg-gray-300 absolute top-[20px] left-1 transition-colors duration-300 ease-linear w-3 h-3 rounded-full z-10'
        />
      )}

      <Title
        isEditing={isEditing}
        label={nodeData.name}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={GiChoice}
      />
      <div className='bg-white rounded mt-2 me-2'>
        {Array.isArray(nodeExits) && nodeExits.length > 0 ? (
          nodeExits.map(ne => (
            <div
              key={ne.id}
              className='flex gap-3 items-center px-2 py-3 border-b border-gray-300 relative'
            >
              <FaRegDotCircle className='text-blue-500' size={14} />
              <p className='text-sm'>{ne.properties.value}</p>
              <Handle
                className='absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500'
                type='source'
                position={Position.Right}
                id={`${ne.id}`}
              />
            </div>
          ))
        ) : (
          <div className='flex gap-3 items-center px-2 py-1 border-b border-gray-300'>
            <GiChoice size={20} />
            <div>
              <h4>Decisions</h4>
              <p className='text-xs text-gray-500'>Add decisions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DecisionNode
