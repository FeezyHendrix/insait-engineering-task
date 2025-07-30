import infoIcon from '@image/icons/info-circle.svg'
import {  useState } from 'react'
import { useTranslation } from 'react-i18next'

interface MessageInputProp {
  onChange?: (value: string) => void
  label: string
  value?: string
  toolTipText?: string
  rows?: number
}

const MessageInput = ({
  onChange,
  label,
  value,
  toolTipText,
  rows = 4,
}: MessageInputProp) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false)


  return (
    <div className='messageBlock my-4'>
      <h3 className='my-2 text-lg font-semibold text-gray-900 inline'>
        {label}
        {'  '}
      </h3>
      {toolTipText && (
        <div className='tooltip relative inline'>
          <img
            src={infoIcon}
            className='logo inline'
            alt='upload icon'
            width={20}
            height={20}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div
              id='tooltip-message'
              className='tooltip-message absolute z-10 inline-block px-1 py-0 text-sm font-sm text-white transition-opacity duration-300 bg-gray-500 rounded-md shadow-sm'
            >
              {toolTipText}
            </div>
          )}
        </div>
      )}
      <textarea
        id='message'
        value={value}
        onChange={event => onChange && onChange(event.target.value)}
        rows={rows}
        className='mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300'
        placeholder={t('input.writeYourThought')}
      ></textarea>
    </div>
  )
}

export default MessageInput
