import { NodePanelProps } from '@/types/agent-builder'
import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

const ImagePanel = ({ selectedNode, updateNodeData }: NodePanelProps) => {
  const [activeTab, setActiveTab] = useState('upload')
  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const [isLoadingError, setIsLoadingError] = useState(false)
  const isFileNode = selectedNode?.type === 'File'

  const handleUpdateNodeDate = (key: string, value: any) => {
    const newNode = {
      ...nodeData,
      [key]: value,
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const handleLocalNodeValuesUpdate = (key: string, value: any) => {
    if (!key) return

    setNodeData(prevData => ({
      ...prevData,
      [key]: value,
    }))
  }

  const handleSubmitNodeData = () => {
    updateNodeData(selectedNode.id, nodeData)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData({
        uploadedImage: '',
        ...selectedNode.data,
      })
    }
  }, [selectedNode])

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
      reader.readAsDataURL(file)
    })
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0]
        if (file) {
          const base64 = isFileNode ? file.name : await convertToBase64(file)
          setIsLoadingError(false)
          handleUpdateNodeDate('uploadedImage', base64)
        }
      } catch (error) {
        toast.error('Error converting file to base64')
      }
    },
    [selectedNode, handleUpdateNodeDate]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isFileNode
      ? undefined
      : {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
    multiple: false,
  })

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleLocalNodeValuesUpdate('uploadedImage', e.target.value)
  }

  return (
    <div className='bg-white p-6 border-l border-gray-200 h-full overflow-y-auto w-[400px]'>
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>
        {selectedNode?.data?.label}
      </h2>

      <div className='flex mb-6 border-b'>
        <button
          className={`px-6 py-2 font-medium ${
            activeTab === 'upload'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button
          className={`px-6 py-2 font-medium ${
            activeTab === 'link'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('link')}
        >
          Link
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-4'>
            <p className='text-gray-600'>
              {!isFileNode
                ? 'Drag & drop image/GIF here. Or,'
                : 'Upload file here by'}
            </p>
            <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
              Browse
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type='text'
            value={nodeData?.uploadedImage}
            onChange={handleUrlChange}
            onBlur={handleSubmitNodeData}
            placeholder='Enter file URL or {variable}'
            className='w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      )}

      {nodeData?.uploadedImage?.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-sm font-medium text-gray-700 mb-2'>
            {isFileNode ? 'Files' : 'Preview'}
          </h3>
          <div className='border rounded-lg p-2'>
            {isLoadingError ? (
              <p className='text-red-400'>Unable to load the file</p>
            ) : !isFileNode ? (
              <img
                src={nodeData?.uploadedImage}
                alt='Preview'
                className='w-full h-auto rounded-md'
                onError={() => {
                  setIsLoadingError(true)
                }}
              />
            ) : (
              <p>{nodeData?.uploadedImage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImagePanel
