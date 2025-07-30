import { ChatDataTableBodyType } from '@/types/dashboard'
import linkImg from '@image/icons/link.svg'
import { toast } from 'react-toastify'
import { handleCopyText } from '@/utils'
import { camelToSentenceCase } from '@/utils/data'
import { formatDataViewText } from '@/utils/stringHelper'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { ReactNode } from 'react'

interface ChatDataViewType {
  dataObject: ChatDataTableBodyType | {}
  keyClassName?: string
  children?: ReactNode
}

const ChatDataView = ({
  dataObject,
  keyClassName,
  children,
}: ChatDataViewType) => {
  const { t } = useTranslation()
  const isEmpty = Object.keys(dataObject).length === 0;
  const dateSettings = useSelector((state: RootState) => state.companyConfig.dateSettings) || 'DD-MM-YYYY'
  const copyData = async () => {
    try {
      const dataToCopy = JSON.stringify(dataObject);
      await handleCopyText(dataToCopy)
      toast.success(t('feedback.dataCopied'))
    } catch (error) {
      toast.error(t('feedback.errorCopyingData'))
    }
  }
    
  return (
    <div className='rounded-xl receiver-row h-full flex flex-col'>
      <div className='flex flex-row justify-between px-4 py-3'>
        <div className='w-2' />
        {
          isEmpty ? <></> : 
          <button
            onClick={copyData}
            className='copy-icon flex justify-center items-center'
          >
            <img src={linkImg} width={23} />
          </button>
        }
      </div>

      <div className='flex-1 overflow-y-scroll'>
        <div className='h-full overflow-y-scroll'>
          {    
        <div className="flex flex-col gap-3 py-2 px-8 items-left">
        {isEmpty ? (
            <div className="flex justify-center items-center h-full">
                <p>{t('chats.noDataCollectedForUser')}</p>
            </div>        
            ) : (
            Object.keys(dataObject).map((key) => {
                const value = (dataObject as any)[key];
                return (
                    <div key={key} className='flex gap-1'>
                        <strong className={keyClassName ?? ''}>{camelToSentenceCase(key).replace(/_/g, ' ')}:</strong> {
                            Array.isArray(value)
                                ? <ul className='list-disc ms-5'>
                                    {value.map((item: string, index: number) => 
                                      <li key={index}>{formatDataViewText(item, dateSettings)}
                                      </li>)}
                                  </ul>
                                : formatDataViewText(value, dateSettings)
                        }
                    </div>
                );
            })
        )}
        {children && children}
    </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ChatDataView
