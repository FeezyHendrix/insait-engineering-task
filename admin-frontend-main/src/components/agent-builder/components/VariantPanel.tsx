import React, { useState } from 'react'
import AddVariable from './AddVariable'
import { FiTrash2 } from 'react-icons/fi'
import { VariableDataProps, VariantPanelProps } from '@/types/agent-builder'
import { LuMinimize, LuMaximize } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'

const VariablePanel = ({
  variableData,
  functionData,
  setVariableData,
}: VariantPanelProps) => {
  const [selectedVariable, setSelectedVariable] =
    useState<VariableDataProps | null>(null)
  const [showVariableModal, setShowVariableModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleEditVariable = (selected: VariableDataProps) => {
    setSelectedVariable(selected)
    setShowVariableModal(prevState => !prevState)
  }
  const handleNewVariable = () => {
    setSelectedVariable(null)
    setShowVariableModal(prevState => !prevState)
  }

  const handleDeleteClick = (
    e: React.MouseEvent,
    selected: VariableDataProps
  ) => {
    e.stopPropagation()
    setSelectedVariable(selected)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (selectedVariable?.id !== null) {
      setVariableData(prevData =>
        prevData.filter(item => item.id !== selectedVariable?.id)
      )
      setShowDeleteDialog(false)
      setSelectedVariable(null)
    }
  }

  return (
    <div
      className={`relative flex  gap-3 bg-white p-2 rounded-2xl w-52 border-[0.1px] border-blue-300 shadow-xl ${
        isExpanded ? 'h-56 min-h-[250px] flex-col' : 'h-11'
      }`}
    >
      <strong className={`text-center w-full`}>
        Fields
        {!isExpanded && (
          <span className='ms-1'>({variableData?.length || 0})</span>
        )}
      </strong>

      {isExpanded ? (
        <div className='overflow-x-hidden overflow-y-auto max-h-[130px] pb-3 scroll-smooth'>
          {variableData.map(variable => (
            <div
              key={variable.id}
              className='bg-white rounded-md p-1 mb-1 border-[0.1px] border-[#94C5F8] flex justify-between px-2 items-center'
              style={{ backgroundColor: variable.color + '40' }}
            >
              <p
                className='m-0 text-base text-center cursor-pointer text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap w-36'
                onClick={() => handleEditVariable(variable)}
              >
                {variable.value}
              </p>
              <FiTrash2
                size={14}
                className='text-red-400 hover:text-red-600 cursor-pointer'
                onClick={e => handleDeleteClick(e, variable)}
              />
            </div>
          ))}
        </div>
      ) : null}

      <button
        className={`absolute  transform -translate-y-1/4 border-none bg-blue-500 text-white text-2xl w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 ${
          isExpanded
            ? 'bottom-0 left-1/2 transform -translate-x-1/2 '
            : 'top-3 left-2'
        }`}
        onClick={handleNewVariable}
      >
        +
      </button>

      <button
        className={`text-xl absolute right-2 bottom-3`}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        {isExpanded ? <LuMinimize /> : <LuMaximize />}
      </button>

      <AddVariable
        showVariableModal={showVariableModal}
        setShowVariableModal={setShowVariableModal}
        variableData={variableData}
        functionData={functionData}
        setVariableData={setVariableData}
        selectedVariable={selectedVariable}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedVariable(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default VariablePanel
