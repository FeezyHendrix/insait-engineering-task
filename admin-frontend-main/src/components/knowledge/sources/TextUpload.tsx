import { TextUploadProps } from '@/types/input'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TextUpload: React.FC<TextUploadProps> = ({ textData, setTextData }) => {
  const { t } = useTranslation()

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextData(e.target.value)
  }

  const characterCount = textData.length
  const maxCharacters = 5000

  return (
    <div>
      <textarea
        value={textData}
        onChange={handleTextChange}
        placeholder={t('input.enterText')}
        className='w-full rounded-lg px-2 py-2 outline-none text-sm border border-gray-300'
        rows={10}
        maxLength={maxCharacters}
      ></textarea>
      <div className='flex justify-between mt-1 text-sm text-gray-500'>
        <span>{characterCount} {t('general.characters')}</span>
        <span>{maxCharacters - characterCount} {t('input.charsRemaining')}</span>
      </div>
    </div>
  )
}

export default TextUpload
