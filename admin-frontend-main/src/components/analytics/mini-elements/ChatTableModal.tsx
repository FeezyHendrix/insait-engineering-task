import Modal from '@/components/elements/Modal'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { MessagesType } from '@/types/dashboard'
import { Fragment, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { getChatDataRequest } from '@/redux/slices/analytics/request'
import ConversationalChat from '@/components/conversation/ConversationChat'
import ConversationTable from '@/components/conversation/ConversationTable'
import { chatSelector } from '@/redux/slices/analytics'
import {
  ChatTableModalType,
  OrderSortType,
  TableHeaderKeyType,
} from '@/types/chat'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import ChatInput from '@/components/elements/ChatInput'

const defaultMessages = {
  id: '',
  data: [],
  createdAt: '',
}

const ChatTableModal = ({
  value,
  type,
  isOpen,
  toggle,
}: ChatTableModalType) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { data, loading } = useAppSelector(chatSelector)
  const globalDate = useAppSelector(state => state.analytics.globalFilters)

  const [isMessageDisplay, setIsMessageDisplay] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [messages, setMessages] = useState<MessagesType>(defaultMessages)

  const fetchTableData = useCallback(
    (
      page: number = 0,
      itemsPerPage: number,
      order: OrderSortType,
      orderBy: TableHeaderKeyType,
      search: string = ''
    ) => {
      try {
        if (loading) return
        setCurrentPage(page)
        dispatch(
          getChatDataRequest({
            page: page + 1,
            itemsPerPage,
            order,
            orderBy,
            startDate: globalDate.startDate, 
            endDate: globalDate.endDate,
            [type]: value,
            search,
          })
        )
      } catch (error: any) {
        toast.error(error?.message || t('feedback.errorWrong'))
      }
    },
    [dispatch, value]
  )

  const getExistingMessage = (chatId: string | null): MessagesType | null => {
    if (!data) return null

    const selectedItem = data.filter(item => item.chatId === chatId)[0]

    if (!selectedItem?.chatId || !selectedItem.messages?.length) return null

    return {
      id: selectedItem.chatId,
      createdAt: selectedItem?.createdAt,
      data: selectedItem.messages,
      comment: selectedItem.comment,
    }
  }

  const showChat = (id: string | null) => {
    setIsMessageDisplay(true)
    const existingMessage = getExistingMessage(id)
    if (!existingMessage) {
      toast.error(t('feedback.errorWrong'))
      return
    }
    setMessages(existingMessage)
  }

  const handleClose = () => {
    if (isMessageDisplay) {
      setMessages(defaultMessages)
      setIsMessageDisplay(false)
      return
    }
    toggle()
  }

  return (
    <Modal isOpen={isOpen} toggle={handleClose}>
      <h2 className='text-xl text-center bolder-text pb-5 pt-3 capitalize'>
        {isMessageDisplay ? t('chats.conversation') : `${value} ${type}`}
      </h2>
      <div className='h-full overflow-hidden flex flex-col'>
        <Fragment>
          {isMessageDisplay ? (
            <ConversationalChat
              id={messages.id}
              showReportButton={true}
              data={messages.data}
              date={dayjs(messages.createdAt).format('DD-MM-YYYY')}
              loading={loading}
            >
              <ChatInput
                defaultValue={messages?.comment}
                chatId={messages.id}
              />
            </ConversationalChat>
          ) : (
            <ConversationTable
              data={data}
              loading={loading}
              chat={showChat}
              isChatScreen={true}
              fetchTableData={fetchTableData}
              lastPage={currentPage + 1}
              searchQuery={null}
            />
          )}
        </Fragment>
      </div>
    </Modal>
  )
}

export default ChatTableModal
