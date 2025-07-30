import { ConversationType } from '@/types/conversation'
import { useEffect, useState } from 'react'
import { groupMessagesByDate } from '@/utils/dateHelper'
import LiveChatList from './mini/LiveChatList'
import LiveChatInput from './mini/LiveChatInput'
import LiveChatHeader from './mini/LiveChatHeader'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { resetInboxItem } from '@/redux/slices/analytics'
import { getConversationDataByIdRequest } from '@/redux/slices/analytics/request'
import { unwrapResult } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { CapitalizeEachWord } from '@/utils/stringHelper'
import { useTranslation } from 'react-i18next'

const Conversation = ({ selectedInbox , messageList, setMessageList}: ConversationType) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [templateData, setTemplateData] = useState('')

  const resetCount = (id: string) => {
    try {
      dispatch(resetInboxItem(id))
    } catch (error) {}
  }

  const fetchMessageById = async (id: string) => {
    try {
      setLoading(true)
      const response = await unwrapResult(
        await dispatch(getConversationDataByIdRequest(id))
      )
      const data = groupMessagesByDate(response.messages)
      setMessageList(data)
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateClick = (templateMessage: string) => {
    setTemplateData(templateMessage)
  }

  useEffect(() => {
    if (selectedInbox?.conversation_id) {
      fetchMessageById(selectedInbox.conversation_id)
      resetCount(selectedInbox.conversation_id)
    }
  }, [selectedInbox?.conversation_id])

  return (
    <div className='flex-1 hidden md:flex flex-col'>
      {selectedInbox?.customer_id ? (
        <>
          <LiveChatHeader
            name={selectedInbox.customer_id}
            category={CapitalizeEachWord(selectedInbox.chat_product)}
            clientCollectedInfo={selectedInbox.conversation_obj_string}
          />
          {loading ? (
            <p className='flex-1 flex justify-center items-center'>
              {t('feedback.loading')}
            </p>
          ) : (
            <>
              <LiveChatList 
                list={messageList} 
                conversationId={selectedInbox.conversation_id}
                openTemplate={openTemplate}
                setOpenTemplate={setOpenTemplate}

                handleTemplateClick={handleTemplateClick}
              />
              <LiveChatInput 
                conversationId={selectedInbox.conversation_id}
                openTemplate={openTemplate}
                setOpenTemplate={setOpenTemplate}

                setTemplateData={setTemplateData}
                templateData={templateData}
              /> 
            </>
          )}
        </>
      ) : (
        <p className='flex-1 flex justify-center items-center'>
          {t('chats.selectMessage')}
        </p>
      )}
    </div>
  )
}

export default Conversation
