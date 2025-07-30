import { AgentNodePanelProps } from '@/types/agent-builder'
import BaseDecisionButtonPanel from './BaseDecisionButtonPanel'

const ButtonsPanel = (props: AgentNodePanelProps) => {
  return (
    <BaseDecisionButtonPanel
      {...props}
      nodeType='BUTTON_DECISION'
      inputPlaceholder='Enter button label'
      addButtonLabel='Button'
      type='button'
    />
  )
}

export default ButtonsPanel
