import { useState } from 'react'
import { AgentNodePanelProps } from '@/types/agent-builder'
import NodePanelBase from './NodePanelBase'

const EndPanel = (props: AgentNodePanelProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <NodePanelBase
      {...props}
      nodeType='ENDING'
      loading={loading}
      setLoading={setLoading}
      showName={true}
    >
      <></>
    </NodePanelBase>
  )
}

export default EndPanel
