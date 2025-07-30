import {
  ValueOnlyProps,
  NodePanelProps,
  CaptureEntitiesProp,
} from '@/types/agent-builder'
import { useState, useEffect } from 'react'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import EditorInput from '../components/EditorInput'
import SimpleEditor from '../components/SimpleEditor'

const CaptureRightPanel = ({
  selectedNode,
  variableData,
  updateNodeData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [dropItem, setDropItem] = useState<string[]>([])

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible)
  }

  const handleToggle = (value: string) => {
    const newNode = {
      ...nodeData,
      [value]: !(nodeData[value] ?? false),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const handleSelect = (item: string) => {
    setDropdownVisible(prev => !prev)

    if (item !== 'No entities exist') {
      const exisitingEntities = nodeData.entities || []
      const newNode = {
        ...nodeData,
        entities: [
          ...exisitingEntities,
          { id: Date.now().toString(), value: item, optional: false },
        ],
      }
      updateNodeData(selectedNode.id, newNode)
    }
  }

  const removeItemFromList = (id: string) => {
    const existingEntities = nodeData?.entities || []
    const newNode = {
      ...nodeData,
      entities: existingEntities.filter(entity => entity.id !== id),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const toggleOptional = (item: CaptureEntitiesProp) => {
    const existingEntities = nodeData?.entities || []
    const newNode = {
      ...nodeData,
      entities: existingEntities.map(entity =>
        entity.id === item.id ? { ...entity, optional: !item.optional } : entity
      ),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const updateRules = (
    updateFn: (rules: ValueOnlyProps[]) => ValueOnlyProps[]
  ) => {
    const newNode = {
      ...nodeData,
      rules: updateFn(nodeData?.rules || []),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const addRule = () => {
    const hasEmptyRule = nodeData?.rules?.some(rule => !rule.value.trim())

    if (hasEmptyRule) {
      toast.error('Please fill in the current rule before adding a new one.')
      return
    }

    updateRules(rules => [
      ...rules,
      { id: `${(rules.length || 0) + 1}`, value: '' },
    ])
  }

  const removeRule = (id: string) => {
    updateRules(rules => rules.filter(rule => rule.id !== id))
  }

  const handleRuleContentChange = (id: string, newValue: string) => {
    setNodeData(prevNodeData => {
      const currentRuleNodeData = prevNodeData.rules || []
      return {
        ...prevNodeData,
        rules: currentRuleNodeData.map(rule =>
          rule.id === id ? { ...rule, value: newValue } : rule
        ),
      }
    })
  }

  const updateScenarios = (
    updateFn: (scenario: ValueOnlyProps[]) => ValueOnlyProps[]
  ) => {
    const newNode = {
      ...nodeData,
      scenarios: updateFn(nodeData?.scenarios || []),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const addScenarios = () => {
    const hasEmptyScenario = nodeData?.scenarios?.some(
      scenario => !scenario.value.trim()
    )

    if (hasEmptyScenario) {
      toast.error(
        'Please fill in the current exit scenario before adding a new one.'
      )
      return
    }

    updateScenarios(currentScenarios => [
      ...currentScenarios,
      { id: `${(currentScenarios.length || 0) + 1}`, value: '' },
    ])
  }

  const removeScenarios = (id: string) => {
    updateScenarios(currentScenarios =>
      currentScenarios.filter(scenario => scenario.id !== id)
    )
  }

  const handleScenarioContentChange = (id: string, newValue: string) => {
    setNodeData(prevNodeData => {
      const currentScenarioNodeData = prevNodeData.scenarios || []
      return {
        ...prevNodeData,
        scenarios: currentScenarioNodeData.map(scenario =>
          scenario.id === id ? { ...scenario, value: newValue } : scenario
        ),
      }
    })
  }

  const updateRulesToRemember = (
    updateFn: (rulesToRemember: ValueOnlyProps[]) => ValueOnlyProps[]
  ) => {
    const newNode = {
      ...nodeData,
      rulesToRemember: updateFn(nodeData?.rulesToRemember || []),
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const removeRulesToRemember = (id: string) => {
    updateRulesToRemember(currentRule =>
      currentRule.filter(rule => rule.id !== id)
    )
  }

  const handleRuleToRememberContentChange = (id: string, newValue: string) => {
    setNodeData(prevNodeData => {
      const currentRuleNodeData = prevNodeData.rulesToRemember || []
      return {
        ...prevNodeData,
        rulesToRemember: currentRuleNodeData.map(rule =>
          rule.id === id ? { ...rule, value: newValue } : rule
        ),
      }
    })
  }

  const addRulesToRemember = () => {
    const hasEmptyRule = nodeData?.rulesToRemember?.some(
      rule => !rule.value.trim()
    )

    if (hasEmptyRule) {
      toast.error(
        'Please fill in the current Rule To remember before adding a new one.'
      )
      return
    }

    if (nodeData?.rulesToRemember && nodeData?.rulesToRemember?.length > 7) {
      toast.error('Maximum Rule list reached')
      return
    }

    updateRulesToRemember(currentRulesToRemember => [
      ...currentRulesToRemember,
      { id: `${(currentRulesToRemember.length || 0) + 1}`, value: '' },
    ])
  }

  useEffect(() => {
    if (!nodeData?.entities) {
      const values = variableData?.map(item => item.value) || []
      setDropItem(values)
      return
    }

    const existingEntities = (nodeData?.entities || []).map(item => item.value)

    const uniqueItems = variableData
      ?.map(item => item.value)
      .filter(value => !existingEntities.includes(value))

    setDropItem(
      uniqueItems && uniqueItems?.length > 0
        ? uniqueItems
        : ['No entities exist']
    )
  }, [variableData, nodeData])

  const handleClose = () => {
    updateNodeData(selectedNode.id, nodeData)
    onClose && onClose()
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  return (
    <div
      className={`w-[400px] bg-white p-5 border-l border-gray-300 overflow-x-hidden max-h-full overflow-y-auto flex flex-col`}
    >
      <h3 className='border-b border-gray-300 p-2 pl-0 mb-4 font-semibold text-gray-700'>
        {nodeData?.label}
      </h3>

      <div className='flex justify-between items-center'>
        <strong>Entities</strong>
        <div className='flex gap-4 items-center justify-center'>
          {nodeData?.entities && nodeData?.entities.length > 0 && (
            <p>Optional?</p>
          )}
          <FiPlusCircle
            className='cursor-pointer'
            size={20}
            onClick={toggleDropdown}
          />
        </div>
      </div>

      <div className='relative border-b border-gray-300 py-3'>
        {isDropdownVisible && (
          <div className='mt-2 bg-white border border-gray-300 rounded-md shadow-md absolute top-0 left-0 z-20 w-full'>
            {dropItem.map((variable, index) => (
              <p
                key={index}
                className='text-center cursor-pointer'
                onClick={() => handleSelect(variable)}
              >
                {variable}
              </p>
            ))}
          </div>
        )}
        {isDropdownVisible && dropItem.length == 0 && (
          <div className='bg-white border border-gray-300 rounded-md shadow-md absolute top-0 left-0 z-20 w-full'>
            <p className='text-center'>No entities exist</p>
          </div>
        )}

        <div className='z-10 flex flex-col gap-2'>
          {nodeData?.entities &&
            nodeData?.entities.map(item => (
              <div key={item.id} className='flex justify-between'>
                <p>{item.value}</p>
                <div className='flex gap-8 items-center justify-center'>
                  <button
                    onClick={() => toggleOptional(item)}
                    className={`cursor-pointer border-none rounded-md px-2 py-1 text-xs text-white ${
                      item.optional ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    {item.optional ? 'On' : 'Off'}
                  </button>
                  <FiMinusCircle
                    className='cursor-pointer'
                    size={20}
                    onClick={() => removeItemFromList(item.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className='flex flex-col gap-3 pt-5 pb-3'>
        <div className='flex justify-between'>
          <p>Automatically reprompt</p>
          <button
            onClick={() => handleToggle('autoReprompt')}
            className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
              nodeData?.autoReprompt ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            {nodeData?.autoReprompt ? 'On' : 'Off'}
          </button>
        </div>

        <div className='flex justify-between'>
          <p>No reply</p>
          <button
            onClick={() => handleToggle('noReply')}
            className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
              nodeData?.noReply ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            {nodeData?.noReply ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <div className='border-b border-gray-300 p-2.5' />

      <div className='pt-4'>
        <div className='flex justify-between mb-2'>
          <strong>Rules</strong>
          <FiPlusCircle
            className=' cursor-pointer'
            size={20}
            onClick={addRule}
          />
        </div>
        {nodeData?.rules &&
          nodeData?.rules?.length > 0 &&
          nodeData.rules.map(item => (
            <div key={item.id} className='pt-1 flex gap-2 items-center'>
              <div className='py-1.5 bg-gray-100 w-full rounded-md'>
                <EditorInput
                  characters={variableData?.map(item => item.value)}
                  value={item.value}
                  placeholder='Type { to add field '
                  onChange={value => handleRuleContentChange(item.id, value)}
                  className='bg-gray-100 outline-none'
                />
              </div>
              <FiMinusCircle
                className='cursor-pointer'
                size={20}
                onClick={() => removeRule(item.id)}
              />
            </div>
          ))}
      </div>

      <div className='border-b border-gray-300 p-2.5' />

      <div className='flex flex-col pt-4'>
        <div className='flex justify-between'>
          <strong>Exit scenarios</strong>
          <FiPlusCircle
            className='cursor-pointer'
            size={20}
            onClick={addScenarios}
          />
        </div>
        {nodeData?.scenarios &&
          nodeData?.scenarios?.length > 0 &&
          nodeData.scenarios.map(item => (
            <div key={item.id} className='pt-2 flex gap-2 items-center'>
              <input
                className='text-base bg-gray-100 border-none outline-none flex-1 rounded py-1 px-2'
                onChange={e => {
                  handleScenarioContentChange(item.id, e.target.value)
                }}
                value={item.value}
                placeholder='Exit if...'
              />
              <FiMinusCircle
                className='cursor-pointer'
                size={20}
                onClick={() => removeScenarios(item.id)}
              />
            </div>
          ))}

        {nodeData?.scenarios && nodeData?.scenarios?.length > 0 && (
          <div className='pt-5 flex justify-between'>
            <p className='flex items-center'>Exit scenario path</p>
            <button
              onClick={() => handleToggle('exitScenarioPath')}
              className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
                nodeData?.exitScenarioPath ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              {nodeData?.exitScenarioPath ? 'On' : 'Off'}
            </button>
          </div>
        )}
        <div className='mt-4 mb-5 flex flex-col gap-3'>
          <SimpleEditor
            label={'How to ask: '}
            value={nodeData?.howToAsk || ''}
            onChange={e => {
              setNodeData(prev => ({ ...prev, howToAsk: e.target.value }))
            }}
          />

          <div className='flex justify-between'>
            <strong>Rules to Remember</strong>
            <FiPlusCircle
              className='cursor-pointer'
              size={20}
              onClick={addRulesToRemember}
            />
          </div>
          {nodeData?.rulesToRemember &&
            nodeData?.rulesToRemember?.length > 0 &&
            nodeData.rulesToRemember.map(item => (
              <div key={item.id} className='pt-2 flex gap-2 items-center'>
                <input
                  className='text-base bg-gray-100 border-none outline-none flex-1 rounded py-1 px-2'
                  onChange={e => {
                    handleRuleToRememberContentChange(item.id, e.target.value)
                  }}
                  value={item.value}
                  placeholder='Rules to remember'
                />
                <FiMinusCircle
                  className='cursor-pointer'
                  size={20}
                  onClick={() => removeRulesToRemember(item.id)}
                />
              </div>
            ))}
        </div>
      </div>

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

export default CaptureRightPanel
