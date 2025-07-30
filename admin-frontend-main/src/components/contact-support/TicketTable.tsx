import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { SupportFetchTypes, SupportModalTypes, TicketDataType } from '@/types/support'
import {
  camelToSentenceCase,
  getSupportTicketTableHeaderKey,
  ITEMS_PER_PAGE,
  supportTableHeader,
} from '@/utils/data'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { FaSortAlphaUp, FaSortAlphaDown, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import conversationImg from '@image/icons/conversation.svg'
import { CiCircleMore } from 'react-icons/ci'

import Loader from '../elements/Loader'
import ReactPaginate from 'react-paginate'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage'
import CustomTooltip from '../elements/CustomTooltip'
import { getChatDataDataRequest } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'

interface TicketTableProp {
  data: Array<TicketDataType>
  handleOpenModal: (type: SupportModalTypes, ticket: TicketDataType | null) => void
  loading: boolean
  reloadTable: SupportFetchTypes
  totalCount: number
  searchQuery: string | null
  fetchSupportTickets: (
    page: number,
    order: OrderSortType,
    orderBy: TableHeaderKeyType,
    search: string,
  ) => Promise<void>
}

const TicketTable = ({
  data,
  handleOpenModal,
  loading,
  reloadTable,
  totalCount,
  fetchSupportTickets,
  searchQuery
}: TicketTableProp) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams();
  const initialPage = (Number(searchParams.get("page")) || 1) - 1
  const [order, setOrder] = useState<OrderSortType>('des')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('updatedAt')
  const [currentPage, setCurrentPage] = useState(initialPage);
  const isAdminOrInternalUser = useIsInternalOrAdminUser()

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

  const handleRequestSort = (field: TableHeaderKeyType) => {
    if (!field) return
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'des' : 'asc')
    setOrderBy(field)
    setCurrentPage(0)
  }

  const getPriorityClassName = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600 text-white'
      case 'high':
        return 'bg-yellow-500 text-white'
      case 'normal':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-slate-400 text-white'
    }
  }

  useEffect(() => {
    fetchSupportTickets(currentPage, order, orderBy, searchQuery || "")
  }, [currentPage, order, orderBy])


  useEffect(() => {
    fetchSupportTickets(0, 'des', 'updatedAt', searchQuery || '')
    setCurrentPage(0)
  }, [searchQuery]);
  
  useEffect(() => {
    if (reloadTable !== 'none') {
      if (reloadTable === 'refresh') {
        fetchSupportTickets(currentPage, order, orderBy, searchQuery || "")
        return
      }
      setOrder('des')
      setOrderBy('updatedAt')
      if (currentPage === 0) {
        fetchSupportTickets(currentPage, order, orderBy, searchQuery || "")
      } else {
        setCurrentPage(0)
      }
    }
  }, [reloadTable])

  return (
    <>
      <div className='flex-1 overflow-y-auto'>
        <table className={`table-auto w-full rounded-corners`}>
          <thead className='primary-style sticky top-0 z-10'>
            <tr>
              {supportTableHeader.map(headingKey => {
                const heading = t(headingKey)
                const fieldKey = getSupportTicketTableHeaderKey(headingKey)
                return (
                  <th
                    onClick={() =>
                      handleRequestSort && handleRequestSort(fieldKey)
                    }
                    key={heading}
                    className='bolder-text'
                  >
                    <div className='flex justify-center items-center'>
                      <span className='flex items-center gap-1 capitalize whitespace-nowrap'>
                        {heading}
                        {orderBy === fieldKey && (
                          <span className='text-xl'>
                            {order === 'asc' ? (
                              <FaSortAlphaUp />
                            ) : (
                              <FaSortAlphaDown />
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className='overflow-y-auto'>
            {data.map(detail => (
              <tr key={detail.id}>
                <td className='bold-text text-center'>{detail.id}</td>
                <td className='bold-text text-center overflow-hidden whitespace-nowrap text-ellipsis max-w-[15vw]'>
                  {detail.subject}
                </td>
                <td className='bold-text text-center'>{detail.requestType.charAt(0).toUpperCase() + detail.requestType.slice(1)}</td>
                <td className={'bold-text text-center '}>
                  <span
                    className={`capitalize whitespace-nowrap px-5 py-1.5 rounded-md ${getPriorityClassName(
                      detail.priority
                    )}`}
                  >
                    {detail.priority}
                  </span>
                </td>
                <td className='bold-text text-center capitalize whitespace-nowrap'>
                  {camelToSentenceCase(detail.status)}
                </td>
                <td className='bold-text text-center capitalize whitespace-nowrap'>
                  {detail.commentCount}
                </td>
                <td className='bold-text text-center whitespace-nowrap'>
                  {dayjs(detail.createdAt).format('DD-MM-YYYY')}
                </td>
                <td className='bold-text text-center whitespace-nowrap'>
                  {dayjs(detail.updatedAt).format('DD-MM-YYYY')}
                </td>
                <td>
                  <div className='flex gap-4'>
                    <span
                      onClick={() => handleOpenModal('create', detail)}
                      className='mx-auto cursor-pointer app-text-blue text-xl flex justify-center items-center'
                    >
                      <CustomTooltip title={t('support.actions.edit')}>
                        <FaEdit />
                      </CustomTooltip>
                    </span>
                    <span
                      onClick={() => handleOpenModal('detail',detail)}
                      className='mx-auto cursor-pointer app-text-blue text-xl flex justify-center items-center'
                    >
                      <CustomTooltip title={t('support.ticketInformation')}>
                        <CiCircleMore />
                      </CustomTooltip>
                    </span>
                    <span
                      onClick={() => handleOpenModal('comment', detail)}
                      className='mx-auto cursor-pointer app-text-blue text-xl flex justify-center items-center'
                    >
                      <CustomTooltip title={t('support.ticketConversation')} noWrap={false}>
                        <img
                          src={conversationImg}
                          alt='conversation'
                          width={32}
                          height={32}
                          className='cursor-pointer min-w-[32px]'
                        />
                      </CustomTooltip>
                    </span>
                    {isAdminOrInternalUser && (
                      <span
                        onClick={() => handleOpenModal('delete', detail)}
                        className='mx-auto cursor-pointer text-red-500 text-xl flex justify-center items-center'
                      >
                        <CustomTooltip title={t('support.deleteTicket')} noWrap={false}>
                          <MdDelete />
                        </CustomTooltip>
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <Loader
            hasNoData={data.length === 0}
            loading={loading}
            title={t('feedback.fetching')}
          />
        )}
      </div>
      {data.length > 0 && (
        <div className='flex md:justify-end'>
          <ReactPaginate
            previousLabel='&#x2C2;'
            previousLinkClassName='text-xl flex items-center justify-center border border-blue-400 px-2 rounded-lg app-text-blue w-full h-full'
            nextLabel='&#x2C3;'
            nextLinkClassName='text-xl flex items-center justify-center text-center text-white app-bg-blue px-3 rounded-lg w-full h-full'
            pageLinkClassName='px-3 py-1 border rounded-lg flex items-center justify-center w-full h-full'
            breakLinkClassName='page-link'
            pageCount={Math.ceil(totalCount / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName='flex gap-3 justify-start md:justify-end md:mr-10 pt-5'
            activeClassName='text-white app-bg-blue rounded-lg'
            forcePage={currentPage}
          />
        </div>
      )}
    </>
  )
}

export default TicketTable
