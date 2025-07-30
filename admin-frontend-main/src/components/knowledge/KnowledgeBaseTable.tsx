import { useAppDispatch } from '@/hook/useReduxHooks'
import {
  deleteKnowledgeRequest,
  fetchKnowledgeRequest,
  toggleKnowledgeActivenessRequest,
} from '@/redux/slices/knowledgeHub/request'
import { KnowledgeBaseTableProps, KnowledgeType } from '@/types/knowledge'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import deactivate from '@image/icons/deactivate.svg'
import activate from '@image/icons/actvate.svg'
import trashImg from '@image/icons/trash.svg'
import { CiEdit } from 'react-icons/ci'
import useModal from '@/hook/useModal'
import { KnowledgeDeleteModal } from './KnowledgeDeleteModal'
import AddKnowledgeModal from './AddKnowledgeModal'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { ITEMS_PER_PAGE } from '@/utils/data'
import ReactPaginate from 'react-paginate'
import Search from '../elements/Search'

const KnowledgeBaseTable = ({
  openAddBtn,
  toggleAddBtn,
}: KnowledgeBaseTableProps) => {
  const { t } = useTranslation()
  const [data, setData] = useState<Array<KnowledgeType>>([])
  const [selectedKnowledge, setSelectedKnowledge] =
    useState<KnowledgeType | null>(null)
  const { toggle, isOpen } = useModal()
  const [addEditModal, setAddEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [totalCount, setTotalCount] = useState<number>(0)
  const initialPage = (Number(searchParams.get("page")) || 1) - 1
  const [order, setOrder] = useState<OrderSortType>('des')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('createdAt')
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  };

  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  };

  const dispatch = useAppDispatch()
  const fetchKnowledge = async ( 
      page: number,
      order: OrderSortType,
      orderBy: TableHeaderKeyType,
      search: string) => {
    try {
      setLoading(true)
      searchParams.set('page', `${page + 1}`)
      searchParams.set('search', search)
      setSearchParams(searchParams)
      setLoading(true)
      const request = await dispatch(fetchKnowledgeRequest({
        page: page + 1,
        itemsPerPage: ITEMS_PER_PAGE,
        orderBy,
        order,
        search,
      }))
      const response = request.payload
      if (!response.data) return;
      setData(response.data)
      setTotalCount(response.pagination.totalRecords)
      return
    } catch (error: any) {
      setLoading(false)
      toast.error(error?.message || t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  }

  const deleteKnowledge = async (data: KnowledgeType) => {
    const result = await dispatch(deleteKnowledgeRequest(data))
    if (result.payload.message) {
      toast.error(t('feedback.errorWrong'))
      return
    }
    toast.success(
      t('knowledge.itemRemoved', {
        question: data.question,
      })
    )
  }

  const onDeleteClick = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    knowledge: KnowledgeType
  ) => {
    setSelectedKnowledge(knowledge)
    toggle()
  }

  const onRemove = async () => {
    if (!selectedKnowledge) return
    setData(prevData =>
      prevData.filter(item => item.id !== selectedKnowledge.id)
    )
    deleteKnowledge(selectedKnowledge)
    toggle()
  }

  const toggleKnowledgeActiveness = async (data: KnowledgeType) => {
    const result = await dispatch(toggleKnowledgeActivenessRequest(data))
    if (result.payload.message) {
      toast.error(t('feedback.errorWrong'))
      return
    }
    toast.success(
      `"${data.question}" ${data.active ? t('knowledge.activated') : t('knowledge.deactivated')}`
    )
  }

  const onDeactivate = async (knowledge: KnowledgeType) => {
    const updatedKnowledge = { ...knowledge, active: false }
    const updatedData = data.map(item =>
      item.id === updatedKnowledge.id ? updatedKnowledge : item
    )
    setData(updatedData)
    toggleKnowledgeActiveness(updatedKnowledge)
  }

  const onActivate = async (knowledge: KnowledgeType) => {
    const updatedKnowledge = { ...knowledge, active: true }
    const updatedData = data.map(item =>
      item.id === updatedKnowledge.id ? updatedKnowledge : item
    )
    setData(updatedData)
    toggleKnowledgeActiveness(updatedKnowledge)
  }

  const handleEditKnowledge = (knowledge: KnowledgeType) => {
    setSelectedKnowledge(knowledge)
    setAddEditModal(true)
  }

  const handleCloseAddKnowledgeModal = () => {
    setAddEditModal(false)
  }

  const handleAddNewKnowledgeItem = (newData: KnowledgeType) => {
    setData(prev => {
      const index = prev.findIndex(item => item.id === newData.id)
      if (index !== -1) {
        const updatedData = [...prev]
        updatedData[index] = newData
        return updatedData
      } else {
        return [newData, ...prev]
      }
    })
  }

  useEffect(() => {
    if (openAddBtn === true) {
      setSelectedKnowledge(null)
      setAddEditModal(true)
      toggleAddBtn(false)
    }
  }, [openAddBtn])

  useEffect(() => {
    fetchKnowledge(currentPage, order, orderBy, searchQuery || "")
  }, [currentPage, order, orderBy]);

  useEffect(() => {
    fetchKnowledge(0, 'des', 'createdAt', searchQuery || '')
    setCurrentPage(0)
  }, [searchQuery]);

  return (
    <div className='bg-white rounded-2xl'>
      <div className='flex justify-between items-center py-4 px-4'>
        <h4>
          {t('knowledge.archivedInfo')}
        </h4>
        <button
          className='app-bg-blue text-white py-2 px-4 rounded-2xl'
          onClick={() => toggleAddBtn(true)}
        >
          {t('knowledge.add')}
        </button>
      </div>
            <Search
              extraClass={'!py-2 m-2 !w-1/2 md:w-11/12'}
              imgWidth={20}
              placeholder={"Search knowledge"}
              onChange={handleSearchChange}
              value={searchQuery}
            />
      <div className='pb-11 bg-white rounded-2xl mb-4 w-full'>
        <table className='w-full'>
          <thead className='primary-style sticky -top-6 z-10'>
            <tr>
              <th className='text-center'>{t('knowledge.question')}</th>
              <th className='text-center'>{t('knowledge.answer')}</th>
              <th className='text-center'>{t('knowledge.status')}</th>
              <th className='text-center'>{t('knowledge.date')}</th>
              <th className='text-center'>{t('knowledge.action')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(knowledge => (
              <tr key={knowledge.id} className=' border-b'>
                <td className='bold-text py-4 app-word-break'>{knowledge.question}</td>
                <td className='py-4 app-word-break'>{knowledge.answer}</td>
                <td className='py-4'>
                  {knowledge.active ? t('knowledge.active') : t('knowledge.deactivated')}
                </td>
                <td className='py-4 whitespace-nowrap'>
                  {dayjs(knowledge.createdAt).format('DD-MM-YYYY')}
                </td>
                <td>
                  <div className='flex gap-4 px-6 justify-center'>
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
                        onClick={() => onDeactivate(knowledge)}
                      />
                    ) : (
                      <img
                        className='cursor-pointer'
                        src={activate}
                        alt='trash'
                        title='Activate'
                        onClick={() => onActivate(knowledge)}
                      />
                    )}
                    <img
                      className='cursor-pointer'
                      src={trashImg}
                      alt='trash'
                      title='Delete'
                      onClick={e => onDeleteClick(e, knowledge)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length ? (
          <p className='text-center pt-8'>{loading ? t('feedback.loading') : t('feedback.noData')}</p>
        )
        :
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
        }

        <KnowledgeDeleteModal
          isOpen={isOpen}
          confirm={onRemove}
          toggle={toggle}
        />

        <AddKnowledgeModal
          isOpen={addEditModal}
          handleClose={handleCloseAddKnowledgeModal}
          handleAdd={handleAddNewKnowledgeItem}
          selectedKnowledge={selectedKnowledge}
        />
      </div>
    </div>
  )
}

export default KnowledgeBaseTable
