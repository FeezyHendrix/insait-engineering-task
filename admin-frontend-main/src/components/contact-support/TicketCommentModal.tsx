import Modal from '../elements/Modal'
import {
  FileWithPreview,
  SupportFetchTypes,
  TicketDataType,
} from '@/types/support'
import ConversationalChat from '../conversation/ConversationChat'
import ChatInput from '../elements/ChatInput'
import { useAppDispatch } from '@/hook/useReduxHooks'
import {
  getSupportTicketDetailById,
  sendSupportCommentRequest,
} from '@/redux/slices/analytics/request'
import { useEffect, useRef, useState } from 'react'
import { ChatType } from '@/types/dashboard'
import { toast } from 'react-toastify'
import { unwrapResult } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import AttachFile from './AttachFile'
import { processFileRemove, processNewFiles } from '@/utils/data'

interface TicketCommentModalProp {
  isOpen: boolean
  ticketId?: string | null
  tableData: Array<TicketDataType>
  closeModal: () => void
  fetchNewData: (type: SupportFetchTypes) => void
}

const TicketCommentModal = ({
  isOpen,
  ticketId,
  closeModal,
  tableData,
  fetchNewData,
}: TicketCommentModalProp) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [data, setData] = useState<ChatType[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([])
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (text: string) => {
    if (!ticketId) return
    const ticketCommentUrl = window.location.href
    const data = {
      id: '',
      text,
      ticketCommentUrl,
      supportId: ticketId,
    }

    const formData = new FormData()
    Array.from(uploadedFiles).forEach(file => formData.append('files', file))
    formData.append('data', JSON.stringify(data))

    const response = await (
      await dispatch(sendSupportCommentRequest(formData))
    ).payload

    if (response.status) {
      fetchNewData('refresh')
      setData(prev => [...prev, response.data])
      setUploadedFiles([])
      toast.success(t('feedback.ticketCommentSuccess'))
      closeModal()
    } else {
      toast.error(response?.message ?? t('feedback.errorWrong'))
    }
  }

   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
  
      const newFiles = processNewFiles(files)
  
      if (!newFiles || newFiles.length === 0) return
  
      setUploadedFiles(prev => [...prev, ...newFiles])
  
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  
    const removeFile = (index: number) => {
      setUploadedFiles(prev => processFileRemove(prev, index))
    }

  const getExistingComments = (): ChatType[] | null => {
    if (!tableData) return null

    const selectedItem = tableData.filter(item => item.id === ticketId)[0]

    if (!selectedItem?.id || !selectedItem.comments?.length) return null

    return selectedItem.comments
  }

  const fetchData = async () => {
    try {
      if (!ticketId) return
      setLoading(true)
      const response = unwrapResult(
        await dispatch(getSupportTicketDetailById(ticketId))
      )
      if (response.status === true && response.data?.id) {
        setData(response?.data?.comments)
        return
      }
      toast.error(response?.message || t('feedback.errorWrong'))
    } catch (error) {
      toast.error(t('feedback.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ticketId && isOpen) {
      const existingComments = getExistingComments()
      if (existingComments) {
        setData(existingComments)
        return
      }
      fetchData()
    }
  }, [ticketId, isOpen])

  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <h2 className='text-xl text-center bolder-text pt-3 pb-4'>
        {t('support.ticketConversation')}
      </h2>
      <div className='h-full overflow-hidden'>
        <ConversationalChat
          id={ticketId || ''}
          showReportButton={false}
          showCopyButton={false}
          showSenderName={true}
          data={data}
          loading={loading}
        >
          <div className='w-full relative'>
            <ChatInput chatId={ticketId || ''} onClick={handleSendMessage}  />
            <AttachFile
              fileInputRef={fileInputRef}
              files={uploadedFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
              buttonClass='absolute top-2 right-1'
            />
          </div>
        </ConversationalChat>
      </div>
    </Modal>
  )
}

export default TicketCommentModal
