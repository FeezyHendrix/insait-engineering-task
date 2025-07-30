import { deleteFileKnowledgeRequest, uploadKnowledgeDocument } from '@/redux/slices/knowledgeHub/request'
import { KnowledgeFileItemType, KnowledgeFileModalTypes, KnowledgeFileUploadProp } from '@/types/knowledge'
import { fixFileNameEncoding } from '@/utils'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdOutlineFileUpload } from 'react-icons/md'
import { toast } from 'react-toastify'
import KnowledgeFileList from './KnowledgeFileList'
import KnowledgeFileDeleteModal from '../KnowledgeFileDeleteModal'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { BiExpandAlt } from "react-icons/bi";
import { CgMinimize } from "react-icons/cg";
import { OrderSortType, TableHeaderKeyType } from '@/types/chat'
import { useSearchParams } from 'react-router-dom'

const FileUpload = ({
  fileData,
  loading,
  setLoading,
  fetchFileKnowledgeData,
  uploadBoxVisible,
  setUploadBoxVisible
}: KnowledgeFileUploadProp) => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const initialPage = (Number(searchParams.get("page")) || 1) - 1
  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const [modalOpened, setModalOpened] = useState<KnowledgeFileModalTypes>('none')
  const [selectedFile, setSelectedFile] = useState<KnowledgeFileItemType | null>(null);
  const [order, setOrder] = useState<OrderSortType>('desc')
  const [orderBy, setOrderBy] = useState<TableHeaderKeyType>('createdAt')
  const [currentPage, setCurrentPage] = useState(initialPage);  

  const uploadFiles = async (files: FileList) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => formData.append('files', file))

      const response = await uploadKnowledgeDocument(formData)

      await response.results.forEach(
        (item: { success: boolean; fileName: string; error?: string }) => {
          if (item.success) {
            toast.success(
              t('feedback.fileUploaded', {
                name: fixFileNameEncoding(item.fileName),
              })
            )
          } else {
            toast.error(item?.error || t('feedback.fileProcessingFailed'))
          }
        }
      )
      await fetchFileKnowledgeData(currentPage, order, orderBy)
    } catch (error) {
      toast.error(t('feedback.fileProcessingFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (selected: number ) => {
    setCurrentPage(selected)
  }

  const handleRequestSort = (field: TableHeaderKeyType) => {
    if (!field) return
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(field)
    setCurrentPage(0)
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      uploadFiles(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files) {
      if(loading) {
        toast.error(t('feedback.fileProcessingFailed'))
        return;
      }
      uploadFiles(files)
    }
  };

  const handleOpenModal = (
    type: KnowledgeFileModalTypes,
    file: KnowledgeFileItemType | null
  ) => {
      setSelectedFile(file)
      setModalOpened(type)
  };

  const handleCloseModal = () => {
    setSelectedFile(null)
    setModalOpened('none')
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      const request = await dispatch(deleteFileKnowledgeRequest(id))
      const response = request.payload
      if (request.meta.requestStatus === 'rejected') {
        toast.error(t('feedback.errorWrong'))
      } else {
        toast.success(response?.message)
      }
      fetchFileKnowledgeData(currentPage, order, orderBy)
      return
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      setLoading(false)
      setModalOpened('none')
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchFileKnowledgeData(currentPage, order, orderBy)
   }, [currentPage, order, orderBy]);

   useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const pendingFileFound = fileData.data.some((file) => file.status === 'PENDING');
    if (pendingFileFound) {
      interval = setInterval(() => {
        fetchFileKnowledgeData(currentPage, order, orderBy);
      }, 5000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fileData]);

  return (
    <div>
      <div className={'w-full md:w-9/12 mx-auto relative'}>
      {!uploadBoxVisible ? (
        <div
          onClick={() => setUploadBoxVisible(true)}
          className={`border cursor-pointer border-gray-300 flex justify-center items-center gap-2 py-3 rounded-md`}
        >
          <BiExpandAlt className='text-md text-gray-500' />
          <span className='text-gray-500'>{t('knowledge.expandFileUpload')}</span>
        </div>
      ) : (
        <CgMinimize
          onClick={() => setUploadBoxVisible(false)}
          className='text-xl text-gray-500 absolute -top-4 -right-10 cursor-pointer'
        />
      )}
      <div
        className={`border border-gray-300 py-20 flex flex-col justify-center items-center ${
        !uploadBoxVisible ? 'hidden' :
        loading ? 'cursor-not-allowed' : 'cursor-pointer'
        } rounded-md mt-8`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <MdOutlineFileUpload className='text-2xl text-gray-600' />
        <p className='text-sm text-center text-gray-500'>
        {t('knowledge.dragAndDropFile')}
        </p>
        <p className='text-xs text-gray-400'>
        {t('knowledge.supportedFile')}
        </p>
        {loading && <div className='inline-app-loader dark mt-3' />}
        <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept='.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.txt,text/plain,.pdf,application/pdf,.md,text/markdown,.html,text/html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/vnd.openxmlformats-officedocument.presentationml.presentation,audio/mpeg,application/json'
        multiple
        disabled={loading}
        className='hidden'
        />
      </div>
      <p className={`text-xs md:text-sm text-gray-400 text-center leading-4 pt-2 ${uploadBoxVisible ? 'block' : 'hidden'}`}>
        {t('knowledge.ensureDocumentHighlight')}{' '}
        <br className='hidden md:block' />
        <span className='text-xs'>{t('knowledge.meaningfulName')}</span>
      </p>
      </div>
      <hr className='w-full h-0.5 bg-gray-300 my-5' />
      <div className='flex flex-col gap-2 max-h-[40vh] overflow-y-auto'>
      <KnowledgeFileList 
        data={fileData.data} 
        loading={false} 
        currentPage={currentPage}
        totalCount={fileData?.pagination?.totalDocuments || 0}
        order={order}
        orderBy={orderBy}
        handleOpenModal={handleOpenModal}
        handleRequestSort={handleRequestSort}
        handlePageChange={handlePageChange}
        closeModal={handleCloseModal}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      /> 
      </div>
      <KnowledgeFileDeleteModal
      isOpen={modalOpened === 'delete'}
      loading={loading}
      file={selectedFile}
      closeModal={handleCloseModal}
      handleDelete={handleDelete}
      />
    </div>
    
  )
}

export default FileUpload
