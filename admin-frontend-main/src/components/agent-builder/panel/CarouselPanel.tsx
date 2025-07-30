import { CarouselImageProp, NodePanelProps } from '@/types/agent-builder'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { IoClose } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'

const CarouselPanel = ({ selectedNode, updateNodeData }: NodePanelProps) => {
  const [activeTab, setActiveTab] = useState('upload')
  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const [isLoadingError, setIsLoadingError] = useState<Record<string, boolean>>(
    {}
  )
  const isFileNode = selectedNode?.type === 'File'

  const handleUpdateNodeData = (key: string, value: any) => {
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

  const handleAddNewImage = () => {
    const newImage: CarouselImageProp = {
      image: '',
      alt: '',
    }
    const currentImages = nodeData?.carouselImages || []
    const updatedImages = [...currentImages, newImage]
    handleUpdateNodeData('carouselImages', updatedImages)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData({
        carouselImages: [],
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
        const newImages = await Promise.all(
          acceptedFiles.map(async file => {
            const base64 = isFileNode ? file.name : await convertToBase64(file)
            return {
              image: base64 as string,
              alt: '', //file.name,
            }
          })
        )

        setIsLoadingError({})
        const currentImages = nodeData?.carouselImages || []
        const updatedImages = [...currentImages, ...newImages]
        handleUpdateNodeData('carouselImages', updatedImages)
      } catch (error) {
        toast.error('Error processing files')
      }
    },
    [nodeData, handleUpdateNodeData]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isFileNode
      ? undefined
      : {
          'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
    multiple: true,
  })

  const handleAltTextChange = (index: number, newAlt: string) => {
    const updatedImages = [...(nodeData?.carouselImages || [])]
    updatedImages[index] = {
      ...updatedImages[index],
      alt: newAlt,
    }
    handleLocalNodeValuesUpdate('carouselImages', updatedImages)
  }

  const handleImageURLChange = (index: number, newURL: string) => {
    const updatedImages = [...(nodeData?.carouselImages || [])]
    updatedImages[index] = {
      ...updatedImages[index],
      image: newURL,
    }
    handleLocalNodeValuesUpdate('carouselImages', updatedImages)
  }

  const handleRemoveImage = (index: number) => {
    const carouselImages = nodeData?.carouselImages || []
    const updatedImages = carouselImages.filter((_, i) => i !== index)
    handleUpdateNodeData('carouselImages', updatedImages)
  }

  const handleImageError = (index: number) => {
    setIsLoadingError(prev => ({
      ...prev,
      [index]: true,
    }))
  }

  return (
    <div className='bg-white p-6 border-l border-gray-200 h-full overflow-y-auto w-[400px]'>
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>
        {selectedNode?.data?.label}
      </h2>

      <div className='flex mb-4 border-b'>
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
                ? 'Drag & drop images/GIFs here. Or,'
                : 'Upload files here by'}
            </p>
            <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
              Browse
            </button>
          </div>
        </div>
      ) : (
        <div className='flex items-end justify-end'>
          <button
            onClick={handleAddNewImage}
            className='bg-blue-500 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition-colors'
          >
            Add
            <IoMdAdd />
          </button>
        </div>
      )}

      {nodeData?.carouselImages && nodeData?.carouselImages?.length > 0 && (
        <div className='mt-3 space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-sm font-medium text-gray-700'>
              {isFileNode ? 'Files' : 'Carousel Images'}
            </h3>
          </div>

          {nodeData.carouselImages.map((item, index: number) => (
            <div key={index} className='border rounded-lg p-4 space-y-1'>
              <div className='flex justify-between items-start'>
                <h4 className='text-sm font-medium text-gray-700'>
                  Image {index + 1}
                </h4>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <IoClose size={16} />
                </button>
              </div>

              {activeTab === 'link' ? (
                <input
                  type='text'
                  value={item.image}
                  onChange={e => handleImageURLChange(index, e.target.value)}
                  onBlur={handleSubmitNodeData}
                  placeholder='Enter image URL or {variable}'
                  className='w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              ) : (
                !isFileNode &&
                !isLoadingError[index] && (
                  <img
                    src={item.image}
                    alt={item.alt}
                    className='w-full h-32 object-cover rounded-md'
                    onError={() => handleImageError(index)}
                  />
                )
              )}

              <input
                type='text'
                value={item.alt}
                onChange={e => handleAltTextChange(index, e.target.value)}
                onBlur={handleSubmitNodeData}
                placeholder='Enter alt text'
                className='w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />

              {isLoadingError[index] && (
                <p className='text-red-400 text-sm'>Unable to load the image</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CarouselPanel
