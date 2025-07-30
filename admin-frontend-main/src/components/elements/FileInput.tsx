import { useEffect } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import exportImg from '@image/icons/export.svg'
import closeCircleImg from '@image/icons/close-circle.svg'

interface FileInputType {
  value?: File
  accept?: Accept
  onChange: (file?: File) => void
}

const FileInput = ({ value, accept, onChange }: FileInputType) => {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept,
  })

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0])
    }
  }, [acceptedFiles])

  return (
    <>
      <div
        {...getRootProps({
          className:
            'flex flex-col justify-center items-center bg-primary-light rounded-xl border border-dashed border-primary-light py-12',
        })}
      >
        <input {...getInputProps()} />
        <span className='p-2 bg-primary rounded-full'>
          <img src={exportImg} />
        </span>
        <p
          className='mt-2.5 cursor-pointer font-bold text-sm underline text-primary'
          onClick={open}
        >
          Upload PDF file
        </p>
      </div>
      {value && (
        <div className='flex items-center mt-2'>
          <p className='font-bold text-sm'>{value.name}</p>
          <img
            className='ms-2 cursor-pointer'
            src={closeCircleImg}
            alt='close-circle'
            onClick={() => {
              onChange(undefined)
            }}
          />
        </div>
      )}
    </>
  )
}

export default FileInput
