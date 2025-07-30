import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalType {
  children?: ReactNode
  isOpen: boolean
  toggle: (val?: boolean) => void
  size?: string
  additionalClass?: string
}

const Modal = ({ isOpen, toggle, children, additionalClass }: ModalType) => {
  const modalRoot = document.getElementById('modal')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        toggle(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, toggle])

  if (!modalRoot || !isOpen) return null
  return createPortal(
    <div
      className='modal-overlay'
      aria-modal
      tabIndex={-1}
      role='dialog'
      onClick={() => toggle(false)}
    >
      <div
        className={`modal-box relative h-full ${additionalClass}`}
        onClick={e => e.stopPropagation()}
      >
        <div className='flex flex-row justify-end absolute end-3 top-1'>
          <button
            type='button'
            className='modal-close-button'
            data-dismiss='modal'
            aria-label='Close'
            onClick={() => toggle(false)}
          >
            <span
              className='text-2xl text-gray-500 font-light'
              aria-hidden='true'
            >
              &times;
            </span>
          </button>
        </div>
        <div className='flex-1 flex flex-col h-full'>{children}</div>
      </div>
    </div>,
    modalRoot
  )
}
export default Modal
