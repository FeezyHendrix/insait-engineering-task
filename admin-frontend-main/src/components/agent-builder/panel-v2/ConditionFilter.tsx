import {
  ConditionItemType,
  ConditionType,
  FieldDataProps,
} from '@/types/agent-builder'
import {
  LOGIC_OPERATORS,
  OPERATORS,
  getOperatorsForFieldType,
  generateConditionText,
} from '@/utils/botBuilder'
import React, { useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { MdOutlineFilterList } from 'react-icons/md'
import { VscSymbolOperator } from 'react-icons/vsc'

interface ConditionFilterProps {
  id?: string
  condition: ConditionType
  fields: FieldDataProps[]
  onCancel: () => void
  onSubmit: (condition: ConditionType) => void
}

const ConditionFilter = ({
  id,
  condition,
  fields,
  onCancel,
  onSubmit,
}: ConditionFilterProps) => {
  const [activeSubConditionIndex, setActiveSubConditionIndex] = useState<
    number | null
  >(id ? null : 0)

  const [localCondition, setLocalCondition] = useState<ConditionType>(condition)

  const handleSubFieldChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    subConditionIndex: number
  ) => {
    const fieldName = e.target.value
    const fieldType =
      fields.find(v => v.properties.name === fieldName)?.properties.type ||
      'string'

    if (localCondition.conditions) {
      const updatedConditions = [...localCondition.conditions]
      updatedConditions[subConditionIndex] = {
        ...updatedConditions[subConditionIndex],
        field: fieldName,
        fieldType,
      }

      setLocalCondition({
        ...localCondition,
        conditions: updatedConditions,
      })
    }
  }

  const handleSubOperatorChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    subConditionIndex: number
  ) => {
    const operator = e.target.value

    if (localCondition.conditions) {
      const subCondition = localCondition.conditions[subConditionIndex]

      let values = subCondition.values || []
      if ([OPERATORS.IN, OPERATORS.NOT_IN].includes(operator)) {
      } else {
        values = values.length > 0 ? [values[0]] : []
      }

      const updatedConditions = [...localCondition.conditions]
      updatedConditions[subConditionIndex] = {
        ...subCondition,
        operator,
        values,
      }

      setLocalCondition({
        ...localCondition,
        conditions: updatedConditions,
      })
    }
  }

  const convertValueBasedOnType = (
    value: string,
    fieldType: string
  ): string | number | boolean | null => {
    if (fieldType === 'int') {
      return value === '' ? null : Number(value)
    } else if (fieldType === 'boolean') {
      if (value === 'true') return true
      if (value === 'false') return false
      return null // For 'None' case
    }
    return value
  }

  const handleSubValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    subConditionIndex: number
  ) => {
    const value = e.target.value

    if (localCondition.conditions) {
      const subCondition = localCondition.conditions[subConditionIndex]
      const fieldType = getFieldType(subCondition)

      let values
      if (
        subCondition.operator &&
        [OPERATORS.IN, OPERATORS.NOT_IN].includes(subCondition.operator)
      ) {
        values = value
          .split(',')
          .map(v => {
            const trimmedValue = v.trim()
            return convertValueBasedOnType(trimmedValue, fieldType)
          })
          .filter(v => v !== null)
      } else {
        const convertedValue = convertValueBasedOnType(value, fieldType)
        values = convertedValue !== null ? [convertedValue] : []
      }

      const updatedConditions = [...localCondition.conditions]
      updatedConditions[subConditionIndex] = {
        ...subCondition,
        values,
      }

      setLocalCondition({
        ...localCondition,
        conditions: updatedConditions,
      })
    }
  }

  const handleLogicChange = (logic: string) => {
    setLocalCondition({
      ...localCondition,
      logic,
    })
  }

  const addNestedCondition = () => {
    const conditions = localCondition.conditions || []

    const newCondition: ConditionItemType = {
      field: null,
      operator: null,
      values: [],
    }

    const updatedConditions = [...conditions, newCondition]

    setLocalCondition({
      ...localCondition,
      conditions: updatedConditions,
      logic: localCondition.logic || LOGIC_OPERATORS.AND,
    })

    setActiveSubConditionIndex(updatedConditions.length - 1)
  }

  const removeNestedCondition = (
    subConditionIndex: number,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation()

    if (localCondition.conditions) {
      const updatedConditions = [...localCondition.conditions]
      updatedConditions.splice(subConditionIndex, 1)

      const updatedLogic =
        updatedConditions.length === 0 ? undefined : localCondition.logic

      const updatedLocalCondition = {
        ...localCondition,
        conditions: updatedConditions,
      }
      if (updatedLogic) {
        updatedLocalCondition.logic = updatedLogic
      }

      setLocalCondition(updatedLocalCondition)

      if (activeSubConditionIndex === subConditionIndex) {
        setActiveSubConditionIndex(null)
      }
    }
  }

  const getFieldType = (condition: ConditionItemType) => {
    return (
      fields.find(v => v.properties.name === condition.field)?.properties
        .type || 'string'
    )
  }

  const handleSubmit = () => {
    onSubmit(localCondition)
  }

  const hasNestedConditions =
    localCondition.conditions && localCondition.conditions.length > 1

  const handleNestedClick = (subIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setActiveSubConditionIndex(
      subIndex === activeSubConditionIndex ? null : subIndex
    )
  }

  const renderValueInput = (condition: ConditionItemType, subIndex: number) => {
    const fieldType = getFieldType(condition)
    const displayValue =
      condition.values && condition.values.length > 0
        ? String(condition.values.join(', '))
        : ''

    if (fieldType === 'boolean') {
      return (
        <select
          value={displayValue}
          onChange={e => handleSubValueChange(e, subIndex)}
          className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
          onClick={e => e.stopPropagation()}
        >
          <option value=''>None</option>
          <option value='true'>True</option>
          <option value='false'>False</option>
        </select>
      )
    }

    return (
      <input
        type={fieldType === 'int' ? 'number' : 'text'}
        value={displayValue}
        onChange={e => handleSubValueChange(e, subIndex)}
        placeholder={
          condition.operator &&
          [OPERATORS.IN, OPERATORS.NOT_IN].includes(condition.operator)
            ? 'value1, value2, value3'
            : 'value'
        }
        className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
        onClick={e => e.stopPropagation()}
      />
    )
  }

  const renderNestedCondition = (
    condition: ConditionItemType,
    subIndex: number
  ) => {
    const isActive = activeSubConditionIndex === subIndex
    const fieldType = getFieldType(condition)
    const applicableOperators = getOperatorsForFieldType(fieldType)

    return (
      <div
        key={`nested-${subIndex}`}
        className={`border ${
          isActive ? 'border-blue-500' : 'border-gray-300'
        } rounded-md p-2 mb-2 cursor-pointer hover:bg-gray-50`}
        onClick={e => handleNestedClick(subIndex, e)}
      >
        {isActive ? (
          <div onClick={e => e.stopPropagation()}>
            <div className='flex gap-2'>
              <div className='flex flex-col justify-center mb-2 flex-1'>
                <span className='text-gray-700 text-sm'>Field:</span>
                <select
                  value={condition.field || ''}
                  onChange={e => handleSubFieldChange(e, subIndex)}
                  className='flex-1 p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
                  onClick={e => e.stopPropagation()}
                >
                  <option value='' disabled>
                    Select field
                  </option>
                  {fields.map(field => (
                    <option key={field.id} value={field.properties.name}>
                      {field.properties.name}
                    </option>
                  ))}
                </select>
              </div>

              {condition.field && (
                <>
                  <div className='flex flex-col justify-center mb-2 flex-1'>
                    <span className='text-gray-700 text-sm'>Operator:</span>
                    <select
                      value={condition.operator || ''}
                      onChange={e => handleSubOperatorChange(e, subIndex)}
                      className='flex-1 p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm'
                      onClick={e => e.stopPropagation()}
                    >
                      <option value='' disabled>
                        Select operator
                      </option>
                      {applicableOperators.map(op => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='flex flex-col justify-center mb-2 flex-1'>
                    <span className='text-gray-700 text-sm'>Value:</span>
                    {renderValueInput(condition, subIndex)}
                  </div>
                </>
              )}

              {hasNestedConditions && (
                <button
                  className='text-red-500 hover:text-red-700 self-center'
                  onClick={e => removeNestedCondition(subIndex, e)}
                >
                  <FaMinus size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2 overflow-hidden'>
              <VscSymbolOperator size={16} className='text-blue-500' />
              <span className='truncate'>
                {generateConditionText(condition)}
              </span>
            </div>
            {hasNestedConditions && (
              <button
                className='text-gray-400 hover:text-gray-600'
                onClick={e => removeNestedCondition(subIndex, e)}
              >
                <FaMinus size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-lg'>
      <div className='flex justify-between items-center border-b border-gray-200 pb-3 mb-4'>
        <div className='flex items-center gap-2'>
          <MdOutlineFilterList className='text-gray-500' size={18} />
          <h3 className='text-gray-700 font-medium'>Filters</h3>
        </div>
      </div>

      <div className='mb-4'>
        <div className='border border-blue-500 rounded-md p-3 mb-2 hover:bg-gray-50'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium'>
                {hasNestedConditions ? 'Group Condition' : 'Condition'}
              </span>
              {hasNestedConditions && (
                <div className='flex justify-between items-center mb-2'>
                  <div />
                  <div className='flex gap-2'>
                    <button
                      className={`px-2 py-1 text-xs rounded ${
                        localCondition.logic === LOGIC_OPERATORS.AND
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={e => {
                        e.stopPropagation()
                        handleLogicChange(LOGIC_OPERATORS.AND)
                      }}
                    >
                      AND
                    </button>
                    <button
                      className={`px-2 py-1 text-xs rounded ${
                        localCondition.logic === LOGIC_OPERATORS.OR
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={e => {
                        e.stopPropagation()
                        handleLogicChange(LOGIC_OPERATORS.OR)
                      }}
                    >
                      OR
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className='mt-2' onClick={e => e.stopPropagation()}>
              {(localCondition.conditions || []).map(
                (subCondition: ConditionItemType, subIndex: number) => (
                  <div
                    key={`subcontainer-${subIndex}`}
                    onClick={e => e.stopPropagation()}
                  >
                    {renderNestedCondition(subCondition, subIndex)}
                  </div>
                )
              )}
            </div>

            <button
              className='flex items-center gap-1 mt-3 text-gray-500 hover:text-gray-700 text-sm'
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                addNestedCondition()
              }}
            >
              <FaPlus size={10} /> Add new condition
            </button>
          </div>
        </div>
      </div>

      <div className='flex justify-between mt-4 pt-3 border-t border-gray-200'>
        <div className='flex gap-2 ml-auto'>
          <button
            className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            onClick={handleSubmit}
          >
            {id ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConditionFilter
