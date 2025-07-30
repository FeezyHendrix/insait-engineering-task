import { toast } from 'react-toastify'
import Modal from '../elements/Modal'
import ConversationalChat from '../conversation/ConversationChat'
import { useEffect, useState } from 'react'
import { getThumbsConversation } from '@/redux/slices/analytics/request'
import dayjs from 'dayjs'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { MessageReactionInfoModalType } from '@/types/messageReactions'
import { useTranslation } from 'react-i18next'

const MessageFeedbackModal = ({
  chatId,
  isOpen,
  toggle,
}: MessageReactionInfoModalType) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([]);
  const [date, setDate] = useState('')
  const [conversationId, setConversationId] = useState('')


  useEffect(() => {
    if (chatId) {
      fetchMessages()
    }
  }, [chatId])

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getThumbsConversation(chatId));
      setMessages(response.payload.messages)
      setDate(response.payload.startedTime)
      setConversationId(response.payload.conversationId)
      setLoading(false);
    } catch (error) {
      toast.error(t('feedback.error'))
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <h2 className='text-xl text-center bolder-text pt-3 pb-4'>
      {t('messages.messageReactions')}
      </h2>
      <div className='h-full overflow-hidden'>
        {loading ? (
          <p className='text-center py-10 flex-1'>{t('feedback.fetching')}</p>
        ) : (
          <ConversationalChat
            id={conversationId}
            data={messages}
            date={dayjs(date).format('DD-MM-YYYY')}
            loading={loading}
          >
          </ConversationalChat>
        )}
      </div>
    </Modal>
  )
}

export default MessageFeedbackModal