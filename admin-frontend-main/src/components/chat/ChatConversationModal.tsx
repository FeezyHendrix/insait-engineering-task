import { toast } from 'react-toastify'
import { MessagesType } from '@/types/dashboard'
import ChatInput from '../elements/ChatInput'
import Modal from '../elements/Modal'
import ConversationalChat from '../conversation/ConversationChat'
import { useEffect, useState } from 'react'
import { getConversationByIdRequest } from '@/redux/slices/analytics/request'
import { unwrapResult } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { ConversationModalType } from '@/types/unansweredQs'
import { useTranslation } from 'react-i18next'
import CustomTooltip from '../elements/CustomTooltip'
import { copyTimeout } from '@/utils/data'
import { handleCopyText } from '@/utils'

const ChatConversationModal = ({
  chatId,
  isOpen,
  toggle,
  tableData,
  showReportButton = true
}: ConversationModalType) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<MessagesType>({
    id: '',
    data: [],
    createdAt: '',
  })

  const getExistingMessage = (): MessagesType | null => {
    if(!tableData) return null

    const selectedItem = tableData.filter(item => item.chatId === chatId)[0];    
    
    if(!selectedItem?.chatId || !selectedItem.messages?.length) return null;

    return {
      id: selectedItem.chatId,
      createdAt: selectedItem?.createdAt,
      data: selectedItem.messages,
      comment: selectedItem.comment,
    }
  }

  useEffect(() => {
    if (chatId && isOpen) {
      const existingMessage = getExistingMessage();
      if(existingMessage) {
        setMessages(existingMessage)
        return;
      }
      fetchMessages()
    }
  }, [chatId, isOpen])

  useEffect(() => {
    copyTimeout(copied, setCopied);
  }, [copied]);

  const fetchMessages = async () => {    
    try {
      if(!chatId) return;
      setLoading(true)
      const response = unwrapResult(
        await dispatch(getConversationByIdRequest(chatId))
      )
      if (response?.messages && Array.isArray(response.messages)) {
        setMessages({
          id: response.chatId,
          data: response.messages,
          createdAt: response?.createdAt,
          comment: response.comment,
        })
        return;
      }
      toast.error(t('feedback.errorWrong'))
    } catch (error) {
      toast.error(t('feedback.error'))
    } finally {
      setLoading(false)
    }
  }

  const renderCustomField = () => {
    return (
      <button
        className='flex justify-start ps-3'
        onClick={() => {
          handleCopyText(messages.id)
          setCopied(true)
        }}
      >
        <CustomTooltip
          noWrap={false}
          title={copied ? t('chats.copied') : t('chats.copy')}
        >
          <h3 className='text-md font-medium pt-2 hover:text-blue-400 '>
            {t('chats.conversation')} {messages.id}
          </h3>
        </CustomTooltip>
      </button>
    )
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <div className='h-full overflow-hidden'>
        {loading ? (
          <p className='text-center py-10 flex-1'>{t('feedback.fetching')}</p>
        ) : (
          <ConversationalChat
            id={messages.id}
            customHeaderField={renderCustomField}
            showReportButton={showReportButton}
            data={messages.data}
            date={dayjs(messages.createdAt).format('MMM DD, YYYY HH:mm')}
            loading={loading}
          >
            <ChatInput defaultValue={messages?.comment} chatId={messages.id} />
          </ConversationalChat>
        )}
      </div>
    </Modal>
  )
}

export default ChatConversationModal
