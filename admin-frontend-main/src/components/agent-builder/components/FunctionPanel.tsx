import React, { useEffect, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { FunctionDataProps, FunctionPanelProps } from '@/types/agent-builder'
import BaseModal from './BaseModal'
import { LuMinimize, LuMaximize } from 'react-icons/lu'
import ConfirmDialog from './ConfirmDialog'
import useModal from '@/hook/useModal'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { toast } from 'react-toastify'
import { validateName } from '@/utils/botBuilder'

const FunctionPanel = ({
  functionData = [],
  setFunctionData,
}: FunctionPanelProps) => {
  const [selectedFunction, setSelectedFunction] =
    useState<FunctionDataProps | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { toggle, isOpen } = useModal()
  const [code, setCode] = useState('')

  const handleEditFunction = (selected: FunctionDataProps) => {
    setSelectedFunction(selected)
    toggle()
  }
  const handleNewFunction = () => {
    setSelectedFunction(null)
    toggle()
  }

  const handleDeleteClick = (
    e: React.MouseEvent,
    selected: FunctionDataProps
  ) => {
    e.stopPropagation()
    setSelectedFunction(selected)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (selectedFunction?.id !== null) {
      setFunctionData(prevData =>
        prevData.filter(item => item.id !== selectedFunction?.id)
      )
      setShowDeleteDialog(false)
      setSelectedFunction(null)
    }
  }

  const handleCloseModal = () => {
    setCode('')
    toggle(false)
  }

  const handleSubmit = () => {
    if (!code) {
      toast.error('No code entered')
      return
    }

    const functionRegex = /def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/
    const match = code.match(functionRegex)

    if (!match) {
      toast.error('No valid Python function definition found!')
      return
    }

    const functionName = match[1]
    const validation = validateName(
      functionName,
      functionData.map(item => item.name),
      selectedFunction?.name
    )

    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    const newFunc = {
      id: selectedFunction?.id || `${Date.now()}`,
      name: functionName,
      value: code,
    }

    if (selectedFunction) {
      setFunctionData(prevData =>
        prevData.map(item => (item.id === selectedFunction.id ? newFunc : item))
      )
    } else {
      setFunctionData(prev => [...prev, newFunc])
    }

    handleCloseModal()
  }
  const onChange = (value: string) => {
    setCode(value)
  }

  useEffect(() => {
    if (selectedFunction?.value && isOpen) {
      setCode(selectedFunction.value)
    } else {
      setCode('')
    }
  }, [selectedFunction, isOpen])

  return (
    <div
      className={`relative flex gap-3 bg-white p-2 rounded-2xl w-52 shadow-xl border-[0.1px] border-blue-300  ${
        isExpanded ? 'h-56 min-h-[250px] flex-col' : 'h-11'
      }`}
    >
      <strong className={`text-center w-full`}>
        Function
        {!isExpanded && (
          <span className='ms-1'>({functionData?.length || 0})</span>
        )}
      </strong>

      {isExpanded ? (
        <div className='overflow-x-hidden overflow-y-auto max-h-[130px] pb-3 scroll-smooth'>
          {functionData.map(func => (
            <div
              key={func.id}
              className='bg-white rounded-md p-1 mb-1 border-[0.1px] border-blue-400 flex justify-between px-2 items-center'
            >
              <p
                className='m-0 text-base text-center cursor-pointer text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap w-36'
                onClick={() => handleEditFunction(func)}
              >
                {func.name}
              </p>
              <FiTrash2
                size={14}
                className='text-red-400 hover:text-red-600 cursor-pointer'
                onClick={e => handleDeleteClick(e, func)}
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
        onClick={handleNewFunction}
      >
        +
      </button>

      <button
        className={`text-xl absolute right-2 bottom-3`}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        {isExpanded ? <LuMinimize /> : <LuMaximize />}
      </button>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setSelectedFunction(null)
        }}
        onConfirm={handleConfirmDelete}
      />
      <BaseModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={`${selectedFunction ? 'Edit' : 'Create'} Function`}
        submitButton={{
          text: selectedFunction ? 'Update' : 'Create',
          onClick: handleSubmit,
          disabled: !code,
        }}
      >
        <p className='mb-5'>Language: Python</p>
        <CodeMirror
          value={code}
          height='100%'
          className='h-full min-h-[200px]'
          extensions={[python()]}
          onChange={onChange}
          theme={oneDark}
        />
      </BaseModal>
    </div>
  )
}
export default FunctionPanel
