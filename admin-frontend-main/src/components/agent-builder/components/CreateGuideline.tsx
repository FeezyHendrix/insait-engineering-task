import {
  CreateGuidelineProps,
  FlowGuideline,
  FlowGuidelineReactionType,
  NewFlowType,
} from '@/types/agent-builder'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BaseModal from './BaseModal'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { SwitchInput, TextareaWithExpand } from '@/components/elements/Input'
import { updateBuilderFlow } from '@/redux/slices/agentBuilder/request'

const CreateGuideline = ({
  showModal,
  setShowModal,
  selectedGuideline,
}: CreateGuidelineProps) => {
  const dispatch = useAppDispatch()
  const { currentFlowId, currentFlowData } = useAppSelector(
    (state) => state.builder
  )

  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [reactionType, setReactionType] =
    useState<FlowGuidelineReactionType>('Say X')
  const [allNodes, setAllNodes] = useState<boolean>(false)
  const [nodesList, setNodeList] = useState<string[]>([])
  const [whatToSay, setWhatToSay] = useState<string>('')
  const [destinationNodeId, setDestinationNodeId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const {
      name = '',
      description = '',
      reaction_type = 'Say X',
      all_nodes = false,
      nodes_list = [],
      what_to_say = '',
      destination_node_id = '',
    } = selectedGuideline || {}
    setName(name)
    setDescription(description)
    setReactionType(reaction_type)
    setAllNodes(all_nodes)
    setNodeList(nodes_list)
    setWhatToSay(what_to_say)
    setDestinationNodeId(destination_node_id)
  }, [selectedGuideline, showModal])

  const handleCreateGuideline = async () => {
    const input = name.trim()

    if (!input) {
      toast.error('Guideline name cannot be empty')
      return
    }

    const existingNames = (currentFlowData?.fields || []).map(
      (item) => item.properties.name
    )
    const descriptionLongEnough = description.trim().length > 5
    const startsWithLetter = /^[a-zA-Z]/.test(input)

    if (!startsWithLetter) {
      toast.error('Guideline name must start with a letter.')
      return
    }

    const isNameChanged = selectedGuideline && selectedGuideline.name !== input
    const isUnique = isNameChanged ? !existingNames.includes(input) : true

    if (!isUnique) {
      toast.error('Guideline name must be unique.')
      return
    }

    if (!descriptionLongEnough) {
      toast.error('Description is shorter than minimum length 5')
      return
    }

    setLoading(true)

    const guideline: FlowGuideline = {
      name,
      description,
      reaction_type: reactionType,
      all_nodes: allNodes,
      nodes_list: nodesList.map(String),
      what_to_say: whatToSay,
      destination_node_id: destinationNodeId
        ? String(destinationNodeId)
        : undefined,
    }

    if (currentFlowData?.flow.properties) {
      const newGuidelines = [
        ...(currentFlowData.flow.properties.guidelines || []),
      ]

      if (selectedGuideline) {
        const index = newGuidelines.findIndex(
          (g) => g.name === selectedGuideline.name
        )
        if (index !== -1) {
          newGuidelines[index] = guideline
        } else {
          newGuidelines.push(guideline)
        }
      } else {
        newGuidelines.push(guideline)
      }

      const newFlowData: NewFlowType = {
        name: currentFlowData.flow.name,
        properties: {
          ...currentFlowData.flow.properties,
          guidelines: newGuidelines,
        },
      }

      const response = await dispatch(
        updateBuilderFlow({ data: newFlowData, flowId: currentFlowId })
      )
      const result = response.payload

      if (result?.message) {
        toast.error(result.message)
        setLoading(false)
        return
      }

      toast.success(
        `Guideline ${selectedGuideline ? 'updated' : 'created'} successfully`
      )
      handleCloseModal()
    } else {
      toast.error('Current flow data is missing.')
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setName('')
    setDescription('')
    setReactionType('Say X')
    setAllNodes(false)
    setNodeList([])
    setWhatToSay('')
    setDestinationNodeId('')
    setLoading(false)
    setShowModal(false)
  }

  return (
    <BaseModal
      isOpen={showModal}
      loading={loading}
      onClose={handleCloseModal}
      title={`${selectedGuideline ? 'Edit' : 'Create'} Field`}
      submitButton={{
        text: `${selectedGuideline ? 'Update' : 'Create'} Field`,
        onClick: handleCreateGuideline,
        disabled: !name,
      }}
    >
      <div className='mb-4'>
        <label htmlFor='name' className='block font-bold mb-0.5'>
          Name:
        </label>
        <input
          type='text'
          id='name'
          value={name}
          placeholder='Enter variable name'
          className='w-full p-2 border border-[#ccc] rounded-lg outline-none focus:border-blue-500'
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='mb-4'>
        <label className='font-bold'>Description</label>
        <textarea
          rows={4}
          className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className='mb-2'>
        <SwitchInput
          onChange={(e) => setAllNodes(e.target.checked)}
          className='!flex-row justify-between'
          label='Guidelines active in all nodes'
          placeholder=''
          checked={allNodes}
          showEnableDisableText={false}
          name='allNodes'
        />
      </div>

      {!allNodes && (
        <div className='mb-4'>
          <label className='block font-bold mb-0.5'>Select Nodes:</label>
          <div className='flex flex-wrap gap-2 max-h-40 overflow-auto'>
            {currentFlowData?.nodes?.map((node) => {
              const nodeId = node.id
              const nodeName = node.properties?.name || nodeId
              const isSelected = nodesList.includes(nodeId)

              return (
                <div
                  key={nodeId}
                  onClick={() => {
                    if (isSelected) {
                      setNodeList(nodesList.filter((id) => id !== nodeId))
                    } else {
                      setNodeList([...nodesList, nodeId])
                    }
                  }}
                  className={`cursor-pointer px-3 py-1 rounded-md border select-none ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                  }`}
                >
                  {nodeName}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className='mb-4'>
        <label htmlFor='reaction-type' className='block font-bold mb-0.5'>
          Reaction Type:
        </label>
        <select
          id='reaction-type'
          value={reactionType}
          onChange={(e) =>
            setReactionType(e.target.value as FlowGuidelineReactionType)
          }
          className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
        >
          <option value='Say X'>Say X</option>
          <option value='Go to Node X'>Go to Node X</option>
        </select>
      </div>

      {reactionType === 'Go to Node X' && (
        <div className='mb-4'>
          <label htmlFor='destination-node' className='block font-bold mb-0.5'>
            Destination Node:
          </label>
          <select
            id='destination-node'
            value={destinationNodeId}
            onChange={(e) => setDestinationNodeId(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
          >
            <option value=''>Select a node</option>
            {currentFlowData?.nodes?.map((node) => (
              <option key={node.id} value={node.id}>
                {node.properties.name || node.id}
              </option>
            ))}
          </select>
        </div>
      )}

      {reactionType === 'Say X' && (
        <div className='mb-4'>
          <TextareaWithExpand
            label='What to say'
            placeholder='Enter what to say'
            name='what_to_say'
            rows={3}
            onChange={(e) => setWhatToSay(e.target.value)}
            value={whatToSay}
          />
        </div>
      )}
    </BaseModal>
  )
}

export default CreateGuideline
