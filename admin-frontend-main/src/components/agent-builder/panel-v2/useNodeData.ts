import {
  AgentNodeComponentProps,
  NodePropertiesType,
} from '@/types/agent-builder'
import { useState, useEffect } from 'react'

interface UseNodeDataProps {
  selectedNode: AgentNodeComponentProps
  updateNodeData: (id: string, data: NodePropertiesType) => void
}

interface UseNodeDataReturn {
  nodeData: NodePropertiesType
  setNodeData: React.Dispatch<React.SetStateAction<NodePropertiesType>>
  updateField: (fieldName: string, value: any) => void
  updateFieldsArray: (
    fieldName: string,
    updateFn: (currentArray: any[]) => any[]
  ) => void
  addToFieldsArray: (fieldName: string, item: any) => void
  removeFromFieldsArray: (
    fieldName: string,
    predicateFn: (item: any) => boolean
  ) => void
}

export const useNodeData = ({
  selectedNode,
  updateNodeData,
}: UseNodeDataProps): UseNodeDataReturn => {
  const [nodeData, setNodeData] = useState(selectedNode?.data)

  useEffect(() => {
    if (selectedNode?.data) {
      setNodeData(selectedNode.data)
    }
  }, [selectedNode])

  const updateField = (fieldName: string, value: any) => {
    const updatedData = {
      ...nodeData,
      [fieldName]: value,
    }
    setNodeData(updatedData)
    updateNodeData(selectedNode.id, updatedData)
  }

  // Update an array field using a transformation function
  const updateFieldsArray = (
    fieldName: string,
    updateFn: (currentArray: any[]) => any[]
  ) => {
    const currentArray = nodeData[fieldName] || []
    const updatedArray = updateFn(currentArray)

    const updatedData = {
      ...nodeData,
      [fieldName]: updatedArray,
    }

    setNodeData(updatedData)
    updateNodeData(selectedNode.id, updatedData)
  }

  // Add an item to an array field
  const addToFieldsArray = (fieldName: string, item: any) => {
    updateFieldsArray(fieldName, (currentArray) => [...currentArray, item])
  }

  // Remove items from an array field based on a predicate function
  const removeFromFieldsArray = (
    fieldName: string,
    predicateFn: (item: any) => boolean
  ) => {
    updateFieldsArray(fieldName, (currentArray) =>
      currentArray.filter((item) => !predicateFn(item))
    )
  }

  return {
    nodeData,
    setNodeData,
    updateField,
    updateFieldsArray,
    addToFieldsArray,
    removeFromFieldsArray,
  }
}
