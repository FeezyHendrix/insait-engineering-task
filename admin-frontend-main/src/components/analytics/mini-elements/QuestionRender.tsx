import { QuestionRenderProps } from '@/types/analytics'
import { topLinkMaxLength } from '@/utils/data'
import { useTranslation } from 'react-i18next'

const QuestionRender = ({
  count,
  text,
  displayAsLink,
}: QuestionRenderProps) => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-row gap-4 items-start py-4 border-b last:border-b-0'>
      <div className='relative min-w-[60px]'>
        <p className='z-20 relative text-xs'>
          {count} {count === 1 ? t('chart.click') : t('chart.clicks')}:
        </p>
        {displayAsLink ? (
          <a
            className='app-text-blue underline text-sm'
            target='_blank'
            href={text.startsWith('https') ? text : `https://${text}`}
          >
            {text.slice(0, topLinkMaxLength)}
            {text.length > topLinkMaxLength && '...'}
          </a>
        ) : (
          <p className='text-gray bold-text'>{text}</p>
        )}
      </div>
    </div>
  )
}

export default QuestionRender
