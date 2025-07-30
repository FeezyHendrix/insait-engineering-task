import {
  AgentNodePanelProps,
  DIALOG_TYPE,
  NODE_CREATE_TYPE,
  UpdateNodeRequestType,
} from '@/types/agent-builder'
import { useState, useEffect, useMemo } from 'react'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { createNode, deleteNode } from '@/redux/slices/agentBuilder/request'
import ConfirmDialog from '../components/ConfirmDialog'
import { TextareaWithIcon } from '@/components/elements/Input'

const CollectionPanel = ({
  selectedNode,
  updateNodeData,
  onClose,
  submitUpdate,
}: AgentNodePanelProps) => {
  const dispatch = useAppDispatch()

  const fieldData =
    useAppSelector((state) => state.builder.currentFlowData?.fields) ?? []
  const { currentFlowId, currentFlowData } = useAppSelector(
    (state) => state.builder
  )

  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const [dialogDisplay, setDialogDisplay] = useState<DIALOG_TYPE>('none')
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible)
  }

  const handleSelect = (item: string) => {
    setDropdownVisible((prev) => !prev)

    if (item !== 'No fields exist') {
      const existingFieldsToCollect = nodeData.fields_to_collect || []
      const newNode = {
        ...nodeData,
        fields_to_collect: [...existingFieldsToCollect, item],
      }
      updateNodeData(selectedNode.id, newNode)
    }
  }

  const removeItemFromList = (fieldToRemove: string) => {
    const existingFieldsToCollect = nodeData?.fields_to_collect || []
    const newNode = {
      ...nodeData,
      fields_to_collect: existingFieldsToCollect.filter(
        (field: string) => field !== fieldToRemove
      ),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const updateRules = (updateFn: (rules_to_remember: string[]) => string[]) => {
    const newNode = {
      ...nodeData,
      rules_to_remember: updateFn(nodeData?.rules_to_remember || []),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const addRule = () => {
    const hasEmptyRule = nodeData.rules_to_remember?.some(
      (rule) => !rule.trim()
    )

    if (hasEmptyRule) {
      toast.error('Please fill in the current rule before adding a new one.')
      return
    }

    updateRules((rules_to_remember) => [...rules_to_remember, ''])
  }

  const removeRule = (ruleToRemove: string) => {
    updateRules((rules_to_remember) =>
      rules_to_remember.filter((item) => item !== ruleToRemove)
    )
  }

  const handleRuleContentChange = (index: number, newValue: string) => {
    setNodeData((prevNodeData) => {
      const currentRuleNodeData = prevNodeData.rules_to_remember || []
      return {
        ...prevNodeData,
        rules_to_remember: currentRuleNodeData.map((rule, i) =>
          i === index ? newValue : rule
        ),
      }
    })
  }

  const dropItem = useMemo(() => {
    if (
      !nodeData?.fields_to_collect ||
      nodeData.fields_to_collect.length === 0
    ) {
      return fieldData?.map((item) => item.properties.name) || []
    }

    const existingField = nodeData.fields_to_collect || []

    return (
      fieldData
        ?.map((item) => item.properties.name)
        .filter((value) => !existingField.includes(value)) || [
        'No fields exist',
      ]
    )
  }, [fieldData, nodeData?.fields_to_collect])

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeData((prevNodeData) => ({
      ...prevNodeData,
      name: e.target.value,
    }))
  }

  const handleSubmitData = () => {
    updateNodeData(selectedNode.id, nodeData)
  }

  const handleSave = async () => {
    const data = {
      properties: {
        ...nodeData,
        is_root_node: !currentFlowData || currentFlowData.nodes.length === 0,
      },
      type: 'COLLECTION' as NODE_CREATE_TYPE,
      agent_builder_properties: {
        position: selectedNode.position,
      },
    }

    await dispatch(createNode({ flowId: currentFlowId, data }))
  }

  const handleUpdate = async () => {
    const updateData: UpdateNodeRequestType = {
      flowId: currentFlowId,
      nodeId: selectedNode.id,
      data: {
        properties: nodeData,
        type: 'COLLECTION' as NODE_CREATE_TYPE,
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
    setLoading(true)
    if (dialogDisplay === 'create') {
      await handleSave()
    }
    if (dialogDisplay === 'delete') {
      await handleDelete()
    }
    if (dialogDisplay === 'update') {
      await handleUpdate()
    }
    onClose && onClose()
    setLoading(false)
    setDialogDisplay('none')
  }

  const handleValidation = (type: DIALOG_TYPE) => {
    if (nodeData.fields_to_collect?.length === 0) {
      toast.error('Please select fields to collect')
      return
    }
    if (!nodeData.name) {
      toast.error('Please specify collection name')
      return
    }
    setDialogDisplay(type)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  return (
    <div
      className={`w-[400px] bg-white p-5 border-l border-gray-300 overflow-x-hidden max-h-full overflow-y-auto flex flex-col`}
    >
      <div className='border-b border-gray-300 p-2 pl-0 mb-4 font-semibold text-gray-700'>
        <input
          className='w-full'
          value={nodeData?.name}
          onChange={handleLabelChange}
          onBlur={handleSubmitData}
        />
      </div>

      <div className='flex justify-between items-center'>
        <strong>Fields To Collect</strong>
        <div className='flex gap-4 items-center justify-center'>
          <FiPlusCircle
            className='cursor-pointer'
            size={20}
            onClick={toggleDropdown}
          />
        </div>
      </div>

      <div className='relative border-b border-gray-300 py-3'>
        {isDropdownVisible && (
          <div className='mt-2 bg-white border border-gray-300 rounded-md shadow-md absolute top-0 left-0 z-20 w-full'>
            {dropItem.map((variable, index) => (
              <p
                key={index}
                className='text-center cursor-pointer'
                onClick={() => handleSelect(variable)}
              >
                {variable}
              </p>
            ))}
            {/* <p className='text-sm cursor-pointer text-center w-full mt-2 underline mb-2'>
              Create Field
            </p> */}
          </div>
        )}
        {isDropdownVisible && dropItem.length == 0 && (
          <div className='bg-white border border-gray-300 rounded-md shadow-md absolute top-0 left-0 z-20 w-full'>
            <p className='text-center'>No fields exist</p>
          </div>
        )}

        <div className='z-10 flex flex-col gap-2'>
          {nodeData?.fields_to_collect &&
            nodeData?.fields_to_collect.map((item: string, index: number) => (
              <div key={index} className='flex justify-between'>
                <p>{item}</p>
                <div className='flex gap-8 items-center justify-center'>
                  <FiMinusCircle
                    className='cursor-pointer'
                    size={20}
                    onClick={() => removeItemFromList(item)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className='mt-4 mb-5 flex flex-col gap-3'>
        <TextareaWithIcon
          label='How to ask:'
          placeholder='Input how to ask'
          name='how_to_ask'
          rows={3}
          onChange={(e) =>
            setNodeData((prev) => ({
              ...prev,
              how_to_ask: e.target.value,
            }))
          }
          className={'!pt-2'}
          value={nodeData?.how_to_ask || ''}
        />

        <div className='border-b border-gray-300 pt-2' />

        <div className='flex justify-between'>
          <strong>Rules to Remember</strong>
          <FiPlusCircle
            className='cursor-pointer'
            size={20}
            onClick={addRule}
          />
        </div>
        {nodeData?.rules_to_remember &&
          nodeData?.rules_to_remember?.length > 0 &&
          nodeData.rules_to_remember.map((item, index) => (
            <div key={index} className='pt-1 flex gap-2 items-center'>
              <div className='py-1.5 bg-gray-100 w-full rounded-md'>
                <input
                  onChange={(e) =>
                    handleRuleContentChange(index, e.target.value)
                  }
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

        <TextareaWithIcon
          label='General Instruction'
          placeholder='Enter Instruction'
          name='general_instructions'
          rows={3}
          onChange={(e) =>
            setNodeData((prev) => ({
              ...prev,
              general_instructions: e.target.value,
            }))
          }
          className={'!pt-2'}
          value={nodeData?.general_instructions || ''}
        />
      </div>

      <div className='flex justify-center items-end flex-1 gap-8 px-4'>
        {!selectedNode.created_at ? (
          <button
            onClick={() => handleValidation('create')}
            className='p-2 bg-blue-600 text-white rounded-md border-none cursor-pointer w-full  hover:bg-blue-700'
          >
            Save
          </button>
        ) : (
          <>
            <button
              onClick={() => handleValidation('update')}
              className='p-2 bg-blue-600 text-white rounded-md border-none cursor-pointer w-full  hover:bg-blue-700'
            >
              Update
            </button>
            <button
              onClick={() => setDialogDisplay('delete')}
              className='p-2 bg-red-600 text-white rounded-md border-none cursor-pointer w-full  hover:bg-red-700'
            >
              Delete
            </button>
          </>
        )}
      </div>

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

export default CollectionPanel
