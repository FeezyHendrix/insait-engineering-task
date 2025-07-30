import ChatConversationModal from '@/components/chat/ChatConversationModal'
import ChatDataModal from '@/components/chat/ChatDataModal'
import ConversationTable from '@/components/conversation/ConversationTable'
import Search from '@/components/elements/Search'
import DateSelectPane from '@/components/layout/DateSelectPane'
import { ModalOpenType } from '@/types/completedSessions'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { chatSelector } from '@/redux/slices/analytics'
import { getChatDataRequest } from '@/redux/slices/analytics/request'
import { RootState } from '@/redux/store'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Chats = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch()
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);

  const conversationId = searchParams.get("conversationId");
  const { data, loading } = useAppSelector(chatSelector)
  const [userId, setUserId] = useState<string | null>(null)
  const [openState, setOpenState] = useState<ModalOpenType>('none')
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  

  const launchModal = (id: string | null, userId: string | null,  type: ModalOpenType) => {
    if (!id) return
    searchParams.set("conversationId", id)
    setSearchParams(searchParams);
    setUserId(userId)
    setChatId(id)
    setOpenState(type)
  }

  const closeModal = () => {
    searchParams.delete("conversationId")
    setUserId(null)
    setSearchParams(searchParams)
    setOpenState('none')
  }

  const fetchTableData = (
    page: number, 
    itemsPerPage: number, 
    order: OrderSortType, 
    orderBy: TableHeaderKeyType,
    searchRef: string | null | undefined ) => {
    try {
      searchParams.set("page", `${page + 1}`)
      setSearchParams(searchParams)
      dispatch(getChatDataRequest({ page: page + 1, itemsPerPage, order, orderBy, search: searchRef ?? '', startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow }))
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorFetchWrong'))
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  useEffect(() => {
    if (data.length && conversationId) {
      launchModal(conversationId, null, 'conversation')
    }
  }, [data.length])

  useEffect(() => {
    const chatIdParam = searchParams.get('chatId')

    if (chatIdParam) {
      searchParams.delete('chatId');
      launchModal(chatIdParam, null, 'conversation')
    }
  }, [location.search])


  return (
    <section className='flex-1'>
      <DateSelectPane className='!me-0 !h-fit' />
      <div className='flex-1 m-5 pt-4 pb-5 bg-white rounded-2xl flex flex-col max-h-[80vh] border'>
        <div className='flex justify-end pb-5 px-4'>
          <Search
            extraClass={'!py-0 w-full md:w-[350px] h-10'}
            imgWidth={15}
            placeholder={t('input.searchMessages')}
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
        <ConversationTable
          data={data}
          loading={loading}
          chat={launchModal}
          isChatScreen={true}
          fetchTableData={fetchTableData}
          searchQuery={searchQuery}
        />
        <ChatConversationModal 
          chatId={chatId} 
          toggle={closeModal} 
          isOpen={openState === 'conversation'} 
          tableData={data} 
        />
        <ChatDataModal 
          userId={userId} 
          chatId={chatId} 
          toggle={closeModal} 
          isOpen={openState === 'data'}
          source='chat'
        />
        
      </div>
    </section>
  )
}

export default Chats
