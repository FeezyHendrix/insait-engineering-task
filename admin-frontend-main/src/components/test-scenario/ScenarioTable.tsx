import {
  getTestScenarioTableHeaderKey,
  ITEMS_PER_PAGE,
  scenarioTableHeader,
} from '@/utils/data'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { CiCircleMore } from 'react-icons/ci'
import { FaSortAlphaUp, FaSortAlphaDown, FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import ReactPaginate from 'react-paginate'
import CustomTooltip from '../elements/CustomTooltip'
import Loader from '../elements/Loader'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { CiPlay1 } from 'react-icons/ci'
import { FormattedScenarioType, ScenarioMessage, ScenarioTableProp } from '@/types/scenario'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { runTestScenario } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import constants from "@/utils/constants";
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const ScenarioTable = ({
  data,
  handleOpenModal,
  loading,
  totalCount,
  fetchTableData,
}: ScenarioTableProp) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const initialPage = (Number(searchParams.get('page')) || 1) - 1
  const [order, setOrder] = useState<OrderSortType>('des')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('createdAt')
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [tableData, setTableData] = useState<Array<FormattedScenarioType>>([])
  const [idToRun, setIdToRun] = useState('')
  const dispatch = useAppDispatch()
  const language = useSelector((state: RootState) => state.companyConfig.language)
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

  const handleRun = async (id: string) => {
    setIdToRun(id)
    const companyName = constants.TENANT
    const testRunResponse = await dispatch(runTestScenario({testScenarioId: id, companyName, language}))
    if (testRunResponse.payload.success) {
      toast.success("Test run ran successfully")
    } else {
      toast.error("Test run failed")
    }
    setIdToRun('')
    fetchTableData(currentPage, order, orderBy, '')
  }

  const formatTestRunScore = (messages: ScenarioMessage[] | undefined) => {
    if (!messages) return '-';
    const backAndForths = messages.reduce(
      (acc: { user: string; assistant: string; correct?: boolean | null }[], message, index, array) => {
        if (message.role === 'user' && array[index + 1]?.role === 'assistant' && array[index + 1].correct !== null) {
          acc.push({
            user: message.content,
            assistant: array[index + 1].content,
            correct: array[index + 1].correct,
          });
        }
        return acc;
      },
      []
    );
    if (!backAndForths.length) return '-';
    const correctCount = backAndForths.filter((backAndForth) => backAndForth.correct).length;
    return `${correctCount} / ${backAndForths.length}`;
  };


  useEffect(() => {
    setTableData(data)
  }, [data])

  useEffect(() => {
    fetchTableData(currentPage, order, orderBy, '');
  }, [currentPage, order, orderBy])

  return (
    <>
      <div className='flex-1 overflow-y-auto'>
        <table className={`table-auto w-full rounded-corners`}>
          <thead className='primary-style sticky top-0 z-10'>
            <tr>
              {scenarioTableHeader.map(headingKey => {
                const heading = t(headingKey)
                const fieldKey = getTestScenarioTableHeaderKey(headingKey)
                return (
                  <th onClick={() => 
                    handleRequestSort && handleRequestSort(fieldKey)
                  } key={heading} className='bolder-text'>
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
            {tableData.map(detail => (
              <tr key={detail.testScenarioId} className='relative'>
                <td className='bold-text text-center'>{detail.testScenarioId}</td>
                <td className='bold-text text-center capitalize overflow-hidden whitespace-nowrap text-ellipsis max-w-[15vw]'>
                  {detail.name}
                </td>
                <td className='bold-text text-center capitalize whitespace-nowrap'>
                  {detail.type}
                </td>
                <td className='bold-text text-center whitespace-nowrap'>
                  {dayjs(detail.createdAt).format('DD-MM-YYYY')}
                </td>
                <td className='bold-text text-center whitespace-nowrap'>
                    {detail.testRuns[0]?.runDate ? dayjs(detail.testRuns[0].runDate).format('DD-MM-YYYY HH:mm') : '-'}
                </td>                
                <td className='bold-text text-center whitespace-nowrap'>
                    <span>{detail.questions.length}</span>
                </td>
                <td className='bold-text text-center whitespace-nowrap'>
                    {detail.testRuns.length}
                </td>  
                <td className='bold-text text-center whitespace-nowrap'>
                    {detail.type === 'QA' ? formatTestRunScore(detail.testRuns[0]?.Interaction?.messages) : '-'}
                </td>  
                <td>
                  <div className='flex gap-4'>
                    <span className='mx-auto cursor-pointer app-text-blue text-xl flex justify-center items-center'>
                      <CustomTooltip title={t('scenario.actions.run')}>
                        {idToRun === detail.testScenarioId ? (
                          <div className='inline-app-loader dark ' />
                        ) : (
                          <CiPlay1 onClick={() => handleRun(detail.testScenarioId)} />
                        )}
                      </CustomTooltip>
                    </span>
                    <span
                      onClick={() => handleOpenModal('view', detail)}
                      className={`mx-auto cursor-pointer text-xl flex justify-center items-center app-text-blue `}
                    >
                      <CustomTooltip title={t('scenario.actions.view')}>
                        <CiCircleMore />
                      </CustomTooltip>
                    </span>
                    <span
                      onClick={() => handleOpenModal('delete', detail)}
                      className='mx-auto cursor-pointer text-red-500 text-xl flex justify-center items-center'
                    >
                      <CustomTooltip
                        title={t('scenario.actions.delete')}
                        noWrap={false}
                      >
                        <MdDelete />
                      </CustomTooltip>
                    </span>
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

export default ScenarioTable
