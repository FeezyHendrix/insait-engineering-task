import {
  agentFieldTypeEnum,
  BuilderFieldListItem,
  CreateFieldProps,
  FieldPropertiesType,
  FieldValidValue,
  TransformMethodEnum,
} from '@/types/agent-builder'
import {
  agentFieldType,
  builderListItemsType,
  transformMethods,
} from '@/utils/botBuilder'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import BaseModal from './BaseModal'
import { createField, updateField } from '@/redux/slices/agentBuilder/request'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { setSelectedNodeId } from '@/redux/slices/agentBuilder'
import { SwitchInput, TextareaWithExpand } from '@/components/elements/Input'
import ValidValuesManager from './ValidValuesManager'

const CreateField = ({
  showModal,
  setShowModal,
  selectedField,
}: CreateFieldProps) => {
  const dispatch = useAppDispatch()
  const { currentFlowId, currentFlowData } = useAppSelector(
    (state) => state.builder
  )
  // Field properties
  const [name, setName] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isComplexEnum, setIsComplexEnum] = useState(false)
  const [useDescription, setUseDescription] = useState<string>('')
  const [validValues, setValidValues] = useState<FieldValidValue[]>([])
  //
  const [transformMethod, setTransformMethod] = useState<
    TransformMethodEnum | undefined
  >(undefined)
  const [transformPrompt, setTransformPrompt] = useState<string | undefined>(
    undefined
  )
  const [transformTargetField, setTransformTargetField] = useState<
    string | undefined
  >(undefined)
  //
  const [listName, setListName] = useState<string | undefined>(undefined)
  const [listItemsType, setListItemsType] = useState<
    BuilderFieldListItem | undefined
  >(undefined)
  const [listCompleteCondition, setListCompleteCondition] = useState<
    string | undefined
  >(undefined)

  //Component properties
  const [isTransformField, setIsTransformField] = useState<boolean>(false)
  const [disableEnum, setDisableEnum] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const fieldTypesWithoutEnum: Partial<agentFieldTypeEnum>[] = [
    'pdf',
    'picture',
    'date',
    'email',
  ]

  useEffect(() => {
    const {
      name = '',
      type = '',
      description = '',
      is_complex_enum = false,
      use_descriptions = '',
      list_name = undefined,
      list_items_type = undefined,
      list_complete_condition = undefined,
      transform_method = undefined,
      transform_prompt = undefined,
      output_field_name = undefined,
    } = selectedField?.properties || {}
    const enumValues = selectedField?.properties?.['enum'] || []
    setName(name)
    setType(type)
    setDescription(description)
    setValidValues(enumValues)
    setIsComplexEnum(is_complex_enum)
    setUseDescription(use_descriptions)
    setListName(list_name)
    setListItemsType(list_items_type as BuilderFieldListItem)
    setListCompleteCondition(list_complete_condition)
    setTransformMethod(transform_method)
    setTransformPrompt(transform_prompt)
    setTransformTargetField(output_field_name)
  }, [selectedField, showModal])

  useEffect(() => {
    if (fieldTypesWithoutEnum.includes(type as agentFieldTypeEnum)) {
      setDisableEnum(true)
    } else {
      setDisableEnum(false)
    }
  }, [type])

  const validateValidValues = (values: FieldValidValue[]) => {
    const hasEmptyValue = values.some((v) => !v.value.trim())
    if (hasEmptyValue) {
      const msg = 'Please fill in all Value fields.'
      toast.error(msg)
      return false
    }

    const lowerValues = values.map((v) => v.value.trim().toLowerCase())
    const uniqueValues = new Set(lowerValues)
    if (uniqueValues.size !== lowerValues.length) {
      const msg = 'Values must be unique.'
      toast.error(msg)
      return false
    }

    if (isTransformField && transformMethod === 'mapping') {
      const hasEmptyTransformed = values.some(
        (v) => !v.transformed_value.trim()
      )
      if (hasEmptyTransformed) {
        const msg = 'Please fill in all Transformed Value fields.'
        toast.error(msg)
        return false
      }
    }

    return true
  }

  const handleCreateField = async () => {
    const input = name.trim()

    if (!input) {
      toast.error('Field name cannot be empty')
      return
    }

    if (!type) {
      toast.error('Field Type cannot be empty')
      return
    }

    const isNameChanged =
      selectedField && selectedField.properties.name !== input
    const existingNames = (currentFlowData?.fields || []).map(
      (item) => item.properties.name
    )
    const descriptionLongEnough = description.trim().length > 5
    const isUnique = isNameChanged ? !existingNames.includes(input) : true
    const startsWithLetter = /^[a-zA-Z]/.test(input)

    if (!startsWithLetter) {
      toast.error('Field name must start with a letter.')
      return
    }

    if (!isUnique) {
      toast.error('Field name must be unique.')
      return
    }

    if (!descriptionLongEnough) {
      toast.error('Description is shorter than minimum length 5')
      return
    }

    if (isTransformField) {
      if (!transformTargetField) {
        toast.error('Please select a target field to transform to.')
        return
      }
      if (!transformMethod) {
        toast.error('Please select a transform method.')
        return
      }
      if (transformTargetField && transformMethod) {
        if (transformMethod === 'llm' && !transformPrompt) {
          toast.error('Please provide a transform prompt for the LLM method.')
          return
        }
      }
    }

    if (!validateValidValues(validValues)) {
      return
    }
    setLoading(true)

    const fieldProperties: FieldPropertiesType = {
      name,
      type,
      description,
      is_complex_enum: isComplexEnum,
      enum: validValues,
      output_field_name: transformTargetField,
      transform_method: transformMethod,
      transform_prompt: transformPrompt,
      list_name: listName,
      list_items_type: listItemsType,
      list_complete_condition: listCompleteCondition,
    }
    if (isComplexEnum && useDescription) {
      fieldProperties.use_descriptions = useDescription
    }
    const data = { properties: fieldProperties }

    const response = selectedField
      ? await dispatch(
          updateField({
            flowId: currentFlowId,
            fieldId: selectedField.id,
            data,
          })
        )
      : await dispatch(
          createField({
            flowId: currentFlowId,
            data,
          })
        )

    const result = response.payload

    if (result?.message) {
      toast.error(result.message)
      setLoading(false)
      return
    }

    dispatch(setSelectedNodeId(''))
    toast.success(
      `Field ${selectedField?.id ? 'updated' : 'created'} successfully`
    )
    handleCloseModal()
  }

  const handleVariableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleCloseModal = () => {
    setName('')
    setDescription('')
    setType('')
    setValidValues([])
    setLoading(false)
    setShowModal(false)
    setDisableEnum(false)
    setIsComplexEnum(false)
    setUseDescription('')
    setListName(undefined)
    setListItemsType(undefined)
    setListCompleteCondition(undefined)
    setTransformMethod(undefined)
    setTransformPrompt(undefined)
    setTransformTargetField(undefined)
  }

  const transformFieldToggleHandler = (checked: boolean) => {
    if (!currentFlowData?.fields?.length) {
      toast.error(
        'No fields have been created yet. Please create at least one field to enable the transform field feature.'
      )
    } else {
      setIsTransformField(checked)
    }
  }

  return (
    <BaseModal
      isOpen={showModal}
      loading={loading}
      onClose={handleCloseModal}
      title={`${selectedField ? 'Edit' : 'Create'} Field`}
      submitButton={{
        text: `${selectedField ? 'Update' : 'Create'} Field`,
        onClick: handleCreateField,
        disabled: !name,
      }}
    >
      <div className='mb-4'>
        <label htmlFor='name' className='block font-bold mb-0.5'>
          Name:
        </label>
        <input
          type='text'
          id='name'
          value={name}
          placeholder='Enter variable name'
          className='w-full p-2 border border-[#ccc] rounded-lg outline-none focus:border-blue-500'
          onChange={handleVariableChange}
        />
      </div>
      <div>
        <label className='font-bold '>Description</label>
        <textarea
          rows={4}
          className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <>
        <div className='mb-4'>
          <label htmlFor='variable-type' className='block font-bold mb-0.5'>
            Field Type:
          </label>
          <div className='flex gap-2 items-center justify-between'>
            <select
              id='field-type'
              onChange={(e) => setType(e.target.value)}
              value={type || ''}
              className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
            >
              {agentFieldType.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {type === 'list' && (
          <div>
            <div className='mb-4'>
              <label htmlFor='list-name' className='block font-bold mb-0.5'>
                List Name:
              </label>
              <input
                type='text'
                id='list-name'
                value={listName}
                placeholder='Enter variable name'
                className='w-full p-2 border border-[#ccc] rounded-lg outline-none focus:border-blue-500'
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='list-items-type'
                className='block font-bold mb-0.5'
              >
                List Items Type:
              </label>
              <select
                id='list-items-type'
                value={listItemsType}
                onChange={(e) =>
                  setListItemsType(e.target.value as BuilderFieldListItem)
                }
                className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
              >
                {builderListItemsType.map((item) => (
                  <option key={item.id} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor='list-complete-condition'
                className='block font-bold mb-0.5'
              >
                List Complete Condition:
              </label>
              <textarea
                id='list-complete-condition'
                rows={4}
                className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none'
                value={listCompleteCondition}
                onChange={(e) => setListCompleteCondition(e.target.value)}
              />
            </div>
          </div>
        )}

        {!disableEnum && (
          <div>
            <SwitchInput
              onChange={(e) => setIsComplexEnum(e.target.checked)}
              className='!flex-row justify-between'
              label={'Enable complex enum'}
              placeholder=''
              checked={isComplexEnum}
              showEnableDisableText={false}
              name='isComplexEnum'
            />
            {isComplexEnum && (
              <TextareaWithExpand
                label='Use Case Description'
                placeholder='Input use case description'
                name='useDescription'
                rows={3}
                onChange={(e) => setUseDescription(e.target.value)}
                value={useDescription}
              />
            )}
            <SwitchInput
              onChange={(e) => transformFieldToggleHandler(e.target.checked)}
              className='!flex-row justify-between'
              label={'Transform field to a different field'}
              placeholder=''
              checked={isTransformField}
              showEnableDisableText={false}
              name='isTransformField'
            />
            {isTransformField && (
              <>
                <div className='mt-4'>
                  <label
                    htmlFor='variable-type'
                    className='block font-bold mb-0.5'
                  >
                    Choose fields to transform to:
                  </label>
                  <div className='flex mb-3 gap-2 items-center justify-between'>
                    <select
                      id='field-type'
                      onChange={(e) => setTransformTargetField(e.target.value)}
                      value={transformTargetField}
                      className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                    >
                      <option value='' disabled>
                        Choose a value
                      </option>
                      {currentFlowData?.fields.map((field) => (
                        <option key={field.id} value={field.properties.name}>
                          {field.properties.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor='variable-type'
                    className='block font-bold mb-0.5'
                  >
                    Transform method:
                  </label>
                  <div className='flex gap-2 items-center justify-between'>
                    <select
                      id='field-type'
                      onChange={(e) =>
                        setTransformMethod(
                          e.target.value as TransformMethodEnum
                        )
                      }
                      value={transformMethod || ''}
                      className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                    >
                      {transformMethods.map((item) => (
                        <option key={item.id} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {transformMethod == 'llm' && (
                  <TextareaWithExpand
                    label='Transform prompt'
                    placeholder='Input transform prompt'
                    name='transformPrompt'
                    rows={3}
                    onChange={(e) => setTransformPrompt(e.target.value)}
                    value={transformPrompt}
                  />
                )}
              </>
            )}
          </div>
        )}
        {!disableEnum && (
          <div className='mt-4'>
            <label className='font-bold'>Valid Values</label>
            <ValidValuesManager
              showTransformedValue={
                isTransformField && transformMethod === 'mapping'
              }
              onValidation={validateValidValues}
              validValues={validValues}
              setValidValues={setValidValues}
            />
          </div>
        )}
      </>
    </BaseModal>
  )
}

export default CreateField
