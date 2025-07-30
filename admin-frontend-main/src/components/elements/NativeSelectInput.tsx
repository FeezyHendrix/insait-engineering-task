import { LabelValueType } from '@/types/chat'

interface NativeSelectInputProps {
  label?: string
  id?: string
  data: LabelValueType[]
  value: string
  onValueChange: (value: string) => void
  containerClass?: string
  className?: string
}

const NativeSelectInput = ({
  label,
  id,
  data,
  value,
  onValueChange,
  containerClass = '',
  className = '',
}: NativeSelectInputProps) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`

  return (
    <div className={`mb-2 ${containerClass}`}>
      {label && (
        <label htmlFor={selectId} className='block bold-text ml-1 mb-1'>
          {label}
        </label>
      )}
      <div className='flex gap-2 items-center justify-between'>
        <select
          id={selectId}
          value={value}
          onChange={e => onValueChange(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-lg  focus:border-blue-500 ${className}`}
        >
          {data.map(item => (
            <option
              disabled={item.value === ''}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default NativeSelectInput
