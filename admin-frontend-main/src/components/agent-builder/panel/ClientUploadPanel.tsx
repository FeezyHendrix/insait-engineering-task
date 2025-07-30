import { NodePanelProps } from '@/types/agent-builder'
import React, { useState, useEffect } from 'react'

import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnLink,
  Editor,
  EditorProvider,
  Toolbar,
} from 'react-simple-wysiwyg'

const ClientUploadPanel = ({
  selectedNode,
  variableData,
  updateNodeData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)

  const handleUpdateNodeData = (key: string, value: any) => {
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

  const handleSubmitNodeData = () => {
    updateNodeData(selectedNode.id, nodeData)
  }

  const handleClose = () => {
    handleSubmitNodeData()
    onClose && onClose()
  }

  return (
    <div
      className={`w-[400px] bg-white p-5 border-l border-gray-300 ${
        selectedNode ? 'block' : 'hidden'
      } overflow-x-hidden max-h-full overflow-y-auto flex flex-col gap-5`}
    >
      <h3 className='border-b border-gray-300 p-2 pl-0 font-semibold text-gray-700'>
        {nodeData?.label}
      </h3>

      <div>
        <h3 className='mb-5 text-md font-bold'>Capture Response</h3>
        <p className='text-sm'>Apply to</p>
        <select
          value={nodeData?.clientVariable || ''}
          onChange={e => handleUpdateNodeData('clientVariable', e.target.value)}
          className='w-full bg-transparent font-medium text-gray-700 cursor-pointer outline-none p-2 border border-gray-200 rounded-md'
        >
          <option value='' disabled>
            Select Option
          </option>
          {variableData &&
            variableData?.length > 0 &&
            variableData.map(item => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
        </select>
      </div>

      <div>
        <strong>System prompt</strong>
        <div className='mb-2.5 border-b border-gray-300'>
          <EditorProvider>
            <Editor
              className='min-h-[120px]'
              placeholder='Enter System Prompt'
              value={nodeData?.systemPrompt}
              onChange={e => {
                setNodeData(prev => ({
                  ...prev,
                  systemPrompt: e.target.value,
                }))
              }}
              onBlur={handleSubmitNodeData}
            >
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnStrikeThrough />
                <BtnLink />
              </Toolbar>
            </Editor>
          </EditorProvider>
        </div>
      </div>

      <div className='mt-6 flex justify-between items-end flex-1'>
        <button
          className='class="bg-blue-500 text-white px-6 py-2 rounded-lg bg-blue-600 flex items-center gap-2 w-full justify-center'
          onClick={handleClose}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default ClientUploadPanel
