import {
  AgentNodePanelProps,
  DIALOG_TYPE,
  NODE_CREATE_TYPE,
  UpdateNodeRequestType,
} from '@/types/agent-builder'
import { useState } from 'react'
import { useNodeData } from './useNodeData'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import {
  createNode,
  createNodeExit,
  deleteNode,
} from '@/redux/slices/agentBuilder/request'
import ConfirmDialog from '../components/ConfirmDialog'
import { TextareaWithExpand } from '@/components/elements/Input'

export interface NodePanelBaseProps extends AgentNodePanelProps {
  children?: React.ReactNode
  renderFieldsSection?: () => React.ReactNode
  nodeType: NODE_CREATE_TYPE
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  onSave?: () => Promise<boolean | undefined>
  onUpdate?: () => Promise<boolean | undefined>
  showName?: boolean
  showMessage?: boolean
  showHowToAsk?: boolean
  showGeneralInstruction?: boolean
  showQuestionForUser?: boolean
  showWhatToSay?: boolean
  showHowToSayIt?: boolean
  checkRootNode?: boolean
  canCreateNodeExit?: boolean
}

const NodePanelBase = ({
  selectedNode,
  updateNodeData,
  onClose,
  submitUpdate,
  children,
  renderFieldsSection,
  nodeType,
  loading,
  setLoading,
  onSave,
  onUpdate,
  showName = false,
  showMessage = false,
  showHowToAsk = false,
  showGeneralInstruction = false,
  showQuestionForUser = false,
  showWhatToSay = false,
  showHowToSayIt = false,
  checkRootNode = false,
  canCreateNodeExit = false,
}: NodePanelBaseProps) => {
  const dispatch = useAppDispatch()
  const { currentFlowId, currentFlowData } = useAppSelector(
    (state) => state.builder
  )

  const { nodeData, updateField } = useNodeData({
    selectedNode,
    updateNodeData,
  })
  const [dialogDisplay, setDialogDisplay] = useState<DIALOG_TYPE>('none')

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('name', e.target.value)
  }

  const handleSubmitData = () => {
    updateNodeData(selectedNode.id, nodeData)
  }

  const handleSave = async () => {
    const data = {
      properties: {
        ...nodeData,
      },
      type: nodeType,
      agent_builder_properties: {
        position: selectedNode.position,
      },
    }
    if (checkRootNode) {
      data.properties.is_root_node =
        !currentFlowData || currentFlowData.nodes.length === 0
    }

    const response = await dispatch(
      createNode({ flowId: currentFlowId, data })
    ).unwrap()

    if (response?.id && canCreateNodeExit) {
      const exitData = {
        flowId: currentFlowId,
        nodeId: response.id,
        data: {
          properties: {
            name: 'type',
            value: nodeType || '',
          },
          node_type: selectedNode.type,
        },
      }
      await dispatch(createNodeExit(exitData))
    }
  }

  const handleUpdate = async () => {
    const updateData: UpdateNodeRequestType = {
      flowId: currentFlowId,
      nodeId: selectedNode.id,
      data: {
        properties: nodeData,
        type: nodeType,
        agent_builder_properties: {
          position: selectedNode.position,
        },
      },
    }
    await submitUpdate(updateData)
  }

  const handleDelete = async () => {
    await dispatch(deleteNode({ flowId: currentFlowId, id: selectedNode.id }))
  }

  const handleDialogConfirm = async () => {
    try {
      setLoading(true)
      if (dialogDisplay === 'create') {
        if (onSave) {
          await onSave()
          setDialogDisplay('none')
          return
        }
        await handleSave()
      }
      if (dialogDisplay === 'delete') {
        await handleDelete()
      }
      if (dialogDisplay === 'update') {
        if (onUpdate) {
          const response = await onUpdate()
          setDialogDisplay('none')
          if (response !== true) return
        } else {
          await handleUpdate()
        }
      }
      onClose && onClose(false)
      setLoading(false)
      setDialogDisplay('none')
    } catch (error) {
      setLoading(false)
      setDialogDisplay('none')
    }
  }

  const handleValidation = (type: DIALOG_TYPE) => {
    if (nodeType === 'COLLECTION') {
      const groups = nodeData.fields_to_collect_groups ?? []

      const emptyGroup = groups.find(
        (group) =>
          !group.fields_to_collect || group.fields_to_collect.length === 0
      )

      if (emptyGroup) {
        toast.error(
          `Group "${
            emptyGroup.name || 'Unnamed'
          }" must contain at least one field`
        )
        return
      }

      const hasAnyFields = groups.some(
        (group) => group.fields_to_collect.length > 0
      )

      if (!hasAnyFields) {
        toast.error('Please select fields to collect')
        return
      }

      const allRequiredNone = groups.every((group) => group.required === 'none')

      if (allRequiredNone) {
        toast.error(
          'All groups have "required" set to "none". Please ensure at least one group requires "all" or "one.'
        )
        return
      }
    }

    if (nodeType === 'SPEAK' && !nodeData.what_to_say) {
      toast.error('Please specify what to say')
      return
    }

    if (showName && !nodeData.name) {
      toast.error('Please specify collection name')
      return
    }
    setDialogDisplay(type)
  }

  const handleInstructionChange = (field: string, value: string) => {
    updateField(field, value)
  }

  return (
    <div className='w-[400px] bg-white p-5 border-l border-gray-300 h-full flex flex-col overflow-y-auto relative max-h-[90vh]'>
      {showName && (
        <div className='border-b border-gray-300 p-2 pl-0 mb-4 font-semibold text-gray-700'>
          <input
            className='w-full'
            value={nodeData?.name}
            onChange={handleLabelChange}
            onBlur={handleSubmitData}
          />
        </div>
      )}

      <div className='flex-1 flex flex-col'>
        {renderFieldsSection && renderFieldsSection()}

        <div className='mt-2 mb-5 flex flex-col gap-3'>
          {showMessage && (
            <TextareaWithExpand
              label='Display Message'
              placeholder='Input message'
              name='message'
              rows={3}
              onChange={(e) =>
                handleInstructionChange('message', e.target.value)
              }
              className={'!pt-0'}
              value={nodeData?.message || ''}
            />
          )}
          {showHowToAsk && (
            <TextareaWithExpand
              label='How to ask:'
              placeholder='Input how to ask'
              name='how_to_ask'
              rows={3}
              onChange={(e) =>
                handleInstructionChange('how_to_ask', e.target.value)
              }
              className={'!pt-2'}
              value={nodeData?.how_to_ask || ''}
            />
          )}
          {showGeneralInstruction && (
            <TextareaWithExpand
              label='General Instruction'
              placeholder='Enter Instruction'
              name='general_instructions'
              rows={3}
              onChange={(e) =>
                handleInstructionChange('general_instructions', e.target.value)
              }
              className={'!pt-2'}
              value={nodeData?.general_instructions || ''}
            />
          )}
          {showQuestionForUser && (
            <TextareaWithExpand
              label='Question for User'
              placeholder='Enter Question'
              name='question_for_user'
              rows={3}
              onChange={(e) =>
                handleInstructionChange('question_for_user', e.target.value)
              }
              className={'!pt-2'}
              value={nodeData?.question_for_user || ''}
            />
          )}
          {showWhatToSay && (
            <TextareaWithExpand
              label='What to say'
              placeholder='Enter what to say'
              name='what_to_say'
              rows={3}
              onChange={(e) =>
                handleInstructionChange('what_to_say', e.target.value)
              }
              className={'!pt-2'}
              value={nodeData?.what_to_say || ''}
            />
          )}
          {showHowToSayIt && (
            <TextareaWithExpand
              label='How to say it'
              placeholder='Enter How to say it'
              name='how_to_say_it'
              rows={3}
              onChange={(e) =>
                handleInstructionChange('how_to_say_it', e.target.value)
              }
              className={'!pt-2'}
              value={nodeData?.how_to_say_it || ''}
            />
          )}
          {children && children}
        </div>
      </div>

      <div className='flex justify-center items-end gap-8 px-4 mt-auto'>
        {!selectedNode.created_at ? (
          <button
            onClick={() => handleValidation('create')}
            className='p-2 bg-blue-600 text-white rounded-md border-none cursor-pointer w-full hover:bg-blue-700'
          >
            Save
          </button>
        ) : (
          <>
            <button
              onClick={() => handleValidation('update')}
              className='p-2 bg-blue-600 text-white rounded-md border-none cursor-pointer w-full hover:bg-blue-700'
            >
              Update
            </button>
            <button
              onClick={() => setDialogDisplay('delete')}
              className='p-2 bg-red-600 text-white rounded-md border-none cursor-pointer w-full hover:bg-red-700'
            >
              Delete
            </button>
          </>
        )}
      </div>
      {dialogDisplay === 'none' && loading && (
        <div className='absolute top-0 bottom-0 right-0 left-0 bg-gray-700 opacity-50 flex justify-center items-center'>
          <div className='inline-app-loader' />
        </div>
      )}

      <ConfirmDialog
        isOpen={dialogDisplay !== 'none'}
        title={`${dialogDisplay} Node`}
        description={`Are you sure you want to ${dialogDisplay} this node?`}
        onClose={() => setDialogDisplay('none')}
        onConfirm={handleDialogConfirm}
        isDelete={dialogDisplay === 'delete'}
        loading={loading}
      />
    </div>
  )
}

export default NodePanelBase
