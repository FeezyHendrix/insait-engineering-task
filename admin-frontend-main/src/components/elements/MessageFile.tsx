import React, { useEffect, useState } from 'react'
import PdfDisplay from './PdfDisplay'
import { base64ToFile, getFileType } from '@/utils'
import { MessageFileProps } from '@/types/chat'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getPDFFile } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const MessageFile: React.FC<MessageFileProps> = ({ url }) => {
  const { t } = useTranslation()
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleFileClick = () => {
    setShowFullPreview(true)
  }

  const handleClosePreview = () => {
    setShowFullPreview(false)
  }

  useEffect(() => {
    async function fetchPdf () {
      if (getFileType(url) !== 'pdf') return
      try {
        setIsLoading(true)
        const response = (await dispatch(getPDFFile(url))).payload
        if (response.status && response?.data?.file) {
          const responseData = response?.data
          const file = base64ToFile(responseData.file, responseData.fileName)
          const fileUrl = URL.createObjectURL(file)
          setPdfUrl(fileUrl)
        }
      } catch (error) {
        toast.error(t('feedback.errorWrong'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchPdf()
  }, [url, dispatch])

  const DisplayFileFromUrl = (url: string, isFullScreen: boolean = false) => {
    const urlFileType = getFileType(url)

    switch (urlFileType) {
      case 'image':
        return (
          <img
            className={`${
              isFullScreen ? 'max-h-[80vh]' : 'max-h-[300px] max-w-full'
            } h-auto  cursor-pointer rounded-lg shadow-md`}
            src={url}
            alt='Selected file'
            onClick={handleFileClick}
          />
        )
      case 'video':
        return (
          <div
            className={`relative ${
              isFullScreen ? 'max-h-[80vh]' : 'max-h-[300px] max-w-fit'
            } cursor-pointer`}
            onClick={handleFileClick}
          >
            <video
              className={`${
                isFullScreen ? 'max-h-[80vh]' : 'max-h-[300px] max-w-full'
              } w-full h-full rounded-lg shadow-md`}
              src={url}
              controls={isFullScreen}
              autoPlay={isFullScreen}
            >
              {t('messages.browserVideoNotSupported')}
            </video>
            {!isFullScreen && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='w-16 h-16 text-white'
                >
                  <polygon points='5 3 19 12 5 21 5 3'></polygon>
                </svg>
              </div>
            )}
          </div>
        )
      case 'pdf':
        return (
          <PdfDisplay
            url={url}
            isLoading={isLoading}
            pdfUrl={pdfUrl}
            isFullScreen={isFullScreen}
            onExpand={handleFileClick}
          />
        )
      default:
        return (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            {t('messages.unKnownFileType')}
          </a>
        )
    }
  }

  return (
    <>
      {DisplayFileFromUrl(url)}
      {showFullPreview && (
        <div
          className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50'
          onClick={handleClosePreview}
        >
          <div
            className='relative max-w-[90vw] max-h-[90vh] bg-white p-4 rounded-lg shadow-xl overflow-auto'
            onClick={e => e.stopPropagation()}
          >
            <button
              className='absolute top-1 end-3 text-gray-500 hover:text-gray-700 text-2xl font-bold'
              onClick={handleClosePreview}
            >
              &times;
            </button>
            <div className='mt-6'>{DisplayFileFromUrl(url, true)}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default MessageFile
