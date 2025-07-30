import Modal from '../elements/Modal'
import ChatDataView from '../chat/ChatDataView'
import { TicketDataType } from '@/types/support'
import { camelToSentenceCase } from '@/utils/data'
import { useTranslation } from 'react-i18next'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage'

interface TicketDetailModalProp {
  isOpen: boolean
  ticket: TicketDataType | null
  closeModal: () => void
}

const TicketDetailModal = ({
  isOpen,
  ticket,
  closeModal,
}: TicketDetailModalProp) => {
  const { t } = useTranslation()
  const isAdminOrInternalUser = useIsInternalOrAdminUser()

  if (!ticket) return null

  const {
    id,
    chatURL,
    commentHistory,
    comments,
    fileURLs,
    ticketURL,
    ...rest
  } = ticket

  const dataObject = {
    ID: id,
    ...rest,
    priority: camelToSentenceCase(rest.priority, true),
    status: camelToSentenceCase(rest.status, true),
    ...(chatURL && { chatURL }),
    ...(isAdminOrInternalUser && ticketURL && { ticketURL }), 
  }

  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <h2 className='text-xl text-center bolder-text pt-3 pb-4'>
        {t('support.ticketInformation')}
      </h2>
      <div className='h-full overflow-hidden'>
        {ticket && (
          <>
            <ChatDataView dataObject={dataObject} keyClassName='capitalize'>
            {fileURLs &&
              fileURLs.map(url => <img src={url} alt={'file display'} />)}
            </ChatDataView>
            
          </>
        )}
      </div>
    </Modal>
  )
}

export default TicketDetailModal
