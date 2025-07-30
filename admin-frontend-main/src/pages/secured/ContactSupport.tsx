import CreateContactSupport from '@/components/contact-support/CreateContactSupport'
import TicketCommentModal from '@/components/contact-support/TicketCommentModal'
import TicketDeleteModal from '@/components/contact-support/TicketDeleteModal'
import TicketDetailModal from '@/components/contact-support/TicketDetailsModal'
import TicketTable from '@/components/contact-support/TicketTable'
import Button from '@/components/elements/Button'
import { useAppDispatch } from '@/hook/useReduxHooks'
import {
  deleteSupportTicket,
  getSupportTickets,
} from '@/redux/slices/analytics/request'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import {
  SupportFetchTypes,
  SupportModalTypes,
  TicketDataType,
} from '@/types/support'
import { ITEMS_PER_PAGE, prioritySelectionOptions, supportExportHeader, supportTableHeader, ticketStatusSelectionOptions } from '@/utils/data'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import excelIcon from '@image/icons/excel.png'
import { handleExcelExport } from '@/utils/export'
import dayjs from 'dayjs'
import Search from '@/components/elements/Search'
import SelectInput from '@/components/elements/SelectInput'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage'

const ContactSupport = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [supportTicket, setSupportTicket] = useState<Array<TicketDataType>>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedTicket, setSelectedTicket] = useState<TicketDataType | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [modalOpened, setModalOpened] = useState<SupportModalTypes>('none')
  const [reloadTable, setReloadTable] = useState<SupportFetchTypes>('none')
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const isAdminOrInternalUser = useIsInternalOrAdminUser()

  const fetchSupportTickets = async (
    page: number,
    order: OrderSortType,
    orderBy: TableHeaderKeyType,
    search: string
  ) => {
    try {
      setReloadTable('none')
      searchParams.set('page', `${page + 1}`)
      searchParams.set('search', search)
      setSearchParams(searchParams)
      setLoading(true)
      const request = await dispatch(
        getSupportTickets({
          page: page + 1,
          itemsPerPage: ITEMS_PER_PAGE,
          orderBy,
          order,
          search,
          status,
          priority
        })
      )
      const response = request.payload
      if (response.data) {        
        setSupportTicket(response.data)
        setTotalCount(response.pagination.totalRecords)
        return
      }   
      toast.error(response?.message || t('feedback.errorWrong'))
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  }


  const createEditTicket = (ticket: TicketDataType | null) => {
    setSelectedTicket(ticket)
    setModalOpened('create')
  }

  const handleOpenModal = (
    type: SupportModalTypes,
    ticket: TicketDataType | null
  ) => {
    if (type === 'comment' || type === 'detail') {
      updateUrlForTicket(type, ticket?.id)
    }
    if(type === 'create' || type === 'delete') {
      setSelectedTicket(ticket)
      setModalOpened(type)
    } 
  }

  const handleCloseModal = () => {
    const currentPage = searchParams.get('page') || '1'
    navigate(`/support?page=${currentPage}`)
    setSelectedTicket(null)
    setModalOpened('none')
  }


  const fetchNewData = (type: SupportFetchTypes) => {
    setReloadTable(type)
  }

  const handleDelete = async (id: string) => {
    try {
      setReloadTable('none')
      setLoading(true)
      const request = await dispatch(deleteSupportTicket(id))
      const response = request.payload
      if (response?.status === true) {
        toast.success(response?.message)
        setReloadTable('refresh')
        return
      }
      toast.error(response?.message || t('feedback.errorWrong'))
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      setLoading(false)
      setModalOpened('none')
    }
  }

  const exportToExcel = () => {
    try {
      const headers = supportExportHeader.map(headingKey => t(headingKey))
      if (!isAdminOrInternalUser) {
        headers.filter((header: string) => header !== 'support.ticketURL')
      };
      const ticketData = supportTicket.map(detail => [
        detail.id,
        detail.subject,
        detail.sender,
        detail.companyName,
        detail.message,
        detail.priority,
        detail.status,
        detail.createdAt,
        detail.updatedAt,
        detail.notificationEmails,
        detail.commentCount,
        detail.requestType,
        isAdminOrInternalUser ? detail.ticketURL : ''
      ])
      const timestamp = dayjs().format('YYYYMMDD_HH_mm')
      const combinedData = [headers, ...ticketData, []]

      handleExcelExport(
        combinedData,
        `SupportTickets_${timestamp}.csv`,
        'Tickets',
        'csv'
      )
      toast.success(t('feedback.fileDownloadSuccess'))
    } catch (error) {
      toast.error(t('feedback.fileDownloadError'))
    }
  }

  const updateUrlForTicket = (
    type: SupportModalTypes,
    ticketId?: string | null
  ) => {
    const currentPage = searchParams.get('page') || '1'
    const baseUrl = type === 'comment' ? '/support/comments' : '/support/ticket'

    if (ticketId) {
      navigate(`${baseUrl}?page=${currentPage}&ticketId=${ticketId}`)
    } else {
      navigate(`/support?page=${currentPage}`)
    }
  }

  useEffect(() => {
    const ticketIdParam = searchParams.get('ticketId')

    if (ticketIdParam && supportTicket.length && !selectedTicket?.id) {
      const ticket = { id: ticketIdParam } as TicketDataType
      setSelectedTicket(ticket)
      setModalOpened('comment')
    }
  }, [location.search, supportTicket])

  useEffect(() => {
    const chatLink = location.state?.chatLink
    if (chatLink) {
      const subjectText = location.state?.subject ?? ""
      const messageText = location.state?.message ?? ""
      const ticket = { chatURL: chatLink, subject: subjectText, message: messageText } as TicketDataType
      createEditTicket(ticket)
    }
  }, [location.state])

  useEffect(() => {
    const ticketIdParam = searchParams.get('ticketId')
    const path = location.pathname

    if (ticketIdParam && supportTicket.length && !selectedTicket?.id) {
      const getExisting = supportTicket.filter(item => item.id == ticketIdParam)[0];
      const ticket = { ...getExisting, id: ticketIdParam }
      setSelectedTicket(ticket)

      if (path.includes('/comments')) {
        setModalOpened('comment')
      } else if (path.includes('/ticket')) {
        setModalOpened('detail')
      }
    }
  }, [location.search, location.pathname, supportTicket])


  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleFilterChange = (
    value: string,
    setter: (value: string) => void
  ) => {
    setReloadTable('refresh')
    setter(value)
  }


  return (
    <section className='chats-conversation-container flex-1 px-2 md:px-5 pt-4 pb-5 bg-white rounded-2xl flex flex-col max-h-page-scroll-150 border m-5'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
        <div className='flex items-center gap-4 flex-wrap md:flex-nowrap mb-4 md:mb-0 '>
          <h1 className='text-2xl bold-text'>{t('support.contact')}</h1>
          <SelectInput
            label={t('support.ticketPriority')}
            value={priority}
            extraClass={'w-[150px]'}
            containerClass={'z-20 !w-[150px]'}
            textClass={'text-sm'}
            data={prioritySelectionOptions}
            onValueChange={(value) => handleFilterChange(value, setPriority)}
            showAll={true}
            floatingLabel={true}
          />
          <SelectInput
            label={t('support.ticketStatus')}
            value={status}
            extraClass={'w-[150px]'}
            containerClass={'z-20 !w-[150px]'}
            textClass={'text-sm'}
            data={ticketStatusSelectionOptions}
            onValueChange={(value) => handleFilterChange(value, setStatus)}
            showAll={true}
            floatingLabel={true}
          />
        </div>
        <div className='flex gap-6 flex-wrap md:flex-nowrap'>
        <div className='flex justify-end'>
              <Search
                extraClass={'!py-2 w-full md:w-11/12'}
                imgWidth={20}
                placeholder={t('input.searchMessages')}
                onChange={handleSearchChange}
                value={searchQuery}
              />
            </div>
          {supportTicket.length > 0 && (
            <button onClick={exportToExcel}>
              <img src={excelIcon} width={23} />
            </button>
          )}
          <Button
            text={t('support.create')}
            onClick={() => createEditTicket(null)}
            className='px-4 !text-base'
          />
        </div>
      </div>

      <CreateContactSupport
        isOpen={modalOpened === 'create'}
        toggle={handleCloseModal}
        selectedTicket={selectedTicket}
        fetchNewData={fetchNewData}
      />

      <TicketTable
        data={supportTicket}
        totalCount={totalCount}
        loading={loading}
        fetchSupportTickets={fetchSupportTickets}
        handleOpenModal={handleOpenModal}
        reloadTable={reloadTable}
        searchQuery={searchQuery}
      />

      <TicketDetailModal
        isOpen={modalOpened === 'detail'}
        ticket={selectedTicket}
        closeModal={handleCloseModal}
      />

      <TicketCommentModal
        isOpen={modalOpened === 'comment'}
        ticketId={selectedTicket?.id}
        closeModal={handleCloseModal}
        fetchNewData={fetchNewData}
        tableData={supportTicket}
      />

      <TicketDeleteModal
        isOpen={modalOpened === 'delete'}
        loading={loading}
        ticket={selectedTicket}
        closeModal={handleCloseModal}
        handleDelete={handleDelete}
      />
    </section>
  )
}

export default ContactSupport
