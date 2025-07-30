import { SectionType } from '@/types/agent-builder'
import {
  extractMentionValue,
  extractPlainText,
  transformToEditorFormat,
} from '@/utils/botBuilder'
import { FC } from 'react'
import { FaMinus } from 'react-icons/fa'
import EditorInput from '../../components/EditorInput'
import { useAppSelector } from '@/hook/useReduxHooks'

interface KeyValueInputProps {
  item: { key: string; field_name?: string; value?: string }
  index: number
  section: SectionType
  onFieldChange: (
    section: SectionType,
    index: number,
    field: string,
    value: string
  ) => void
  onRemove: (section: SectionType, index: number) => void
  keyPlaceholder?: string
}

const KeyValueInput: FC<KeyValueInputProps> = ({
  item,
  index,
  section,
  onFieldChange,
  onRemove,
  keyPlaceholder = 'Enter key',
}) => {
  const { currentFlowData } = useAppSelector(state => state.builder)
  const fields = (currentFlowData?.fields || []).map(
    field => field.properties.name
  )

  const handleEditorChange = (val: string) => {
    try {
      const parsedValue = JSON.parse(val)

      const mentionValue = extractMentionValue(parsedValue)
      if (mentionValue) {
        onFieldChange(section, index, 'field_name', mentionValue)
        return
      }

      const plainText = extractPlainText(parsedValue)
      onFieldChange(section, index, 'value', plainText)
    } catch (error) {
      onFieldChange(section, index, 'value', val)
    }
  }
  return (
    <div className='mb-3 relative flex items-start gap-2'>
      <div
        className={`${
          section === 'headers' ? 'w-full' : 'flex-1'
        } flex flex-col gap-2`}
      >
        <input
          type='text'
          value={item.key}
          onChange={e => onFieldChange(section, index, 'key', e.target.value)}
          placeholder={keyPlaceholder}
          className='w-full p-1.5 border border-gray-200 rounded-md'
        />
        <EditorInput
          checkMention={true}
          value={transformToEditorFormat(item?.field_name, item?.value)}
          onChange={handleEditorChange}
          placeholder='Input a value or Type { to select field name'
          characters={fields}
          className='!min-h-[34px] outline-none border-gray-300 border'
        />
      </div>
      <button
        onClick={() => onRemove(section, index)}
        className='text-gray-400 hover:text-gray-600 mt-2'
      >
        <FaMinus size={16} />
      </button>
    </div>
  )
}

export default KeyValueInput
