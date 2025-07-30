import trashImg from '@image/icons/trash.svg'
import { InteractiveMessageTemplate } from '@/types/interactiveMessageTemplate'

const MessageTemplate = ({
    templateId,
    title,
    text,
    onInput,
    onRemove,
  }: InteractiveMessageTemplate) => {
    return (
      <div className='bg-primary-light rounded-md p-3 relative w-full'>
        <img
          className='cursor-pointer absolute top-3 end-3 w-5 h-5'
          src={trashImg}
          alt='trash'
          onClick={() => {
            onRemove((templateId || "").toString());
          }}
        />
        <p
          className='text-base font-medium pe-8 mb-1 break-all cursor-pointer'
          onClick={() => {
            onInput(text)
          }}
        >
          {title}
        </p>
        <p className='text-sm font-normal break-all'>{text}</p>
      </div>
    )
  }

export default MessageTemplate