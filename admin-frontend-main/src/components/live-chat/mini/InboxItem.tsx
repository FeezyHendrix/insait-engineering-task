import { TransferredConversation } from '@/types/chat'
import { convertDatetimeToDateOrTime } from '@/utils/dateHelper';
// import { convertDateToReadableFormat } from '@/utils/dateHelper'
import { CapitalizeEachWord } from '@/utils/stringHelper'

// interface InboxItemType {
//   id: number
//   name: string
//   category: string
//   message: string
//   time: number
//   count?: number
//   onClick?: () => void
//   selected: boolean
// }

const InboxItem = ({
  chat_product,
  last_message,
  last_message_time,
  count,
  onClick,
  selected,
  customer_id,
  conversation_obj_string,
  conversation_id,
}: TransferredConversation) => {

  const timeToDisplay = convertDatetimeToDateOrTime(last_message_time)
  
  return (
    <div
      onClick={onClick}
      className={`flex flex-row justify-between border-b px-4 py-4 cursor-pointer flex-wrap ${selected ? 'bg-gray-100' : 'bg-white'}`}
    >
      <div className=''>
        <div className='flex flex-row gap-3 flex-wrap'>
          <h3 className='bold-text text-lg'>{customer_id}</h3>
          <span className='inbox-chip bold-text text-sm'>{CapitalizeEachWord(chat_product)}</span>
          <span className='text-gray'>{timeToDisplay}</span>
        </div>
        <p className='text-gray bold-text'>{last_message}</p>
      </div>
      <div className='flex flex-col items-end'>
        {/* <p className='text-gray'>
          {convertDateToReadableFormat(time, 'hh:mm A')}
        </p> */}
        {count && <p className='inbox-counter text-sm bold-text'>{count}</p>}
      </div>
    </div>
  )
}

export default InboxItem
