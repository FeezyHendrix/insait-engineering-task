import React, { useState, useEffect } from 'react'
import { PiCornersOut } from 'react-icons/pi'
import { FiPlusCircle } from 'react-icons/fi'
import { NodeDataProps, NodePanelProps } from '@/types/agent-builder'
import { toast } from 'react-toastify'
import RichEditor from './RichEditor'

const MessagePanel = ({
  selectedNode,
  characters,
  updateNodeData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  const handleWrapperClick = () => {
    if (nodeData.visibleCondition) {
      const newNode = {
        ...nodeData,
        visibleCondition: null,
      }
      setNodeData(newNode)
      handleSubmitNodeData(newNode)
    }
  }

  const handleNodeContentChange = (value: string) => {
    setNodeData(prev => ({
      ...prev,
      message: value,
    }))
  }

  const handleVariantMessageChange = (variantId: string, content: string) => {
    const currentVariantNodeData = nodeData.variants || []
    const updatedVariants = currentVariantNodeData.map(variant =>
      variant.id === variantId ? { ...variant, message: content } : variant
    )
    setNodeData({ ...nodeData, variants: updatedVariants })
  }

  const handleSubmitNodeData = (latestNode?: NodeDataProps) => {
    const responseToSend = latestNode !== undefined ? latestNode : nodeData
    updateNodeData(selectedNode.id, responseToSend)
  }

  const handleAddVariant = () => {
    const newVariant = {
      id: `${Date.now()}`,
      message: '',
    }

    const existingVariant = nodeData?.variants || []

    const newNode: NodeDataProps = {
      ...nodeData,
      variants: [...existingVariant, newVariant],
    }
    setNodeData(newNode)
    handleSubmitNodeData(newNode)
  }

  const handleRemoveVariant = (variantId: string) => {
    const existingVariant = nodeData?.variants || []
    const updatedVariants = existingVariant.filter(v => v.id !== variantId)
    const updatedConditions = { ...nodeData.variantConditions }
    delete updatedConditions[variantId]

    const newNode = {
      ...nodeData,
      variants: updatedVariants,
      variantConditions: updatedConditions,
      visibleCondition:
        nodeData.visibleCondition?.variantId === variantId
          ? null
          : nodeData.visibleCondition,
    }

    setNodeData(newNode)
    handleSubmitNodeData(newNode)
  }

  const handleConditionVisibility = (
    e: React.MouseEvent,
    variantId: string
  ) => {
    e.stopPropagation()

    // If clicking the currently visible condition, close it
    if (nodeData.visibleCondition?.variantId === variantId) {
      const newNode = {
        ...nodeData,
        visibleCondition: null,
      }
      setNodeData(newNode)
      handleSubmitNodeData(newNode)
      return
    }

    // Otherwise, show the clicked condition
    const newNode = {
      ...nodeData,
      visibleCondition: { variantId, activeTab: 'all' },
      conditions: nodeData.conditions || [],
      variantConditions: {
        ...nodeData.variantConditions,
        [variantId]:
          (nodeData?.variantConditions &&
            nodeData?.variantConditions[variantId]) ||
          {},
      },
    }

    setNodeData(newNode)
    handleSubmitNodeData(newNode)
  }

  const handleAddCondition = () => {
    const currentConditions = nodeData.conditions || []
    const hasEmptyCondition = currentConditions.some(
      condition => !condition.variable || !condition.value
    )

    if (hasEmptyCondition) {
      toast.error(
        'Please complete the current condition before adding a new one.'
      )
      return
    }

    const newNode = {
      ...nodeData,
      conditions: [
        ...currentConditions,
        {
          id: `${currentConditions.length + 1}`,
          variable: '',
          value: '',
        },
      ],
      conditionCount: (nodeData.conditionCount || 0) + 1,
    }

    setNodeData(newNode)
    handleSubmitNodeData(newNode)
  }

  const handleRemoveCondition = (variantId: string, conditionId: string) => {
    const existingCondition = nodeData?.conditions || []
    const updatedConditions = existingCondition.filter(
      c => c.id !== conditionId
    )
    const updatedVariantConditions = { ...nodeData.variantConditions }

    if (updatedVariantConditions[variantId]) {
      delete updatedVariantConditions[variantId][conditionId]
    }

    const newNode = {
      ...nodeData,
      conditions: updatedConditions,
      variantConditions: updatedVariantConditions,
      conditionCount: Math.max(1, nodeData?.conditionCount || 0 - 1),
    }

    setNodeData(newNode)
    handleSubmitNodeData(newNode)
  }

  const handleConditionChange = (
    variantId: string,
    conditionId: string,
    field: 'variable' | 'value',
    value: string
  ) => {
    const existingCondition = nodeData?.conditions || []
    const existingVariant = nodeData?.variantConditions || {}

    const updatedConditions = existingCondition.map(condition =>
      condition.id === conditionId
        ? { ...condition, [field]: value }
        : condition
    )

    const updatedVariantConditions = {
      ...existingVariant,
      [variantId]: {
        ...(existingVariant[variantId] || {}),
        [conditionId]:
          field === 'value'
            ? value
            : existingVariant[variantId]?.[conditionId] || '',
      },
    }

    const newNode = {
      ...nodeData,
      conditions: updatedConditions,
      variantConditions: updatedVariantConditions,
    }

    setNodeData(newNode)
    handleSubmitNodeData(newNode)
  }

  const setActiveTabForCondition = (tab: string) => {
    if (nodeData.visibleCondition) {
      const newNode = {
        ...nodeData,
        visibleCondition: { ...nodeData.visibleCondition, activeTab: tab },
      }
      setNodeData(newNode)
      handleSubmitNodeData(newNode)
    }
  }

  const getConditionCount = (variantId: string) => {
    const conditions =
      (nodeData.variantConditions && nodeData.variantConditions[variantId]) ||
      {}
    const nonEmptyConditions = nodeData.conditions?.filter(
      condition => condition.variable && conditions[condition.id]?.trim()
    )
    return nonEmptyConditions?.length || 'Condition'
  }

  const handleClose = () => {
    handleSubmitNodeData()
    onClose && onClose()
  }

  return (
    <div
      className={`w-[400px] bg-white p-5 border border-[#ddd] overflow-x-hidden overflow-y-auto max-h-full flex flex-col`}
      onClick={handleWrapperClick}
    >
      <h3 className='border-b border-gray-300 p-2 pl-0 mb-4 font-semibold text-gray-700'>
        {selectedNode?.data?.label}
      </h3>
      <RichEditor
        value={nodeData?.message || ''}
        onChange={value => {
          handleNodeContentChange(value)
        }}
        onBlur={() => handleSubmitNodeData()}
        placeholder='Enter agent message'
        characters={characters}
        className='min-h-[160px]'
      />

      <div className='flex justify-between items-center py-4 pb-2 border-b border-gray-200'>
        <strong>Variants</strong>
        <FiPlusCircle
          className='cursor-pointer'
          size={20}
          onClick={handleAddVariant}
        />
      </div>

      {nodeData?.variants &&
        nodeData?.variants?.length > 0 &&
        nodeData.variants.map(variant => (
          <div
            key={variant.id}
            className='mb-2.5 mt-3.5 pb-2.5 border-b border-gray-300'
          >
            <RichEditor
              value={variant?.message || ''}
              onChange={value => {
                handleVariantMessageChange(variant.id, value)
              }}
              onBlur={() => handleSubmitNodeData()}
              placeholder='Enter variant message'
              characters={characters}
              className='min-h-[160px]'
            />

            <button
              className={`flex items-center justify-center gap-2 p-2 mt-2 mb-3 border border-gray-300 rounded 
              ${
                !nodeData.conditions?.length
                  ? 'bg-gray-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={e => handleConditionVisibility(e, variant.id)}
            >
              <PiCornersOut size={19} />
              <span>{getConditionCount(variant.id)}</span>
            </button>

            {nodeData.visibleCondition?.variantId === variant.id && (
              <div
                className='absolute right-[200px] w-[350px] bg-[#f9f9f9] p-2.5 border border-[#ddd] rounded-lg z-[30]'
                style={{
                  minHeight: `${
                    80 + ((nodeData.conditions?.length || 0) - 1) * 31
                  }px`,
                }}
                onClick={e => e.stopPropagation()}
              >
                <div className='flex justify-between mb-2.5'>
                  <div className='flex bg-gray-100 p-1 rounded w-[70%] mt-2'>
                    <div
                      className={`p-1 px-2 cursor-pointer rounded w-1/2 text-center
                      ${
                        nodeData.visibleCondition.activeTab === 'all'
                          ? 'bg-white'
                          : ''
                      }`}
                      onClick={() => setActiveTabForCondition('all')}
                    >
                      Match all
                    </div>
                    <div
                      className={`p-1 px-2 cursor-pointer rounded w-1/2 text-center
                      ${
                        nodeData.visibleCondition.activeTab === 'any'
                          ? 'bg-white'
                          : ''
                      }`}
                      onClick={() => setActiveTabForCondition('any')}
                    >
                      Match any
                    </div>
                  </div>
                  <button
                    className='mt-2 px-2 hover:bg-gray-200 rounded'
                    onClick={handleAddCondition}
                  >
                    +
                  </button>
                </div>

                {nodeData.conditions?.map((condition, i) => (
                  <div key={i} className='flex items-center mb-1'>
                    <span className='mx-1'>if</span>
                    <select
                      className='mr-4 bg-[#f9f9f9] outline-none rounded'
                      value={condition.variable || ''}
                      onChange={e =>
                        handleConditionChange(
                          variant.id,
                          condition.id,
                          'variable',
                          e.target.value
                        )
                      }
                    >
                      <option value='' disabled>
                        Select
                      </option>
                      {characters &&
                        characters.map((char, i) => (
                          <option key={i} value={char}>
                            {char}
                          </option>
                        ))}
                    </select>
                    <span className='mx-1'>is</span>
                    <input
                      type='text'
                      className='bg-[#f9f9f9] outline-none mx-1'
                      placeholder='value or {var}'
                      value={
                        (nodeData.variantConditions &&
                          nodeData.variantConditions[variant.id]?.[
                            condition.id
                          ]) ||
                        ''
                      }
                      onChange={e =>
                        handleConditionChange(
                          variant.id,
                          condition.id,
                          'value',
                          e.target.value
                        )
                      }
                      disabled={!condition.variable}
                    />
                    <button
                      className={`px-2 ml-2 hover:bg-gray-200`}
                      onClick={() =>
                        handleRemoveCondition(variant.id, condition.id)
                      }
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      <div className='flex justify-center items-end flex-1'>
        <button
          onClick={handleClose}
          className='p-2 bg-[#007bff] text-white rounded-md border-none cursor-pointer w-full shadow-[0px_4px_6px_rgba(0,0,0,0.1)] hover:bg-[#0056b3]'
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default MessagePanel
