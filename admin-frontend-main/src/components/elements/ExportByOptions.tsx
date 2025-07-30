import React, { useState } from 'react'
import excelIcon from '@image/icons/excel.png'
import { ExportByOptionsProps, ExportDateOptions } from '@/types/chat'
import { exportDateRangeOptions } from '@/utils/data'
import { useTranslation } from 'react-i18next'

const ExportByOptions = ({ onExport, topPadding, title }: ExportByOptionsProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExport = async (value: ExportDateOptions) => {
    try {
      setLoading(true)
      setIsOpen(false)
      await onExport(value)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative inline-block ${topPadding ? 'pt-3' : 'pb-4'}`}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className='flex justify-center items-center'>
        <button
          onMouseEnter={() => setIsOpen(true)}
          className='flex items-center gap-2 py-2 px-2 hover:bg-gray-50 transition-colors'
        >
          <img src={excelIcon} width={23} className='min-w-[20px]' alt='Excel' />
          { title && <h3>{title}</h3>}
        </button>
        {loading && <div className='inline-app-loader dark' />}
      </div>

      {isOpen && !loading && (
        <div
          className='absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1'
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {exportDateRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleExport(option.value)}
              className='w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExportByOptions
