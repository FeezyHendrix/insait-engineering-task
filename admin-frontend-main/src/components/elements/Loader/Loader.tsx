import { useTranslation } from 'react-i18next'
import './Loader.scss'

interface LoaderProps {
  title?: string
  loading?: boolean
  hasNoData?: boolean
  onRefresh?: () => void
}

const Loader = ({
  title,
  loading = true,
  hasNoData = false,
  onRefresh,
}: LoaderProps) => {
  const { t } = useTranslation()
  const titleText = title ? title : t('feedback.setting_up')
  return (
    <>
      {loading ? (
        <div className='h-full w-full pt-40'>
          <div className='app-round-loader mx-auto'></div>
          <p className='mt-2 text-center'>{titleText}</p>
        </div>
      ) : hasNoData ? (
        <div className='h-4/6 w-full pt-4 px-4'>
          <p className='text-center'>{t('feedback.noData')}</p>
        </div>
      ) : (
        <div className='flex flex-col w-full h-2/3 min-h-[300px] items-center justify-center gap-3'>
          <p>{t('feedback.errorLoadingData')}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className='app-bg-blue text-white rounded-xl px-4 py-2'
            >
              {t('button.refresh')}
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default Loader
