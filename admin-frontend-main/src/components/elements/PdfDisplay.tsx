import { PdfDisplayProps } from '@/types/chat'
import { useTranslation } from 'react-i18next'
import { IoMdExpand } from 'react-icons/io'

const PdfDisplay: React.FC<PdfDisplayProps> = ({
  pdfUrl,
  url,
  isFullScreen,
  isLoading,
  onExpand,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return <div>{t('feedback.loadingPDF')}</div>
  }

  return (
    <div
      className={`${
        isFullScreen
          ? 'max-h-[80vh] w-[80vw] h-[80vh]'
          : 'max-h-[400px] max-w-fit'
      } cursor-pointer rounded overflow-hidden relative`}
    >
      {!isFullScreen && pdfUrl !== null && (
        <button
          className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200'
          onClick={onExpand}
        >
          <IoMdExpand />
        </button>
      )}
      {pdfUrl ? (
        <iframe
          src={`${pdfUrl}${
            isFullScreen ? '' : '#toolbar=0&navpanes=0&scrollbar=0'
          }`}
          className={`w-full ${isFullScreen ? 'h-full' : 'h-[500px]'}`}
          title='PDF Viewer'
        >
          {t('messages.browserNotSupportedDownloadPDF')}{' '}
          <a href={pdfUrl} className='text-blue-500 hover:underline'>
            {t('button.downloadPDF')}
          </a>
        </iframe>
      ) : (
        <div className='flex items-center justify-center h-full pt-1 pe-2'>
          <span className='me-2'>{t('feedback.couldNotDownloadFile')}</span>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            {t('button.viewPDF')}
          </a>
        </div>
      )}
    </div>
  )
}

export default PdfDisplay
