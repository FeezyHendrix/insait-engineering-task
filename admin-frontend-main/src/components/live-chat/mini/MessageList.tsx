import { LiveMessagesDataType } from '@/types/chat'
import { convertUTCtoLocalTimeString } from '@/utils/dateHelper'

const MessageList = ({ message }: { message: LiveMessagesDataType }) => {
  
    return (
      <div
        className={`w-full flex ${
          message.pov === 'user' ? 'justify-end' : 'justify-start'
        }`}
      >
        <div className={`mb-4 w-fit live-chat-message`}>
          <div
            className={`flex-1 w-full px-3 py-3 font-normal max-w  ${
              message.pov === 'user'
                ? 'text-right rounded-t-xl rounded-l-xl'
                : 'text-left rounded-b-xl rounded-r-xl'
            }`}
            style={{
              backgroundColor: message.pov === 'agent' ? '#F3F5F7' : '#DAECF6',
            }}
          >
            <p className='text-sm text-start'>{message.text}</p>
            <p className='text-xs text-gray mt-1'>
              {/* {dayjs(message.time).format('hh:mm A')} */}
              {convertUTCtoLocalTimeString(message.time)}
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  export default MessageList