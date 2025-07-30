import { useEffect, useState } from 'react'

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = (value?: boolean) => {
    setIsOpen(prev => value || !prev)
  }

  const handleBodyOverflow = (value: 'hidden' | 'auto') => {
    document.body.style.overflow = value
  }

  useEffect(() => {
    if (isOpen) {
      handleBodyOverflow('hidden')
    } else {
      handleBodyOverflow('auto')
    }

    return () => handleBodyOverflow('auto')
  }, [isOpen])

  return {
    isOpen,
    toggle,
  }
}

export default useModal
