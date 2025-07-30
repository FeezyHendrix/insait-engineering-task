import { RiSpeakLine } from 'react-icons/ri'
import BaseNode from './BaseNode'
import { AgentNodeComponentProps } from '@/types/agent-builder'
import { useEffect, useState } from 'react'

const SpeakNode = (props: AgentNodeComponentProps) => {
  const [nodeData, setNodeData] = useState(props.data)
  useEffect(() => {
    if (props.data) {
      setNodeData(props.data)
    }
  }, [props.data])

  return (
    <BaseNode
      defaultMessage={props.data.what_to_say}
      {...props}
      Icon={RiSpeakLine}
      titleLabel={nodeData?.name}
    />
  )
}

export default SpeakNode
