import { FileCategory, KnowledgeFileViewModalProp } from '@/types/knowledge'
import { useTranslation } from 'react-i18next'
import Modal from '../elements/Modal'
import { useEffect, useState, useRef } from 'react'
import mammoth from 'mammoth'
import { toast } from 'react-toastify'
import {
  fetchFileDocumentBuffer,
  fetchKnowledgeFileURL,
} from '@/redux/slices/knowledgeHub/request'
import * as ExcelJS from 'exceljs'

export const KnowledgeFileViewModal = ({
  isOpen,
  selectedFile,
  setSelectedFile,
  closeModal
}: KnowledgeFileViewModalProp) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [workbook, setWorkbook] = useState<ExcelJS.Workbook | null>(null)
  const [activeSheet, setActiveSheet] = useState<string>('')
  const officeContainerRef = useRef<HTMLDivElement>(null)

  const handleError = () => {
    toast.error(t('feedback.errorWrong'))
    setPreviewContent('')
    setLoading(false)
  }

  const loadDocxPreview = async (id: string) => {
    try {
      const arrayBuffer = await fetchFileDocumentBuffer(id)
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setPreviewContent(result.value)
    } catch (error) {
      handleError()
    } finally {
      setLoading(false)
    }
  }

  const loadTextPreview = async (id: string) => {
    try {
      const arrayBuffer = await fetchFileDocumentBuffer(id)
      const decoder = new TextDecoder('utf-8')
      const textContent = decoder.decode(arrayBuffer)
      setPreviewContent(textContent)
    } catch (error) {
      handleError()
    } finally {
      setLoading(false)
    }
  }

  const loadExcelPreview = async (id: string) => {
    try {
      const arrayBuffer = await fetchFileDocumentBuffer(id)
      const wb = new ExcelJS.Workbook()
      await wb.xlsx.load(arrayBuffer)
      setWorkbook(wb)

      if (wb.worksheets.length > 0) {
        setActiveSheet(wb.worksheets[0].name)
      }
    } catch (error) {
      handleError()
    } finally {
      setLoading(false)
    }
  }

  const loadUrlBasedPreview = async (id: string) => {
    try {
      const fileData = await fetchKnowledgeFileURL(id)
      if (fileData?.presignedUrl) {
        setPreviewContent(fileData.presignedUrl)
      }
    } catch (error) {
      handleError()
    } finally {
      setLoading(false)
    }
  }

  const getFileTypeCategory = (
    extension: string,
    mimeType?: string
  ): FileCategory => {
    if (
      ['txt', 'md', 'json', 'csv'].includes(extension) ||
      mimeType?.includes('text/plain') ||
      mimeType?.includes('text/markdown') ||
      mimeType?.includes('application/json') ||
      mimeType?.includes('text/csv')
    ) {
      return 'text'
    }

    if (
      extension === 'docx' ||
      mimeType?.includes('officedocument.wordprocessingml')
    ) {
      return 'docx'
    }

    if (
      ['xlsx', 'xls'].includes(extension) ||
      mimeType?.includes('spreadsheetml') ||
      mimeType?.includes('ms-excel')
    ) {
      return 'excel'
    }

    if (
      ['pptx', 'ppt'].includes(extension) ||
      mimeType?.includes('presentationml')
    ) {
      return 'powerpoint'
    }

    if (
      ['pdf', 'html'].includes(extension) ||
      mimeType?.includes('application/pdf') ||
      mimeType?.includes('text/html')
    ) {
      return 'url'
    }

    if (
      extension === 'mp3' ||
      mimeType?.includes('audio/') ||
      ['wav', 'ogg'].includes(extension)
    ) {
      return 'audio'
    }

    if (
      ['jpg', 'jpeg', 'png', 'gif'].includes(extension) ||
      mimeType?.startsWith('image/')
    ) {
      return 'image'
    }

    if (['mp4', 'webm'].includes(extension) || mimeType?.startsWith('video/')) {
      return 'video'
    }

    return 'unknown'
  }

  useEffect(() => {
    if (selectedFile?.preview) {
      setPreviewContent(selectedFile.preview)
      setLoading(false)
      return
    }

    if (!selectedFile?.id) return
    if (selectedFile.type === 'link') return

    const fileExtension =
      selectedFile.name.split('.').pop()?.toLowerCase() || ''
    const mimeType = selectedFile.type || ''
    setLoading(true)
    setWorkbook(null)

    const fileCategory = getFileTypeCategory(fileExtension, mimeType)

    switch (fileCategory) {
      case 'text':
        loadTextPreview(selectedFile.id)
        break
      case 'docx':
        loadDocxPreview(selectedFile.id)
        break
      case 'excel':
        loadExcelPreview(selectedFile.id)
        break
      case 'powerpoint':
      case 'url':
      case 'audio':
      case 'image':
      case 'video':
        loadUrlBasedPreview(selectedFile.id)
        break
      default:
        loadUrlBasedPreview(selectedFile.id)
        break
    }
  }, [selectedFile])

  // const closeModal = () => {
  //   setSelectedFile(null)
  //   setPreviewContent('')
  //   setWorkbook(null)
  // }

  const renderLoading = () => (
    <div className='flex items-center justify-center h-full'>
      <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500' />
    </div>
  )

  const renderEmptyState = () => (
    <div className='flex items-center justify-center h-full'>
      <p>{t('feedback.noPreviewAvailable')}</p>
    </div>
  )

  const renderDocxContent = () => (
    <div className='bg-white h-full overflow-auto'>
      <div
        className='document-content p-8 whitespace-pre-wrap app-word-break'
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    </div>
  )

  const renderTextContent = () => (
    <div className='bg-white h-full overflow-auto'>
      <pre className='document-content p-8 whitespace-pre-wrap app-word-break'>
        {previewContent}
      </pre>
    </div>
  )

  const renderExcelContent = () => {
    if (!workbook) return renderEmptyState()

    const worksheet = workbook.getWorksheet(activeSheet)
    if (!worksheet) return renderEmptyState()

    const generateTableHtml = () => {
      let html = '<table class="border-collapse w-full">'

      html +=
        '<thead><tr><th class="border border-gray-300 bg-gray-100 p-2"></th>'

      const colCount = worksheet.columnCount || 0
      for (let i = 0; i < colCount; i++) {
        const colName = String.fromCharCode(65 + i)
        html += `<th class="border border-gray-300 bg-gray-100 p-2">${colName}</th>`
      }
      html += '</tr></thead>'

      html += '<tbody>'
      worksheet.eachRow((row, rowIndex) => {
        html += `<tr><td class="border border-gray-300 bg-gray-100 p-2">${rowIndex}</td>`
        row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
          const value = cell ? cell.text || '' : ''
          let cellClass = 'border border-gray-300 p-2'

          if (cell && cell.fill && cell.fill.type === 'pattern') {
            cellClass += ' bg-gray-50'
          }

          html += `<td class="${cellClass}">${value}</td>`
        })
        html += '</tr>'
      })
      html += '</tbody></table>'

      return html
    }

    return (
      <div className='bg-white h-full overflow-auto'>
        <div className='p-4'>
          <div className='mb-4'>
            <label className='me-2 font-medium'>{t('Sheet')}:</label>
            <select
              className='border rounded px-2 py-1'
              value={activeSheet}
              onChange={e => {
                setActiveSheet(e.target.value)
              }}
            >
              {workbook.worksheets.map(sheet => (
                <option key={sheet.id} value={sheet.name}>
                  {sheet.name}
                </option>
              ))}
            </select>
          </div>
          <div
            ref={officeContainerRef}
            className='excel-container overflow-auto border rounded'
            dangerouslySetInnerHTML={{ __html: generateTableHtml() }}
          />
        </div>
      </div>
    )
  }

  const getOfficeViewerUrl = (fileUrl: string, extension: string): string => {
    const encodedUrl = encodeURIComponent(fileUrl)

    if (['pptx', 'ppt'].includes(extension)) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
    }

    return `https://docs.google.com/viewer?embedded=true&url=${encodedUrl}`
  }

  const getFileInfo = (): {
    fileExtension: string
    mimeType: string
    fileCategory: FileCategory
  } => {
    const isPreviewFile = selectedFile && 'preview' in selectedFile
    const fileExtension =
      selectedFile?.name.split('.').pop()?.toLowerCase() || ''
    const mimeType = isPreviewFile ? selectedFile?.type || '' : ''
    const fileCategory = getFileTypeCategory(fileExtension, mimeType)

    return { fileExtension, mimeType, fileCategory }
  }

  const renderMediaContent = () => {
    if (!selectedFile) return null

    const { fileCategory } = getFileInfo()

    if (fileCategory === 'image') {
      return (
        <div className='bg-white h-full flex items-center justify-center'>
          <img
            src={previewContent}
            alt={selectedFile?.name}
            className='max-h-full max-w-full object-contain'
          />
        </div>
      )
    }

    if (fileCategory === 'video') {
      return (
        <div className='bg-white h-full flex items-center justify-center'>
          <video
            src={previewContent}
            controls
            className='max-h-full max-w-full'
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (fileCategory === 'audio') {
      return (
        <div className='bg-white h-full flex items-center justify-center flex-col'>
          <div className='text-center mb-4'>
            <p className='text-lg'>{selectedFile?.name || 'Audio File'}</p>
          </div>
          <audio src={previewContent} controls className='w-3/4'>
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    }

    return null
  }

  const renderContent = () => {
    if (loading) return renderLoading()
    if (!previewContent && !workbook) return renderEmptyState()

    const mediaContent = renderMediaContent()
    if (mediaContent) return mediaContent

    const { fileExtension, fileCategory } = getFileInfo()

    switch (fileCategory) {
      case 'text':
        return renderTextContent()
      case 'docx':
        return renderDocxContent()
      case 'excel':
        return renderExcelContent()
      case 'powerpoint':
        const viewerUrl = getOfficeViewerUrl(previewContent, fileExtension)
        return (
          <div className='flex flex-col h-full'>
            <iframe
              src={viewerUrl}
              className='w-full flex-grow'
              frameBorder='0'
              allowFullScreen
            />
          </div>
        )
      case 'url':
        if (fileExtension === 'html') {
          return (
            <iframe
              src={previewContent}
              className='w-full h-full'
              sandbox='allow-scripts'
            />
          )
        }
        if (fileExtension === 'pdf') {
          return <iframe src={previewContent} className='w-full h-full' />
        }
        return <iframe src={previewContent} className='w-full h-full' />
      default:
        const fallbackUrl = getOfficeViewerUrl(previewContent, fileExtension)
        return (
          <iframe src={fallbackUrl} className='w-full h-full' frameBorder='0' />
        )
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeModal}
      additionalClass='min-h-[90vh] w-[80vw]'
    >
      <div className='h-[95%] p-6'>
        <h1 className='text-center text-2xl bold-text mb-5'>
          {selectedFile?.name || ''}
        </h1>
        {renderContent()}
      </div>
    </Modal>
  )
}
