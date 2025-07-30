import {
  AddVariableProps,
  ValidationProp,
  VariableDataProps,
} from '@/types/agent-builder'
import {
  agentBuilderColorSelectionOption,
  generalAgentVariableType,
} from '@/utils/botBuilder'
import React, { useState, useEffect, ChangeEvent, useRef } from 'react'
import Papa from 'papaparse'
import { toast } from 'react-toastify'
import CustomTooltip from '@/components/elements/CustomTooltip'
import { CSVRow } from '@/types/scenario'
import { t } from 'i18next'
import BaseModal from './BaseModal'

const AddVariable = ({
  showVariableModal,
  setShowVariableModal,
  variableData,
  setVariableData,
  selectedVariable,
  functionData,
}: AddVariableProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newVariable, setNewVariable] = useState<string>('')
  const [variableType, setVariableType] = useState<string>('')
  const [validation, setValidation] = useState<ValidationProp>({
    type: 'api',
    value: '',
  })
  const [color, setColor] = useState<string>('')
  const [valueData, setValueData] = useState<string>('')

  useEffect(() => {
    const {
      value = '',
      type = '',
      values = '',
      validation,
      color = '#a1c972',
    } = selectedVariable || {}
    setNewVariable(value)
    setVariableType(type)
    setValueData(values)
    setColor(color)
    setValidation({ type: 'api', value: validation?.value || '' })
  }, [selectedVariable, showVariableModal])

  const handleCreateVariable = () => {
    const input = newVariable.trim()

    if (!input) {
      toast.error('Field name cannot be empty')
      return
    }

    if (!variableType) {
      toast.error('Field Type cannot be empty')
      return
    }

    const isNameChanged = selectedVariable && selectedVariable.value !== input
    const existingNames = variableData.map(item => item.value)
    const isUnique = isNameChanged ? !existingNames.includes(input) : true
    const startsWithLetter = /^[a-zA-Z]/.test(input)
    const noSpaces = !/\s/.test(input)
    const isSnakeCase = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(input)

    if (!startsWithLetter) {
      toast.error('Field name must start with a letter.')
      return
    }

    if (!noSpaces) {
      toast.error('Field name must not contain spaces.')
      return
    }

    if (!isSnakeCase) {
      toast.error(
        'Field name must use underscores and alphanumeric characters only.'
      )
      return
    }

    if (!isUnique) {
      toast.error('Field name must be unique.')
      return
    }

    if (!selectedVariable) {
      const newData: VariableDataProps = {
        id: `${Date.now()}`,
        value: newVariable,
        type: variableType,
        values: valueData,
        validation: validation,
        color: color,
      }
      setVariableData(prevData => [...prevData, newData])
    } else {
      setVariableData(prevData =>
        prevData.map(item =>
          item.id === selectedVariable.id
            ? {
                ...item,
                value: newVariable,
                type: variableType,
                validation: validation,
                values: valueData,
                color: color,
              }
            : item
        )
      )
    }
    handleCloseModal()
  }

  const handleClickColor = (value: string) => {
    setColor(value)
  }

  const handleVariableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewVariable(event.target.value)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (!results?.data?.length) {
          toast.error(t('feedback.fileProcessingFailed'))
          return
        }

        const firstRow = results.data[0] as CSVRow
        const headers = Object.keys(firstRow)
        const requiredFields = ['values']

        const missingFields = requiredFields.filter(
          field => !headers.includes(field)
        )
        if (missingFields.length > 0) {
          toast.error(
            t('feedback.fileInclude', { name: missingFields.join(', ') })
          )
          return
        }

        try {
          const newEnum = (results.data as CSVRow[])
            .filter(row => row.message.trim() !== '')
            .join('\n')

          if (newEnum.length === 0) {
            toast.error('No enum/values to upload')
            return
          }

          setValueData(newEnum)
          toast.success(t('scenario.feedback.csvUpload'))
        } catch (error) {
          toast.error(t('scenario.feedback.csvError'))
        }
      },
      error: function (error) {
        toast.error(t('scenario.feedback.csvError'))
      },
    })
  }

  const handleCloseModal = () => {
    setNewVariable('')
    setVariableType('')
    setColor('')
    setValidation({ type: 'api', value: '' })
    setValueData('')
    setShowVariableModal(false)
  }

  return (
    <BaseModal
      isOpen={showVariableModal}
      onClose={handleCloseModal}
      title={`${selectedVariable ? 'Edit' : 'Create'} Field`}
      submitButton={{
        text: `${selectedVariable ? 'Update' : 'Create'} Field`,
        onClick: handleCreateVariable,
        disabled: !newVariable,
      }}
    >
      <div className='mb-4'>
        <label htmlFor='name' className='block font-bold mb-0.5'>
          Name:
        </label>
        <input
          type='text'
          id='name'
          value={newVariable}
          placeholder='Enter variable name'
          className='w-full p-2 border border-[#ccc] rounded-lg outline-none focus:border-blue-500'
          onChange={handleVariableChange}
        />
      </div>

      <>
        <div className='mb-4'>
          <label htmlFor='variable-type' className='block font-bold mb-0.5'>
            Field Type:
          </label>
          <div className='flex gap-2 items-center justify-between'>
            <select
              id='variable-type'
              onChange={e => {
                setVariableType(e.target.value)
              }}
              value={variableType || ''}
              className='w-4/6 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
            >
              <option value=''>Select type</option>
              {generalAgentVariableType.map(item => (
                <option key={item.id} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className='flex gap-1.5 ml-auto'>
              {agentBuilderColorSelectionOption.map(item => (
                <div
                  key={item.color}
                  className={`w-5 h-5 rounded-full p-1 box-content border-2 ${
                    color === item.color ? 'border-red-500' : 'border-[#ddd]'
                  }`}
                  style={{
                    backgroundColor: item.color,
                  }}
                  onClick={() => handleClickColor(item.color)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className='block font-bold mb-0.5'>Variable Validation:</label>
          <div className='flex items-center mb-1'>
            <input
              id='chooseTemplate'
              type='radio'
              value='template'
              disabled
              checked={validation.type === 'template'}
              name='variable-validation'
              className='w-4 h-4 text-blue-600'
              onChange={e =>
                setValidation(prev => ({ ...prev, type: e.target.value }))
              }
            />
            <label
              htmlFor='chooseTemplate'
              className='ms-2 font-medium text-gray-400'
            >
              Choose from template
            </label>
          </div>

          <div className='flex items-center mt-2 mb-1'>
            <input
              id='chooseAPI'
              type='radio'
              value='api'
              onChange={e =>
                setValidation(prev => ({ ...prev, type: e.target.value }))
              }
              checked={validation.type === 'api'}
              name='variable-validation'
              className='w-4 h-4 text-blue-600'
            />
            <label htmlFor='chooseAPI' className='ms-2 font-medium '>
              Choose from External API
            </label>
          </div>
          {validation.type === 'api' && (
            <div className='mb-4 ms-4 w-8/12'>
              <select
                className='w-full p-2 border border-gray-300 rounded-lg  outline-none'
                value={validation.value}
                onChange={e => {
                  setValidation(prev => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }}
              >
                <option value='' disabled>
                  Select Option
                </option>
                {functionData.map(item => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className='mt-4'>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <label className='font-bold '>Enum / Valid Values</label>
                <small className='text-xs'>Input list, comma seperated</small>
              </div>
              <CustomTooltip
                title={t('scenario.feedback.fileInfo')}
                noWrap={false}
              >
                <label
                  className='text-blue-400 text-sm cursor-pointer hover:text-blue-600 inline-block'
                  role='button'
                >
                  <input
                    id='dropzone-file'
                    type='file'
                    accept='.csv'
                    className='hidden'
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  {t('scenario.actions.uploadCSV')}
                </label>
              </CustomTooltip>
            </div>
            <textarea
              rows={4}
              className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none'
              value={valueData}
              onChange={e => setValueData(e.target.value)}
            ></textarea>
          </div>
        </div>
      </>
    </BaseModal>
  )
}

export default AddVariable
