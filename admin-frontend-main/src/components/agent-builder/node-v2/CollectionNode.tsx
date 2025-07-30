import React, { useState, useEffect, MouseEventHandler } from 'react'
import { Handle, Position } from '@xyflow/react'
import Title from '../components/Title'
import { FaRegCommentDots } from 'react-icons/fa'
import { AgentNodeComponentProps } from '@/types/agent-builder'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/hook/useReduxHooks'

const CollectionNode = ({
  id,
  data,
  onClick,
  updateNodeData,
}: AgentNodeComponentProps) => {
  const { t } = useTranslation()
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

  const groups = nodeData.fields_to_collect_groups ?? []
  const hasGroups = groups.length > 0
  const lastGroupIndex = groups.length - 1

  return (
    <div
      className={`ps-2 pt-0 pb-4 border-2 border-[#f5f2f2] rounded-xl font-normal shadow-lg w-[220px] flex flex-col justify-between relative bg-gray-300 overflow-hidden`}
      style={{
        backgroundColor: data?.style?.backgroundColor,
      }}
      onClick={onClick}
    >
      {!nodeData.is_root_node && (
        <Handle
          type='target'
          position={Position.Left}
          className='bg-gray-300 absolute top-10 left-1 transition-all duration-300 ease-in-out w-3 h-3 rounded-full z-10'
        />
      )}
      <Title
        isEditing={isEditing}
        label={nodeData?.name}
        onLabelChange={handleLabelChange}
        onKeyDown={handleKeyDown}
        onLabelClick={handleLabelClick}
        onBlur={() => handleSubmitData()}
        Icon={FaRegCommentDots}
      />
      <div className='pe-2'>
        {hasGroups ? (
          (nodeData.fields_to_collect_groups ?? []).map((group, groupIdx) => (
            <div key={groupIdx} className='mt-3'>
              <p className='text-xs font-semibold text-gray-700 px-1'>
                {group.name}
              </p>
              {group.fields_to_collect.map((item, index) => {
                const isLast =
                  groupIdx === lastGroupIndex &&
                  index === group.fields_to_collect.length - 1

                return (
                  <div
                    key={item}
                    className='bg-white p-2.5 rounded-sm mt-2.5 border-2 border-[#f5f2f2] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] relative'
                  >
                    <p className='m-0 text-[0.95rem] text-[#808080] relative pr-[30px] text-ellipsis overflow-hidden whitespace-nowrap w-52'>
                      {item}
                    </p>
                    {nodeExits?.id && isLast && (
                      <Handle
                        type='source'
                        position={Position.Right}
                        className='bg-gray-300 absolute right-2 w-3 h-3 rounded-full'
                        id={nodeExits.id}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))
        ) : (
          <div className='bg-gray-100 p-2.5 rounded-md mt-2.5 border-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] relative'>
            <p className='m-0 text-xs text-gray relative'>
              {t('agentBuilder.selectEntity')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
export default CollectionNode
