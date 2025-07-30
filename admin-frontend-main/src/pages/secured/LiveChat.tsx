import Conversation from '@/components/live-chat/Conversation'
import Inbox from '@/components/live-chat/Inbox'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getInboxDataRequest } from '@/redux/slices/analytics/request'
import {
  GroupedLiveMessagesDataType,
  TransferredConversation,
} from '@/types/chat'
import { useEffect, useState } from 'react'
// import { toast } from 'react-toastify'
import { IEvent, useWebSocketEvents } from '@/hook/useWebSocketEvents'
import {
  updateInboxItem,
  updateLiveChatReadyState,
  addNewConversation
} from '@/redux/slices/analytics'
import { toast } from 'react-toastify'
import { groupMessagesByDate } from '@/utils/dateHelper'

const LiveChat = () => {
  const dispatch = useAppDispatch()
  const [selectedInbox, setSelectedInbox] =
    useState<TransferredConversation | null>(null)

  const [messageList, setMessageList] = useState<
    Array<GroupedLiveMessagesDataType>
  >([])

  const events: IEvent[] = [
    {
      name: 'connect',
      handler: () => {
        dispatch(updateLiveChatReadyState(true))
      },
    },
    {
      name: 'transfer_conversation_to_customer_service',
      handler: (data: any) => {
        dispatch(addNewConversation(data))
      },
    },
    {
      name: 'send_live_message',
      handler: (data: any) => {
        const showNotification = data.conversation_id !== selectedInbox?.conversation_id
        const messageData = {
          ...data,
          showNotification
        }
        dispatch(updateInboxItem(messageData))
        if (data.conversation_id === selectedInbox?.conversation_id) {
          const formattedData = groupMessagesByDate(data.messages)
          setMessageList(formattedData)
        }
      },
    },
  ]
  const fetchTransferredConversations = () => {
    try {
      dispatch(getInboxDataRequest())
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong')

    }
  }

  useEffect(() => {
    fetchTransferredConversations()
  }, [])

  useWebSocketEvents(events, selectedInbox)
  return (
    <section className='flex-1 py-5 bg-white rounded-2xl flex flex-row mb-4 w-full md:h-[82vh]'>
      <Inbox
        selectedId={selectedInbox?.conversation_id}
        setSelectedInbox={setSelectedInbox}
      />
      <Conversation
        selectedInbox={selectedInbox}
        messageList={messageList}
        setMessageList={setMessageList}
      />
    </section>
  )
}

export default LiveChat
