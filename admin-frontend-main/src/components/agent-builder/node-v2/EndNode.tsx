import { AgentNodeComponentProps } from '@/types/agent-builder'
import BaseNode from './BaseNode'
import { CiStopSign1 } from 'react-icons/ci'

const EndNode = (props: AgentNodeComponentProps) => {
  return (
    <BaseNode
      defaultMessage='&nbsp;&nbsp;'
      titleLabel='ENDING'
      {...props}
      Icon={CiStopSign1}
    />
  )
}

export default EndNode
