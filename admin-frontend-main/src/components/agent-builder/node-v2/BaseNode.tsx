import React, { useState, useEffect, MouseEventHandler, ReactNode } from 'react'
import { Handle, Position } from '@xyflow/react'
import Title from '../components/Title'
import { BaseNodeProps } from '@/types/agent-builder'
import { useAppSelector } from '@/hook/useReduxHooks'

const BaseNode = ({
  id,
  data,
  onClick,
  updateNodeData,
  Icon,
  bgColor = 'bg-gray-300',
  borderColor = 'border-[#f5f2f2]',
  titleLabel,
  targetHandlePosition = { top: 'top-10', left: 'left-1' },
  children,
  showDefaultContent = true,
  defaultMessage = 'No Message yet',
  handleSourcePosition = { top: 'top-2/4', right: '-right-2' },
}: BaseNodeProps) => {
  const { currentFlowData } = useAppSelector((state) => state.builder)

  const [nodeData, setNodeData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)
  const nodeExits = (currentFlowData?.node_exits || []).find(
    (ne) => ne.node_id === id
  )

  useEffect(() => {
    if (data) {
      setNodeData(data)
    }
  }, [data])

  const handleLabelClick: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeData((prevNodeData) => ({
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
      className={`ps-2 pt-0 pb-4 border-2 ${borderColor} rounded-xl font-normal shadow-lg w-[220px] flex flex-col justify-between relative ${bgColor} overflow-hidden`}
      onClick={onClick}
    >
      {!nodeData?.is_root_node && (
        <Handle
          type='target'
          position={Position.Left}
          className={`${bgColor} absolute ${targetHandlePosition.top} ${targetHandlePosition.left} transition-all duration-300 ease-in-out w-3 h-3 rounded-full z-10`}
        />
      )}
      <Title
        isEditing={isEditing}
        label={titleLabel || nodeData?.name}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={Icon}
      />

      {children ? (
        children
      ) : showDefaultContent ? (
        <div className='bg-white p-2 rounded-md mt-2 me-2 border-2 shadow-sm relative'>
          <p className='text-sm line-clamp-4 overflow-hidden text-ellipsis break-words'>
            {defaultMessage}
          </p>
          {nodeExits?.id && (
            <>
              <Handle
                type='source'
                position={Position.Right}
                className={`absolute ${handleSourcePosition.top} ${handleSourcePosition.right} z-10 w-4 h-4 rounded-full ${bgColor}`}
                id={nodeExits.id}
              />
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default BaseNode
