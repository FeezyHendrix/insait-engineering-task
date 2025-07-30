import { useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import Title from '../components/Title'
import { AgentNodeComponentProps } from '@/types/agent-builder'
import { t } from 'i18next'
import { AiFillApi } from 'react-icons/ai'
import { IoIosGitMerge } from 'react-icons/io'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { RxCross1 } from 'react-icons/rx'
import { useAppSelector } from '@/hook/useReduxHooks'

const APINode = ({ id, data, onClick }: AgentNodeComponentProps) => {
  const { currentFlowData } = useAppSelector(state => state.builder)

  const [nodeData, setNodeData] = useState(data)
  const nodeExits = (currentFlowData?.node_exits || []).filter(
    ne => ne.node_id === id
  )

  useEffect(() => {
    if (data) {
      setNodeData(data)
    }
  }, [data])

  return (
    <div
      className={`ps-2 pt-0 pb-4 rounded-xl flex flex-col justify-between relative border-2 border-[#F5F2F2] font-normal shadow-lg bg-gray-300 w-[220px] overflow-hidden`}
      onClick={onClick}
    >
      {!nodeData.is_root_node && (
        <Handle
          type='target'
          position={Position.Left}
          className='absolute top-2/4 left-1 z-10 w-3 h-3 rounded-full bg-gray-300'
        />
      )}
      <Title label={nodeData.url ?? ''} Icon={AiFillApi} />
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
        {Array.isArray(nodeExits) && nodeExits.length > 0 ? (
          nodeExits.map(ne => (
            <div
              key={ne.id}
              className={`flex gap-3 items-center px-2 py-3 border-b border-gray-300 relative ${
                ne.properties.value === 'success'
                  ? 'text-green-500'
                  : 'text-red-400'
              }`}
            >
              {ne.properties.value === 'success' ? (
                <IoCheckmarkOutline />
              ) : (
                <RxCross1 />
              )}
              <p className='text-sm'>{ne.properties.value}</p>
              <Handle
                id={`${ne.id}`}
                className={`absolute w-3 h-3 right-3 bg-gray-300 border border-gray-500 `}
                type='source'
                position={Position.Right}
              />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default APINode
