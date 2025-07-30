import searchImg from '@image/icons/search.svg'
import moreImg from '@image/icons/more.svg'
import { useState } from 'react'
import ClientInfo from './ClientInfo'
import { LiveChatHeaderType } from '@/types/liveChatHeader'

const LiveChatHeader = ({ name, category, clientCollectedInfo }: LiveChatHeaderType) => {
  if (!name) return null
  const [showClientInfo, setShowClientInfo] = useState(false)
  return (
    <div className='flex flex-row justify-between border-b px-4 pb-4'>
      <div>
        <div className='flex flex-row gap-3'>
          <h3 className='bold-text text-lg'>{name}</h3>
          <p className='inbox-chip bold-text text-sm'>{category}</p>
          <div 
            className='inbox-chip text-sm'
            onMouseEnter={() => setShowClientInfo(true)}
            onMouseLeave={() => setShowClientInfo(false)}
            >
              Client Info
              {showClientInfo && clientCollectedInfo && (
              <ClientInfo data={clientCollectedInfo}/>
            )}
          </div>
        </div>
        <p className=' font-light text-gray text-xs'>Online</p>
      </div>
      <div className='flex flex-row gap-3'>
        <button className='conversation-icon p-2'>
          <img src={searchImg} alt='search icon' width={28} height={28} />
        </button>
        <button className='conversation-icon p-2'>
          <img src={moreImg} alt='more icon' width={28} height={28} />
        </button>
      </div>
    </div>
  )
}

export default LiveChatHeader
