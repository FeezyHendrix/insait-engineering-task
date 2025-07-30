import Modal from '@/components/elements/Modal'
import { ConfirmDialogProps } from '@/types/agent-builder'

const ConfirmDialog = ({
  isOpen,
  onClose,
  loading = false,
  isDelete = true,
  onConfirm,
  title = isDelete ? 'Delete' : 'Confirm',
  description = 'Are you sure you want to delete this variable? This action cannot be undone.',
}: ConfirmDialogProps) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      additionalClass='max-h-[450px] min-w-[380px] w-[380px] p-0 m-0 !h-[200px]'
    >
      <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
        <h3 className='text-lg font-semibold mb-4 capitalize'>{title} </h3>
        <p className='text-gray-600 mb-6'>{description}</p>
        <div className='flex justify-end gap-3'>
          {loading ? (
            <div className='inline-app-loader dark mt-3' />
          ) : (
            <>
              <button
                onClick={onClose}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800'
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 ${
                  isDelete
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-md`}
              >
                {isDelete ? 'Delete' : 'Confirm'}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
