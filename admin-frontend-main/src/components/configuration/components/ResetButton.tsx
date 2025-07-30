// components/ResetButton.tsx
import React from 'react'
import { Tooltip } from '@mui/material'
import { BiReset } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

interface ResetButtonProps {
  onClick: () => void
  disabled?: boolean
}

const ResetButton: React.FC<ResetButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const { t } = useTranslation()

  return (
    <Tooltip enterDelay={500} title={t('configurations.main.resetButtonDesc')}>
      <span>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`
            flex items-center gap-2
            text-white
            font-medium rounded-lg text-md px-5 py-2.5
            focus:outline-none focus:ring-4 focus:ring-amber-200
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-amber-300'
              : 'bg-amber-300 hover:bg-amber-400'}
          `}
        >
          <BiReset className="h-5 w-5" />
          {t('configurations.main.resetButton')}
        </button>
      </span>
    </Tooltip>
  )
}

export default ResetButton