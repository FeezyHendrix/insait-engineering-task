import { RootState } from "@/redux/store"
import { ChatDataTableBodyType, CompletionTableBodyType } from "@/types/dashboard"
import dayjs from "dayjs"
import { useSelector } from "react-redux"
import { Rating } from "react-simple-star-rating"
import conversationImg from '@image/icons/conversation.svg'
import { FaDatabase } from "react-icons/fa"
import { ModalOpenType } from "@/types/completedSessions"
import CustomTooltip from "../elements/CustomTooltip"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { copyTimeout } from "@/utils/data"
import { handleCopyText } from "@/utils"
import { PiChatLight } from "react-icons/pi"

const ConversationTableCell = (props: {header: string, detail: CompletionTableBodyType | ChatDataTableBodyType, chat: (chatId: string | null, userId: string | null,  type: ModalOpenType) => void}) => {
    const dateSettings = useSelector((state: RootState) => state.companyConfig.dateSettings)
    const isCompletionTableBodyType = (detail: CompletionTableBodyType | ChatDataTableBodyType): detail is CompletionTableBodyType => {
        return (detail as CompletionTableBodyType).userRating !== undefined;
    };
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        copyTimeout(copied, setCopied);
    }, [copied]);

    const renderComponent = (header: string): JSX.Element => {
        switch (header) {
            case 'tableHeader.conversationId':
                return <td className='bold-text text-center cursor-pointer hover:text-blue-500'
                onClick={() => {
                    handleCopyText(props.detail.chatId);
                    setCopied(true);
                }}>
                    <CustomTooltip title={copied ? t('chats.copied') : t('chats.copy')}>
                    {
                    props.detail.chatId.length > 8 ? `${props.detail.chatId?.slice(0,8)}...` : props.detail.chatId
                    }
                    </CustomTooltip>
                    </td>
            case 'tableHeader.customerID':
                return <td className='bold-text text-center cursor-pointer hover:text-blue-500'
                            onClick={() => {
                                handleCopyText(props.detail.user?.id?.toString() || '')
                                setCopied(true);
                            }}
                        >
                            <CustomTooltip title={copied ? t('chats.copied') : t('chats.copy')}>
                            {
                                isCompletionTableBodyType(props.detail) && 
                                (props.detail.user.firstName || props.detail.user.lastName) ? `${props.detail.user.firstName || ''} ${props.detail.user.lastName || ''}`
                                :
                                props.detail.user && props.detail.user.id &&
                                props.detail.user.id.toString().length > 8 ? `${props.detail.user.id?.toString().slice(0,8)}...` 
                                : props.detail.user?.id?.toString()
                            }
                            </CustomTooltip>
                        </td>
            case 'tableHeader.date':
                return <td className='bold-text text-center'>
                    {props.detail?.createdAt ? dayjs(props.detail.createdAt).format(dateSettings ?? 'DD-MM-YYYY') : ''}
                </td>
            case 'tableHeader.time':
                return <td className='bold-text text-center'>
                {props.detail?.createdAt ? dayjs(props.detail.createdAt).format('HH:mm') : ''}
              </td>
            case 'tableHeader.firstName':
                return <td className='bold-text text-center'>{props.detail.user && props.detail.user.firstName}</td>
            case 'tableHeader.lastName':
                return <td className='bold-text text-center'>{props.detail.user && props.detail.user.lastName}</td>
            case 'tableHeader.rating':
                return <>
                            <td className='bold-text text-center capitalize'>
                            <Rating
                                readonly
                                initialValue={isCompletionTableBodyType(props.detail) && props.detail.userRating || 0}
                                allowFraction
                                size={24}
                                className='flex items-center '
                            />
                            </td>
                        </>
            case 'tableHeader.messages':
                return <td className='bold-text text-center capitalize'>
                        {`${isCompletionTableBodyType(props.detail) && props.detail.messageCount}`}
                        </td>
            case 'tableHeader.fullConversation':
                return <td>
                            <div className="flex justify-center">
                            <div className="relative">
                                <span 
                                 onClick={() => {
                                    props.detail?.messages?.length &&
                                    props.chat(props.detail.chatId || '', isCompletionTableBodyType(props.detail) ? props.detail.user.id.toString() : props.detail.userId, 'conversation')}}
                                    className={`mx-auto cursor-pointer  flex justify-center fullConversation-btn ${props.detail?.messages?.length ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                        <PiChatLight className="app-text-blue text-2xl" />
                                </span>
                                {props.detail?.comment && props.detail.comment !== '' && <div className="w-2 h-2 rounded-xl bg-yellow-500 absolute -top-[2px] -start-[2px]"></div>}
                                {props.detail?.botSuccess && <div className="w-2 h-2 rounded-xl bg-green-500 absolute -top-[-6px] -start-[2px]"></div>}
                            </div>
                            </div>
                        </td>   
            case 'tableHeader.chatChannel':
                return <td className='bold-text text-center'>{isCompletionTableBodyType(props.detail) && props.detail.chatChannel ? `${props.detail.chatChannel?.slice(0,1).toUpperCase()}${props.detail.chatChannel?.slice(1).toLowerCase()}` : ''}</td>          
            case 'tableHeader.userId':
                return <td className='bold-text text-center cursor-pointer hover:text-blue-500'
                            onClick={() => {
                                handleCopyText(props.detail.user?.id?.toString() || '');
                                setCopied(true);
                            }}
                        >
                            <CustomTooltip title={copied ? t('chats.copied') : t('chats.copy')}>
                            {
                                (props.detail.user?.firstName || props.detail.user?.lastName) ? `${props.detail.user.firstName || ''} ${props.detail.user.lastName || ''}` :
                                props.detail.user && props.detail.user.id && 
                                props.detail.user.id.toString().length > 8 ? `${props.detail.user.id?.toString().slice(0,8)}...` 
                                : props.detail.user?.id?.toString()
                            }
                            </CustomTooltip>
                        </td>
            case 'tableHeader.name':
                return <td className='bold-text text-center'>{!isCompletionTableBodyType(props.detail) && props.detail.dataObject && props.detail.dataObject.name}</td>
            case 'tableHeader.email':
                return <td className='bold-text text-center'>{!isCompletionTableBodyType(props.detail) && props.detail.dataObject && props.detail.dataObject.email}</td>
            case 'tableHeader.country':
                return <td className='bold-text text-center'>{!isCompletionTableBodyType(props.detail) && props.detail.dataObject && props.detail.dataObject.country}</td>
            case 'tableHeader.allData':
                return <td>
                            <span onClick={() => {
                                props.chat(props.detail.chatId || '', !isCompletionTableBodyType(props.detail) && props.detail.userId || props?.detail?.user?.id?.toString() || '', 'data')
                            }} className='mx-auto cursor-pointer app-text-blue text-xl flex justify-center'>
                                <FaDatabase />
                            </span>
                        </td>
                default:
                return <td className='bold-text text-center'></td>
    }}
    return (
        <>
            {renderComponent(props.header)}
            
        </>
    )
}

export default ConversationTableCell