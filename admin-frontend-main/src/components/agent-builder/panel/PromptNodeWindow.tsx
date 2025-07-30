import Modal from '@/components/elements/Modal'
import { NodePanelProps } from '@/types/agent-builder'
import { useState, useEffect } from 'react'
import { FaPlay, FaClock } from 'react-icons/fa'
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

const PromptNodeWindow = ({
  updateNodeData,
  selectedNode,
  handlePlay,
  handleDelay,
  handleExtendWindow,
  isOpenModal = false,
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

  const handleClose = () => {
    handleExtendWindow && handleExtendWindow()
  }

  return (
    <>
      {/* Modal Overlay */}
      <Modal
        isOpen={isOpenModal}
        toggle={handleClose}
        additionalClass='overflow-y-auto p-0 min-w-[50%] max-h-[75%]'
      >
        <div
          className='w-full bg-gray-100 p-5 border border-gray-300 flex flex-col z-[100003] shadow-lg rounded-lg h-full'
          onClick={e => e.stopPropagation()}
        >
          <h3 className='font-semibold'>Description</h3>
          <div className='mb-8 border-b border-gray-300'>
            <EditorProvider>
              <Editor
                className='min-h-[160px]'
                placeholder='Enter prompt'
                value={nodeData?.message || ''}
                onChange={e => {
                  setNodeData(prev => ({ ...prev, message: e.target.value }))
                }}
                onBlur={handleSubmitNodeData}
              >
                <Toolbar>
                  <FaPlay
                    onClick={handlePlay}
                    className='text-white stroke-black stroke-[10px] text-sm ms-2 me-1'
                  />
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnStrikeThrough />
                  <BtnLink />
                  <div className='flex-1 flex items-center justify-between px-3'>
                    <FaClock
                      onClick={handleDelay}
                      className='text-white stroke-black stroke-[10px] text-sm'
                    />
                  </div>
                </Toolbar>
              </Editor>
            </EditorProvider>
          </div>

          <h3 className='font-semibold'>System Prompt</h3>
          <div className='mb-2.5 border-b border-gray-300'>
            <EditorProvider>
              <Editor
                className='min-h-[250px]'
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
                  <FaPlay
                    onClick={handlePlay}
                    className='text-white stroke-black stroke-[10px] text-sm ms-2 me-1'
                  />
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnStrikeThrough />
                  <BtnLink />
                  <div className='flex-1 flex items-center justify-between px-3'>
                    <FaClock
                      onClick={handleDelay}
                      className='text-white stroke-black stroke-[10px] text-sm'
                    />
                  </div>
                </Toolbar>
              </Editor>
            </EditorProvider>
          </div>

          <button
            onClick={() => {
              handleSubmitNodeData()
              handleExtendWindow && handleExtendWindow()
            }}
            className='p-2.5 bg-[#007bff] text-white rounded-md border-none cursor-pointer w-full shadow-md mt-8 hover:bg-[#0056b3]'
          >
            Save
          </button>
        </div>
      </Modal>
    </>
  )
}

export default PromptNodeWindow
