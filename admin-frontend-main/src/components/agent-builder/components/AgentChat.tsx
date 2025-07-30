import { useAppSelector } from '@/hook/useReduxHooks'
import { AgentChatProps } from '@/types/agent-builder'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

declare const INSAIT: {
  init: (config: {
    userId: string
    flowId: string
    CHATBOT_URL: string
    useCustomIframe: boolean
    useCustomIframeMobile: boolean
  }) => void
}

const AgentChat: React.FC<AgentChatProps> = ({ userId, url }) => {
  const { currentFlowId, botLoaded } = useAppSelector((state) => state.builder)

  const parsedUrl = new URL(url)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const removeIframeAndScript = () => {
    const currentScript = document.querySelector(`script[src="${url}"]`)
    if (currentScript) {
      document.head.removeChild(currentScript)
    }
  }
  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${url}"]`)
    if (existingScript) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.async = true

    script.onload = () => {
      setScriptLoaded(true)
    }

    script.onerror = () => {
      toast.error('Error initializing chatbot')
      setScriptLoaded(false)
    }

    document.head.appendChild(script)

    return () => removeIframeAndScript()
  }, [url])

  useEffect(() => {
    if (currentFlowId && scriptLoaded && botLoaded) {
      INSAIT.init({
        userId,
        flowId: currentFlowId,
        CHATBOT_URL: parsedUrl.origin,
        useCustomIframe: true,
        useCustomIframeMobile: true,
      })
    }

    if (!botLoaded) {
      removeIframeAndScript()
    }
  }, [scriptLoaded, userId, url, currentFlowId, botLoaded])

  return (
    <>
      {botLoaded && (
        <div className='absolute bottom-0 right-0 min-h-[300px] mb-10 me-4 shadow-xl p-0.5 rounded-xl overflow-hidden'>
          <iframe
            id='insait'
            src=''
            className='border-none w-[400px] h-[500px]'
          ></iframe>
        </div>
      )}
    </>
  )
}

export default AgentChat
