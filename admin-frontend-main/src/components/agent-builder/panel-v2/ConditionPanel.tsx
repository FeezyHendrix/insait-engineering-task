import React, { useState, useEffect, useMemo } from 'react'
import { VscSymbolOperator } from 'react-icons/vsc'
import { FaPlus, FaMinus } from 'react-icons/fa'
import NodePanelBase from './NodePanelBase'
import { AgentNodePanelProps, ConditionType } from '@/types/agent-builder'
import ConditionFilter from './ConditionFilter'
import {
  cleanCondition,
  createEmptyCondition,
  generateConditionText,
  restoreCondition,
} from '@/utils/botBuilder'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import {
  createNode,
  createNodeExit,
  deleteNodeExit,
  updateNodeExit,
} from '@/redux/slices/agentBuilder/request'
import { setSelectedNodeId } from '@/redux/slices/agentBuilder'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const ConditionPanel = (props: AgentNodePanelProps) => {
  const dispatch = useAppDispatch()
  const { selectedNode } = props
  const { currentFlowData, currentFlowId } = useAppSelector(
    state => state.builder
  )
  const [loading, setLoading] = useState(false)
  const [conditions, setConditions] = useState<ConditionType[]>([])
  const [showConditionFilter, setShowConditionFilter] = useState(false)
  const [modalTop, setModalTop] = useState(0)
  const [selectedCondition, setSelectedCondition] =
    useState<ConditionType | null>(null)

  const nodeExits = useMemo(() => {
    return (currentFlowData?.node_exits || [])
      .filter(ne => ne.node_id === selectedNode.id)
      .sort((a, b) => dayjs(a.created_at).diff(dayjs(b.created_at)))
  }, [currentFlowData?.node_exits, selectedNode.id])

  const flowFields = currentFlowData?.fields || []

  const addCondition = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const newCondition = createEmptyCondition()

    setConditions(prev => [...prev, newCondition])
    setSelectedCondition(newCondition)
    startEditingCondition(event)
  }

  const removeCondition = async (
    e: React.MouseEvent,
    condition: ConditionType
  ) => {
    try {
      e.stopPropagation()
      setLoading(true)

      if (condition.id) {
        await dispatch(
          deleteNodeExit({
            flowId: currentFlowId,
            nodeId: selectedNode.id,
            nodeExitId: condition.id,
          })
        )
      } else {
        const updatedConditions = conditions.filter(c => c.id !== condition.id)
        setConditions(updatedConditions)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const startEditingCondition = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setModalTop(rect.bottom + window.scrollY)
    setShowConditionFilter(true)
  }

  const finishEditing = () => {
    setShowConditionFilter(false)
    setSelectedCondition(null)
  }

  const handleCreateNodeExit = async (
    nodeId: string,
    condition: ConditionType
  ) => {
    const data = {
      flowId: currentFlowId,
      nodeId,
      showToast: true,
      data: {
        properties: {
          name: generateConditionText(condition),
          value: '',
          condition: cleanCondition(condition),
        },
        node_type: selectedNode.type,
      },
    }
    await dispatch(createNodeExit(data))
  }

  const handleCreateNode = async () => {
    const data = {
      properties: {
        ...selectedNode.data,
        is_root_node: !currentFlowData || currentFlowData.nodes.length === 0,
      },
      type: selectedNode.type,
      agent_builder_properties: {
        position: selectedNode.position,
      },
    }

    const createRequest = await dispatch(
      createNode({ flowId: currentFlowId, data })
    ).unwrap()
    return createRequest?.id
  }

  const handleSubmitUpdate = async (condition: ConditionType) => {
    try {
      setLoading(true)
      const data = {
        flowId: currentFlowId,
        nodeId: selectedNode.id,
        nodeExitId: condition.id || '',
        showToast: true,
        data: {
          properties: {
            name: generateConditionText(condition),
            value: '',
            condition: cleanCondition(condition),
          },
          node_type: selectedNode.type,
        },
      }
      await dispatch(updateNodeExit(data))
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleSubmitCreate = async (condition: ConditionType) => {
    try {
      setLoading(true)
      let nodeId = selectedNode.id

      if (!selectedNode?.created_at) {
        const createdNodeId = await handleCreateNode()
        if (createdNodeId) {
          dispatch(setSelectedNodeId(createdNodeId))
          nodeId = createdNodeId
        } else {
          toast.error('Something went wrong')
          setLoading(false)
          return
        }
      }
      await handleCreateNodeExit(nodeId, condition)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleSubmit = async (condition: ConditionType, id?: string) => {
    if (id) {
      handleSubmitUpdate(condition)
    } else {
      handleSubmitCreate(condition)
    }
  }

  useEffect(() => {
    if (nodeExits?.length) {
      const nodeExitConditions = nodeExits
        .map(ne => {
          const condition = ne.properties?.condition
          if (condition) {
            const conditionWithId: ConditionType = {
              ...condition,
              id: ne.id,
            }
            return conditionWithId
          }
          return undefined
        })
        .filter(
          (condition): condition is ConditionType => condition !== undefined
        )

      setConditions(nodeExitConditions)
    } else {
      setConditions([])
    }
  }, [nodeExits])

  const renderFieldsSection = () => (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-gray-700 font-medium'>Conditions</h3>
        <button
          onClick={e => addCondition(e)}
          className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1'
        >
          <FaPlus size={12} /> Add Condition
        </button>
      </div>

      <div className='space-y-2'>
        {conditions.map((condition: ConditionType, index: number) => (
          <div
            key={condition.id || index}
            className='bg-white border border-gray-300 p-3 rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-50 relative'
            onClick={e => {
              setSelectedCondition(condition)
              startEditingCondition(e)
            }}
          >
            <div className='flex items-center gap-2 overflow-hidden'>
              <VscSymbolOperator size={16} className='text-blue-500' />
              <span className='truncate'>
                {generateConditionText(condition)}
              </span>
            </div>
            <button
              className='text-gray-400 hover:text-gray-600'
              onClick={e => removeCondition(e, condition)}
            >
              <FaMinus size={14} />
            </button>
          </div>
        ))}
      </div>

      {showConditionFilter && selectedCondition && (
        <>
          <div
            className='fixed z-50 right-10 w-full max-w-[600px]'
            style={{ top: `${modalTop}px` }}
          >
            <ConditionFilter
              id={selectedCondition.id}
              condition={restoreCondition(selectedCondition, currentFlowData?.fields)}
              fields={flowFields}
              onCancel={finishEditing}
              onSubmit={updatedCondition => {
                handleSubmit(updatedCondition, selectedCondition.id)
                finishEditing()
              }}
            />
          </div>
          <div className='fixed inset-0 z-40' onClick={finishEditing} />
        </>
      )}
    </div>
  )

  return (
    <NodePanelBase
      {...props}
      nodeType='CONDITION'
      loading={loading}
      setLoading={setLoading}
      renderFieldsSection={renderFieldsSection}
      showHowToAsk={true}
      showGeneralInstruction={true}
    ></NodePanelBase>
  )
}

export default ConditionPanel
