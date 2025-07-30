import { useEffect, useState } from 'react'
import URLCrawling from './sources/URLCrawling'
import FileUpload from './sources/FileUpload'
import TextUpload from './sources/TextUpload'
import QAIntegration from './sources/QAIntegreation'
import SourceList from './sources/SourceList'
import SourceInfo from './sources/SourceInfo'
import KnowledgeConfirmModal from './KnowledgeConfirmModal'
import {
  CrawledURLType,
  FileDataProp,
  KnowledgeConfirmProp,
  KnowledgeFileItemType,
  KnowledgeType,
} from '@/types/knowledge'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import {
  deleteKnowledgeRequest,
  fetchFileKnowledgeRequest,
  fetchKnowledgeRequest,
} from '@/redux/slices/knowledgeHub/request'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { generateSourceOptions, ITEMS_PER_PAGE } from '@/utils/data'
import {
  getKnowledgeValueBasedOnType,
  getSourceTypeValue,
} from '@/utils'
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { useSearchParams } from 'react-router-dom'


const AddKnowledgeHub = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const knowledgeSource = useAppSelector(
    state => state.companyConfig.knowledgeSource
  )
  const sourceOptions = generateSourceOptions(knowledgeSource)

  const [selectedSource, setSelectedSource] = useState(sourceOptions[0])
  const [confirmModal, setConfirmModal] = useState<KnowledgeConfirmProp>({
    id: '',
    title: '',
    status: 'none',
  })
  const [loading, setLoading] = useState(false)
  const [uploadBoxVisible, setUploadBoxVisible] = useState<boolean>(false)
  const [urlData, setUrlData] = useState<Array<CrawledURLType>>([])
  const [fileData, setFileData] = useState<FileDataProp>({data: []});
  const [fileCount, setFileCount] = useState<number>(0);
  const [textData, setTextData] = useState('')
  const [qaData, setQaData] = useState<Array<KnowledgeType>>([])
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchQAKnowledgeData = async (
    page: number,
    order: OrderSortType,
    orderBy: TableHeaderKeyType,
    search: string
  ) => {
    try {
      if (!knowledgeSource.includes('qa')) return
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
      setQaData(response.data)
      setTotalCount(response.pagination.totalRecords)
      return
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  }

  const fetchFileKnowledgeData = async (
    page: number, 
    order: OrderSortType, 
    orderBy: TableHeaderKeyType) => {
    try {
      if (!knowledgeSource.includes('file')) return
      const response = await dispatch(fetchFileKnowledgeRequest({ page: page + 1, limit: ITEMS_PER_PAGE, order, orderBy }))
      const data = await response.payload?.data
      if (Array.isArray(data)) {
        setFileData(response.payload)
        setFileCount(response.payload.pagination.totalDocuments)
      }
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
    }
  }
  const refetchItems = async () => {
    console.log('refetchItems')
  }

  
  const handleProcessDeletion = (id: string) => {
    switch (selectedSource.value) {
      case 'crawling':
        handleDeleteCrawlingUrl(id);
        break;
      
      case 'text':
        handleClearText();
        break;
      
      case 'qa':
        handleDeleteQA(id);
        break;
        
      default:
        handleCloseModal()
        break;
    }
  }

  const handleClearText = () => {
    setTextData('')
    handleCloseModal()
  }

  const handleDeleteCrawlingUrl = (id: string) => {
    setUrlData(prev =>
      id === 'all' ? [] : prev.filter(item => item.id !== id)
    )
    handleCloseModal()
  }

  const handleDeleteQA = async (id: string) => {
    try {
      setLoading(true)
      const data: any = { id }
      const result = await dispatch(deleteKnowledgeRequest(data))
      if (result?.payload?.message || result?.payload?.code) {
        toast.error(t('feedback.errorWrong'))
        return
      }
      await fetchQAKnowledgeData(0, 'des', 'createdAt', searchQuery || '')
      handleCloseModal()
      toast.success(t('knowledge.itemRemoved'));
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  }

  const handleProcessUpdateKnowledgebase = () => {
    if (selectedSource.value === 'crawling') {
      setUrlData(prev =>
        prev.map(item => ({
          ...item,
          trained: true,
        }))
      )
    }
    handleCloseModal()
  }

  const handleModalConfirm = (id: string) => {
    setLoading(true)
    if (confirmModal.status === 'delete') {
      handleProcessDeletion(id)
      return
    }
    handleProcessUpdateKnowledgebase()
  }

  const handleCloseModal = () => {
    setConfirmModal({ id: '', title: '', status: 'none' })
    setLoading(false)
  }

  const isKnowledgeItem = (
    item: any
  ): item is KnowledgeFileItemType | KnowledgeType => {
    return typeof item === 'object' && 'id' in item && 'type' in item;
  };
  
  const confirmDelete = (
    item:
      | CrawledURLType
      | KnowledgeFileItemType
      | KnowledgeType
      | 'all'
      | 'text'
  ) => {
    if (loading) return;
  
    if (item === 'all') {
      setConfirmModal({
        id: 'all',
        title: t('knowledge.deleteAllSource', {
          type: getKnowledgeValueBasedOnType(selectedSource.value),
        }),
        status: 'delete',
      });
    } else if (item === 'text') {
      setConfirmModal({
        id: 'text',
        title: t('knowledge.deleteSource', { type: 'the entered text' }),
        status: 'delete',
      });
    } else if (isKnowledgeItem(item)) {
      setConfirmModal({
        id: item.id,
        title: t('knowledge.deleteSource', {
          type: item,
        }),
        status: 'delete',
      });
    } else {
      console.warn('Unknown item type passed to confirmDelete:', item);
    }
  };
  

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchFileKnowledgeData(0, 'desc', 'createdAt'), 
          fetchQAKnowledgeData(0, 'des', 'createdAt', searchQuery || '')
        ])
      } finally {
        setLoading(false)
      }
    }
  
    fetchAllData()
  }, [])

  if (sourceOptions.length === 0)
    return (
      <div className='h-full'>
        <p className='text-center py-20'>{t('knowledge.noSourceSpecified')}</p>
      </div>
    )
  return (
    <div className='mt-2 mb-5 flex flex-col md:flex-row gap-2 h-full'> 
      <div className='md:border-e min-w-[180px]'> {/*side bar START*/}
        <SourceList
          data={sourceOptions}
          handleSelectSource={value => setSelectedSource(value)}
          selectedSource={selectedSource}
        />
        <SourceInfo
          loading={loading}
          fileCount={fileCount || 0}
          urlCount={urlData.length}
          urlChars={urlData.reduce((total, url) => total + (url.chars || 0), 0)}
          questionCount={totalCount}
          textChars={textData.length}
        />
      </div> {/*side bar END*/}

      <div className='flex-1 rounded border-gray-400 px-5'
        onDragOver={() => setUploadBoxVisible(true)}
        > {/*DATA ADD START*/}
        <div className='h-full'>
            <h4
            className='bold-text mb-4 border-b border-gray-300 pb-1'
            >
            {t(selectedSource.label)}
            </h4>
          {selectedSource.value === 'crawling' && (
            <URLCrawling
              urlData={urlData}
              setUrlData={setUrlData}
              confirmDelete={confirmDelete}
              refetchItems={refetchItems}
            />
          )}
          {selectedSource.value === 'file' && (
            <FileUpload
              fileData={fileData}
              loading={loading}
              setLoading={setLoading}
              confirmDelete={confirmDelete}
              fetchFileKnowledgeData={fetchFileKnowledgeData}
              uploadBoxVisible={uploadBoxVisible}
              setUploadBoxVisible={setUploadBoxVisible}
            />
          )}
          {selectedSource.value === 'text' && (
            <TextUpload textData={textData} setTextData={setTextData} />
          )}
          {selectedSource.value === 'qa' && (
            <QAIntegration
              qaData={qaData}
              setLoading={setLoading}
              setQaData={setQaData}
              loading={loading}
              confirmDelete={confirmDelete}
              fetchQAKnowledgeData={fetchQAKnowledgeData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalCount={totalCount}
            />
          )}
        </div> {/*DATA ADD END */}
      </div>
      <KnowledgeConfirmModal
        {...confirmModal}
        loading={loading}
        closeModal={handleCloseModal}
        handleDelete={handleModalConfirm}
      />
    </div>
  )
}

export default AddKnowledgeHub
