import sendImg from '@image/icons/send.svg'
import editImg from '@image/icons/edit.svg'
import { useState } from 'react'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { updateInteractionMessagesRequest } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { supportTicketCommentDimensions } from '@/utils/constants'
import { useTranslation } from 'react-i18next'

interface ChatInputType {
  defaultValue?: string
  chatId: string | null
  onClick?: (text: string) => void
}

const ChatInput = ({ defaultValue, chatId, onClick }: ChatInputType) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation();    
  const [value, setValue] = useState(defaultValue || '')
  const [isEdit, setIsEdit] = useState(!defaultValue)

  const sendMessage = () => {
    if (onClick) {
      onClick(value)
      setValue('')
      return
    } else {
      if (!chatId) return toast.error(t('chats.chatIdIsRequired'))
      const data = { id: chatId, value }
      setIsEdit(false)
      dispatch(updateInteractionMessagesRequest(data))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {

      if (e.shiftKey) {
        // Allow newline if Shift key is pressed
        return;
      }
      e.preventDefault();
      sendMessage();
    }
  }


  return (
    <div className='flex flex-row gap-2 chat-container items-center w-11/12 !bg-white mb-3 relative'>
      {isEdit === false ? (
        <p className='w-full md:w-8/12 flex items-center justify-center py-2 text-center mx-auto'>
          {value}
        </p>
      ) : (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={Math.min(Math.max(value.split('\n').length, Math.ceil(value.length / supportTicketCommentDimensions.charactersPerLine)), supportTicketCommentDimensions.maxRows)}
          placeholder={t('chats.addCommentsPlaceholder')}
          className='flex-1 bg-white text-sm outline-none px-1'
        />
      )}
      {isEdit === false ? (
        <button
          key='edit-button'
          className=' absolute top-2 end-3'
          onClick={() => setIsEdit(true)}
        >
          <img src={editImg} alt='edit' width={15} height={15} />
        </button>
      ) : (
        <button
          key='send-button'
          onClick={sendMessage}
          className='app-bg-blue py-2 px-2 rounded-xl'
        >
          <img src={sendImg} alt='send' width={20} height={20} />
        </button>
      )}
    </div>
  )
}

export default ChatInput
