import { KeyValueProps } from '@/types/agent-builder'
import { agentAPIMethods } from '@/utils/botBuilder'
import { Editor } from '@monaco-editor/react'
import { FaPlus, FaMinus } from 'react-icons/fa'

interface APIFormProp {
  method?: string
  url?: string
  jsonResponse?: string
  bodyType?: string
  headers?: KeyValueProps[]
  parameters?: KeyValueProps[]
  body?: KeyValueProps[]
  handleUpdateNodeDate: (key: string, value: any) => void
  handleLocalNodeValuesUpdate: (key: string, value: any) => void
  removeField: (section: string, id: string) => void
  handleFieldChange: (
    section: string,
    id: string,
    field: string,
    value: string
  ) => void
  handleSubmitNodeData: () => void
  addField: (section: string) => void
}

const APIForm = ({
  method,
  url,
  headers,
  bodyType,
  body,
  jsonResponse,
  parameters,
  handleUpdateNodeDate,
  handleLocalNodeValuesUpdate,
  removeField,
  handleFieldChange,
  handleSubmitNodeData,
  addField,
}: APIFormProp) => {
  return (
    <div>
      {/* URL and method */}
      <div className='flex gap-2 items-center mb-4 p-2 border border-gray-200 rounded-lg'>
        <select
          value={method ?? ''}
          onChange={e => handleUpdateNodeDate('method', e.target.value)}
          className='bg-transparent font-medium text-gray-700 cursor-pointer outline-none'
        >
          {agentAPIMethods.map(item => (
            <option value={item.value} disabled={item.value === ''}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          type='text'
          onChange={e => handleLocalNodeValuesUpdate('url', e.target.value)}
          onBlur={handleSubmitNodeData}
          value={url || ''}
          placeholder='Request URL or {variable}'
          className='flex-1 bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none'
        />
      </div>

      {/* Headers Section */}
      <div className=''>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-medium text-gray-800'>Headers</h3>
          <button
            onClick={() => addField('headers')}
            className='hover:text-blue-600'
          >
            <FaPlus size={16} />
          </button>
        </div>
        {headers &&
          headers?.length > 0 &&
          headers.map(header => (
            <div
              key={header.id}
              className='mb-3 relative flex items-start gap-2'
            >
              <div className='w-full flex flex-col items-center gap-2'>
                <input
                  type='text'
                  value={header.key}
                  onBlur={handleSubmitNodeData}
                  onChange={e =>
                    handleFieldChange(
                      'headers',
                      header.id,
                      'key',
                      e.target.value
                    )
                  }
                  placeholder='Enter key'
                  className='w-full p-2 mb-2 border border-gray-200 rounded-md'
                />
                <input
                  type='text'
                  value={header.value}
                  onBlur={handleSubmitNodeData}
                  onChange={e =>
                    handleFieldChange(
                      'headers',
                      header.id,
                      'value',
                      e.target.value
                    )
                  }
                  placeholder='Enter value or {variable}'
                  className='w-full p-2 border border-gray-200 rounded-md'
                />
              </div>
              <button
                onClick={() => removeField('headers', header.id)}
                className='text-gray-400 hover:text-gray-600 mt-2'
              >
                <FaMinus size={16} />
              </button>
            </div>
          ))}
      </div>

      {/* Parameters Section */}
      <div className=''>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-medium text-gray-800'>Parameters</h3>
          <button
            onClick={() => addField('parameters')}
            className='hover:text-blue-600'
          >
            <FaPlus size={16} />
          </button>
        </div>
        {parameters &&
          parameters?.length > 0 &&
          parameters.map(param => (
            <div
              key={param.id}
              className='mb-3 relative flex items-start gap-2'
            >
              <div className='flex-1 flex flex-col items-center gap-2'>
                <input
                  type='text'
                  value={param.key}
                  onBlur={handleSubmitNodeData}
                  onChange={e =>
                    handleFieldChange(
                      'parameters',
                      param.id,
                      'key',
                      e.target.value
                    )
                  }
                  placeholder='Enter parameter key'
                  className='w-full p-2 mb-2 border border-gray-200 rounded-md'
                />
                <input
                  type='text'
                  value={param.value}
                  onBlur={handleSubmitNodeData}
                  onChange={e =>
                    handleFieldChange(
                      'parameters',
                      param.id,
                      'value',
                      e.target.value
                    )
                  }
                  placeholder='Enter value or {variable}'
                  className='w-full p-2 border border-gray-200 rounded-md'
                />
              </div>
              <button
                onClick={() => removeField('parameters', param.id)}
                className='text-gray-400 hover:text-gray-600 mt-2'
              >
                <FaMinus size={16} />
              </button>
            </div>
          ))}
      </div>

      {/* Body Section */}
      <div className='border-t border-b border-gray-300 py-4'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='text-lg font-medium text-gray-800'>Body</h3>
        </div>
        <div className='flex gap-4 mb-3'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              checked={bodyType === 'formData'}
              onChange={() => handleUpdateNodeDate('bodyType', 'formData')}
              className='text-blue-500 w-4 h-4'
            />
            <span className='text-gray-700'>Form Data</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              checked={bodyType === 'urlEncoded'}
              onChange={() => handleUpdateNodeDate('bodyType', 'urlEncoded')}
              className='text-blue-500 w-4 h-4'
            />
            <span className='text-gray-700'>URL Encoded</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              checked={bodyType === 'raw'}
              onChange={() => handleUpdateNodeDate('bodyType', 'raw')}
              className='text-blue-500 w-4 h-4'
            />
            <span className='text-gray-700'>Raw</span>
          </label>
        </div>

        {bodyType === 'raw' && (
          <div className='border rounded-lg overflow-hidden'>
            <div className='h-48'>
              <Editor
                height='100%'
                defaultLanguage='json'
                value={jsonResponse}
                onChange={val => {
                  handleLocalNodeValuesUpdate('jsonResponse', val)
                }}
                // onBlur={handleSubmitNodeData}
                theme='light'
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  tabSize: 2,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                  },
                }}
              />
            </div>
          </div>
        )}

        {(bodyType === 'formData' || bodyType === 'urlEncoded') && (
          <>
            {body &&
              body?.length > 0 &&
              body.map(field => (
                <div
                  key={field.id}
                  className='mb-3 relative flex items-start gap-2'
                >
                  <div className='flex-1 flex flex-col items-center gap-2'>
                    <input
                      type='text'
                      value={field.key}
                      onBlur={handleSubmitNodeData}
                      onChange={e =>
                        handleFieldChange(
                          'body',
                          field.id,
                          'key',
                          e.target.value
                        )
                      }
                      placeholder='Enter key'
                      className='w-full p-2 mb-2 border border-gray-200 rounded-md'
                    />
                    <input
                      type='text'
                      value={field.value}
                      onBlur={handleSubmitNodeData}
                      onChange={e =>
                        handleFieldChange(
                          'body',
                          field.id,
                          'value',
                          e.target.value
                        )
                      }
                      placeholder='Enter value or {variable}'
                      className='w-full p-2 border border-gray-200 rounded-md'
                    />
                  </div>
                  <button
                    onClick={() => removeField('body', field.id)}
                    className='text-gray-400 hover:text-gray-600 mt-2'
                  >
                    <FaMinus size={16} />
                  </button>
                </div>
              ))}
            <button
              onClick={() => addField('body')}
              className='text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2'
            >
              <FaPlus size={12} />
              <span className='text-sm'>Add field</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default APIForm
