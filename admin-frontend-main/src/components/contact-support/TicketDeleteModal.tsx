import Modal from '../elements/Modal'
import { TicketDataType } from '@/types/support'
import ConfirmationBody from '../batchSend/mini-elements/confirmation-body'
import { useTranslation } from 'react-i18next'

interface TicketDeleteModalProp {
  isOpen: boolean
  loading: boolean
  ticket: TicketDataType | null
  closeModal: () => void
  handleDelete: (id: string) => void
}

const TicketDeleteModal = ({
  isOpen,
  ticket,
  closeModal,
  handleDelete,
  loading,
}: TicketDeleteModalProp) => {
  const { t } = useTranslation()

  if (!ticket) return

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      additionalClass='max-h-[420px] min-w-[450px] w-[450px]'
    >
      <div className='h-full pt-8'>
        <ConfirmationBody
          toggle={closeModal}
          title={t('support.deleteTicketConfirmation', {
            action:  t('button.delete'),
            subject: ticket.subject
          })}
          loading={loading}
          confirm={() => handleDelete(ticket.id)}
          confirmClass='!bg-red-500 !border-red-500'
          buttonText={t('button.delete')}
        />
      </div>
    </Modal>
  )
}

export default TicketDeleteModal
