import { useState, useEffect, useCallback } from 'react'
import { FaPlus } from 'react-icons/fa'
import Editor from '@monaco-editor/react'
import {
  AgentNodePanelProps,
  BodyDataItem,
  BodyTypeEnum,
  CaptureResponseItem,
  NODE_CREATE_TYPE,
  SectionType,
  UpdateNodeRequestType,
} from '@/types/agent-builder'
import { agentAPIMethods } from '@/utils/botBuilder'
import NodePanelBase from '../NodePanelBase'
import { useNodeData } from '../useNodeData'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { createNode, createNodeExit } from '@/redux/slices/agentBuilder/request'
import { toast } from 'react-toastify'
import CaptureResponseInput from './CaptureResponseInput'
import KeyValueInput from './KeyValueInput'
import SectionHeader from './SectionHeader'

const APIPanel = (props: AgentNodePanelProps) => {
  const dispatch = useAppDispatch()
  const { currentFlowId } = useAppSelector(state => state.builder)
  const { selectedNode } = props
  const nodeType = 'API' as NODE_CREATE_TYPE
  const [loading, setLoading] = useState(false)

  const { nodeData, updateField } = useNodeData({
    selectedNode,
    updateNodeData: props.updateNodeData,
  })

  const handleJsonConversion = useCallback(
    (body_data: BodyDataItem[]) => {
      try {
        if (!body_data || !Array.isArray(body_data)) {
          updateField('jsonResponse', '{}')
          return
        }

        const jsonObj: Record<string, any> = {}
        body_data.forEach((item: BodyDataItem) => {
          if (item.key) {
            try {
              jsonObj[item.key] = JSON.parse(item.value)
            } catch {
              jsonObj[item.key] = item.value
            }
          }
        })
        updateField('jsonResponse', JSON.stringify(jsonObj, null, 2))
      } catch (error) {
        updateField('jsonResponse', '{}')
      }
    },
    [updateField]
  )

  useEffect(() => {
    if (
      nodeData?.body_type === BodyTypeEnum.RAW &&
      nodeData?.body_data &&
      !nodeData?.jsonResponse
    ) {
      handleJsonConversion(nodeData.body_data)
    }
  }, [
    nodeData?.body_type,
    nodeData?.body_data,
    nodeData?.jsonResponse,
    handleJsonConversion,
  ])

  const addField = (section: SectionType) => {
    const currentItems = nodeData?.[section] || []
    const newItem =
      section === 'capture_response'
        ? ({ key: '', field_name: '' } as CaptureResponseItem)
        : ({ key: '', value: '' } as BodyDataItem)

    updateField(section, [...currentItems, newItem])
  }

  const removeField = (section: SectionType, index: number) => {
    const currentItems = nodeData?.[section] || []
    updateField(
      section,
      currentItems.filter((_: any, i: number) => i !== index)
    )
  }
  const handleFieldChange = (
    section: SectionType,
    index: number,
    field: string,
    value: string
  ) => {
    const currentItems = nodeData?.[section] || []
    updateField(
      section,
      currentItems.map((item: any, i: number) => {
        if (i !== index) return item
        const updatedItem = { ...item, [field]: value }

        if (field === 'field_name' && value) {
          delete updatedItem.value
        }

        if (field === 'value' && value) {
          delete updatedItem.field_name
        }

        return updatedItem
      })
    )
  }

  const processFormNodeData = () => {
    const properties = { ...nodeData }
    if (properties.body_type === BodyTypeEnum.RAW) {
      try {
        if (properties.jsonResponse) {
          const parsedJson = JSON.parse(properties.jsonResponse)

          const keyValuePairs = Object.entries(parsedJson).map(
            ([key, value]) => ({
              key,
              value:
                typeof value === 'object'
                  ? JSON.stringify(value)
                  : String(value),
            })
          )

          properties.body_data = keyValuePairs
        }
        delete properties.jsonResponse
        return properties
      } catch (error) {
        console.error('Error processing JSON data:', error)
        return null
      }
    }
    return properties
  }

  const handleNodeExitCreate = async (
    id: string,
    value: 'success' | 'fail'
  ) => {
    try {
      const exitData = {
        flowId: currentFlowId,
        nodeId: id,
        data: {
          properties: {
            name: 'status',
            value,
          },
          node_type: selectedNode.type,
        },
      }
      await dispatch(createNodeExit(exitData))
    } catch (error) {
      toast.error('Failed to create node exit')
    }
  }

  const prepareNodeData = (): { properties: any } | null => {
    const properties = processFormNodeData()
    if (!properties) {
      toast.error('Invalid JSON in RAW body')
      return null
    }

    if (properties.use_mock) {
      if (!properties.mock_response) {
        toast.error('Mock response has to be specified')
        return null
      }

      let parsedMockResponse = properties.mock_response
      if (typeof properties.mock_response === 'string') {
        try {
          parsedMockResponse = JSON.parse(properties.mock_response)
          properties.mock_response = parsedMockResponse
        } catch (error) {
          toast.error('Invalid JSON in mock response')
          return null
        }
      }

      if (
        Object.keys(parsedMockResponse).length < 1 ||
        Object.values(parsedMockResponse).length === 0
      ) {
        toast.error('Mock response must contain at least one key')
        return null
      }
    }

    return { properties }
  }

  const handleNodeSave = async (): Promise<boolean | undefined> => {
    try {
      setLoading(true)
      const result = prepareNodeData()
      if (!result) {
        setLoading(false)
        return
      }

      const data = {
        properties: result.properties,
        type: nodeType,
        agent_builder_properties: {
          position: selectedNode.position,
        },
      }

      const response = await dispatch(
        createNode({ flowId: currentFlowId, data })
      ).unwrap()

      if (response?.id) {
        await handleNodeExitCreate(response.id, 'success')
        await handleNodeExitCreate(response.id, 'fail')
      }
      setLoading(false)
      props.onClose && props.onClose(false)
      return true
    } catch (error) {
      setLoading(false)
    }
  }

  const handleNodeUpdate = async (): Promise<boolean | undefined> => {
    try {
      setLoading(true)
      const result = prepareNodeData()
      if (!result) {
        setLoading(false)
        return
      }

      const data: UpdateNodeRequestType = {
        flowId: currentFlowId,
        nodeId: selectedNode.id,
        data: {
          properties: result.properties,
          type: nodeType,
          agent_builder_properties: {
            position: selectedNode.position,
          },
        },
      }

      await props.submitUpdate(data)
      setLoading(false)
      return true
    } catch (error: any) {
      setLoading(false)
      toast.error(error?.message || 'Failed to update API node')
    }
  }

  const renderFieldsSection = () => (
    <div>
      {/* URL and method */}
      <div className='flex gap-2 items-center mb-4 p-2 border border-gray-200 rounded-lg'>
        <select
          value={nodeData?.method ?? ''}
          onChange={e => updateField('method', e.target.value)}
          className='bg-transparent font-medium text-gray-700 cursor-pointer outline-none'
        >
          {agentAPIMethods.map(item => (
            <option
              key={item.value}
              value={item.value}
              disabled={item.value === ''}
            >
              {item.label}
            </option>
          ))}
        </select>
        <input
          type='text'
          onChange={e => updateField('url', e.target.value)}
          value={nodeData?.url || ''}
          placeholder='Input Request URL'
          className='flex-1 bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none'
        />
      </div>

      {/* Headers Section */}
      <div className='mb-4'>
        <SectionHeader title='Headers' onAddClick={() => addField('headers')} />
        {nodeData?.headers?.map((header: BodyDataItem, index: number) => (
          <KeyValueInput
            key={index}
            item={header}
            index={index}
            section='headers'
            onFieldChange={handleFieldChange}
            onRemove={removeField}
          />
        ))}
      </div>

      {/* URL Parameters Section */}
      <div className='mb-4'>
        <SectionHeader
          title='Parameters'
          onAddClick={() => addField('url_params')}
        />
        {nodeData?.url_params?.map((param: BodyDataItem, index: number) => (
          <KeyValueInput
            key={index}
            item={param}
            index={index}
            section='url_params'
            onFieldChange={handleFieldChange}
            onRemove={removeField}
            keyPlaceholder='Enter parameter key'
          />
        ))}
      </div>

      {/* Body Section */}
      <div className='border-t border-b border-gray-300 py-4 mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-md font-medium text-gray-800'>Body</h3>
        </div>
        <div className='flex gap-4 mb-3'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              checked={nodeData?.body_type === BodyTypeEnum.FORM_DATA}
              onChange={() => updateField('body_type', BodyTypeEnum.FORM_DATA)}
              className='text-blue-500 w-4 h-4'
            />
            <span className='text-gray-700'>Form Data</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              checked={nodeData?.body_type === BodyTypeEnum.URL_ENCODED}
              onChange={() =>
                updateField('body_type', BodyTypeEnum.URL_ENCODED)
              }
              className='text-blue-500 w-4 h-4'
            />
            <span className='text-gray-700'>URL Encoded</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              checked={nodeData?.body_type === BodyTypeEnum.RAW}
              onChange={() => updateField('body_type', BodyTypeEnum.RAW)}
              className='text-blue-500 w-4 h-4'
            />
            <span className='text-gray-700'>Raw</span>
          </label>
        </div>

        {nodeData?.body_type === BodyTypeEnum.RAW && (
          <div className='border rounded-lg overflow-hidden'>
            <div className='h-48'>
              <Editor
                height='100%'
                defaultLanguage='json'
                value={nodeData?.jsonResponse || '{}'}
                onChange={val => {
                  updateField('jsonResponse', val || '{}')
                }}
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
            <div className='p-2 text-xs text-gray-500'>
              Enter a valid JSON body like you would in Postman
            </div>
          </div>
        )}

        {(nodeData?.body_type === BodyTypeEnum.FORM_DATA ||
          nodeData?.body_type === BodyTypeEnum.URL_ENCODED) && (
          <>
            {nodeData?.body_data?.map((field: BodyDataItem, index: number) => (
              <KeyValueInput
                key={index}
                item={field}
                index={index}
                section='body_data'
                onFieldChange={handleFieldChange}
                onRemove={removeField}
              />
            ))}
            <button
              onClick={() => addField('body_data')}
              className='text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2'
            >
              <FaPlus size={12} />
              <span className='text-sm'>Add field</span>
            </button>
          </>
        )}
      </div>

      {/* Capture Response Section */}
      <div>
        <SectionHeader
          title='Capture Response'
          onAddClick={() => addField('capture_response')}
        />
        {nodeData?.capture_response?.map(
          (response: CaptureResponseItem, index: number) => (
            <CaptureResponseInput
              key={index}
              item={response}
              index={index}
              onFieldChange={handleFieldChange}
              onRemove={removeField}
            />
          )
        )}
      </div>

      {/* Mock Response Section */}
      <div>
        <div className='py-2 flex justify-between'>
          <p className='flex items-center'>Enable Mock</p>
          <button
            onClick={() => updateField('use_mock', !nodeData?.use_mock)}
            className={`float-right cursor-pointer border-none rounded-md px-2.5 py-1 text-white ${
              nodeData?.use_mock ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            {nodeData?.use_mock ? 'On' : 'Off'}
          </button>
        </div>
        {nodeData?.use_mock && (
          <div className='bg-gray-100 p-2 rounded-md'>
            <Editor
              height='300px'
              defaultLanguage='json'
              value={
                typeof nodeData?.mock_response === 'string'
                  ? nodeData?.mock_response
                  : JSON.stringify(nodeData?.mock_response) || ''
              }
              onChange={val => {
                updateField('mock_response', val || '')
              }}
              theme='light'
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                tabSize: 0,
                lineNumbers: 'off',
                automaticLayout: true,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <NodePanelBase
      {...props}
      nodeType={nodeType}
      loading={loading}
      setLoading={setLoading}
      onSave={handleNodeSave}
      onUpdate={handleNodeUpdate}
      renderFieldsSection={renderFieldsSection}
      showName={false}
    >
      <></>
    </NodePanelBase>
  )
}

export default APIPanel
