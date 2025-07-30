import React, { useRef, useEffect, useState, ChangeEvent } from 'react'
import { KnowledgeType, QAIntegrationProps } from '@/types/knowledge'
import { RiAddLargeFill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { toggleKnowledgeActivenessRequest, uploadMultipleKnowledgeRequest } from '@/redux/slices/knowledgeHub/request'
import deactivate from '@image/icons/deactivate.svg'
import activate from '@image/icons/actvate.svg'
import { CiEdit } from 'react-icons/ci'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import dayjs from 'dayjs'
import AddKnowledgeModal from '../AddKnowledgeModal'
import useModal from '@/hook/useModal'
import { useSearchParams } from 'react-router-dom'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import ReactPaginate from 'react-paginate'
import { ITEMS_PER_PAGE } from '@/utils/data'
import Search from '@/components/elements/Search'
import CustomTooltip from '@/components/elements/CustomTooltip'
import { BsFiletypeCsv } from 'react-icons/bs'
import Papa from 'papaparse'
import { CSVRow } from '@/types/scenario'
import { uuid } from '@/utils/clientDataHelper'
import excelIcon from '@image/icons/excel.png'
import { qaKnowledgeTableHeader } from '@/utils/data'
import { handleExcelExport } from '@/utils/export'

const QAIntegration: React.FC<QAIntegrationProps> = ({
  qaData,
  confirmDelete,
  setQaData,
  setLoading,
  loading,
  fetchQAKnowledgeData,
  searchQuery,
  setSearchQuery,
  totalCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const lastItemRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { toggle, isOpen } = useModal()
  const company = useAppSelector(state => state.companyConfig.company)
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeType | null>(null);
    const [searchParams] = useSearchParams();
  const initialPage = (Number(searchParams.get("page")) || 1) - 1
  const [order, setOrder] = useState<OrderSortType>('des')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('createdAt')
  const [currentPage, setCurrentPage] = useState(initialPage);
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }
  const toggleKnowledgeActiveness = async (data: KnowledgeType) => {
    const result = await dispatch(toggleKnowledgeActivenessRequest(data))
    if (result.payload.message) {
      toast.error(t('feedback.errorWrong'))
      return
    }
    toast.success(
      `"${data.question}" ${data.active ? 'activated' : 'deactivated'}`
    )
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }


  const handleActivation = async (value: string, id?: string) => {
    const itemToUpdate = qaData.find(item => item.id === id)
    if (itemToUpdate) {
      const updatedItem = {
        ...itemToUpdate,
        active: value === 'deactivate' ? false : true,
      }

      toggleKnowledgeActiveness(updatedItem)

      setQaData(prevData =>
        prevData.map(item => (item.id === id ? updatedItem : item))
      )
    }
  }

  const handleAddNewKnowledgeItem = () => {
    fetchQAKnowledgeData(currentPage, order, orderBy, searchQuery || '')
  }

  const handleEditKnowledge = (knowledge: KnowledgeType | null) => {
    setSelectedKnowledge(knowledge)
    toggle(true)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        if (!results?.data?.length) {
          toast.error(t('feedback.fileProcessingFailed'))
          return
        }
  
        const firstRow = results.data[0] as CSVRow
        const headers = Object.keys(firstRow)
        const requiredFields = ['question', 'answer']
  
        const missingFields = requiredFields.filter(
          field => !headers.includes(field)
        )
        if (missingFields.length > 0) {
          toast.error(
            t('feedback.fileInclude', { name: missingFields.join(', ') })
          )
          return
        }
  
        try {
          setLoading(true)
          const csvData = (results.data as CSVRow[])
            .filter(row => row?.question && row?.answer)
            .map(row => ({
              id: uuid(),
              question: row.question || '',
              answer: row.answer || '',
              createdAt: `${new Date().toISOString()}`,
              product: company,
              active: true,
            }))
  
          if (csvData.length === 0) {
            setLoading(false)
            toast.error(t('knowledge.noQAToUpload'))
            return
          }
  
          
          const actionResult = await dispatch(uploadMultipleKnowledgeRequest(csvData))
          if (uploadMultipleKnowledgeRequest.fulfilled.match(actionResult)) {
            const result = actionResult.payload as string[]
            toast.success( t('knowledge.multipleUploadSuccess', { count: result.length }))
            fetchQAKnowledgeData(currentPage, order, orderBy, searchQuery || "")
          } else {
            const error = actionResult.payload as { message: string, failures: string[] }
            toast.error(t('scenario.feedback.csvError'))
          }
          setLoading(false)
        } catch (error) {
          setLoading(false)
          toast.error(t('scenario.feedback.csvError'))
        }
      },
      error: function (error) {
        toast.error(t('scenario.feedback.csvError'))
      },
    })
  }

    const exportToExcel = () => {
      try {
        const headers = qaKnowledgeTableHeader.slice(0, 4).map(headingKey => t(headingKey))
        const ticketData = qaData.map(detail => [
          detail.question,
          detail.answer,
          detail.active,
          dayjs(detail.createdAt).format('DD-MM-YYYY'),
        ])
        const timestamp = dayjs().format('YYYYMMDD_HH_mm')
        const combinedData = [headers, ...ticketData, []]
  
        handleExcelExport(
          combinedData,
          `QA_Knowledge_${timestamp}.csv`,
          'Q&A',
          'csv'
        )
        toast.success(t('feedback.fileDownloadSuccess'))
      } catch (error) {
        toast.error(t('feedback.fileDownloadError'))
      }
    }
  
  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [qaData])

  useEffect(() => {
    fetchQAKnowledgeData(currentPage, order, orderBy, searchQuery || "")
  }, [currentPage, order, orderBy]);

  useEffect(() => {
    fetchQAKnowledgeData(0, 'des', 'createdAt', searchQuery || '')
    setCurrentPage(0)
  }, [searchQuery]);

  return (
    <>
    <div className='flex flex-col'>
      <div className='pb-2'>
        <h4 className='text-sm'>{t('knowledge.archivedInfo')}</h4>
        <div className='flex justify-between gap-6 pr-4 pt-3'>
          <div className='flex gap-3 items-center'>
            <CustomTooltip title={t('knowledge.addQA')}>
              <button
                className='bg-gray-100 border border-gray-300 px-2 py-1 rounded-md'
                onClick={() => handleEditKnowledge(null)}
              >
                <RiAddLargeFill />
              </button>
            </CustomTooltip>
            <CustomTooltip title={t('knowledge.csvFileUploadToolTip')}>
              <button
                className='bg-gray-100 border border-gray-300 px-2 py-1 rounded-md'>
                <label>
                <input
                  id='dropzone-file'
                  type='file'
                  accept='.csv'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <BsFiletypeCsv className='text-md cursor-pointer' />
                </label>
              </button>
            </CustomTooltip>
            <Search
              extraClass={'!py-2 !w-full md:w-11/12'}
              imgWidth={20}
              placeholder={"Search knowledge"}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          {qaData.length > 0 && (
            <div className='flex gap-3'>
              <button onClick={exportToExcel}>
                <img src={excelIcon} width={23} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='md:max-h-[50vh] overflow-auto'>
        <div className=''>
          <table className='w-full'>
            <thead className='primary-style sticky top-0 z-10'>
              <tr>
                {qaKnowledgeTableHeader.map(headingKey => (
                  <th key={headingKey} className='text-center'>{t(headingKey)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {qaData.map(knowledge => (
                <tr key={knowledge.id} className=' border-b'>
                  <td className='bold-text py-4 app-word-break text-center'>
                    {knowledge.question}
                  </td>
                  <td className='py-4 app-word-break text-center'>{knowledge.answer}</td>
                  <td className='py-4'>
                    {knowledge.active
                      ? t('knowledge.active')
                      : t('knowledge.deactivated')}
                  </td>
                  <td className='py-4 whitespace-nowrap text-center'>
                    {dayjs(knowledge.createdAt).format('DD-MM-YYYY')}
                  </td>
                  <td>
                    <div className='flex gap-4 px-6 items-center justify-center'>
                      <button
                        title='Edit'
                        onClick={() => handleEditKnowledge(knowledge)}
                      >
                        <CiEdit className='text-3xl text-gray-500' />
                      </button>
                      {knowledge.active ? (
                        <img
                          className='cursor-pointer'
                          src={deactivate}
                          alt='trash'
                          title='Deactivate'
                          onClick={() =>
                            handleActivation('deactivate', knowledge.id)
                          }
                        />
                      ) : (
                        <img
                          className='cursor-pointer'
                          src={activate}
                          alt='trash'
                          title='Activate'
                          onClick={() =>
                            handleActivation('activate', knowledge.id)
                          }
                        />
                      )}
                      <MdDelete
                        className='text-red-500 text-2xl cursor-pointer min-w-[20px]'
                        title='Delete'
                        onClick={() => confirmDelete(knowledge)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!qaData.length && (
          <p className='text-center pt-8'>
            {loading ? t('feedback.loading') : t('feedback.noQAFound')}
          </p>
        )}
      </div>
      <AddKnowledgeModal
        isOpen={isOpen}
        handleClose={toggle}
        handleAdd={handleAddNewKnowledgeItem}
        selectedKnowledge={selectedKnowledge}
      />
    </div>
    {qaData.length > 0 && (
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

export default QAIntegration
