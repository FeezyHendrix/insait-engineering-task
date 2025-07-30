import Modal from '@/components/elements/Modal'
import ConfirmationBody from './confirmation-body'
import { useTranslation } from 'react-i18next'

interface ConfirmModalType {
  isOpen: boolean
  title?: string
  toggle: (val?: boolean) => void
  confirm: ()=> void
}

const ConfirmationModal = ({ isOpen, title, toggle, confirm}: ConfirmModalType)=> {
  const { t } = useTranslation();
  const titleText = title ? title : t('chats.confirmMessageSending')

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ConfirmationBody title={titleText} toggle={toggle} confirm={confirm} buttonText={t('button.send')} />
    </Modal>
  );
}

export default ConfirmationModal
