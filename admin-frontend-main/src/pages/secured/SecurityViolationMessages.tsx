import { useEffect, useState } from 'react'
import Button from '@/components/elements/Button'
import ChatConversationModal  from '@/components/chat/ChatConversationModal'
import useModal from '@/hook/useModal'
import {
    convertDateToReadableFormat,
    convertDatetimeToTime,
} from '@/utils/dateHelper'
import { getAllSecurityViolationMessages } from '@/redux/slices/analytics/request'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { toast } from 'react-toastify'
import { SecurityViolationMessageType } from "@/types/securityViolationMessagesType"
import { useTranslation } from 'react-i18next'

const SecurityViolationMessages = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { toggle, isOpen } = useModal()
    const [chatId, setChatId] = useState<string>('')
    const [messages, setMessages] = useState<SecurityViolationMessageType[]>([]);

    const launchModal = (conversationId: string) => {
        setChatId(conversationId)
        toggle()
    }


    const fetchAllSecurityViolationMessages = async () => {
    try {
        const response = await dispatch(getAllSecurityViolationMessages())
        const payload = await response.payload
        setMessages(payload)
    } catch (error: any) {
        toast.error(error?.message || t('feedback.errorWrong'))
    }
    }

    useEffect(() => {
        fetchAllSecurityViolationMessages()
    }, [])

    return (
    <section className='p-5 bg-white rounded-2xl mb-4 md:h-[82vh] flex flex-col gap-y-5 m-5 max-h-page-scroll-150 border'>
        {messages.length === 0 ? (
        <p className='text-center text-gray flex-1 flex justify-center items-center'>{t('security.noViolation')}</p>
        ) : (   
            <>
            <p className='text-center text-gray flex justify-center items-center'>{t('security.violationTitle')}</p>
            {messages.map((message) => (
                <div
                    key={message.securityViolationMessageId}
                    className='flex p-5 rounded-lg border justify-between items-center gap-x-4'
                >
                    <div className='w-[calc(100%-350px)]'>
                
                    <div className='flex items-center gap-x-3'>
                        <p className='font-bold text-md mb-2'>{message.securityViolationMessage}</p>
                    </div>
                    </div>
                    <div className='shrink-0'>
                        <div className='flex gap-x-3'>
                            <Button
                                className='px-3'
                                text={t('button.viewConversation')}
                                onClick={() => launchModal(message.conversationId)}
                            />
                        </div>
                    
                        <p className='mt-1 text-right text-base text-gray'>
                            {`${convertDateToReadableFormat(
                                message.conversationStartedTime
                            )} ${convertDatetimeToTime(message.conversationStartedTime)}`}
                        </p>
                    
                    </div>
                </div>
            ))}
        </>
        )}
        <ChatConversationModal  chatId={chatId} toggle={toggle} isOpen={isOpen} />
    </section>
)

}

export default SecurityViolationMessages