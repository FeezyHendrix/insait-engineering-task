import { NodePanelProps } from '@/types/agent-builder'
import { useState, useEffect } from 'react'

import { FaRegCaretSquareLeft } from 'react-icons/fa'
import SimpleEditor from '../components/SimpleEditor'
import RichEditor from '../components/RichEditor'

const PromptRightPanel = ({
  selectedNode,
  updateNodeData,
  handlePlay,
  handleDelay,
  handleExtendWindow,
  variableData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)

  const handleSubmitNodeData = () => {
    updateNodeData(selectedNode.id, nodeData)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  return (
    <div
      className={`w-[400px] bg-white p-5 border-l border-gray-300 ${
        selectedNode ? 'block' : 'hidden'
      } overflow-x-hidden max-h-full overflow-y-auto flex flex-col`}
    >
      <div>
        <FaRegCaretSquareLeft
          size={20}
          className='float-right cursor-pointer me-4 mt-4'
          onClick={handleExtendWindow}
        />
      </div>

      <h3 className=' font-semibold text-gray-700 mb-4'>
        {selectedNode?.data?.label}
      </h3>

      <div className='mb-8 border-b border-gray-300'>
        <SimpleEditor
          label={`Description`}
          value={nodeData?.message || ''}
          onChange={e => {
            setNodeData(prev => ({ ...prev, message: e.target.value }))
          }}
          handlePlay={handlePlay}
          handleDelay={handleDelay}
        />
      </div>

      <div>
        <h3 className='pl-0 mb-2 font-semibold'>System Prompt</h3>

        <RichEditor
          value={nodeData?.message || ''}
          onChange={value => {
            setNodeData(prev => ({ ...prev, systemPrompt: value }))
          }}
          onBlur={() => handleSubmitNodeData()}
          placeholder='Enter agent message'
          characters={variableData?.map(item => item.value)}
          className='min-h-[160px]'
        />
      </div>

      <div className='flex-1 flex items-end'>
        <button
          onClick={() => {
            handleSubmitNodeData()
            onClose && onClose()
          }}
          className='p-2.5 bg-[#007bff] text-white rounded-md border-none cursor-pointer w-full shadow-md mt-auto hover:bg-[#0056b3]'
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default PromptRightPanel
