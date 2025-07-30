import { AgentNodePanelProps } from '@/types/agent-builder'
import BaseDecisionButtonPanel from './BaseDecisionButtonPanel'

const DecisionPanel = (props: AgentNodePanelProps) => {
  return (
    <BaseDecisionButtonPanel
      {...props}
      nodeType='DECISION'
      inputPlaceholder='Input decision'
      addButtonLabel='Decision'
      type='decision'
    />
  )
}

export default DecisionPanel
