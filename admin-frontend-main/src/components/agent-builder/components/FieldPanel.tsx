import React, { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { FieldDataProps } from '@/types/agent-builder'
import { LuMinimize, LuMaximize } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'
import CreateField from './CreateField'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { deleteField } from '@/redux/slices/agentBuilder/request'
import { toast } from 'react-toastify'

const FieldPanel = () => {
  const dispatch = useAppDispatch()

  const fieldData =
    useAppSelector((state) => state.builder.currentFlowData?.fields) ?? []
  const { currentFlowId, loading, currentFlowData } = useAppSelector(
    (state) => state.builder
  )

  const [selectedField, setSelectedField] = useState<FieldDataProps | null>(
    null
  )
  const [showModal, setShowModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleEditVariable = (selected: FieldDataProps) => {
    setSelectedField(selected)
    setShowModal((prevState) => !prevState)
  }
  const handleNewVariable = () => {
    setSelectedField(null)
    setShowModal((prevState) => !prevState)
  }

  const handleDeleteClick = (e: React.MouseEvent, selected: FieldDataProps) => {
    e.stopPropagation()

    const activeNodes =
      currentFlowData?.nodes.filter((node) => {
        const groups = node.properties.fields_to_collect_groups || []

        return groups.some((group) =>
          group.fields_to_collect.includes(selected.properties.name)
        )
      }) || []

    if (activeNodes.length > 0) {
      const nodeNames = activeNodes
        .map((node) => node.properties.name)
        .join(',')
      toast.error(`Field is active in the following nodes:  ${nodeNames}`)
      return
    }
    setSelectedField(selected)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedField?.id) {
      const data = { flowId: currentFlowId, id: selectedField.id }
      await dispatch(deleteField(data))
      setShowDeleteDialog(false)
      setSelectedField(null)
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
          <span className='ms-1'>({fieldData?.length || 0})</span>
        )}
      </strong>

      {isExpanded ? (
        <div className='overflow-x-hidden overflow-y-auto max-h-[130px] pb-3 scroll-smooth'>
          {fieldData.map((field) => (
            <div
              key={field.id}
              className='bg-white rounded-md p-1 mb-1 border-[0.1px] border-[#94C5F8] flex justify-between px-2 items-center'
            >
              <p
                className='m-0 text-base text-center cursor-pointer text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap w-36'
                onClick={() => handleEditVariable(field)}
              >
                {field.properties.name}
              </p>
              <FiTrash2
                size={14}
                className='text-red-400 hover:text-red-600 cursor-pointer'
                onClick={(e) => handleDeleteClick(e, field)}
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

      <CreateField
        showModal={showModal}
        setShowModal={setShowModal}
        selectedField={selectedField}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={`Delete ${selectedField?.properties.name}`}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedField(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  )
}

export default FieldPanel
