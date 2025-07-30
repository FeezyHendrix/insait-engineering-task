import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  DragEvent,
} from 'react'
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider,
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
  NodeTypes,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { IoMdClose } from 'react-icons/io'
import { LuMinimize, LuMaximize } from 'react-icons/lu'
import '@styles/agent-builder.scss'

import FlowSelector from '@/components/agent-builder/components/FlowSelector'
import SaveFlowModal from '@/components/agent-builder/components/SaveFlowModal'
import APINode from '@/components/agent-builder/node/APINode'
import ButtonsNode from '@/components/agent-builder/node/ButtonsNode'
import CaptureNode from '@/components/agent-builder/node/CaptureNode'
import ClientUploadNode from '@/components/agent-builder/node/ClientUploadNode'
import CommentNode from '@/components/agent-builder/node/CommentNode'
import ConditionNode from '@/components/agent-builder/node/ConditionNode'
import ImageNode from '@/components/agent-builder/node/ImageNode'
import JavascriptNode from '@/components/agent-builder/node/JavascriptNode'
import MessageNode from '@/components/agent-builder/node/MessageNode'
import NoteNode from '@/components/agent-builder/node/NoteNode'
import PromptNode from '@/components/agent-builder/node/PromptNode'
import PromptNodeWindow from '@/components/agent-builder/panel/PromptNodeWindow'
import {
  Flow,
  FunctionDataProps,
  NewFlowType,
  NodeComponentProps,
  NodeDataProps,
  PositionXYProp,
  VariableDataProps,
} from '@/types/agent-builder'
import APIPanel from '@/components/agent-builder/panel/APIPanel'
import ButtonsPanel from '@/components/agent-builder/panel/ButtonsPanel'
import CaptureRightPanel from '@/components/agent-builder/panel/CaptureRightPanel'
import ClientUploadPanel from '@/components/agent-builder/panel/ClientUploadPanel'
import CommentPanel from '@/components/agent-builder/panel/CommentPanel'
import ConditionPanel from '@/components/agent-builder/panel/ConditionPanel'
import ImagePanel from '@/components/agent-builder/panel/ImagePanel'
import JavascriptPanel from '@/components/agent-builder/panel/JavascriptPanel'
import MessagePanel from '@/components/agent-builder/components/MessagePanel'
import PromptRightPanel from '@/components/agent-builder/panel/PromptRightPanel'
import VariablePanel from '@/components/agent-builder/components/VariantPanel'
import { toast } from 'react-toastify'
import Toolbar from '@/components/agent-builder/components/Toolbar'
import {
  agentBuilderColorSelectionOption,
  defaultAgentBotViewPort,
  demoMenu,
  edgeConfig,
  generateInitialFlowNode,
  generateNewNode,
} from '@/utils/botBuilder'
import { useTranslation } from 'react-i18next'

import { getAgentBuilderFlows } from '@/redux/slices/agentBuilder/request'
import { useAppDispatch } from '@/hook/useReduxHooks'
import FunctionPanel from '@/components/agent-builder/components/FunctionPanel'
import CarouselNode from '@/components/agent-builder/node/CarouselNode'
import CarouselPanel from '@/components/agent-builder/panel/CarouselPanel'

const BoardPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [nodes, setNodes] = useState<NodeComponentProps[]>(
    generateInitialFlowNode()
  )
  const [edges, setEdges] = useState<Edge[]>([])
  const [flows, setFlows] = useState<Flow[]>([])
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null)
  const [showAddFlowModal, setShowAddFlowModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const [isInitialized, setIsInitialized] = useState(false)
  const reactFlowWrapper = useRef(null)
  const [selectedNode, setSelectedNode] = useState<NodeComponentProps | null>(
    null
  )
  const [selectedNodeId, setSelectedNodeId] = useState('')

  const [contextMenuPosition, setContextMenuPosition] =
    useState<PositionXYProp | null>(null)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const [variableData, setVariableData] = useState<VariableDataProps[]>([])
  const [functionData, setFunctionData] = useState<FunctionDataProps[]>([])
  const { screenToFlowPosition } = useReactFlow()

  const STORAGE_KEY = 'flow-builder-state'

  useEffect(() => {
    if (selectedNode) {
      const nodeSelected = nodes.filter(
        (item) => item.id === selectedNode.id
      )[0]
      if (nodeSelected?.id) {
        setSelectedNode(nodeSelected)
      }
    }
  }, [nodes])

  useEffect(() => {
    const savedFlows = localStorage.getItem(`${STORAGE_KEY}-botFlows`)

    if (savedFlows) {
      const parsedFlow = JSON.parse(savedFlows)
      setFlows(parsedFlow)
      loadFlow(parsedFlow[0]?.id)
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    const savedFlows = localStorage.getItem(`${STORAGE_KEY}-botFlows`)
    if (savedFlows) {
      setFlows(JSON.parse(savedFlows))
    }
  }, [])

  useEffect(() => {
    if (isInitialized) {
      setHasUnsavedChanges(true)
    }
  }, [nodes, edges, variableData])

  useEffect(() => {
    if (flows.length && !currentFlowId) {
      loadFlow(flows[0].id)
    }
  }, [flows])

  const loadFlow = (flowId: string) => {
    const flow = flows.find((f) => f.id === flowId)
    if (flow) {
      setNodes(flow?.nodes || [])
      setEdges(flow?.edges || [])
      setVariableData(flow?.variableData || [])
      setFunctionData(flow.functionData)
      setCurrentFlowId(flow.id)
      setHasUnsavedChanges(false)
    }
  }

  const handleNewFlow = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmNew = window.confirm(t('agentBuilder.unsavedChanges'))
      if (!confirmNew) {
        return
      }
    }
    const newFlow = generateInitialFlowNode()

    setNodes(newFlow)
    setEdges([])
    setVariableData([])
    setFunctionData([])
    setCurrentFlowId(null)
    setHasUnsavedChanges(false)
  }, [hasUnsavedChanges])

  const saveFlow = useCallback(
    (flowObj: NewFlowType) => {
      const isExistingFlow =
        typeof currentFlowId === 'string' && currentFlowId.length

      const newFlow = {
        id: isExistingFlow ? currentFlowId : Date.now().toString(),
        name: flowObj.name,
        nodes,
        variableData,
        functionData,
        edges,
        tenant_id: '',
        created_at: '',
      }

      setFlows((prevFlows) => {
        const updatedFlows = isExistingFlow
          ? prevFlows.map((f) => (f.id === currentFlowId ? newFlow : f))
          : [...prevFlows, newFlow]

        localStorage.setItem(
          `${STORAGE_KEY}-botFlows`,
          JSON.stringify(updatedFlows)
        )
        return updatedFlows
      })
      toast.info(t('agentBuilder.infoStored'))
      setCurrentFlowId(newFlow.id)
      setShowAddFlowModal(false)
      setHasUnsavedChanges(false)
    },
    [currentFlowId, nodes, edges, variableData]
  )

  const saveCurrentFlow = () => {
    if (currentFlowId) {
      const getCurrentFlowName =
        flows.filter((item) => item.id === currentFlowId)[0].name || ''
      const data = {
        name: getCurrentFlowName,
        properties: {
          company: '',
          country: '',
          first_message: '',
          how_to_react_to_not_knowing: '',
          system_prompt: '',
          bot_nickname: '',
          time_format: '',
          date_format: '',
          use_knowledge_base: false,
          guidelines: undefined,
        },
      }
      saveFlow(data)
    } else {
      setShowAddFlowModal(true)
    }
  }

  const handleDuplicateCurrentFlow = () => {
    if (!currentFlowId) {
      toast.error(t('agentBuilder.noFlowToDuplicate'))
      return
    }
    setShowAddFlowModal(true)
  }

  const clearStorage = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY}-variables`)
    localStorage.removeItem(`${STORAGE_KEY}-botFlows`)
    setNodes([])
    setEdges([])
    setVariableData([])
    setFunctionData([])
    toast.info(t('agentBuilder.storageCleared'))
  }, [])

  const updateNodeData = (nodeId: string, newData: Partial<NodeDataProps>) => {
    setNodes((prevNodes) => {
      const newNodes = prevNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          : node
      )
      return newNodes
    })
  }

  const nodeTypes = useMemo(
    () =>
      ({
        Message: (props: NodeComponentProps) => (
          <MessageNode {...props} updateNodeData={updateNodeData} />
        ),
        Transition: (props: NodeComponentProps) => (
          <PromptNode {...props} updateNodeData={updateNodeData} />
        ),
        Collection: (props: NodeComponentProps) => (
          <CaptureNode {...props} updateNodeData={updateNodeData} />
        ),
        ClientUpload: (props: NodeComponentProps) => (
          <ClientUploadNode {...props} updateNodeData={updateNodeData} />
        ),
        API: (props: NodeComponentProps) => (
          <APINode {...props} updateNodeData={updateNodeData} />
        ),
        Buttons: (props: NodeComponentProps) => (
          <ButtonsNode {...props} updateNodeData={updateNodeData} />
        ),
        Condition: (props: NodeComponentProps) => (
          <ConditionNode {...props} updateNodeData={updateNodeData} />
        ),
        Note: (props: NodeComponentProps) => (
          <NoteNode {...props} updateNodeData={updateNodeData} />
        ),
        Comment: (props: NodeComponentProps) => (
          <CommentNode {...props} updateNodeData={updateNodeData} />
        ),
        Image: (props: NodeComponentProps) => (
          <ImageNode {...props} updateNodeData={updateNodeData} />
        ),
        File: (props: NodeComponentProps) => (
          <ImageNode {...props} updateNodeData={updateNodeData} />
        ),
        Carousel: (props: NodeComponentProps) => (
          <CarouselNode {...props} updateNodeData={updateNodeData} />
        ),
        Javascript: (props: NodeComponentProps) => (
          <JavascriptNode {...props} updateNodeData={updateNodeData} />
        ),
      } as unknown as NodeTypes),
    []
  )

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds: Edge[]) =>
        addEdge(
          {
            ...params,
            ...edgeConfig,
          },
          eds
        )
      ),
    []
  )

  const addNode = useCallback(
    (label: string, mousePosition: PositionXYProp) => {
      const position = screenToFlowPosition({
        x: mousePosition.x + 100,
        y: mousePosition.y,
      })
      const count = nodes.reduce((acc, node) => {
        if (node.data.label.includes(label)) {
          return acc + 1
        }
        return acc
      }, 1)

      const newNode = generateNewNode(label, count, position, nodes?.length)
      setNodes((nds) => [...nds, newNode])
    },
    [nodes.length]
  )

  const editNodeColor = useCallback((id: string, newColor: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                style: { ...node.data.style, backgroundColor: newColor },
              },
            }
          : node
      )
    )
  }, [])

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: NodeComponentProps) => {
      setSelectedNode(
        (prevNode: NodeComponentProps | null): NodeComponentProps | null => {
          if (prevNode && prevNode.id) {
            return node
          }
          return node
        }
      )
      setContextMenuPosition(null)
    },
    []
  )

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: NodeComponentProps) => {
      event.preventDefault()
      event.stopPropagation()
      setSelectedNodeId(node.id)
      setContextMenuPosition({ x: event.clientX - 200, y: event.clientY - 200 })
      if (event.button == 2) {
      } else if (event.button == 1) {
        setSelectedNode(node)
      }
    },
    []
  )

  const handleColorChange = (color: string) => {
    editNodeColor(selectedNodeId, color)
    setContextMenuPosition(null)
  }

  const handleExtendWindow = () => {
    setIsOpenModal((prevState) => !prevState)
  }

  const onClose = () => {
    setSelectedNode(null)
  }

  const handlePlay = () => {
    toast.info(t('agentBuilder.comingSoon'))
  }

  const handleDelay = () => {
    toast.info(t('agentBuilder.comingSoon'))
  }

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const nodeRemovals = changes.filter(
      (change): change is NodeChange & { type: 'remove' } =>
        change.type === 'remove'
    )
    if (nodeRemovals.length > 0) {
      setSelectedNode(null)
    }
    setNodes(
      (nds: NodeComponentProps[]) =>
        applyNodeChanges(changes, nds) as unknown as NodeComponentProps[]
    )
  }, [])

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    []
  )

  const renderNodeComponent = () => {
    if (!selectedNode) return null

    switch (selectedNode.type) {
      case 'Transition':
        return isOpenModal ? (
          <PromptNodeWindow
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            handlePlay={handlePlay}
            handleDelay={handleDelay}
            handleExtendWindow={handleExtendWindow}
            isOpenModal={isOpenModal}
          />
        ) : (
          <PromptRightPanel
            selectedNode={selectedNode}
            handlePlay={handlePlay}
            handleDelay={handleDelay}
            updateNodeData={updateNodeData}
            variableData={variableData}
            handleExtendWindow={handleExtendWindow}
            onClose={onClose}
          />
        )

      case 'Message':
        return (
          <MessagePanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            characters={variableData?.map((item) => item.value)}
            onClose={onClose}
          />
        )

      case 'API':
        return (
          <APIPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            variableData={variableData}
            onClose={onClose}
          />
        )

      case 'Buttons':
        return (
          <ButtonsPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
          />
        )

      case 'Collection':
        return (
          <CaptureRightPanel
            variableData={variableData}
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={onClose}
          />
        )
      case 'ClientUpload':
        return (
          <ClientUploadPanel
            variableData={variableData}
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={onClose}
          />
        )

      case 'Condition':
        return (
          <ConditionPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            variableData={variableData}
            onClose={onClose}
          />
        )
      case 'Javascript':
        return (
          <JavascriptPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={onClose}
          />
        )
      case 'Comment':
        return (
          <CommentPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
          />
        )
      case 'Image':
      case 'File':
        return (
          <ImagePanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={onClose}
          />
        )
      case 'Carousel':
        return (
          <CarouselPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={onClose}
          />
        )
      default:
        return null
    }
  }

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const nodeType = event.dataTransfer.getData('application/reactflow')

      if (!nodeType) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const count = nodes.reduce((acc, node) => {
        if (node.data.label.includes(nodeType)) {
          return acc + 1
        }
        return acc
      }, 1)
      const newNode = generateNewNode(nodeType, count, position, nodes?.length)
      setNodes((nds) => [...nds, newNode])
    },
    [screenToFlowPosition, nodes]
  )

  return (
    <div
      className={`flex flex-1 mb-5 w-full ${
        isExpanded
          ? 'fixed right-0 left-0 top-0 bottom-0 z-[999999999] bg-white'
          : 'relative'
      }`}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onClick={(e) => {
          const target = e.target as HTMLElement
          const isPanelClick = target.classList?.contains('react-flow__pane')
          if (isPanelClick) {
            setSelectedNode(null)
            setContextMenuPosition(null)
          }
        }}
        fitView={false}
        nodeTypes={nodeTypes}
        style={{ backgroundColor: '#ffffffa8' }}
        nodesDraggable={true}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={onNodeContextMenu}
        defaultViewport={defaultAgentBotViewPort}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className={`absolute bottom-2 left-14 z-20 flex gap-4 items-end`}>
        <VariablePanel
          variableData={variableData}
          functionData={functionData}
          setVariableData={setVariableData}
        />
        <FunctionPanel
          functionData={functionData}
          setFunctionData={setFunctionData}
        />
      </div>
      {contextMenuPosition && (
        <div
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
          className={`absolute bg-white rounded-lg shadow-lg z-50 px-3 py-2 border border-[#e0e0e0]`}
        >
          <div className='flex justify-between items-center gap-1'>
            {agentBuilderColorSelectionOption.map(({ color, label }) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                aria-label={`Select ${label}`}
                className={`border-2 border-white rounded-full w-[36px] h-[36px] cursor-pointer transition-all duration-200 ease-in-out shadow-md outline-none transform hover:scale-110 hover:shadow-lg focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]`}
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <FlowSelector
        flows={flows}
        currentFlowId={currentFlowId}
        onFlowSelect={loadFlow}
        onNewFlow={handleNewFlow}
        saveCurrentFlow={saveCurrentFlow}
        handleDuplicateCurrentFlow={handleDuplicateCurrentFlow}
        onDelete={clearStorage}
      />

      <SaveFlowModal
        isOpen={showAddFlowModal}
        action={
          typeof currentFlowId === 'string' && currentFlowId.length > 0
            ? 'duplicate'
            : 'add'
        }
        onClose={() => setShowAddFlowModal(false)}
        onSave={saveFlow}
      />

      <Toolbar data={demoMenu} addNode={addNode} />
      {selectedNode !== null && (
        <div className='h-full z-20 flex'>
          <IoMdClose
            onClick={() => setSelectedNode(null)}
            className='absolute right-2 text-xl top-2 cursor-pointer'
          />
          {renderNodeComponent()}
        </div>
      )}

      <div className='flex absolute bottom-[25px] right-4'>
        <button
          className='text-xl'
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? <LuMinimize /> : <LuMaximize />}
        </button>
      </div>
    </div>
  )
}

const DemoAgentBuilder = () => {
  return (
    <ReactFlowProvider>
      <BoardPage />
    </ReactFlowProvider>
  )
}

export default DemoAgentBuilder
