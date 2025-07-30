import { BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import { ChatType } from '@/types/dashboard'
import linkImg from '@image/icons/link.svg'
import { ReactNode, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { handleCopyText, normalizeMenuLink } from '@/utils'
import textIcon from '@image/icons/txt.png'
import dayjs from 'dayjs'
import { handleTxtExport } from '@/utils/export'
import { BiSupport } from "react-icons/bi";
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { pageOptions } from '@/utils/data'
import { useTranslation } from 'react-i18next'
import MessageFile from '../elements/MessageFile'

interface ConversationalChatType {
  id: string
  data: Array<ChatType>
  date?: string
  loading: boolean
  children?: ReactNode
  showSenderName?: boolean
  showReportButton?: boolean
  showCopyButton?: boolean
  customHeaderField?: () => JSX.Element
}

const ConversationalChat = ({
  id,
  data,
  date,
  loading,
  children,
  showSenderName,
  showReportButton = true,
  showCopyButton = true,
  customHeaderField,
}: ConversationalChatType) => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const visiblePages = useSelector((state: RootState) => state.companyConfig.pages);
  const pagesToShow = pageOptions
    .filter(option => visiblePages.regularUsers.includes(normalizeMenuLink(option.link)))
    .map(page => page.link);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const exportToText = () => {
    try {
      let textData = "Created At: " + date + "\n\n";

      data.forEach(msg => {
        textData += `[${msg?.time ? dayjs(msg.time).format('ddd DD MMM YYYY h:mm:ss A') : ''}] ${msg.pov?.toUpperCase() || ''}: ${msg.text}\n\n`;
      });

      handleTxtExport(textData,`chat_data_${id}.txt`);
      toast.success(t('feedback.fileDownloadSuccess'));
    } catch (error) {
      toast.error(t('feedback.fileDownloadError'));
    }
  };
  
  const copyLink = async () => {
    try {
      const url = window.location.href;
      await handleCopyText(url);
      toast.success(t('feedback.linkCopied'));
    } catch (error) {
      toast.error(t('feedback.errorCopyingLink'));
    }
  };

  const handleIssueReport = () => {
    navigate("/support", { state: { chatLink: window.location.href }});
  }

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data.length]);

  const formatFileUrl = (url: string | string[]) => {
    const formattedUrl = Array.isArray(url)
      ? url[0]
      : url;
    return formattedUrl;
  };

  return (
    <div className='rounded-xl h-full flex flex-col'>
      {/* Heading */}
      <div className='flex flex-row justify-between pe-4 py-3 mt-4'>
       {customHeaderField ? customHeaderField() : <div className='w-2' />}
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className='copy-icon flex justify-center items-center'
          >
            <img src={linkImg} width={20} alt="copy link" />
          </button>
          {pagesToShow.includes('/support/') && showReportButton === true && (
            <button
              title='Report an issue'
              onClick={handleIssueReport}
              className='copy-icon flex justify-center items-center'
            >
              <BiSupport className='text-xl' />
            </button>
          )}
         {showCopyButton === true && <button onClick={exportToText}>
            <img src={textIcon} width={20} alt="txt button" />
          </button>}
        </div>
        
      </div>

      {/* Chat List */}
        <div className='flex-1 overflow-y-scroll'>
          <div className='h-full overflow-y-scroll'>
            {data && data.map((msg, index) => (
          <div
            ref={index === data.length - 1 ? lastMessageRef : null}
            key={msg.id}
            className={`flex flex-col items-start max-w-[85%] rounded-2xl my-3 py-2 px-3 ${
              msg.pov === 'user' ? 'sender-row' : 'receiver-row'
            }`}
          >
            <div>
             {showSenderName === true && <p className='text-sm bold-text leading-none'>{msg?.sender}</p>}
              {msg?.file && msg.file.length > 0 && msg.file[0] !== '' ? (
                <MessageFile url={formatFileUrl(msg.file)} />
              ) : (
              <p className='whitespace-pre-line break-all text-sm'>{msg.text}</p>
              )}             
             {!msg.rating ? <></> : 
            (msg.pov === 'bot'? 
            (msg.rating === 'positive'? 
            <div className="text-green-500">
              <BiSolidLike className="w-4 h-4" />
            </div>
              : 
            <div className="text-red-500">
              <BiSolidDislike className="w-4 h-4" />
            </div>
            )
            : <></>
            )
              }

            </div>
            <div className='flex-1'>
              {msg?.createdAt && (
                <>
                  <p className='text-xs text-center'>
                    {dayjs(msg.createdAt).format('hh:mm A')}
                  </p>
                  <p className='text-xs text-center whitespace-nowrap'>
                    {dayjs(msg.createdAt).format('DD-MM-YYYY')}
                  </p>
                </>
              )}
            </div>
            <div className='flex justify-end w-full mt-2'>
              <p className=' text-xs font-light'> {dayjs(msg.time).format('MMM DD YYYY hh:mm A')}</p>
            </div>
          </div>
            ))}
          </div>
        </div>

        {/* No Message */}
      {(!data || data?.length === 0) && (
        <p className='text-center py-10 flex-1'>{loading === true ? t('feedback.fetching') : t('feedback.noData')}</p>
      )}
            
      <div className='mt-2 flex justify-center'>{children}</div>

    </div>
  )
}

export default ConversationalChat
