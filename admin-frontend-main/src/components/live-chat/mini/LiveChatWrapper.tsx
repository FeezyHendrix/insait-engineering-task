import { ChangeEvent, SetStateAction, useCallback, useEffect, useState, ReactNode } from 'react'
import { useAppDispatch} from '@/hook/useReduxHooks'
import AddTemplateModal from './AddTemplateModal'
import MessageTemplate from './MessageTemplate'
import { socket } from '@/main'
import useModal from '@/hook/useModal'
import { LiveChatWrapperType } from '@/types/liveChatWrapperType'
import { createTemplate, deleteTemplate, getAllTemplates } from '../../../redux/slices/analytics/request'
import { BaseMessageTemplate } from '@/types/baseMessageTemplate'
import { toast } from 'react-toastify'

const LiveChatWrapper = ({
  open,
  onClose,
  children,
  conversationId,
  handleTemplateClick,
}: LiveChatWrapperType) => {
  const { toggle, isOpen } = useModal()
  const [templates, setTemplates] = useState<BaseMessageTemplate[]>([])

  const dispatch = useAppDispatch();

  const getAllTemplatesArr = async () => {
    try {
      const result = await dispatch(getAllTemplates());
      const payload = result.payload;
      const payloadMessage = result.payload?.message;
      
      if (!payload || payloadMessage === 'Something went wrong') {
        return;
      }
      setTemplates(payload);
    } catch (error) {
      toast.error("Error. No server response.")
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(()=> {
    getAllTemplatesArr()
  }, [])

  const handleAdd = async (data: BaseMessageTemplate) => {
    try {
      const result = await dispatch(createTemplate( data ));
      setTemplates((prev) => [...prev, result.payload])
      toast.success('Template created successfully')
    } catch (error) {
      toast.error("Failed to create template.")
    }
  }

  const handleRemove = async (templateId: string) => {
    try {
      await dispatch(deleteTemplate( templateId ));
      setTemplates((prev) => prev.filter((template) => template.templateId?.toString() !== templateId))
      toast.success('Template removed successfully')
    } catch (error) {
      toast.error("The template was't deleted.")
    }
  }

  const handleInput = (message: string) => {
    const data = {
      conversation_id: conversationId,
      text: message,
      pov: 'user',
    }
    socket?.emit('send_live_message', data)
  }
  
  const onTemplateClick = (message: string) => {
    handleTemplateClick(message)
  }

  return (
    <div className='flex flex-1 overflow-x-hidden overflow-y-auto'>
      <div
        className={`flex-1 overflow-auto flex flex-col justify-end ${ open ? 'me-0' : 'me-[-30%]'}`}
        style={{ transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',}}>
        {children}
      </div>
      <div className={`w-[30%] min-w-60 flex flex-col justify-between px-3 pt-3 ${ open ? 'z-[1]' : '-z-[1]'}`}>
        <div className='flex justify-between items-center'
          style={ open? { transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',}
            : { transform: 'translateX(257px)',}
          }>
          <button
            className='text-2xl text-gray-500 font-light'
            type='button'
            onClick={() => onClose()}
          >
            &times;
          </button>
          <p
            className='text-sm font-bold underline text-primary cursor-pointer'
            onClick={() => toggle()}
          >
            + Add Templates
          </p>
        </div>
        <div
          className={`flex flex-col-reverse gap-y-3.5 overflow-x-hidden overflow-y-auto w-full ${
            open ? 'transform-none' : 'invisible'
          }`}
          style={
            open
              ? {
                  transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
                }
              : {
                  transform: 'translateX(257px)',
                }
          }
        >
          {templates.map((template: BaseMessageTemplate) => (
            <MessageTemplate
              key={template.templateId}
              onInput={onTemplateClick}
              onRemove={handleRemove}
              {...template}
            />
          ))}
        </div>
      </div>
      <AddTemplateModal isOpen={isOpen} toggle={toggle} onSubmit={handleAdd} />
    </div>
  )
}

export default LiveChatWrapper