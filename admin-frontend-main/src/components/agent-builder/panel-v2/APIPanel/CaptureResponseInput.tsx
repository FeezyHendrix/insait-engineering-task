import { FC } from 'react'
import { FaMinus } from 'react-icons/fa'
import { useAppSelector } from '@/hook/useReduxHooks'
import SelectInput from '@/components/elements/SelectInput'

interface CaptureResponseInputProps {
  item: { key: string; field_name: string }
  index: number
  onFieldChange: (
    section: 'capture_response',
    index: number,
    field: string,
    value: string
  ) => void
  onRemove: (section: 'capture_response', index: number) => void
}

const CaptureResponseInput: FC<CaptureResponseInputProps> = ({
  item,
  index,
  onFieldChange,
  onRemove,
}) => {
  const { currentFlowData } = useAppSelector(state => state.builder)

  const fields = (currentFlowData?.fields || []).map(field => ({
    label: field.properties.name,
    value: field.properties.name,
  }))

  return (
    <div className='mb-3 relative flex items-start gap-2'>
      <div className='flex-1 flex flex-col gap-2'>
        <input
          type='text'
          value={item.key}
          onChange={e =>
            onFieldChange('capture_response', index, 'key', e.target.value)
          }
          placeholder='Enter key'
          className='w-full p-1.5 border border-gray-200 rounded-md'
        />
        <SelectInput
          placeholder={'Field Name'}
          value={item.field_name}
          extraClass={'w-full'}
          data={fields}
          textClass={'text-sm'}
          onValueChange={value =>
            onFieldChange('capture_response', index, 'field_name', value)
          }
        />
      </div>
      <button
        onClick={() => onRemove('capture_response', index)}
        className='text-gray-400 hover:text-gray-600 mt-2'
      >
        <FaMinus size={16} />
      </button>
    </div>
  )
}

export default CaptureResponseInput
