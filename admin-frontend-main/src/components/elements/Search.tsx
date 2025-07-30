import searchImg from '@image/icons/search.svg'
import { useState } from 'react'

interface SearchType {
  extraClass?: string
  imgWidth?: number
  placeholder: string
  value?: string | null
  onChange?: (value: string) => void
  secondBounce?: number
}

const Search = ({
  extraClass,
  imgWidth,
  placeholder,
  value,
  onChange,
  secondBounce = 1,
}: SearchType) => {
  const [inputValue, setInputValue] = useState(value || '')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const BOUNCE_TIMEOUT = secondBounce * 1000

  const debouncedOnChange = (newValue: string) => {
    setInputValue(newValue)
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      if (onChange) onChange(newValue)
    }, BOUNCE_TIMEOUT)
    setTimeoutId(newTimeoutId)
  }

  return (
    <div
      className={`flex flex-row rounded-2xl border items-center ps-3 pe-2 ${extraClass}`}
    >
      <img
        src={searchImg}
        className='logo'
        alt='search icon'
        width={imgWidth || 30}
      />
      <input
        placeholder={placeholder}
        value={inputValue}
        onChange={e => debouncedOnChange(e.target.value)}
        className='flex-1 bg-transparent text-md outline-none ms-2'
      />
    </div>
  )
}

export default Search
