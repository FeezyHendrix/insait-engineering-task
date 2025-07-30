import { useEffect, useState } from 'react'
import { FaQuestion, FaPlus, FaMinus } from 'react-icons/fa'
import Editor from '@monaco-editor/react'
import { NodePanelProps } from '@/types/agent-builder'

const JavascriptPanel = ({
  selectedNode,
  updateNodeData,
  onClose,
}: NodePanelProps) => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)

  const handleChange = (key: string, value: any) => {
    setNodeData(prevData => ({
      ...prevData,
      [key]: value,
    }))
  }

  const addPath = () => {
    const currentPaths = nodeData?.paths || []

    handleUpdateNodeDate('paths', [
      ...currentPaths,
      {
        id: currentPaths.length + 1,
        value: '',
      },
    ])
  }

  const removePath = (id: string) => {
    const filteredSection = nodeData.paths?.filter(item => item.id !== id)
    handleUpdateNodeDate('paths', filteredSection)
  }

  const handleUpdateNodeDate = (key: string, value: any) => {
    const newNode = {
      ...nodeData,
      [key]: value,
    }
    updateNodeData(selectedNode.id, newNode)
  }

  const updatePath = (id: string, value: string) => {
    setNodeData(prevNodeData => {
      const currentNodeDataPath = prevNodeData?.paths || []
      return {
        ...prevNodeData,
        paths: currentNodeDataPath.map(path =>
          path.id === id ? { ...path, value: value } : path
        ),
      }
    })
  }

  const handleSubmitData = () => {
    updateNodeData(selectedNode.id, nodeData)
  }

  const handleClose = () => {
    handleSubmitData()
    onClose && onClose()
  }

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  return (
    <div className='w-[400px] bg-white p-6 border-l border-gray-200 h-full overflow-y-auto flex flex-col'>
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>Javascript</h2>

      {/* Code Editor Section */}
      <div className='mb-6'>
        <div className='bg-gray-900 rounded-lg overflow-hidden'>
          <div className='flex justify-between items-center p-2 border-b border-gray-700'>
            <span className='text-white text-sm'>Javascript</span>
            <div className='flex gap-2'>
              <button
                className='text-gray-400 hover:text-gray-200'
                title='Help'
              >
                <FaQuestion size={14} />
              </button>
            </div>
          </div>
          <Editor
            height='300px'
            defaultLanguage='javascript'
            theme='vs-dark'
            value={nodeData?.javascript}
            onChange={value => handleChange('javascript', value)}
            // onBlur={handleSubmitData}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Paths Section */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium text-gray-800'>Paths</h3>
          <button
            onClick={addPath}
            className='text-blue-500 hover:text-blue-600'
          >
            <FaPlus size={16} />
          </button>
        </div>

        <div className='space-y-4'>
          {nodeData?.paths &&
            nodeData?.paths?.length > 0 &&
            nodeData?.paths.map(path => (
              <div key={path.id} className='flex items-start gap-2'>
                <div className='flex-1'>
                  <input
                    type='text'
                    value={path.value}
                    onBlur={handleSubmitData}
                    onChange={e => updatePath(path.id, e.target.value)}
                    placeholder='Enter path name'
                    className='w-full p-2 border border-gray-200 rounded-md'
                    disabled={path.value === 'Default' || path.value === 'Fail'}
                  />
                </div>
                <button
                  onClick={() => removePath(path.id)}
                  className='text-gray-400 hover:text-gray-600 mt-2'
                >
                  <FaMinus size={16} />
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className='mt-6 flex justify-end items-end flex-1'>
        <button
          className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2'
          onClick={handleClose}
        >
          Save Request
        </button>
      </div>
    </div>
  )
}

export default JavascriptPanel
