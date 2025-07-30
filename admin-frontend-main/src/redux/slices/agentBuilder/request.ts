import { createAsyncThunk } from '@reduxjs/toolkit'
import { AgentClient } from '@/utils/network'
import { handleNetworkError } from '@/utils'
import {
  EntityRequest,
  CreateEntityRequest,
  NewFlowType,
  FieldPropertiesType,
  CreateNodeRequest,
  CreateEdgePropertiesType,
  CreateEdgeRequest,
  UpdateNodeRequestType,
  UpdateFieldRequestType,
  DuplicateFlowRequest,
  UpdateFlowRequest,
  CreateNodeExitRequest,
  DeleteNodeExitRequest,
  UpdateNodeExitRequest,
  CreateEndingNodeRequest,
} from '@/types/agent-builder'
import { toast } from 'react-toastify'

export const getAgentBuilderFlows = createAsyncThunk(
  'agentBuilder/getAgentBuilderFlows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AgentClient({ method: 'GET', path: `flows/` })
      return response?.flows
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const createNewBuilderFlow = createAsyncThunk(
  'agentBuilder/createNewBuilderFlow',
  async (data: NewFlowType, { dispatch, rejectWithValue }) => {
    try {
      const response = await AgentClient({
        method: 'POST',
        path: `flows/`,
        data,
      })
      dispatch(getAgentBuilderFlows())
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const updateBuilderFlow = createAsyncThunk(
  'agentBuilder/updateBuilderFlow',
  async (
    { data, flowId }: UpdateFlowRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'PUT',
        path: `flows/${flowId}`,
        data,
      })
      dispatch(getAgentBuilderFlows())
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const duplicateExistingFlow = createAsyncThunk(
  'agentBuilder/duplicateExistingFlow',
  async (
    { data, flowId }: DuplicateFlowRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'POST',
        path: `flows/duplicate/${flowId}`,
        data,
      })
      dispatch(getAgentBuilderFlows())
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const deleteBuilderFlow = createAsyncThunk(
  'agentBuilder/deleteBuilderFlow',
  async (id: string, { dispatch, rejectWithValue }: any) => {
    try {
      const response = await AgentClient({
        method: 'DELETE',
        path: `flows/${id}`,
      })
      dispatch(getAgentBuilderFlows())
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const getFlowById = createAsyncThunk(
  'agentBuilder/getFlowById',
  async (flowId: string, { rejectWithValue }) => {
    try {
      const response = await AgentClient({
        method: 'GET',
        path: `flows/${flowId}`,
      })
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const getFlowSanity = createAsyncThunk(
  'agentBuilder/getFlowSanity',
  async (flowId: string, { rejectWithValue }) => {
    try {
      const response = await AgentClient({
        method: 'GET',
        path: `flows/sanity/${flowId}`,
      })
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const createField = createAsyncThunk(
  'fields/createField',
  async (
    { flowId, data }: CreateEntityRequest<FieldPropertiesType>,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'POST',
        path: `fields/${flowId}`,
        data,
      })
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const updateField = createAsyncThunk(
  'fields/updateField',
  async (
    { flowId, fieldId, data }: UpdateFieldRequestType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'PUT',
        path: `fields/${flowId}/${fieldId}`,
        data,
      })
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const deleteField = createAsyncThunk(
  'fields/deleteField',
  async ({ flowId, id }: EntityRequest, { dispatch, rejectWithValue }) => {
    try {
      await AgentClient({
        method: 'DELETE',
        path: `fields/${flowId}/${id}`,
      })
      toast.success('Field deleted successfully')
      dispatch(getFlowById(flowId))
      return id
    } catch (e) {
      const message = handleNetworkError(e)
      toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const createNode = createAsyncThunk(
  'nodes/createNode',
  async (
    { flowId, data }: CreateNodeRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'POST',
        path: `nodes/${flowId}`,
        data: data,
      })
      toast.success('Node saved successfully')
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const createEndingNode = createAsyncThunk(
  'nodes/createEndingNode',
  async (data: CreateEndingNodeRequest, { dispatch, rejectWithValue }) => {
    try {
      const { flowId, position } = data
      const response = await AgentClient({
        method: 'POST',
        path: `nodes/${flowId}`,
        data: {
          properties: {
            name: 'Ending Node',
          },
          type: 'ENDING',
          agent_builder_properties: { position },
        },
      })
      toast.success('Ending Node created successfully')
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const updateNode = createAsyncThunk(
  'nodes/updateNode',
  async (
    { flowId, nodeId, data, showToast = true }: UpdateNodeRequestType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'PUT',
        path: `nodes/${flowId}/${nodeId}`,
        data: data,
      })
      dispatch(getFlowById(flowId))
      if (showToast) toast.success('Node updated successfully')
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      if (showToast) toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const deleteNode = createAsyncThunk(
  'nodes/deleteNode',
  async ({ flowId, id }: EntityRequest, { dispatch, rejectWithValue }) => {
    try {
      await AgentClient({
        method: 'DELETE',
        path: `nodes/${flowId}/${id}`,
      })
      toast.success('Node deleted successfully')
      dispatch(getFlowById(flowId))
      return id
    } catch (e) {
      const message = handleNetworkError(e)
      toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const createEdge = createAsyncThunk(
  'edges/createEdge',
  async (
    { flowId, data }: CreateEdgeRequest<CreateEdgePropertiesType>,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'POST',
        path: `edges/${flowId}`,
        data: data,
      })
      toast.success('Edges saved successfully')
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const createNodeExit = createAsyncThunk(
  'nodeExit/createNodeExit',
  async (
    { flowId, nodeId, data, showToast }: CreateNodeExitRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'POST',
        path: `node-exits/${flowId}/${nodeId}`,
        data: data,
      })
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      if (showToast) toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const updateNodeExit = createAsyncThunk(
  'nodeExit/updateNodeExit',
  async (
    { flowId, nodeId, nodeExitId, data, showToast }: UpdateNodeExitRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'PUT',
        path: `node-exits/${flowId}/${nodeId}/${nodeExitId}`,
        data: data,
      })
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      if (showToast) toast.error(message)
      return rejectWithValue({ message })
    }
  }
)

export const deleteNodeExit = createAsyncThunk(
  'nodeExit/deleteNodeExit',
  async (
    { flowId, nodeId, nodeExitId }: DeleteNodeExitRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await AgentClient({
        method: 'DELETE',
        path: `node-exits/${flowId}/${nodeId}/${nodeExitId}`,
      })
      dispatch(getFlowById(flowId))
      return response
    } catch (e) {
      const message = handleNetworkError(e)
      return rejectWithValue({ message })
    }
  }
)

export const deleteEdge = createAsyncThunk(
  'edges/deleteEdge',
  async ({ flowId, id }: EntityRequest, { dispatch, rejectWithValue }) => {
    try {
      await AgentClient({
        method: 'DELETE',
        path: `edges/${flowId}/${id}`,
      })
      toast.success('Edge deleted successfully')
      dispatch(getFlowById(flowId))
      return id
    } catch (e) {
      const message = handleNetworkError(e)
      toast.error(message)
      return rejectWithValue({ message })
    }
  }
)
