import React, { useState, useEffect, MouseEventHandler } from 'react'
import { Handle, Position } from '@xyflow/react'
import { VscSymbolOperator } from 'react-icons/vsc'
import Title from '../components/Title'
import { FiGitBranch } from 'react-icons/fi'
import {
  NodeComponentProps,
  NodeDataConditionType,
} from '@/types/agent-builder'

const generateConditionText = (
  conditions: NodeDataConditionType[] | undefined
) => {
  if (!conditions || conditions.length === 0) return '\u00A0'

  return conditions
    .map(condition => `If ${condition.variable} is ${condition.value}`)
    .join(' AND ')
}

const ConditionNode = ({
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
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative w-[280px] border-2 border-[#f5f2f2] shadow-lg bg-gray-300 overflow-hidden`}
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
        Icon={FiGitBranch}
      />

      <div className='bg-white rounded-lg me-2 mt-2'>
        {(!nodeData?.conditionType || !nodeData?.paths?.length) && (
          <div className='flex items-center gap-2 p-3 border-b border-gray-100'>
            <>
              <VscSymbolOperator size={20} className='text-gray-500' />
              <span>{'Empty condition'}</span>
            </>
          </div>
        )}

        <div>
          {nodeData?.paths &&
            nodeData?.paths?.length > 0 &&
            nodeData?.paths.map(path => (
              <div
                key={path.id}
                className='relative flex items-center p-3 border-b border-gray-100'
              >
                <p className='text-md'>
                  {generateConditionText(path?.conditions)}
                </p>
                <Handle
                  type='source'
                  position={Position.Right}
                  id={`${path.id}`}
                  className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
                />
              </div>
            ))}
        </div>

        {nodeData?.description?.length > 0 &&
          nodeData?.conditionType === 'prompt' && (
            <div className='relative flex items-center p-3 border-b border-gray-100'>
              <p className='text-md'>{nodeData?.description}</p>
              <Handle
                type='source'
                position={Position.Right}
                id={`prompt-description`}
                className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
              />
            </div>
          )}

        {/* False/Else path */}
        {nodeData?.elsePath === true && (
          <div className='relative flex items-center p-3'>
            <span className='text-gray-500'>Else</span>
            <Handle
              type='source'
              position={Position.Right}
              id='false'
              className='absolute right-2 w-3 h-3 bg-gray-300 border border-gray-400'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ConditionNode
