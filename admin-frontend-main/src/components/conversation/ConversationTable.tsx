import { CompletionTableBodyType } from '@/types/dashboard'
import { Fragment, useEffect, useRef, useState } from 'react'
import { AUTOMATIC_CHATS_REFRESH, DEFAULT_CHAT_COLUMNS, ITEMS_PER_PAGE, MISC, generateTableHeader, getTableHeaderKey, hasTableDataAccess } from '@/utils/data'
import ReactPaginate from 'react-paginate'
import { FaSortAlphaUp, FaSortAlphaDown } from 'react-icons/fa'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { useAppSelector } from '@/hook/useReduxHooks'
import { chatSelector } from '@/redux/slices/analytics'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useSearchParams } from 'react-router-dom'
import ChatTableLegend from '../chatData/ChatTableLegend'
import Loader from '../elements/Loader'
import { useTranslation } from 'react-i18next'
import ConversationTableCell from './ConversationTableCell'
import dayjs from 'dayjs'
import { ModalOpenType } from '@/types/completedSessions'

export type GridValidRowModel = {
  [key: string]: any
  [key: symbol]: any
}

interface ConversationTableType {
  data: Array<CompletionTableBodyType>
  loading: boolean
  chat: (id: string | null, userId: string | null,  type: ModalOpenType) => void
  isChatScreen?: boolean
  fetchTableData: (page: number, itemsPerPage: number, order: OrderSortType, orderBy: TableHeaderKeyType, searchRef: string) => void
  searchQuery?: string | null
  lastPage?: number
}

const ConversationTable = ({
  data,
  loading,
  chat,
  isChatScreen,
  fetchTableData,
  searchQuery,
  lastPage,
}: ConversationTableType) => {
  const { t } = useTranslation();
  const tableConfig = useSelector((state: RootState) => state.companyConfig.tables)
  const columns = tableConfig?.['chats']?.columns || DEFAULT_CHAT_COLUMNS
  const tableHeader = generateTableHeader(columns)
  const [searchParams] = useSearchParams();
  const initialPage = (Number(searchParams.get("page")) || lastPage || 1) - 1

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [tableData, setTableData] = useState<Array<CompletionTableBodyType>>([])
  const [order, setOrder] = useState<OrderSortType>('des')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('createdAt')
  const { totalRecords } = useAppSelector(chatSelector)

  const searchRef = useRef(searchQuery);
  const orderByRef = useRef(orderBy);
  const orderRef = useRef(order);
  const currentPageRef = useRef(currentPage);
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters)

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }

  const handleRequestSort = (field: TableHeaderKeyType) => {
    if (!field) return
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'des' : 'asc')
    setOrderBy(field)
    setCurrentPage(0);
  }

  useEffect(() => {
    setTableData(data)
  }, [data])

  useEffect(() => {
    if (dayjs(globalDate.endDate).toDate() < dayjs(globalDate.startDate).toDate()) return
    fetchTableData(currentPage, ITEMS_PER_PAGE, order, orderBy, searchQuery ?? '');
  }, [currentPage, order, orderBy, globalDate])

  useEffect(() => {
    if (searchQuery !== null) {
      if (currentPage === 0) {
        fetchTableData(currentPage, ITEMS_PER_PAGE, order, orderBy, searchQuery ?? '')
      } else {
        setCurrentPage(0)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(0)
  }, [globalDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getMinutes();
      const minuteRemainder = currentMinutes % AUTOMATIC_CHATS_REFRESH.FREQUENCY;
      if (minuteRemainder !== AUTOMATIC_CHATS_REFRESH.OFFSET_MINUTES_FROM_PREFECT_RUN_TIME) return;
      fetchTableData(currentPageRef.current, ITEMS_PER_PAGE, orderRef.current, orderByRef.current, searchRef.current as string);
    }, MISC.SECONDS_PER_MINUTE * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    searchRef.current = searchQuery;
    orderByRef.current = orderBy;
    orderRef.current = order;
    currentPageRef.current = currentPage;
  }, [searchQuery, orderBy, order, currentPage]);

  return (
    <>
      {loading? <Loader /> :
      <Fragment>
        <div className={`overflow-y-auto ${loading && data.length === 0 ? 'h-1/6' : isChatScreen ? 'flex-1' : 'h-5/6'} `}>
          <table className='table-auto w-full'>
            <thead className='primary-style sticky top-0 z-10'>
              <tr>
                {tableHeader.map(headingKey => {
                  const heading = t(headingKey)
                  const fieldKey = getTableHeaderKey(headingKey)
                  return (
                    <th
                      onClick={() =>
                        handleRequestSort && handleRequestSort(fieldKey)
                      }
                      key={heading}
                      className='text-md font-medium'
                    >
                      <span className='flex items-center gap-1 justify-center'>
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
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className='overflow-y-auto'>
                {tableData.map((detail, index) => (
                  <tr key={index}>
                    {tableHeader.map(headingKey => (
                    <ConversationTableCell key={headingKey} header={headingKey} detail={detail} chat={chat} />
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {loading && data.length === 0 ? <p className='text-center py-10 flex-1'>{t('feedback.loading')}</p> : <></>}
        {data.length === 0 && loading === false && (
          <p className='text-center py-10 flex-1'>{t('feedback.noData')}</p>
        )}
        {data.length > 0 && <div className='flex justify-between ps-4'>
          <ChatTableLegend showSuccessConvo={true} />
          <ReactPaginate
            previousLabel='&#x2C2;'
            previousLinkClassName='text-xl flex items-center justify-center border border-blue-400 px-2 rounded-lg app-text-blue w-full h-full'
            nextLabel='&#x2C3;'
            nextLinkClassName='text-xl flex items-center justify-center text-center text-white app-bg-blue px-3 rounded-lg w-full h-full'
            pageLinkClassName='px-3 py-1 border rounded-lg flex items-center justify-center w-full h-full'
            breakLinkClassName='page-link'
            pageCount={Math.ceil(totalRecords / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
            containerClassName='flex gap-3 justify-start md:justify-end md:mr-10 pt-5'
            activeClassName='text-white app-bg-blue rounded-lg'
            forcePage={currentPage}
          />
        </div>}
      </Fragment>}
    </>
  )
}

export default ConversationTable
