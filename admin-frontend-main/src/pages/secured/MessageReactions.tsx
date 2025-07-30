import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import Button from '@/components/elements/Button'
import MessageFeedbackModal from '@/components/chat/MessageFeedbackModal'
import useModal from '@/hook/useModal'
import {
    convertDateToReadableFormat,
    convertDatetimeToTime,
} from '@/utils/dateHelper'
import { getAllMessageFeedback } from '@/redux/slices/analytics/request'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { toast } from 'react-toastify'
import { MessageReaction, MessageReactionInfoType } from '@/types/messageReactions'
import HeaderTab from '@/components/elements/HeaderTab'
import ReactPaginate from 'react-paginate'
import { ITEMS_PER_PAGE } from '@/utils/data'
import Loader from '@/components/elements/Loader'
import { useTranslation } from 'react-i18next'

const MessageReactions = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { toggle, isOpen } = useModal()
    const [chatId, setChatId] = useState<string>('')
    const [allData, setAllData] = useState<MessageReactionInfoType | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [messages, setMessages] = useState(Array<MessageReaction>);
    const [selectedTab, setSelectedTab] = useState<string>('positive');
    const [loading, setLoading] = useState<boolean>(true);
    const contentRef = useRef<HTMLDivElement>(null)

    
    const pageCount = useMemo(() => {
        if(!allData) return 0;
        const messageCount = selectedTab === 'positive' ? allData.thumbsUpMessages.length ?? 0 : allData.thumbsDownMessages.length ?? 0;
        return Math.ceil(messageCount / ITEMS_PER_PAGE)
    }, [allData, selectedTab]);

    const launchModal = (conversationId: string) => {
        setChatId(conversationId)
        toggle()
    }

    const fetchAllMessageReactions = async () => {
        setLoading(true)
        try {
          const response = await dispatch(getAllMessageFeedback())
          if (response.meta.requestStatus === 'rejected') {
            throw new Error(response.payload.message)
          }
          const payload: any = await response.payload
          setAllData(payload)
          setLoading(false)
        } catch (error: any) {
          toast.error(error?.message || t('feedback.errorWrong'))
          setLoading(false)
        }
    }

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected)
    }

    useLayoutEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0)
        }
    }, [currentPage, selectedTab])

    useEffect(() => {
        fetchAllMessageReactions()
    }, [])

    useEffect(() => {
        const fetchData = async()=> {
            const data = await fetchAllMessageReactions()
            return data
        }
        if (!allData || !allData.thumbsDownMessages || !allData.thumbsUpMessages) {
            fetchData()
            return
        };
        const start = currentPage * ITEMS_PER_PAGE;
        const end = (currentPage + 1) * ITEMS_PER_PAGE;
        const selected = selectedTab === 'positive' ? allData.thumbsUpMessages : allData.thumbsDownMessages;            
        setMessages(selected.slice(start, end));
        setLoading(false)
    }, [selectedTab, allData, currentPage])

    return (
    <section className='p-5 bg-white rounded-2xl mb-4 flex-1 md:h-[82vh] flex flex-col gap-y-5 m-5 max-h-page-scroll-150 border'>

        <HeaderTab 
            data={[
                {value: 'positive', name: t('messages.likes')},
                {value: 'negative', name: t('messages.dislikes')},
            ]}
            valueSelected={selectedTab}
            onPress={(value) => {                
                setSelectedTab(value);
                setCurrentPage(0)
            }}
        />
        <div ref={contentRef} className='flex-1 overflow-y-auto'>

            {loading ? 
                <Loader />
                :
                messages && messages.length > 0 ?
                <>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className='md:flex p-5 rounded-lg border justify-between items-center gap-x-10 mb-5'
                        >
                        <div className='flex flex-col md:flex-row md:items-center gap-x-3'>
                            <div className="">
                                {selectedTab === 'positive' ? (
                                    <BiSolidLike className='w-8 h-8 text-green-500' />
                                ) : (   
                                    <BiSolidDislike className='w-8 h-8 text-red-500' />
                                )}
                            </div>
                            <div>
                                <p className='font-bold text-md mb-2'>{msg.text}</p>
                                {msg.user_comment && 
                                    <p className='mt-1 text-left text-base text-gray'>
                                        "{msg.user_comment}"
                                    </p>
                                }
                            </div>
                            </div>
                            <div className='shrink-0'>
                                <div className='flex gap-x-3'>
                                    <Button
                                        className='px-3'
                                        text={t('button.viewConversation')}
                                        onClick={() => launchModal(msg.id)}
                                />
                                </div>
                                <p className='mt-1 text-left md:text-right text-base text-gray'>
                                    {`${convertDateToReadableFormat(
                                        msg.time
                                    )} ${convertDatetimeToTime(msg.time)}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </>
                :
                <Loader loading={false} hasNoData={true}/>
            }
        </div>
        <div className='flex justify-end'>
            <ReactPaginate
                previousLabel='&#x2C2;'
                previousLinkClassName='text-xl flex items-center justify-center border border-blue-400 px-2 rounded-lg app-text-blue w-full h-full'
                nextLabel='&#x2C3;'
                nextLinkClassName='text-xl flex items-center justify-center text-center text-white app-bg-blue px-3 rounded-lg w-full h-full'
                pageLinkClassName='px-3 py-1 border rounded-lg flex items-center justify-center w-full h-full'
                breakLinkClassName='page-link'
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName='flex gap-3 justify-start md:justify-end md:mr-10 pt-5 overflow-x-auto'
                activeClassName='text-white app-bg-blue rounded-lg'
                forcePage={currentPage}
            />
        </div>
        <MessageFeedbackModal chatId={chatId} toggle={toggle} isOpen={isOpen} />
    </section>
)

}

export default MessageReactions