import { AddKnowledgeModalProp, KnowledgeType } from '@/types/knowledge'
import Modal from '../elements/Modal'
import KnowledgeSubmit from './KnowledgeSubmit'
import { useTranslation } from 'react-i18next'

const AddKnowledgeModal = ({
  isOpen,
  handleClose,
  handleAdd,
  selectedKnowledge,
}: AddKnowledgeModalProp) => {
  const { t } = useTranslation()
  const handleSuccess = (data: KnowledgeType) => {
    handleAdd(data)
    handleClose()
  }
  return (
    <Modal isOpen={isOpen} toggle={handleClose} additionalClass="!h-fit max-h-[90%] !overflow-y-auto">
      <h5 className='mt-5 px-4 bold-text text-xl'>
        {selectedKnowledge?.id ?t('knowledge.edit') : t('knowledge.add')}
      </h5>
      <div className='flex justify-center items-center h-full'>
      <KnowledgeSubmit
        editKnowledge={selectedKnowledge?.id ? selectedKnowledge as KnowledgeType : undefined}
        addKnowledge={handleSuccess}
      />
      </div>
    </Modal>
  )
}

export default AddKnowledgeModal
