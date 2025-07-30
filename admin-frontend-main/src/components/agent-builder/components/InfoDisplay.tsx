import Modal from '@/components/elements/Modal'
import { InfoDisplayProps } from '@/types/agent-builder'

const InfoDisplay = ({
  isOpen,
  onClose,
  title,
  children,
}: InfoDisplayProps) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      additionalClass='max-h-[550px] min-w-[380px] w-[550px] p-0 pb-3 m-0 !h-fit'
    >
      <div className='bg-white rounded-lg p-6 w-full'>
        <h3 className='text-lg font-semibold mb-4 capitalize'>{title} </h3>
        <div className='h-full overflow-y-auto max-h-[410px]'>{children}</div>
        <div className='flex justify-end mt-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm border border-gray-200 rounded-lg'
            type='button'
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default InfoDisplay
