import { useState } from 'react'
import { useNodeData } from './useNodeData'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import {
  AgentNodePanelProps,
  FieldsToCollectGroup,
} from '@/types/agent-builder'
import { useAppSelector } from '@/hook/useReduxHooks'
import NodePanelBase from './NodePanelBase'
import FieldGroupsManager from '../components/FieldGroupsManager'

const CollectionPanel = (props: AgentNodePanelProps) => {
  const { selectedNode } = props

  const fieldData =
    useAppSelector((state) => state.builder.currentFlowData?.fields) ?? []

  const {
    nodeData,
    addToFieldsArray,
    removeFromFieldsArray,
    updateFieldsArray,
    updateField,
  } = useNodeData({ selectedNode, updateNodeData: props.updateNodeData })

  const [loading, setLoading] = useState(false)

  const addRule = () => {
    const hasEmptyRule = nodeData.rules_to_remember?.some(
      (rule) => !rule.trim()
    )

    if (hasEmptyRule) {
      toast.error('Please fill in the current rule before adding a new one.')
      return
    }

    addToFieldsArray('rules_to_remember', '')
  }

  const removeRule = (ruleToRemove: string) => {
    removeFromFieldsArray('rules_to_remember', (item) => item === ruleToRemove)
  }

  const handleRuleContentChange = (index: number, newValue: string) => {
    updateFieldsArray('rules_to_remember', (currentRules) =>
      currentRules.map((rule, i) => (i === index ? newValue : rule))
    )
  }

  const renderRulesSection = () => (
    <>
      <div className='border-b border-gray-300 pt-2' />

      <div className='flex justify-between'>
        <strong>Rules to Remember</strong>
        <FiPlusCircle className='cursor-pointer' size={20} onClick={addRule} />
      </div>
      {nodeData?.rules_to_remember &&
        nodeData?.rules_to_remember?.length > 0 &&
        nodeData.rules_to_remember.map((item, index) => (
          <div key={index} className='pt-1 flex gap-2 items-center'>
            <div className='py-1.5 bg-gray-100 w-full rounded-md'>
              <input
                onChange={(e) => handleRuleContentChange(index, e.target.value)}
                placeholder='Enter Rule'
                className='bg-gray-100 outline-none px-2 w-full'
                value={item}
              />
            </div>
            <FiMinusCircle
              className='cursor-pointer'
              size={20}
              onClick={() => removeRule(item)}
            />
          </div>
        ))}
    </>
  )

  const removeFieldsGroup = (index: number) => {
    const groups = [...(nodeData.fields_to_collect_groups ?? [])]
    groups.splice(index, 1)
    updateField('fields_to_collect_groups', groups)
  }

  const updateFieldsGroup = (
    index: number,
    updatedGroup: FieldsToCollectGroup
  ) => {
    const groups = [...(nodeData.fields_to_collect_groups ?? [])]
    groups[index] = updatedGroup
    updateField('fields_to_collect_groups', groups)
  }

  const addFieldsGroup = (group: FieldsToCollectGroup) => {
    const updatedGroups = [...(nodeData.fields_to_collect_groups ?? []), group]
    updateField('fields_to_collect_groups', updatedGroups)
  }

  const renderFieldsSection = () => (
    <FieldGroupsManager
      allFields={fieldData}
      initialGroups={nodeData.fields_to_collect_groups}
      addFieldsGroup={addFieldsGroup}
      updateFieldsGroup={updateFieldsGroup}
      removeFieldsGroup={removeFieldsGroup}
    />
  )

  return (
    <NodePanelBase
      {...props}
      nodeType='COLLECTION'
      loading={loading}
      setLoading={setLoading}
      renderFieldsSection={renderFieldsSection}
      showName={true}
      showHowToAsk={true}
      showGeneralInstruction={true}
      checkRootNode={true}
      canCreateNodeExit={true}
    >
      {renderRulesSection()}
    </NodePanelBase>
  )
}

export default CollectionPanel
