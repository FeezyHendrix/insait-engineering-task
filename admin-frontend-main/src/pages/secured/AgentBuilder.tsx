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
  XYPosition,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { IoMdClose } from 'react-icons/io'
import { LuMinimize, LuMaximize } from 'react-icons/lu'
import '@styles/agent-builder.scss'

import FlowSelector from '@/components/agent-builder/components/FlowSelector'
import SaveFlowModal from '@/components/agent-builder/components/SaveFlowModal'
import {
  AddFlowModalActionProp,
  AddFlowModalProp,
  AgentDialogType,
  AgentNodeComponentProps,
  NewFlowType,
  NodePropertiesType,
  PositionChange,
  PositionXYProp,
  UpdateNodeRequestType,
} from '@/types/agent-builder'
import { toast } from 'react-toastify'
import Toolbar from '@/components/agent-builder/components/Toolbar'
import {
  agentBuilderMenuOptions,
  defaultAgentBotViewPort,
  generateAgentNewNode,
  getNodePosition,
} from '@/utils/botBuilder'
import { useTranslation } from 'react-i18next'

import {
  createEdge,
  createEndingNode,
  createNewBuilderFlow,
  deleteBuilderFlow,
  deleteEdge,
  deleteNode,
  duplicateExistingFlow,
  getAgentBuilderFlows,
  getFlowById,
  getFlowSanity,
  updateBuilderFlow,
  updateNode,
} from '@/redux/slices/agentBuilder/request'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import FieldPanel from '@/components/agent-builder/components/FieldPanel'

import constants from '@/utils/constants'
import AgentChat from '@/components/agent-builder/components/AgentChat'
import {
  setCurrentFlowData,
  setSelectedNodeId,
  setCurrentFlowId,
} from '@/redux/slices/agentBuilder'
import ConfirmDialog from '@/components/agent-builder/components/ConfirmDialog'

// PANEL
import ButtonsPanel from '@/components/agent-builder/panel-v2/ButtonsPanel'
import CollectionPanel from '@/components/agent-builder/panel-v2/CollectionPanel'
import DecisionPanel from '@/components/agent-builder/panel-v2/DecisionPanel'
import ConditionPanel from '@/components/agent-builder/panel-v2/ConditionPanel'
import APIPanel from '@/components/agent-builder/panel-v2/APIPanel'
import SpeakPanel from '@/components/agent-builder/panel-v2/SpeakPanel'

// NODE
import ButtonsNode from '@/components/agent-builder/node-v2/ButtonsNode'
import CollectionNode from '@/components/agent-builder/node-v2/CollectionNode'
import DecisionNode from '@/components/agent-builder/node-v2/DecisionNode'
import ConditionNode from '@/components/agent-builder/node-v2/ConditionNode'
import APINode from '@/components/agent-builder/node-v2/APINode'
import SpeakNode from '@/components/agent-builder/node-v2/SpeakNode'
import EndNode from '@/components/agent-builder/node-v2/EndNode'
import FlowGuidelinesPanel from '@/components/agent-builder/components/FlowGuidelinesPanel'

const { AGENT_INSAIT_INIT_URL } = constants

const BoardPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reactFlowWrapper = useRef(null)

  const {
    flows,
    currentFlowId,
    currentFlowData,
    selectedNodeId,
    loading: requestLoading,
    botUserId,
  } = useAppSelector((state) => state.builder)
  const [nodes, setNodes] = useState<AgentNodeComponentProps[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const [showAddFlowModal, setShowAddFlowModal] = useState<AddFlowModalProp>({
    status: false,
    action: 'none',
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dialog, setDialog] = useState<AgentDialogType>({
    open: false,
    type: '',
    action: '',
    id: '',
  })

  const [selectedNode, setSelectedNode] =
    useState<AgentNodeComponentProps | null>(null)

  const { screenToFlowPosition } = useReactFlow()

  const handleCloseFlowModal = () => {
    setShowAddFlowModal({ status: false, action: 'none' })
  }

  useEffect(() => {
    if (selectedNodeId) {
      const id = selectedNodeId ?? selectedNode?.id
      const nodeSelected = nodes.filter((item) => item.id === id)[0]
      if (nodeSelected?.id) {
        setSelectedNode(nodeSelected)
      }
    } else {
      setSelectedNode(null)
    }
  }, [nodes, selectedNodeId])

  useEffect(() => {
    if (flows.length && !currentFlowId) {
      const flowId = flows[0].id
      dispatch(setCurrentFlowId(flowId))
    }
  }, [flows])

  useEffect(() => {
    const fetchAllFlows = () => {
      dispatch(getAgentBuilderFlows())
    }
    fetchAllFlows()
  }, [])

  useEffect(() => {
    const fetchCurrentFlow = () => {
      dispatch(getFlowById(currentFlowId))
      handleCloseFlowModal()
    }

    if (currentFlowId) {
      fetchCurrentFlow()
    } else {
      saveCurrentFlow()
    }
  }, [currentFlowId])

  useEffect(() => {
    loadFlow()
  }, [currentFlowData])

  const loadFlow = () => {
    if (currentFlowData) {
      dispatch(getFlowSanity(currentFlowId))
      setNodes(
        currentFlowData?.nodes.map((item, index: number) => {
          const position = getNodePosition(
            index,
            item?.agent_builder_properties?.position
          )

          return {
            ...item,
            position,
            data: item?.properties || {},
          }
        }) || []
      )
      setEdges(
        currentFlowData?.edges.map((item) => {
          const sourceId = currentFlowData.node_exits.find(
            (ne) => ne.id === item.node_exit_id
          )?.node_id

          return {
            id: item.id,
            source: sourceId || '',
            target: item.child_node_id,
            sourceHandle: item.node_exit_id,
          }
        }) || []
      )
    } else {
      setNodes([])
      setEdges([])
    }
  }

  const handleNewFlow = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmNew = window.confirm(t('agentBuilder.unsavedChanges'))
      if (!confirmNew) {
        return
      }
    }
    dispatch(setCurrentFlowId(''))
    dispatch(setCurrentFlowData(null))
    setHasUnsavedChanges(false)
  }, [hasUnsavedChanges])

  const saveFlow = useCallback(
    async (newFlow: NewFlowType, action: AddFlowModalActionProp) => {
      const request =
        currentFlowId && action === 'duplicate'
          ? await dispatch(
              duplicateExistingFlow({
                data: { name: newFlow.name },
                flowId: currentFlowId,
              })
            )
          : currentFlowId && action === 'edit'
          ? await dispatch(
              updateBuilderFlow({ data: newFlow, flowId: currentFlowId })
            )
          : await dispatch(createNewBuilderFlow(newFlow))
      const response = request.payload

      if (response?.message) {
        toast.error(response.message)
        return
      }

      toast.info(t('agentBuilder.infoStored'))
      handleCloseFlowModal()
      setHasUnsavedChanges(false)
    },
    [currentFlowId, nodes, edges]
  )

  const saveCurrentFlow = () => {
    if (currentFlowId) {
      handleUpdateCurrentFlow()
    } else {
      setShowAddFlowModal({ status: true, action: 'add' })
    }
  }

  const handleUpdateCurrentFlow = () => {
    toast.success('Flow updated successfully')
  }

  const handleDuplicateCurrentFlow = () => {
    if (!currentFlowId) {
      toast.error('Current Flow is not saved')
      return
    }
    setShowAddFlowModal({ status: true, action: 'duplicate' })
  }

  const updateNodeData = (id: string, newData: Partial<NodePropertiesType>) => {
    setNodes((prevNodes) => {
      const newNodes = prevNodes.map((node) =>
        node.id === id
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

  const handleCreateNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      if (!nodeType) {
        toast.error(`Invalid node type ${nodeType}`)
        return
      }

      if (!currentFlowId) {
        toast.error(`You need to save this flow first before creating a node`)
        return
      }

      const count = nodes.reduce((acc, node) => {
        if (node.data?.name?.includes(nodeType)) {
          return acc + 1
        }
        return acc
      }, 1)

      const newNode = generateAgentNewNode(nodeType, count, position)
      if (newNode.type === 'ENDING') {
        dispatch(
          createEndingNode({
            flowId: currentFlowId,
            position: newNode.position,
          })
        )
        return
      }
      setNodes((nds) => [...nds, newNode])
      dispatch(setSelectedNodeId(newNode.id))
    },
    [currentFlowId, nodes.length]
  )

  const addNode = useCallback(
    (nodeType: string, mousePosition: PositionXYProp) => {
      const position = screenToFlowPosition({
        x: mousePosition.x + 100,
        y: mousePosition.y,
      })
      handleCreateNode(nodeType, position)
    },
    [screenToFlowPosition, handleCreateNode]
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: AgentNodeComponentProps) => {
      if (node.id) {
        dispatch(setSelectedNodeId(node.id))
      }
    },
    []
  )

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: AgentNodeComponentProps) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.button == 2) {
        return
      } else if (event.button == 1) {
        dispatch(setSelectedNodeId(node.id))
      }
    },
    []
  )

  const handleDeleteFlow = (flowId: string) => {
    dispatch(deleteBuilderFlow(flowId))
  }

  const handleEditFlow = () => {
    setShowAddFlowModal({ status: true, action: 'edit' })
  }

  const handleUnsavedChanges = (id: string) => {
    setDialog({
      open: true,
      type: 'unsaved',
      action: 'close',
      id,
    })
  }

  const handleCloseNodePanel = (checkUnsaved: boolean = true) => {
    if (checkUnsaved === false) {
      dispatch(setSelectedNodeId(''))
      return
    }
    if (selectedNode) {
      const isUnsavedNode = /^\d+$/.test(selectedNode.id)
      if (isUnsavedNode) {
        handleUnsavedChanges(selectedNode.id)
        return
      }
    }
    dispatch(setSelectedNodeId(''))
    loadFlow()
  }

  const submitNodeUpdate = async (data: UpdateNodeRequestType) => {
    await dispatch(updateNode(data))
  }

  const updateNodePosition = async (id: string, properties: PositionXYProp) => {
    const node = currentFlowData?.nodes.filter((n) => n.id === id)?.[0]

    if (!node?.id) return

    const updateData = {
      flowId: currentFlowId,
      nodeId: node.id,
      showToast: false,
      data: {
        properties: node.properties,
        type: node.type,
        agent_builder_properties: {
          position: properties,
        },
      },
    }
    submitNodeUpdate(updateData)
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const nodeRemovals = changes.filter(
        (change): change is NodeChange & { type: 'remove' } =>
          change.type === 'remove'
      )

      if (nodeRemovals.length > 0) {
        nodeRemovals.forEach((node) => handleDeleteOperation(node.id, 'node'))
        handleCloseNodePanel()
        return
      }

      const nodePositionMoved = changes.filter(
        (change): change is NodeChange & PositionChange => {
          return change.type === 'position' && change.dragging === false
        }
      )

      if (nodePositionMoved.length > 0) {
        const nodeMoved = nodePositionMoved[0]
        updateNodePosition(nodeMoved.id, nodeMoved.position)
        return
      }

      setNodes(
        (nds) =>
          applyNodeChanges(changes, nds) as unknown as AgentNodeComponentProps[]
      )
    },
    [currentFlowData]
  )

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const edgeRemovals = changes.filter(
      (change): change is EdgeChange & { type: 'remove' } =>
        change.type === 'remove'
    )

    if (edgeRemovals.length > 0) {
      edgeRemovals.forEach((edge) => handleDeleteOperation(edge.id, 'edge'))
      return
    }

    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const nodeType = event.dataTransfer.getData('application/reactflow')

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      handleCreateNode(nodeType, position)
    },
    [screenToFlowPosition, handleCreateNode]
  )

  const resetDialog = () => {
    setDialog({
      open: false,
      type: '',
      action: '',
      id: '',
    })
  }

  const handleDialogConfirm = async () => {
    if (dialog.type === 'unsaved' && dialog.action === 'close') {
      await dispatch(setSelectedNodeId(''))
      await loadFlow()
    } else {
      await processDeleteOperation(dialog.id, dialog.type)
    }
    resetDialog()
  }

  const handleCreateEdge = async (
    source: string,
    target: string,
    sourceHandle?: string | null
  ) => {
    try {
      if (!currentFlowId) {
        toast.error('Save newly created flow to proceed')
        return
      }

      if (sourceHandle) {
        setLoading(true)

        await dispatch(
          createEdge({
            flowId: currentFlowId,
            data: { node_exit_id: sourceHandle, child_node_id: target },
          })
        )
      } else {
        toast.error('Error creating edge')
      }
      setLoading(false)
    } catch (error) {
      toast.error('Error creating edge')
      setLoading(false)
    }
  }

  const onConnect = useCallback(
    (params: Connection) => {
      const hasUnsavedNode =
        /^\d+$/.test(params.source) || /^\d+$/.test(params.target)

      if (hasUnsavedNode) {
        toast.error('Node has to be saved to proceed')
        return
      }

      handleCreateEdge(params.source, params.target, params.sourceHandle)
    },
    [currentFlowId]
  )

  const handleDeleteOperation = async (id: string, type: 'node' | 'edge') => {
    setDialog({
      open: true,
      type,
      action: 'delete',
      id,
    })
  }

  const processDeleteOperation = async (id: string, type: string) => {
    const isUnSavedNodeOrEdge = /^\d+$/.test(id)

    if (isUnSavedNodeOrEdge) {
      if (type === 'node') {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id))
      } else if (type === 'edge') {
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id))
      }
      return
    }

    setLoading(true)

    if (type === 'edge') {
      const nodeEdge = currentFlowData?.edges.find((edg) => edg.id === id)

      if (nodeEdge) {
        await dispatch(deleteEdge({ flowId: currentFlowId, id }))
      }
    }
    if (type === 'node') {
      await dispatch(deleteNode({ flowId: currentFlowId, id }))
    }
    setLoading(false)
  }

  const nodeTypes = useMemo(
    () =>
      ({
        COLLECTION: (props: AgentNodeComponentProps) => {
          return <CollectionNode {...props} updateNodeData={updateNodeData} />
        },
        BUTTON_DECISION: (props: AgentNodeComponentProps) => {
          return <ButtonsNode {...props} updateNodeData={updateNodeData} />
        },
        DECISION: (props: AgentNodeComponentProps) => {
          return <DecisionNode {...props} updateNodeData={updateNodeData} />
        },
        CONDITION: (props: AgentNodeComponentProps) => {
          return <ConditionNode {...props} updateNodeData={updateNodeData} />
        },
        API: (props: AgentNodeComponentProps) => {
          return <APINode {...props} updateNodeData={updateNodeData} />
        },
        SPEAK: (props: AgentNodeComponentProps) => {
          return <SpeakNode {...props} updateNodeData={updateNodeData} />
        },
        ENDING: (props: AgentNodeComponentProps) => {
          return <EndNode {...props} updateNodeData={updateNodeData} />
        },
      } as unknown as NodeTypes),
    []
  )

  const renderNodeComponent = () => {
    if (!selectedNode) return null

    switch (selectedNode.type) {
      case 'COLLECTION':
        return (
          <CollectionPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={handleCloseNodePanel}
            submitUpdate={submitNodeUpdate}
          />
        )
      case 'DECISION':
        return (
          <DecisionPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={handleCloseNodePanel}
            submitUpdate={submitNodeUpdate}
          />
        )
      case 'BUTTON_DECISION':
        return (
          <ButtonsPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={handleCloseNodePanel}
            submitUpdate={submitNodeUpdate}
          />
        )
      case 'CONDITION':
        return (
          <ConditionPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={handleCloseNodePanel}
            submitUpdate={submitNodeUpdate}
          />
        )
      case 'API':
        return (
          <APIPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={handleCloseNodePanel}
            submitUpdate={submitNodeUpdate}
          />
        )
      case 'SPEAK':
        return (
          <SpeakPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onClose={handleCloseNodePanel}
            submitUpdate={submitNodeUpdate}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`flex flex-1 mb-5 ${
        isExpanded
          ? 'fixed right-0 left-0 top-0 bottom-0 z-[99999999] bg-white'
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
            handleCloseNodePanel()
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
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className={`absolute bottom-2 left-14 z-20 flex gap-4 items-end`}>
        <FieldPanel />
        <FlowGuidelinesPanel />
      </div>
      <FlowSelector
        flows={flows}
        currentFlowId={currentFlowId}
        onNewFlow={handleNewFlow}
        saveCurrentFlow={saveCurrentFlow}
        handleDuplicateCurrentFlow={handleDuplicateCurrentFlow}
        onDelete={handleDeleteFlow}
        onEdit={handleEditFlow}
      />

      <SaveFlowModal
        isOpen={showAddFlowModal.status && !requestLoading}
        action={showAddFlowModal.action}
        onClose={() => handleCloseFlowModal()}
        onSave={saveFlow}
      />

      <Toolbar
        data={agentBuilderMenuOptions}
        addNode={addNode}
        showComment={false}
      />
      {selectedNode !== null && (
        <div className='h-full z-20 flex'>
          <IoMdClose
            onClick={() => handleCloseNodePanel()}
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
      <AgentChat userId={botUserId || ''} url={AGENT_INSAIT_INIT_URL} />
      {loading && (
        <div className='absolute top-0 bottom-0 left-0 right-0 bg-gray-900 opacity-50 flex justify-center items-center z-[999999]'>
          <div className='inline-app-loader tex-5xl' />
        </div>
      )}

      <ConfirmDialog
        isOpen={dialog.open}
        title={
          dialog.type === 'unsaved'
            ? 'Unsaved Changes'
            : dialog.type === 'node'
            ? `Delete Node`
            : `Delete Edge`
        }
        description={
          dialog.type === 'unsaved'
            ? 'You have unsaved changes. Are you sure you want to discard the unsaved changes?'
            : `Are you sure you want to delete this ${dialog.type}?`
        }
        onClose={resetDialog}
        onConfirm={handleDialogConfirm}
        isDelete={dialog.action === 'delete'}
        loading={loading}
      />
    </div>
  )
}

const Board = () => {
  return (
    <ReactFlowProvider>
      <BoardPage />
    </ReactFlowProvider>
  )
}

export default Board
