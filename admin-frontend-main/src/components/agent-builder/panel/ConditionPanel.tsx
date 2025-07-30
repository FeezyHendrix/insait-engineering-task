import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { FaPlus, FaMinus, FaExpand, FaQuestion } from 'react-icons/fa'
import { DiJavascript1 } from 'react-icons/di'
import { VscSymbolOperator } from 'react-icons/vsc'
import MonoEditor from '@monaco-editor/react'

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
import {
  ConditionBuilderProp,
  JavaScriptEditorProp,
  NodeDataConditionType,
  NodeDataPathType,
  NodePanelProps,
} from '@/types/agent-builder'
import { toast } from 'react-toastify'

const generateConditionText = (conditions: NodeDataConditionType[]) => {
  if (!conditions || conditions.length === 0) return 'Empty Condition'

  return conditions
    .map(condition => `If ${condition.variable} is ${condition.value}`)
    .join(' AND ')
}

const ConditionBuilder = ({
  conditions = [],
  variableData,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  handleSubmit,
  selectedPath,
  onUpdatePath,
}: ConditionBuilderProp) => {
  const [matchType, setMatchType] = useState(selectedPath?.match || 'all')

  const handleMatchTypeChange = (type: string) => {
    if (onUpdatePath && selectedPath) {
      setMatchType(type)
      onUpdatePath({
        ...selectedPath,
        match: type,
      })
    }
  }

  const handleSubmitClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    // Validate all conditions are filled
    const hasEmptyConditions = conditions.some(
      condition => !condition.variable || !condition.value
    )

    if (hasEmptyConditions) {
      toast.error('Please complete all conditions before submitting.')
      return
    }

    handleSubmit()
  }

  return (
    <div
      className='bg-white p-4 rounded-lg shadow-lg border border-gray-100'
      onClick={e => e.stopPropagation()}
    >
      <div className='flex justify-between items-center mb-3'>
        <div className='flex gap-2'>
          <button
            className={`px-4 py-1 rounded-md ${
              matchType === 'all' ? 'bg-white shadow-sm border' : 'bg-gray-50'
            }`}
            onClick={() => handleMatchTypeChange('all')}
          >
            Match all
          </button>
          <button
            className={`px-4 py-1 rounded-md ${
              matchType === 'any' ? 'bg-white shadow-sm border' : 'bg-gray-50'
            }`}
            onClick={() => handleMatchTypeChange('any')}
          >
            Match any
          </button>
        </div>
        <div className='flex gap-2'>
          <button
            className={`text-gray-500 ${
              conditions.some(c => !c.variable || !c.value)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={onAddCondition}
            disabled={conditions.some(c => !c.variable || !c.value)}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {conditions.map((condition, index) => (
        <div
          key={condition.id}
          className='flex items-center gap-2 text-gray-700 mb-2 w-full'
        >
          <div className='flex items-center gap-2 flex-1'>
            <span>if</span>
            <select
              value={condition.variable}
              onChange={e =>
                onUpdateCondition(condition.id, {
                  ...condition,
                  variable: e.target.value,
                })
              }
              className='border-b border-gray-200 bg-transparent outline-none py-1'
            >
              <option disabled value={''}>
                Select
              </option>
              {variableData &&
                variableData?.length > 0 &&
                variableData.map(item => (
                  <option key={item.id} value={item.value}>
                    {item.value}
                  </option>
                ))}
            </select>
            <span>is</span>
            <input
              type='text'
              value={condition.value}
              onChange={e =>
                onUpdateCondition(condition.id, {
                  ...condition,
                  value: e.target.value,
                })
              }
              placeholder='value or {var}'
              className='bg-transparent outline-none border-b border-gray-200'
            />
          </div>
          <button
            className='text-gray-500 ml-auto hover:text-gray-700'
            onClick={() => onRemoveCondition(condition.id)}
          >
            <FaMinus />
          </button>
        </div>
      ))}
      <button
        onClick={handleSubmitClick}
        className='flex place-self-end text-xs'
      >
        Submit
      </button>
    </div>
  )
}

const JavaScriptEditor = ({ code, onChange, onBlur }: JavaScriptEditorProp) => {
  return (
    <div className='bg-gray-900 rounded-lg overflow-hidden'>
      <div className='flex justify-between items-center p-2 border-b border-gray-700'>
        <span className='text-white text-sm'>Javascript</span>
        <div className='flex gap-2'>
          <button className='text-gray-400 hover:text-gray-200'>
            <FaQuestion size={14} />
          </button>
          <button className='text-gray-400 hover:text-gray-200'>
            <FaExpand size={14} />
          </button>
        </div>
      </div>
      <MonoEditor
        height='200px'
        theme='vs-dark'
        defaultLanguage='javascript'
        value={code}
        onChange={onChange}
        // onBlur={onBlur}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          fontSize: 14,
          tabSize: 2,
        }}
      />
    </div>
  )
}

const ConditionPanel = ({
  selectedNode,
  updateNodeData,
  variableData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const [showEvaluateMenu, setShowEvaluateMenu] = useState(false)
  const [evaluationType, setEvaluationType] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<NodeDataPathType | null>(
    null
  )

  const addPath = (type: string) => {
    const existingPaths = nodeData?.paths || []
    const newPath = {
      id: `${existingPaths.length + 1}`,
      conditions: [],
      value: '',
      type,
      match: 'all', //either all or any
    }
    setSelectedPath(newPath)
    setEvaluationType(type)
    setShowEvaluateMenu(false)
    handleUpdateNodeData('paths', [...existingPaths, newPath])
  }

  const handleRemovePath = (id: string) => {
    if (!nodeData?.paths) return

    const updatedPaths = nodeData.paths.filter(path => path.id !== id)

    handleUpdateNodeData('paths', updatedPaths)

    // Reset related states if the removed path was selected
    if (selectedPath && selectedPath?.id === id) {
      setSelectedPath(null)
      setEvaluationType(null)
    }
  }

  const handleAddCondition = () => {
    if (!selectedPath) return

    // Check if there are any empty conditions
    const hasEmptyConditions = selectedPath.conditions?.some(
      condition => !condition.variable || !condition.value
    )

    if (hasEmptyConditions) {
      toast.error('Please complete the current condition before adding a new one.')
      return
    }

    const existingNodeDataPath = nodeData.paths || []
    const updatedPaths = existingNodeDataPath.map(path => {
      if (path.id === selectedPath.id) {
        const currentConditions = path.conditions || []
        return {
          ...path,
          conditions: [
            ...currentConditions,
            { id: currentConditions.length + 1, variable: '', value: '' },
          ],
        }
      }
      return path
    })

    handleUpdateNodeData('paths', updatedPaths)
  }

  const handleRemoveCondition = (id: string) => {
    if (!selectedPath || !nodeData.paths) return

    const updatedPaths = nodeData.paths.map(path => {
      if (path.id === selectedPath.id) {
        const existingPathCondition = path?.conditions || []
        return {
          ...path,
          conditions: existingPathCondition.filter(
            condition => condition.id !== id
          ),
        }
      }
      return path
    })

    handleUpdateNodeData('paths', updatedPaths)
  }

  const handleUpdateCondition = (
    id: string,
    newCondition: NodeDataConditionType
  ) => {
    if (!selectedPath || !nodeData.paths) return

    const updatedPaths = nodeData.paths.map(path => {
      if (path.id === selectedPath.id) {
        const existingPathCondition = path?.conditions || []
        return {
          ...path,
          conditions: existingPathCondition.map(condition =>
            condition.id === id ? newCondition : condition
          ),
        }
      }
      return path
    })

    handleUpdateNodeData('paths', updatedPaths)
  }

  const handleUpdateNodeData = (key: string, value: any) => {
    const newNode = {
      ...nodeData,
      [key]: value,
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const handleSubmitNodeData = () => {
    setSelectedPath(null)
    updateNodeData(selectedNode.id, nodeData)
  }

  const handleConditionTypeSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newNode = {
      ...nodeData,
      conditionType: e.target.value,
      paths: [],
    }
    updateNodeData(selectedNode.id, newNode)
    setEvaluationType(null)
  }

  const handleUpdatePath = (updatedPath: NodeDataPathType) => {
    const nodeDataPath = nodeData.paths || []
    const updatedPaths = nodeDataPath.map(path =>
      path.id === updatedPath.id ? updatedPath : path
    )
    handleUpdateNodeData('paths', updatedPaths)
  }

  const handleClose = () => {
    handleSubmitNodeData()
    onClose && onClose()
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
    if (!selectedNode?.data?.conditionType) {
      handleUpdateNodeData('conditionType', 'business')
    }
  }, [selectedNode])

  return (
    <div className='w-[400px] bg-white p-6 border-l border-gray-200 h-full overflow-y-auto flex flex-col'>
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>
        {selectedNode?.data?.label}
      </h2>

      {/* Condition Type */}
      <div className='mb-6'>
        <label className='block text-gray-600 mb-2'>Condition type</label>
        <div className='relative'>
          <select
            value={nodeData?.conditionType}
            onChange={handleConditionTypeSelection}
            className='w-full p-3 text-gray-900 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white'
          >
            <option value='business'>Business logic</option>
            <option value='prompt'>Prompt</option>
          </select>
          <div className='pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2'>
            <IoIosArrowDown className='text-gray-500' size={20} />
          </div>
        </div>

        <div className='mt-4 text-sm text-gray-600'>
          {nodeData?.conditionType === 'business' ? (
            <p>
              Evaluate individual paths one by one using an expression builder
              or Javascript.
            </p>
          ) : (
            <p>
              Evaluate all paths at once using a prompt and conversation memory.
            </p>
          )}
        </div>
      </div>

      {nodeData?.conditionType === 'prompt' && (
        <div>
          <h3 className='pl-0 mb-2 font-semibold'>Description</h3>

          <div className='mb-8 border-b border-gray-300'>
            <EditorProvider>
              <Editor
                className='min-h-[120px]'
                value={nodeData?.description}
                onChange={e => {
                  setNodeData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }}
                onBlur={() => handleSubmitNodeData()}
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
      )}

      {/* Paths Section */}
      {nodeData?.conditionType !== null && (
        <div className='mb-6'>
          <div className='flex justify-between items-center mb-4 relative border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-800'>Paths</h3>
            <button
              onClick={() => setShowEvaluateMenu(prev => !prev)}
              className='text-gray-400 hover:text-gray-600'
            >
              <FaPlus size={16} />
            </button>
            {showEvaluateMenu && (
              <div className='absolute right-0 top-[20px] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-10'>
                <div className='p-2'>
                  <button
                    onClick={() => addPath('builder')}
                    className='w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-700'
                  >
                    <VscSymbolOperator className='text-blue-500' size={20} />
                    <span>Condition builder</span>
                  </button>
                  <button
                    onClick={() => addPath('javascript')}
                    className='w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-700'
                  >
                    <DiJavascript1 className='text-yellow-500' size={20} />
                    <span>Expression</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className='space-y-4'>
            {nodeData?.paths &&
              nodeData?.paths?.length > 0 &&
              nodeData?.paths.map(path => (
                <div
                  key={path.id}
                  onClick={() => {
                    setSelectedPath(prev => (prev === path ? null : path))
                    setEvaluationType(path.type || '')
                  }}
                  className='flex items-center justify-between bg-blue-500  py-2 px-3 rounded-lg w-full relative gap-4'
                >
                  <p className='text-white overflow-hidden text-ellipsis whitespace-nowrap'>
                    {generateConditionText(path.conditions)}
                  </p>
                  <button className='text-white hover:text-gray-200'>
                    <FaMinus
                      size={16}
                      onClick={() => handleRemovePath(path.id)}
                    />
                  </button>
                  {selectedPath?.id === path.id && (
                    <div className='absolute top-14 right-0 left-0 z-50'>
                      {evaluationType === 'builder' && (
                        <ConditionBuilder
                          variableData={variableData}
                          conditions={path?.conditions || []}
                          onAddCondition={handleAddCondition}
                          onRemoveCondition={handleRemoveCondition}
                          onUpdatePath={handleUpdatePath}
                          selectedPath={selectedPath}
                          onUpdateCondition={handleUpdateCondition}
                          handleSubmit={() => {
                            setEvaluationType(null)
                            handleSubmitNodeData()
                          }}
                        />
                      )}
                      {evaluationType === 'javascript' && (
                        <JavaScriptEditor
                          code={path?.code}
                          onChange={val => {
                            handleUpdatePath({
                              ...path,
                              code: val,
                            })
                          }}
                          onBlur={() => {
                            handleSubmitNodeData()
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Else Path Toggle */}
          {nodeData?.paths && nodeData?.paths?.length > 0 === true && (
            <div className='flex items-center justify-between mt-4'>
              <span className='text-gray-700'>Else path</span>
              <div
                className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                  nodeData?.elsePath === true ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() =>
                  handleUpdateNodeData(
                    'elsePath',
                    !(nodeData?.elsePath || false)
                  )
                }
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    nodeData?.elsePath ? 'translate-x-6' : 'translate-x-1'
                  } shadow-md mt-0.5`}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className='mt-6 flex justify-end items-end flex-1'>
        <button
          className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex w-full justify-center gap-2'
          onClick={handleClose}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default ConditionPanel
