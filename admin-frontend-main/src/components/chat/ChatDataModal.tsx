import { toast } from 'react-toastify'
import { ChatDataModalType, ChatDataTableBodyType } from '@/types/dashboard'
import Modal from '../elements/Modal'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/hook/useReduxHooks'
import ChatDataView from './ChatDataView'
import { useTranslation } from 'react-i18next'
import { getFilteredData } from '@/utils/stringHelper'

const ChatDataModal = ({
  chatId,
  userId,
  isOpen,
  toggle,
  source = 'chatData'
}: ChatDataModalType) => {
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [dataObject, setDataObject] = useState<ChatDataTableBodyType | {}>({})
  const individualChatData = useAppSelector(state => state.analytics[source]).data.filter((chat) => chat.chatId === chatId)
  const allDataFields = useAppSelector((state) => state.companyConfig.allDataFields)

  useEffect(() => {    
    if (chatId) {
      fetchChatData()
    }
  }, [chatId])

  const fetchChatData = async () => {    
    try {      
      setLoading(true)
      if (individualChatData && individualChatData?.length > 0) {
        const chatDataObject = individualChatData[0]?.dataObject
        const parsedData = typeof chatDataObject === 'string' ? JSON.parse(chatDataObject) : chatDataObject;
        const filteredDataObject = getFilteredData(parsedData, allDataFields)
        setDataObject(filteredDataObject)
      } else {
        setDataObject({})
      }
    } catch (error: any) {
      toast.error(error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <h2 className='text-xl text-center bolder-text pt-3 pb-4'>
        {t('chats.userData', { userId })}
      </h2>
      <div className='h-full overflow-hidden'>
        {loading ? (
          <p className='text-center py-10 flex-1'>{t('feedback.fetching')}</p>
        ) : (
          userId &&
          <ChatDataView dataObject={dataObject}/>
        )}
      </div>
    </Modal>
  )
}

export default ChatDataModal
