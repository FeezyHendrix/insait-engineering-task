import React from 'react'
import { useTranslation } from 'react-i18next'
import { SourceInfoProps } from '@/types/knowledge'

const SourceInfo: React.FC<SourceInfoProps> = ({
  loading,
  fileCount,
  urlCount,
  urlChars,
  questionCount,
  textChars,
}) => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col md:mt-14 h-fit rounded-lg py-2 pe-4 gap-1 min-h-[100px]'>
      <h4 className='bold-text text-md mb-2 text-black'>{t('knowledge.uploadTitle')}</h4>
      {fileCount > 0 && (
        <p className='text-sm text-gray-500'>{`${fileCount} ${t('general.files')}`}</p>
      )}
      {urlCount > 0 && (
        <p className='text-sm text-gray-500'>{`${urlCount} ${t('general.urls')} (${urlChars.toLocaleString()} ${t('general.chars')})`}</p>
      )}
      {questionCount > 0 && (
        <p className='text-sm text-gray-500'>{`${questionCount} ${t('general.questions')}`}</p>
      )}
      {textChars > 0 && (
        <p className='text-sm text-gray-500'>{`${t('general.textInput')} (${textChars.toLocaleString()} ${t('general.chars')})`}</p>
      )}
      {!textChars && !questionCount && !urlCount && !fileCount && (
        <p className='text-sm text-gray-500'>{t('feedback.noData')}</p>
      )}
      {loading && <div className='inline-app-loader dark mx-auto' />}
    </div>
  )
}

export default SourceInfo
