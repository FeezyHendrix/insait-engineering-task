import { ChatDataTableBodyType } from '@/types/dashboard'
import conversationImg from '@image/icons/conversation.svg'
import { Fragment, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { ITEMS_PER_PAGE, generateTableHeader, getChatDataTableHeaderKey, hasTableDataAccess } from '@/utils/data'
import ReactPaginate from 'react-paginate'
import { FaSortAlphaUp, FaSortAlphaDown } from 'react-icons/fa'
import { ChatDataTableType } from '@/types/completedSessions'
import { useAppSelector } from '@/hook/useReduxHooks'
import { chatDataSelector } from '@/redux/slices/analytics'
import { FaDatabase } from "react-icons/fa";
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import ChatTableLegend from './ChatTableLegend'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import Loader from '../elements/Loader'
import { useTranslation } from 'react-i18next'
import ConversationTableCell from '../conversation/ConversationTableCell'

const ChatDataTable = ({
  data,
  loading,
  viewData,
  isChatScreen,
  fetchTableData,
  searchQuery
}: ChatDataTableType) => {
  const { t } = useTranslation()
  const tableConfig = useSelector((state: RootState) => state.companyConfig.tables)
  const columns = tableConfig?.['completedSessions']?.columns || []
  const tableHeader = generateTableHeader(columns)  
  const [searchParams] = useSearchParams();
  const initialPage = (Number(searchParams.get("page")) || 1) - 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [tableData, setTableData] = useState<Array<ChatDataTableBodyType>>([])
  const [order, setOrder] = useState<OrderSortType>('des')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('createdAt')
  const { totalRecords } = useAppSelector(chatDataSelector);
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);

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
    fetchTableData(currentPage, ITEMS_PER_PAGE, order, orderBy);
  }, [currentPage, order, orderBy, globalDate])

  useEffect(() => {
    if (searchQuery !== null) {
      if (currentPage === 0) {
        fetchTableData(currentPage, ITEMS_PER_PAGE, order, orderBy)
      } else {
        setCurrentPage(0)
      }
    }
  }, [searchQuery])

  return (
    <Fragment>
      <div className={`overflow-y-auto ${((loading && data.length === 0 ) || data.length === 0) ? 'h-1/6' : isChatScreen ? 'flex-1' : 'h-5/6'} `}>
        <table className={`table-auto w-full`}>
          <thead className='primary-style sticky top-0 z-10'>
            <tr>
              {tableHeader.map(headingKey => {
                const heading = t(headingKey)
                const fieldKey = getChatDataTableHeaderKey(headingKey)
                return (
                  <th
                    onClick={() => handleRequestSort && handleRequestSort(fieldKey)}
                    key={heading}
                    className="bolder-text"
                  >
                    <div className="flex justify-center items-center">
                      <span className="flex items-center gap-1 capitalize">
                        {heading}
                        {orderBy === fieldKey && (
                          <span className="text-xl">
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
            {tableData.map((detail, index) => (
              detail.dataObject &&
              <tr key={index}>
              {tableHeader.map(headingKey => (
                <ConversationTableCell key={headingKey} header={headingKey} detail={detail} chat={viewData}/>
              ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && data.length === 0 ? <Loader /> : <>
      {data.length === 0 && loading === false && (
        <p className='text-center py-10 flex-1'>{t('feedback.noData')}</p>
      )}
      {data.length > 0 && <div className='flex justify-between ps-4'>
        <ChatTableLegend />
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
      </>}
    </Fragment>
  )
}

export default ChatDataTable
