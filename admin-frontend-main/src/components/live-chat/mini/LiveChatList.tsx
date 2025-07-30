import LiveChatWrapper from './LiveChatWrapper'
import { GroupedLiveMessagesDataType } from '@/types/chat'
import { convertDateToReadableFormat } from '@/utils/dateHelper'
import { useEffect, useRef } from 'react'
import MessageList from './MessageList'
import { LiveChatListType } from '@/types/liveChatListType'

const LiveChatList = ({ list, conversationId, openTemplate, setOpenTemplate, handleTemplateClick}: LiveChatListType) => {

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [list]);

  return (
  <LiveChatWrapper
    conversationId={conversationId}
    open={openTemplate}
    onClose={() => setOpenTemplate(false)}
    handleTemplateClick={handleTemplateClick}
    >
    <div className='flex-1 overflow-scroll flex flex-col justify-end' >
      <div className=' overflow-scroll h-auto px-3' ref={chatContainerRef}>
        {list.map(group => (
          <div key={group.time}>
            <p className='text-center w-fit mx-auto mt-5 mb-3 text-xs text-gray bold-text'>
              {convertDateToReadableFormat(group.time)}
            </p>
            {group.data.map((message, i) => ( // TODO : add key that is not index
              <MessageList key={i} message={message} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </LiveChatWrapper>
  )
}

export default LiveChatList
