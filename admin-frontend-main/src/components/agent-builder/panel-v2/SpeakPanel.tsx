import { useState } from 'react'
import { AgentNodePanelProps } from '@/types/agent-builder'
import NodePanelBase from './NodePanelBase'

const SpeakPanel = (props: AgentNodePanelProps) => {
  const [loading, setLoading] = useState(false)

  return (
    <NodePanelBase
      {...props}
      nodeType='SPEAK'
      loading={loading}
      setLoading={setLoading}
      showName={true}
      showWhatToSay={true}
      showHowToSayIt={true}
      canCreateNodeExit={true}
    >
      <></>
    </NodePanelBase>
  )
}

export default SpeakPanel
