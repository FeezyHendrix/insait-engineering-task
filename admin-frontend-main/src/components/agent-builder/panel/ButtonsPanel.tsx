import CustomTooltip from '@/components/elements/CustomTooltip'
import { NodePanelProps, ToggleProps } from '@/types/agent-builder'
import { useEffect, useState } from 'react'
import { FaMinus } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'

const ButtonsPanel = ({ selectedNode, updateNodeData }: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const [isExpanded, setIsExpanded] = useState(true)
  const [newButtonLabel, setNewButtonLabel] = useState('')

  const toggleSection = () => {
    setIsExpanded(!isExpanded)
  }

  const addButton = () => {
    if (!newButtonLabel.trim()) return
    const currentButtons = nodeData?.buttons || []
    handleUpdateNodeDate('buttons', [
      ...currentButtons,
      {
        id: currentButtons.length + 1,
        label: newButtonLabel,
        value: newButtonLabel.toLowerCase().replace(/\s+/g, '_'),
      },
    ])

    setNewButtonLabel('')
  }

  const removeButton = (id: string) => {
    const filteredSection = nodeData.buttons?.filter(item => item.id !== id)
    handleUpdateNodeDate('buttons', filteredSection)
  }

  const handleUpdateNodeDate = (key: string, value: any) => {
    const newNode = {
      ...nodeData,
      [key]: value,
    }
    updateNodeData(selectedNode.id, newNode)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  return (
    <div className='w-[400px] bg-white p-6 border-l border-gray-200 h-full overflow-y-auto'>
      <div className='mb-3'>
        <h3>{nodeData?.label}</h3>
      </div>

      {/* Buttons Section */}
      <div className='mb-6 pt-2'>
        <div className='flex justify-between items-center mb-4 cursor-pointer'>
          <h3
            onClick={toggleSection}
            className='text-lg font-medium text-gray-800'
          >
            Buttons
          </h3>
          <div className='flex items-center gap-5'>
            <CustomTooltip title={`Multi Select Toggle`} noWrap={true}>
              <Toggle
                checked={nodeData?.isMultiSelectEnabled || false}
                onChange={val =>
                  handleUpdateNodeDate('isMultiSelectEnabled', val)
                }
              />
            </CustomTooltip>
            <button
              className='text-gray-400 hover:text-gray-600 transform transition-transform duration-200'
              onClick={toggleSection}
            >
              <span
                className={`transform inline-block transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                <IoIosArrowDown size={20} />
              </span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className='space-y-4'>
            {nodeData?.buttons &&
              nodeData?.buttons?.length > 0 &&
              nodeData.buttons.map(button => (
                <div
                  key={button.id}
                  className='flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg'
                >
                  <span className='text-gray-700'>{button.label}</span>
                  <button
                    onClick={() => removeButton(button.id)}
                    className='text-gray-400 hover:text-gray-600'
                  >
                    <FaMinus size={14} />
                  </button>
                </div>
              ))}

            <div className='flex items-center gap-2'>
              <input
                type='text'
                value={newButtonLabel}
                onChange={e => setNewButtonLabel(e.target.value)}
                placeholder='Enter button label or {variable}'
                className='flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                onKeyPress={e => e.key === 'Enter' && addButton()}
              />
              <button
                onClick={addButton}
                className='text-blue-500 bg-blue-50 px-4 py-2 rounded-md hover:bg-blue-100'
                disabled={!newButtonLabel.trim()}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Options Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-700'>No match</span>
          <Toggle
            checked={nodeData?.noMatch || false}
            onChange={val => handleUpdateNodeDate('noMatch', val)}
          />
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-gray-700'>No reply</span>
          <Toggle
            checked={nodeData?.noReply || false}
            onChange={val => handleUpdateNodeDate('noReply', val)}
          />
        </div>

        {/* <div className='flex items-center justify-between'>
          <span className='text-gray-700'>Listen for other triggers</span>
          <Toggle
            checked={nodeData?.listenForTrigger || false}
            onChange={val => handleUpdateNodeDate("listenForTrigger", val)}
          />
        </div> */}
      </div>
    </div>
  )
}

export default ButtonsPanel

const Toggle = ({ checked, onChange }: ToggleProps) => {
  return (
    <div
      className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
        checked ? 'bg-blue-500' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        } shadow-md mt-0.5`}
      />
    </div>
  )
}
