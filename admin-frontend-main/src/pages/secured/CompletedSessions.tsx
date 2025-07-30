import ChatConversationModal from '@/components/chat/ChatConversationModal'
import ChatDataModal from '@/components/chat/ChatDataModal'
import ChatDataTable from '@/components/chatData/ChatDataTable'
import Search from '@/components/elements/Search'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { chatDataSelector } from '@/redux/slices/analytics'
import { fetchCompletedSessionData, getChatDataDataRequest } from '@/redux/slices/analytics/request'
import { ChatDataTableBodyType, } from '@/types/dashboard'
import { ExportDateOptions, OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { handleExcelExport } from '@/utils/export'
import { ModalOpenType } from '@/types/completedSessions'
import { useSearchParams } from 'react-router-dom'
import ExportByOptions from '@/components/elements/ExportByOptions'
import { getStartEndDateRange } from '@/utils/dateHelper'
import DateSelectPane from '@/components/layout/DateSelectPane'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'


const Chats = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams();

  const conversationId = searchParams.get("conversationId");
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const { data, loading } = useAppSelector(chatDataSelector)
  const [openState, setOpenState] = useState<ModalOpenType>('none')
  const [userId, setUserId] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
  const launchModal = (chatId: string | null, userId: string | null, type: ModalOpenType) => {
    if (!chatId) return
    searchParams.set("conversationId", chatId)
    setSearchParams(searchParams);    
    setUserId(userId)
    setChatId(chatId)
    setOpenState(type)
  }

  const fetchTableData = (
    page: number, 
    itemsPerPage: number,
    order: OrderSortType,
    orderBy: TableHeaderKeyType ) => {
    try {
      searchParams.set("page", `${page + 1}`)
      setSearchParams(searchParams)
      dispatch(getChatDataDataRequest({ page: page + 1, itemsPerPage, order, orderBy, search: searchQuery ?? '', startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow }))
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorFetchWrong'))
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  useEffect(() => {
    if (data.length && conversationId) {
      launchModal(conversationId, '', 'conversation')
    }
  }, [data.length])

  const extractDataValues = (dataObject: ChatDataTableBodyType['dataObject']): (string | number)[] => {
    return Object.keys(dataObject).map(key => dataObject[key as keyof ChatDataTableBodyType['dataObject']]);
  };
  

  const exportToExcel = async (value: ExportDateOptions) => {
    try {
      const {startDate, endDate} = getStartEndDateRange(value)
      const response = await fetchCompletedSessionData(startDate, endDate);
      if(!Array.isArray(response) || response?.length === 0) {
        return toast.error(t('feedback.noData'))
      }
      const headers = ['User Id', 'Date', ...Object.keys(data[0]?.dataObject || []).map(key => key.replace(/_/g, ' '))];
      const exportData = response.map((detail) => {
        const dataObject = JSON.parse(detail?.dataObject ?? {})
        return [
          detail.userId,
          detail.createdAt,
          ...extractDataValues(dataObject || []),
        ]
      })

      const combinedData = [
        headers,
        ...exportData,
        [],
      ];

      handleExcelExport(combinedData, `CompletedSessions.xlsx`,  'Completed Sessions')
      toast.success(t('feedback.fileDownloadSuccess'));
    } catch (error) {
      toast.error(t('feedback.fileDownloadError'))
    }
  };

  const closeModal = () => {
    searchParams.delete('conversationId')
    setUserId(null)
    setChatId(null)
    setOpenState("none")
  }

  return (
    <section className='flex-1'>
      <DateSelectPane className='!me-0 !h-fit' />
      <div className='flex-1 pb-3 bg-white rounded-2xl flex flex-col max-h-[80vh] m-5 border'>
        <div className='flex justify-between py-4 px-5'>
          <div className="flex">
            {data.length > 0 && <ExportByOptions onExport={exportToExcel} topPadding={false} />}
          </div>
          <Search
            extraClass={'!py-0 w-full md:w-[350px] h-10'}
            imgWidth={16}
            placeholder={t('input.searchSessions')}
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
        <ChatDataTable
          data={data}
          loading={loading}
          viewData={launchModal}
          isChatScreen={false}
          fetchTableData={fetchTableData}
          searchQuery={searchQuery}
        />
        <ChatDataModal 
          userId={userId} 
          chatId={chatId} 
          toggle={closeModal} 
          isOpen={openState === 'data'} 
        />

        <ChatConversationModal 
          chatId={chatId} 
          toggle={closeModal} 
          isOpen={openState === 'conversation'} 
          tableData={data} 
        />
      </div>
    </section>
  )
}

export default Chats
