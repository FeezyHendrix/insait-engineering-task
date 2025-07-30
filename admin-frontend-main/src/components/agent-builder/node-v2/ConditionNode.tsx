import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { FaRegDotCircle } from 'react-icons/fa'
import Title from '../components/Title'
import { FiGitBranch } from 'react-icons/fi'
import { AgentNodeComponentProps } from '@/types/agent-builder'
import { generateConditionText } from '@/utils/botBuilder'
import { useAppSelector } from '@/hook/useReduxHooks'
import dayjs from 'dayjs'

const ConditionNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: AgentNodeComponentProps) => {
  const { currentFlowData } = useAppSelector(state => state.builder)

  const [nodeData, setNodeData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)

  const nodeExits = useMemo(() => {
    return (currentFlowData?.node_exits || [])
      .filter(ne => ne.node_id === id)
      .sort((a, b) => dayjs(a.created_at).diff(dayjs(b.created_at)))
  }, [currentFlowData?.node_exits, id])

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
        Icon={FiGitBranch}
      />
      <div className='bg-white rounded mt-2 me-2'>
        {Array.isArray(nodeExits) && nodeExits.length > 0 ? (
          nodeExits.map(ne => (
            <div
              key={ne.id}
              className='flex gap-3 items-center px-2 py-3 border-b border-gray-300 relative'
            >
              <FaRegDotCircle className='text-blue-500' size={14} />
              <p className='text-sm truncate flex-1'>
                {generateConditionText(ne.properties?.condition)}
              </p>
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
            <div>
              <h4>Add Conditions</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConditionNode
