import Search from '../elements/Search'
import InboxItem from './mini/InboxItem'
import {  TransferredConversation } from '@/types/chat'
import { InboxType } from '@/types/inbox'
import { inboxSelector } from '@/redux/slices/analytics'
import { useAppSelector } from '@/hook/useReduxHooks'
import { useMemo, useState } from 'react'

const Inbox = ({ setSelectedInbox, selectedId }: InboxType) => {
  const { loading, inbox: inboxData } = useAppSelector(inboxSelector)
  const [searchQuery, setSearchQuery] = useState('')
  const filteredInboxData = useMemo(() => {
    return inboxData.filter(message => {
      const val = searchQuery.trim().toLowerCase()
      return (
        message.conversation_id.toLowerCase().includes(val) ||
        message.chat_product.toLowerCase().includes(val)
      )
    })
  }, [inboxData, searchQuery])

  const sortedConversations = filteredInboxData.sort((a: TransferredConversation, b: TransferredConversation) => {
    if (!a.last_message_time || !b.last_message_time) return 0
    const timeA = new Date(a.last_message_time);
    const timeB = new Date(b.last_message_time);
    return timeB.getTime() - timeA.getTime();
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <div
      style={styles.container}
      className='flex flex-col border-r w-full md:w-4/12'
    >
      <div className='px-5 border-b pb-4'>
        <Search
          extraClass={'!py-2'}
          imgWidth={20}
          placeholder={`Search here`}
          onChange={handleSearchChange}
          value={searchQuery}
        />
      </div>
      {loading ? (
        <p className='flex-1 flex justify-center items-center'>Loading...</p>
      ) : inboxData.length === 0 ? (
        <p className='flex-1 flex justify-center items-center'>
          No Users currently
        </p>
      ) : (
        <div className='overflow-auto pe-1'>
          {sortedConversations.map(conversation => (
            <InboxItem
              key={conversation.customer_id}
              {...conversation}
              onClick={() => setSelectedInbox(conversation)}
              selected={conversation.conversation_id === String(selectedId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    minWidth: 350,
  },
}

export default Inbox
