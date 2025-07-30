import ConfirmationBody from '@/components/batchSend/mini-elements/confirmation-body'
import Modal from '@/components/elements/Modal'
import { KnowledgeConfirmModalProp } from '@/types/knowledge'
import { useTranslation } from 'react-i18next'

const KnowledgeConfirmModal = ({
  status,
  title,
  id,
  closeModal,
  handleDelete,
  loading,
}: KnowledgeConfirmModalProp) => {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={status !== 'none'}
      toggle={closeModal}
      additionalClass='max-h-[400px] min-w-[450px] w-[450px]'
    >
      <div className='h-full pt-8'>
        <ConfirmationBody
          toggle={closeModal}
          title={title}
          loading={loading}
          confirm={() => handleDelete(id)}
          confirmClass={
            status === 'delete'
              ? '!bg-red-500 !border-red-500'
              : 'app-bg-blue border-none'
          }
          buttonText={
            status === 'delete' ? t('button.delete') : t('button.update')
          }
        />
      </div>
    </Modal>
  )
}

export default KnowledgeConfirmModal
