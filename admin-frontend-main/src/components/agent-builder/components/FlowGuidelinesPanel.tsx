import React, { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { FlowGuideline, NewFlowType } from '@/types/agent-builder'
import { LuMinimize, LuMaximize } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import CreateGuideline from './CreateGuideline'
import { updateBuilderFlow } from '@/redux/slices/agentBuilder/request'
import { toast } from 'react-toastify'

const FlowGuidelinesPanel = () => {
  const dispatch = useAppDispatch()

  const flowGuidelines =
    useAppSelector(
      (state) => state.builder.currentFlowData?.flow.properties?.guidelines
    ) ?? []
  const { currentFlowId, loading, currentFlowData } = useAppSelector(
    (state) => state.builder
  )

  const [selectedGuideline, setSelectedGuideline] =
    useState<FlowGuideline | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const handleEditVariable = (selected: FlowGuideline) => {
    setSelectedGuideline(selected)
    setShowModal((prevState) => !prevState)
  }
  const handleNewVariable = () => {
    setSelectedGuideline(null)
    setShowModal((prevState) => !prevState)
  }

  const handleDeleteClick = (e: React.MouseEvent, selected: FlowGuideline) => {
    e.stopPropagation()
    setSelectedGuideline(selected)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (currentFlowData && currentFlowData?.flow.properties) {
      const newGuidelines = (
        currentFlowData.flow.properties.guidelines || []
      ).filter((g) => g.name !== selectedGuideline?.name)

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
        return
      }

      toast.success(`Guideline removed successfully`)
      setShowDeleteDialog(false)
      setSelectedGuideline(null)
    }
  }

  return (
    <div
      className={`relative flex  gap-3 bg-white p-2 rounded-2xl w-52 border-[0.1px] border-blue-300 shadow-xl ${
        isExpanded ? 'h-56 min-h-[250px] flex-col' : 'h-11'
      }`}
    >
      <strong className={`text-center w-full`}>
        Guidelines
        {!isExpanded && (
          <span className='ms-1'>({flowGuidelines?.length || 0})</span>
        )}
      </strong>

      {isExpanded ? (
        <div className='overflow-x-hidden overflow-y-auto max-h-[130px] pb-3 scroll-smooth'>
          {flowGuidelines.map((guideline, i) => (
            <div
              key={i}
              className='bg-white rounded-md p-1 mb-1 border-[0.1px] border-[#94C5F8] flex justify-between px-2 items-center'
            >
              <p
                className='m-0 text-base text-center cursor-pointer text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap w-36'
                onClick={() => handleEditVariable(guideline)}
              >
                {guideline.name}
              </p>
              <FiTrash2
                size={14}
                className='text-red-400 hover:text-red-600 cursor-pointer'
                onClick={(e) => handleDeleteClick(e, guideline)}
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
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? <LuMinimize /> : <LuMaximize />}
      </button>

      <CreateGuideline
        showModal={showModal}
        setShowModal={setShowModal}
        selectedGuideline={selectedGuideline}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={`Delete ${selectedGuideline?.name}`}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedGuideline(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  )
}

export default FlowGuidelinesPanel
