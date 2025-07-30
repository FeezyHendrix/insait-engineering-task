export interface KnowledgeFileViewModalProp {
  isOpen: boolean
  selectedFile: KnowledgeFileItemType | null
  setSelectedFile: (file: KnowledgeFileItemType | null) => void
}

import { FileWithPreview } from '@/types/support'
import { IoCloseCircle, IoDocument, IoVideocam } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import mammoth from 'mammoth'
import { KnowledgeFileViewModal } from '../knowledge/KnowledgeFileViewModal'
import { KnowledgeFileItemType } from '@/types/knowledge'

interface FilePreviewProp {
  file: FileWithPreview
  onRemove: () => void
}

const FilePreview = ({ file, onRemove }: FilePreviewProp) => {
  const [showPreview, setShowPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>('')

  if (typeof file === 'string') return;
  // TODO: handle when the file is  a string

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPreview(true)
  }

  useEffect(() => {
    if (!showPreview) return

    const loadPreview = async () => {
      try {
        if (file.type.startsWith('image/')) {
          setPreviewContent(file.preview || URL.createObjectURL(file))
          return
        }

        if (file.type.startsWith('video/')) {
          setPreviewContent(URL.createObjectURL(file))
          return
        }

        if (
          file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setPreviewContent(result.value)
        } else if (file.type === 'text/plain') {
          const text = await file.text()
          setPreviewContent(text)
        } else if (file.type === 'application/pdf') {
          const url = URL.createObjectURL(file)
          setPreviewContent(url)
        }
      } catch (error) {
        console.error('Error loading preview:', error)
        setPreviewContent('')
      }
    }

    loadPreview()
  }, [file, showPreview])

  const localFile: KnowledgeFileItemType = {
    id: '',
    url: '',
    key: '',
    status: '',
    createdAt: '',
    name: file?.name,
    size: file.size,
    type: file.type,
    preview: previewContent,
  }

  if (file.type.startsWith('image/')) {
    return (
      <>
        <div
          className='relative group w-16 h-16 cursor-pointer'
          onClick={handleClick}
        >
          <img
            src={file.preview || URL.createObjectURL(file)}
            alt={file.name}
            className='w-16 h-16 object-cover rounded-md'
          />
          <button
            onClick={e => {
              e.stopPropagation()
              onRemove()
            }}
            className='absolute -top-2 -right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full'
          >
            <IoCloseCircle className='text-lg' />
          </button>
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate rounded-b-md'>
            {file.name}
          </div>
        </div>
        <KnowledgeFileViewModal
          isOpen={showPreview}
          selectedFile={localFile}
          setSelectedFile={() => setShowPreview(false)}
          closeModal={() => setShowPreview(false)}
        />
      </>
    )
  }

  const FileIcon = file.type.startsWith('video/') ? IoVideocam : IoDocument
  return (
    <>
      <div
        className='relative group flex items-center gap-1 bg-gray-100 p-2 rounded-md cursor-pointer'
        onClick={handleClick}
      >
        <FileIcon className='text-lg' />
        <span className='text-sm text-gray-600 max-w-[120px] truncate'>
          {file.name}
        </span>
        <button
          onClick={e => {
            e.stopPropagation()
            onRemove()
          }}
          className='absolute -top-2 -right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full'
        >
          <IoCloseCircle className='text-lg' />
        </button>
      </div>
      <KnowledgeFileViewModal
        isOpen={showPreview}
        selectedFile={localFile}
        setSelectedFile={() => setShowPreview(false)}
        closeModal={() => setShowPreview(false)}
      />
    </>
  )
}

export default FilePreview
