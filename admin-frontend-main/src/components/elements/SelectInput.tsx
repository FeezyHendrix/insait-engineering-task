import { useState, useRef, useEffect } from 'react'
import { LabelValueType } from '@/types/chat'
import { useTranslation } from 'react-i18next'
import { IoChevronDown } from 'react-icons/io5'

interface SelectInputType {
  label?: string
  placeholder?: string
  data: Array<LabelValueType>
  value: string
  onValueChange: (value: string) => void
  extraClass?: string
  textClass?: string
  containerClass?: string
  showAll?: boolean
  floatingLabel?: boolean
}

const SelectInput = ({
  label,
  placeholder = '',
  data,
  value,
  onValueChange,
  extraClass = '',
  textClass = '',
  containerClass = '',
  showAll = false,
  floatingLabel = false,
}: SelectInputType) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedItem = data.find(item => item.value === value)

  const handleCloseDropdown = () => setIsOpen(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        handleCloseDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableOptions = dropdownRef.current?.querySelectorAll('li')
    const currentIndex = Array.from(focusableOptions || []).findIndex(
      item => item === document.activeElement
    )

    if (e.key === 'Escape') {
      handleCloseDropdown()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = currentIndex + 1
      if (focusableOptions && nextIndex < focusableOptions.length) {
        ;(focusableOptions[nextIndex] as HTMLElement).focus()
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = currentIndex - 1
      if (focusableOptions && prevIndex >= 0) {
        ;(focusableOptions[prevIndex] as HTMLElement).focus()
      }
    }
  }

  const OptionItem = ({ option, className = '' }: { option: LabelValueType, className?: string }) => (
    <li
      key={option.value}
      className={`px-4 py-2 cursor-pointer text-lg ${
        value === option.value ? 'bg-blue-100' : 'hover:bg-gray-50'} ${className}`}
      onClick={() => {
        onValueChange(option.value)
        handleCloseDropdown()
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onValueChange(option.value)
          handleCloseDropdown()
        }
      }}
      tabIndex={0}
      role='option'
      aria-selected={value === option.value}
      id={`option-${option.value}`}
    >
      {t(option.label)}
    </li>
  )

  return (
    <div
      className={`relative px-0.5 ${containerClass}`}
      ref={dropdownRef}
      tabIndex={-1}
      onBlur={e => {
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
          handleCloseDropdown()
        }
      }}
    >
      {label && (
        <label
          onClick={handleCloseDropdown}
          className={`${
            floatingLabel
              ? 'absolute left-2 transition-all duration-200 pointer-events-none transform -translate-y-3 scale-90 px-2 bg-white z-10'
              : 'block bold-text ml-1 mb-1'
          }`}
        >
          {label}
        </label>
      )}
      <div
        className={`border rounded-lg p-2 cursor-pointer ${extraClass} hover:border-gray-300`}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        tabIndex={0}
      >
        <div className='flex items-center justify-between'>
          <span
            className={`text-lg whitespace-nowrap overflow-hidden ${textClass} ${
              !selectedItem ? 'text-gray-400' : ''
            }`}
          >
            {selectedItem
              ? t(selectedItem.label)
              : showAll
              ? t('general.all')
              : placeholder}
          </span>
          <IoChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <ul className='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto'>
          {showAll && (
            <OptionItem option={{ value: '', label: t('general.all') }} className={textClass} />
          )}
          {data.map(option => (
            <OptionItem option={option} key={option.value} className={textClass} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default SelectInput
