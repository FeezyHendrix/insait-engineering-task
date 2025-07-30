import { useState } from 'react'

const useFunnelHover = () => {
  const [isOpen, setIsOpen] = useState(false)

  const show = () => {
    setIsOpen(true)
  }

  const hide = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    show,
    hide,
  }
}

export default useFunnelHover
