import Modal from '@/components/elements/Modal'
import { useAppDispatch } from '@/hook/useReduxHooks'
import {
  CompletionDisplayType,
  CompletionTableBodyType,
  MessagesType,
} from '@/types/dashboard'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import ChatInput from '@/components/elements/ChatInput'
import { unwrapResult } from '@reduxjs/toolkit'
import { getStatUpdatedDataRequest } from '@/redux/slices/analytics/request'
import ConversationalChat from '@/components/conversation/ConversationChat'
import ConversationTable from '@/components/conversation/ConversationTable'
import { getChatStatus } from '@/utils'

interface CompletionRateModalType {
  selected: string
  isOpen: boolean
  toggle: (value?: boolean) => void
  display: CompletionDisplayType
  setDisplay: React.Dispatch<React.SetStateAction<CompletionDisplayType>>
}

const CompletionRateModal = ({
  selected,
  isOpen,
  toggle,
  display,
  setDisplay,
}: CompletionRateModalType) => {
  const dispatch = useAppDispatch()

  const [data, setData] = useState<Array<CompletionTableBodyType>>([])
  const [messages, setMessages] = useState<MessagesType>({
    id: '',
    data: [],
    createdAt: '',
  })
  const [loading, setLoading] = useState(false)
  const [enableGoBack, setEnableGoBack] = useState(false)

  useEffect(() => {
    if (display.value === 'table') {
      fetchTableData()
    } else if (display.value === 'message' && display.id) {
      fetchMessages(display.id)
    }
  }, [display.id, isOpen])


  const fetchTableData = useCallback(async () => {
    try {
      const completionType = getChatStatus(selected)
      if (!completionType) return
      setData([])
      setLoading(true)
      const payload = {
        url: `analytics/dashboard?completionType=${completionType}`,
        type: `completionRateTableBody`,
      }
      const response = unwrapResult(
        await dispatch(getStatUpdatedDataRequest(payload))
      )

      if (response?.length > 0) {
        setData(response)
      }
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      toast.error(error?.message || 'Something went wrong')
    }
  }, [selected])

  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true)
      const payload = {
        url: `analytics/dashboard?interactionMessageId=${chatId}`,
        type: `interactionMessages`,
      }
      const response = unwrapResult(
        await dispatch(getStatUpdatedDataRequest(payload))
      )
      const { data, createdAt, id, comment } = response
      if (data && data?.length) {
        setMessages({
          id,
          data: response.data,
          createdAt: createdAt,
          comment,
        })
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [])

  const showChat = (id: string | null) => {
    setEnableGoBack(true)
    setDisplay({ value: 'message', id })
  }

  const handleClose = () => {
    if (enableGoBack && display.value === 'message') {
      return setDisplay({ value: 'table', id: null })
    }
    toggle()
  }

  return (
    <Modal isOpen={isOpen} toggle={handleClose}>
      <h2 className='text-xl text-center bolder-text pb-5 pt-3'>
        {display.value === 'message' ? 'Conversation' : selected}
      </h2>
      <div className='h-full overflow-hidden'>
        {loading === true ? (
          <p className='text-center py-10 flex-1'>Fetching Data</p>
        ) : (
          <Fragment>
            {display.value === 'table' && (
              <ConversationTable
                data={data}
                loading={loading}
                chat={showChat}
                fetchTableData={fetchTableData}
              />
            )}
            {display.value === 'message' && (
              <ConversationalChat
                id={messages.id}
                data={messages.data}
                date={dayjs(messages.createdAt).format('DD-MM-YYYY')}
                loading={loading}
              >
                <ChatInput
                  chatId={messages.id}
                  defaultValue={messages?.comment}
                />
              </ConversationalChat>
            )}
          </Fragment>
        )}
      </div>
    </Modal>
  )
}

export default CompletionRateModal
