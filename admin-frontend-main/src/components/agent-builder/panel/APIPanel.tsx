import React, { useEffect, useState, useRef } from 'react'
import { FaPlus, FaMinus, FaKey, FaFile } from 'react-icons/fa'
import { LiaFileExportSolid } from 'react-icons/lia'
import { BiExport } from 'react-icons/bi'
import Editor from '@monaco-editor/react'
import { CertificateFilesProp, NodePanelProps } from '@/types/agent-builder'
import { toast } from 'react-toastify'
import {
  agentAPIMethods,
  downloadSpec,
  generateSwaggerSpec,
  testRequest,
} from '@/utils/botBuilder'
import CustomTooltip from '@/components/elements/CustomTooltip'
import APIForm from './APIForm'

const APIPanel = ({
  selectedNode,
  updateNodeData,
  variableData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)
  const certificateInputRef = useRef<HTMLInputElement>(null)
  const keyInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const [certificates, setCertificates] = useState<CertificateFilesProp>({
    cert: null,
    key: null,
  })

  const handleCertificateUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    if (file) {
      setCertificates(prev => ({
        ...prev,
        [type]: file,
      }))

      const newNodeData = {
        ...nodeData,
        certificates: {
          ...nodeData?.certificates,
          [type]: file.name,
        },
      }
      updateNodeData(selectedNode.id, newNodeData)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (file) {
      setCertificates(prev => ({
        ...prev,
        [type]: file,
      }))

      const newNodeData = {
        ...nodeData,
        certificates: {
          ...nodeData?.certificates,
          [type]: file.name,
        },
      }
      updateNodeData(selectedNode.id, newNodeData)
    }
  }

  const addField = (section: string) => {
    switch (section) {
      case 'headers':
      case 'parameters':
      case 'body':
      case 'responses':
        const currentItems = nodeData?.[section] || []

        const hasEmptyField = currentItems.some(
          item => !item.key.trim() || !item.value.trim()
        )

        if (hasEmptyField) {
          toast.error(
            `Please complete the current ${section} before adding a new one.`
          )
          return
        }

        handleUpdateNodeDate(section, [
          ...currentItems,
          { id: `${currentItems.length + 1}`, key: '', value: '' },
        ])
        break
    }
  }

  const removeField = (section: string, id: string) => {
    switch (section) {
      case 'headers':
      case 'parameters':
      case 'body':
      case 'responses':
        const filteredSection = nodeData?.[section]?.filter(
          item => item.id !== id
        )
        handleUpdateNodeDate(section, filteredSection)
        break
    }
  }

  const handleFieldChange = (
    section: string,
    id: string,
    field: string,
    value: string
  ) => {
    switch (section) {
      case 'headers':
      case 'parameters':
      case 'body':
      case 'responses':
        setNodeData(prevNodeData => {
          const currentSection = prevNodeData[section] || []
          return {
            ...prevNodeData,
            [section]: currentSection.map(item =>
              item.id === id ? { ...item, [field]: value } : item
            ),
          }
        })
        break
    }
  }

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

  const handleClose = () => {
    handleSubmitNodeData()
    onClose && onClose()
  }

  const handleTestRequest = async () => {
    try {
      setLoading(true)
      handleSubmitNodeData()
      const result = await testRequest(nodeData)
      handleUpdateNodeDate('testStatus', result.status ? 'pass' : 'fail')
      setLoading(false)
      toast(result.message, { type: result.status ? 'success' : 'error' })
    } catch (error) {
      setLoading(false)
      handleUpdateNodeDate('testStatus', 'fail')
      toast.error('Failed to test API')
    }
  }

  const exportAPIToText = () => {
    const spec = generateSwaggerSpec(nodeData)
    downloadSpec(spec, `${nodeData?.label || 'api'}-spec.json`)
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  const certificateSection = (
    <div className='mb-6 border-t border-b border-gray-200 py-4'>
      <h3 className='text-lg font-medium text-gray-800 mb-4'>Certificates</h3>

      {/* Certificate Upload */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Certificate
        </label>
        <div
          className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500'
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, 'cert')}
          onClick={() => certificateInputRef.current?.click()}
        >
          <input
            type='file'
            ref={certificateInputRef}
            className='hidden'
            onChange={e => handleCertificateUpload(e, 'cert')}
            accept='.crt,.pem,.cer'
          />
          <div className='flex flex-col items-center justify-center'>
            <FaFile className='text-sm text-gray-400 mb-2' />
            <p className='text-sm text-gray-600'>
              {certificates.cert
                ? certificates.cert.name
                : 'Drag & drop certificate here. Or, click to browse. \n .crt,.pem,.cer'}
            </p>
          </div>
        </div>
      </div>

      {/* Key Upload */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Key
        </label>
        <div
          className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500'
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, 'key')}
          onClick={() => keyInputRef.current?.click()}
        >
          <input
            type='file'
            ref={keyInputRef}
            className='hidden'
            onChange={e => handleCertificateUpload(e, 'key')}
            accept='.key,.pem'
          />
          <div className='flex flex-col items-center justify-center'>
            <FaKey className='text-sm text-gray-400 mb-2' />
            <p className='text-sm text-gray-600'>
              {certificates.key
                ? certificates.key.name
                : 'Drag & drop key here. Or, click to browse \n .key,.pem'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='w-[400px] bg-white p-6 border-l border-gray-200 h-full overflow-y-auto flex flex-col'>
      <div className='mb-0'>
        <div className='flex gap-3 items-center mb-4 justify-between pe-8'>
          <div className='flex gap-3 items-center '>
            {nodeData?.testStatus && (
              <p
                className={` rounded-2xl text-sm px-3 text-white capitalize py-0.5 font-bold ${
                  nodeData?.testStatus === 'pass'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              >
                {nodeData?.testStatus}
              </p>
            )}
            <h2 className='text-xl font-semibold text-gray-800'>
              {selectedNode?.data?.label}
            </h2>
          </div>
          <CustomTooltip title='Export API To Text'>
            <button
              onClick={exportAPIToText}
              disabled={!nodeData?.method || !nodeData?.url}
              className='disabled:bg-transparent text-2xl disabled:text-gray-300'
            >
              <BiExport />
            </button>
          </CustomTooltip>
        </div>
      </div>
      <APIForm
        method={nodeData.method}
        url={nodeData.url}
        jsonResponse={nodeData.jsonResponse}
        bodyType={nodeData.bodyType}
        headers={nodeData.headers}
        parameters={nodeData.parameters}
        body={nodeData.body}
        handleUpdateNodeDate={handleUpdateNodeDate}
        handleLocalNodeValuesUpdate={handleLocalNodeValuesUpdate}
        removeField={removeField}
        handleFieldChange={handleFieldChange}
        handleSubmitNodeData={handleSubmitNodeData}
        addField={addField}
      />
      {/* Response Section */}
      <div className='mt-2'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-medium text-gray-800'>
            Capture Response
          </h3>
          <button
            onClick={() => addField('responses')}
            className='text-blue-500 hover:text-blue-600'
          >
            <FaPlus size={16} />
          </button>
        </div>
        {nodeData?.responses &&
          nodeData?.responses?.length > 0 &&
          nodeData.responses.map(response => (
            <div
              key={response.id}
              className='mb-3 relative flex items-start gap-2'
            >
              <div className='flex-1 flex flex-col items-center gap-2'>
                <input
                  type='text'
                  value={response.key}
                  onBlur={handleSubmitNodeData}
                  onChange={e =>
                    handleFieldChange(
                      'responses',
                      response.id,
                      'key',
                      e.target.value
                    )
                  }
                  placeholder='Enter key'
                  className='w-full p-2 border border-gray-200 rounded-md'
                />
                <select
                  value={response.value}
                  onChange={e =>
                    handleFieldChange(
                      'responses',
                      response.id,
                      'value',
                      e.target.value
                    )
                  }
                  className='w-full bg-transparent font-medium text-gray-700 cursor-pointer outline-none p-2 border border-gray-200 rounded-md'
                >
                  <option value='' disabled>
                    Select Option
                  </option>
                  {variableData &&
                    variableData?.length > 0 &&
                    variableData.map(item => (
                      <option key={item.id} value={item.value}>
                        {item.value}
                      </option>
                    ))}
                </select>
              </div>
              <button
                onClick={() => removeField('responses', response.id)}
                className='text-gray-400 hover:text-gray-600 mt-4'
              >
                <FaMinus size={16} />
              </button>
            </div>
          ))}
      </div>

      {/* Insert Certificate Section here */}
      <div>
        <div className='py-2 flex justify-between'>
          <p className='flex items-center'>Upload Certificate</p>
          <button
            onClick={() =>
              handleUpdateNodeDate('uploadCert', !nodeData?.uploadCert)
            }
            className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
              nodeData?.uploadCert ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            {nodeData?.uploadCert ? 'On' : 'Off'}
          </button>
        </div>
        {nodeData?.uploadCert && certificateSection}
      </div>

      <div className=' flex justify-between items-end flex-1'>
        <button
          className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'
          onClick={handleClose}
        >
          Save Request
        </button>
        <button
          className={`px-3 py-2 rounded-lg text-white flex items-center bg-blue-500 hover:bg-blue-600`}
          disabled={!nodeData?.method || !nodeData?.url}
          onClick={handleTestRequest}
        >
          {loading && <div className='inline-app-loader' />}
          Test Request
        </button>
      </div>
    </div>
  )
}

export default APIPanel
