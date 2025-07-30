import { FileWithPreview } from '@/types/support'
import { allowedMimeTypes } from '@/utils/data'
import React, { RefObject } from 'react'
import { IoDocumentAttachOutline } from 'react-icons/io5'
import FilePreview from './FilePreview'

interface AttachFileProp {
  fileInputRef: RefObject<HTMLInputElement>
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (index: number) => void
  files: FileWithPreview[]
  buttonClass?: string
}

const AttachFile = ({
  fileInputRef,
  handleFileUpload,
  removeFile,
  files,
  buttonClass = ''
}: AttachFileProp) => {
  return (
    <div className='bg-white pt-2'>
      <div className='flex gap-4'>
        <button
          className={`flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md w-fit ${buttonClass}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <IoDocumentAttachOutline className='text-xl' />
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileUpload}
            className='hidden'
            accept={allowedMimeTypes.join(',')}
            multiple
          />
        </button>

        {files.length > 0 && (
          <div className='flex flex-wrap gap-4 bg-gray-50 rounded-md'>
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttachFile
