import { LegendRowTextProps, ChatTableLegendProps } from '@/types/chat'
import { useTranslation } from 'react-i18next'

const LegendRowText = ({ text, dotClass }: LegendRowTextProps) => (
  <div className='flex gap-2 items-center'>
    <div className={`w-2 h-2 rounded-xl ${dotClass}`}></div>
    <p className='text-sm'>{text}</p>
  </div>
)

const ChatTableLegend = ({ showSuccessConvo }: ChatTableLegendProps) => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col justify-end'>
      <LegendRowText
        text={t('legend.chatComment')}
        dotClass={'bg-yellow-500'}
      />
      {showSuccessConvo === true && (
        <LegendRowText
          text={t('legend.successfulConversation')}
          dotClass={'bg-green-500'}
        />
      )}
    </div>
  )
}

export default ChatTableLegend
