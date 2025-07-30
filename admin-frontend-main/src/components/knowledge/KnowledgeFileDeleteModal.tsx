import Modal from '../elements/Modal'
import ConfirmationBody from '../batchSend/mini-elements/confirmation-body'
import { useTranslation } from 'react-i18next'
import { KnowledgeFileItemType } from '@/types/knowledge'

interface KnowledgeFileDeleteModalProp {
  isOpen: boolean
  loading: boolean
  file: KnowledgeFileItemType | null
  closeModal: () => void
  handleDelete: (id: string) => void
}

const KnowledgeFileDeleteModal = ({
  isOpen,
  file,
  closeModal,
  handleDelete,
  loading,
}: KnowledgeFileDeleteModalProp) => {
  const { t } = useTranslation()

  if (!file) return

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      additionalClass='max-h-[420px] min-w-[450px] w-[450px]'
    >
      <div className='h-full pt-8'>
        <ConfirmationBody
          toggle={closeModal}
          title={t('knowledge.deleteKnowledgeFileConfirmation', {
            action:  t('button.delete'),
            subject: file.name
          })}
          loading={loading}
          confirm={() => handleDelete(file.id)}
          confirmClass='!bg-red-500 !border-red-500'
          buttonText={t('button.delete')}
        />
      </div>
    </Modal>
  )
}

export default KnowledgeFileDeleteModal
