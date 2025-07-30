import React from 'react'
import Modal from '@/components/elements/Modal'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  submitButton?: {
    text: string
    onClick: () => void
    disabled?: boolean
  }
  loading?: boolean
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  submitButton,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose} additionalClass='p-0'>
      <div className='bg-white rounded-[10px] w-full flex flex-col gap-4 relative pb-4 h-full'>
        <div className='bg-gray-200 p-3 w-full'>
          <h2 className='text-center text-xl font-bold m-0 capitalize'>
            {title}
          </h2>
        </div>

        <div className='px-6 flex flex-col h-full overflow-y-auto overflow-x-hidden pb-4'>
          {children}

          <button
            className='absolute top-3 right-2 bg-none border-none text-2xl text-gray-400 cursor-pointer'
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {submitButton && (
          <div className='flex justify-center items-center mt-2'>
            {loading ? (
              <div className='inline-app-loader dark mb-3' />
            ) : (
              <>
                <button
                  className='bg-gray-300 hover:bg-gray-400 border-none py-3 px-7 text-base rounded-md cursor-pointer mr-2.5'
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className={`px-7 py-3 text-base rounded-md border-none ${
                    submitButton.disabled
                      ? 'bg-gray-300 text-black cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                  onClick={submitButton.onClick}
                  disabled={submitButton.disabled}
                >
                  {submitButton.text}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default BaseModal
