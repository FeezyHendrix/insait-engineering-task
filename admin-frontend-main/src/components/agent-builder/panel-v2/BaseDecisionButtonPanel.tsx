import { useState } from 'react'
import { useNodeData } from './useNodeData'
import { FaMinus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import {
  AgentNodePanelProps,
  CreateNodeExitRequest,
  NODE_CREATE_TYPE,
} from '@/types/agent-builder'
import NodePanelBase from './NodePanelBase'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import {
  createNode,
  createNodeExit,
  deleteNodeExit,
} from '@/redux/slices/agentBuilder/request'
import { setSelectedNodeId } from '@/redux/slices/agentBuilder'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'
import { TextareaWithExpand } from '@/components/elements/Input'

export interface BaseDecisionButtonPanelProps extends AgentNodePanelProps {
  nodeType: NODE_CREATE_TYPE
  inputPlaceholder: string
  addButtonLabel: string
  type: 'decision' | 'button'
}

const BaseDecisionButtonPanel = ({
  nodeType,
  inputPlaceholder,
  addButtonLabel,
  type,
  ...props
}: BaseDecisionButtonPanelProps) => {
  const dispatch = useAppDispatch()
  const { currentFlowId, currentFlowData } = useAppSelector(
    (state) => state.builder
  )
  const { selectedNode } = props

  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const {
    nodeData,
    addToFieldsArray,
    removeFromFieldsArray,
    updateFieldsArray,
    updateField,
  } = useNodeData({ selectedNode, updateNodeData: props.updateNodeData })

  const nodeExits = (currentFlowData?.node_exits || []).filter(
    (ne) => ne.node_id === selectedNode.id
  )

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

  const handleCreateNodeExit = async (
    nodeId: string,
    value: string,
    descriptionVal: string
  ) => {
    const data: CreateNodeExitRequest = {
      flowId: currentFlowId,
      nodeId,
      showToast: true,
      data: {
        properties: {
          name: type,
          value,
        },
        node_type: selectedNode.type,
      },
    }
    if (descriptionVal) {
      data.data.properties.description = descriptionVal
    }
    await dispatch(createNodeExit(data))
  }

  const handleSubmitOption = async (val: string, descriptionVal: string) => {
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
      await handleCreateNodeExit(nodeId, val, descriptionVal)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const addOption = () => {
    if (!value.trim()) {
      toast.error(`${addButtonLabel} label is required`)
      return
    }
    handleSubmitOption(value, description)
    setValue('')
    setDescription('')
  }

  const removeOption = async (nodeExitId: string) => {
    try {
      setLoading(true)

      await dispatch(
        deleteNodeExit({
          flowId: currentFlowId,
          nodeId: selectedNode.id,
          nodeExitId,
        })
      )
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const addRule = () => {
    const hasEmptyRule = nodeData.rules_to_remember?.some(
      (rule) => !rule.trim()
    )

    if (hasEmptyRule) {
      toast.error('Please fill in the current rule before adding a new one.')
      return
    }

    addToFieldsArray('rules_to_remember', '')
  }

  const removeRule = (ruleToRemove: string) => {
    removeFromFieldsArray('rules_to_remember', (item) => item === ruleToRemove)
  }

  const handleRuleContentChange = (index: number, newValue: string) => {
    updateFieldsArray('rules_to_remember', (currentRules) =>
      currentRules.map((rule, i) => (i === index ? newValue : rule))
    )
  }

  const handleUseDescriptionButton = async () => {
    if (nodeExits.length == 0) {
      toast.error(
        `First create ${type}s with descriptions to enable ${type}s descriptions`
      )
      return
    }
    try {
      setLoading(true)
      updateField('use_descriptions', !nodeData?.use_descriptions)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(`Something went wrong, please try again`)
    }
  }

  const renderFieldsSection = () => (
    <>
      <div className='flex flex-col items-center gap-2 mb-3'>
        <div className='py-2 w-full flex justify-between'>
          <p className='flex items-center'>Enable {type}s descriptions</p>
          <button
            onClick={() => handleUseDescriptionButton()}
            className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
              nodeData?.use_descriptions ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            {nodeData?.use_descriptions ? 'On' : 'Off'}
          </button>
        </div>
        {
          <p
            className={`py-2 text-sm ${
              nodeData?.use_descriptions ? 'hidden' : ''
            }`}
          >
            While use case description is OFF, descriptions won't be active
            during conversations
          </p>
        }
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={inputPlaceholder}
          className='px-2 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
        />
        <TextareaWithExpand
          label=''
          placeholder={`Add ${type} description (OPTIONAL)`}
          name='description'
          rows={2}
          onChange={(e) => setDescription(e.target.value)}
          className='text-sm w-full pt-0'
          value={description}
        />
        <button
          onClick={addOption}
          className='text-blue-500 bg-blue-50 px-4 py-2 rounded-md hover:bg-blue-100 ms-auto text-sm'
          disabled={!value.trim()}
        >
          Add
        </button>
      </div>
      <div className='flex flex-col gap-2 mt-1 overflow-y-auto'>
        <div className='space-y-2'>
          {nodeExits.map((ne, index) => (
            <div
              key={index}
              className='flex items-center justify-between gap-2 bg-gray-100 py-1.5 px-3 rounded-lg'
            >
              <div className='flex flex-col'>
                <span className='text-gray-700'>{ne.properties.value}</span>
                {ne.properties?.description && (
                  <small
                    className={`${
                      nodeData?.use_descriptions
                        ? 'text-gray-800 text-xs'
                        : 'text-gray-400 text-xs'
                    }`}
                  >
                    {!nodeData?.use_descriptions && `(DISABLED)`} Description -{' '}
                    {ne.properties.description}
                  </small>
                )}
              </div>
              <button
                onClick={() => removeOption(ne.id)}
                className='text-gray-400 hover:text-gray-600'
              >
                <FaMinus size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderRulesSection = () => (
    <>
      <div className='border-b border-gray-300 pt-2' />

      <div className='flex justify-between'>
        <strong>Rules to Remember</strong>
        <FiPlusCircle className='cursor-pointer' size={20} onClick={addRule} />
      </div>
      {nodeData?.rules_to_remember &&
        nodeData?.rules_to_remember?.length > 0 &&
        nodeData.rules_to_remember.map((item, index) => (
          <div key={index} className='pt-1 flex gap-2 items-center'>
            <div className='py-1.5 bg-gray-100 w-full rounded-md'>
              <input
                onChange={(e) => handleRuleContentChange(index, e.target.value)}
                placeholder='Enter Rule'
                className='bg-gray-100 outline-none px-2 w-full'
                value={item}
              />
            </div>
            <FiMinusCircle
              className='cursor-pointer'
              size={20}
              onClick={() => removeRule(item)}
            />
          </div>
        ))}
    </>
  )

  return (
    <NodePanelBase
      {...props}
      nodeType={nodeType}
      loading={loading}
      setLoading={setLoading}
      renderFieldsSection={renderFieldsSection}
      showName={true}
      showHowToAsk={true}
      showGeneralInstruction={true}
      showQuestionForUser={true}
      checkRootNode={true}
    >
      {renderRulesSection()}
    </NodePanelBase>
  )
}

export default BaseDecisionButtonPanel
