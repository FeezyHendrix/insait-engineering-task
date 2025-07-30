import { useAppSelector } from '@/hook/useReduxHooks'
import { generalSelector } from '@/redux/slices/analytics'
import { ChartLoaderType } from '@/types/chart'
import { useTranslation } from 'react-i18next'

const ChartLoader = ({ children, type, loading, hasData }: ChartLoaderType) => {
  const { t } = useTranslation()
  const reduxState = useAppSelector(generalSelector)
  const reduxLoading: boolean = reduxState[type].loading

  if (reduxLoading || loading) {
    return (
      <div className='flex items-center pl-5'>
        <div className='inline-app-loader dark' /> <span>{t('feedback.fetching')}</span>
      </div>
    )
  }
  if(hasData === false) return <p>{t('feedback.noData')}</p>
  return <div className='h-full w-full direction-ltr'>{children}</div>
}

export default ChartLoader
