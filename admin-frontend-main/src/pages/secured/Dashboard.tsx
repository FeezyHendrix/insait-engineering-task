import MainContainer from '@components/dashboard/containers/MainContainer'
import ConversionContainer from '@components/dashboard/containers/ConversionContainer'
import EngagementContainer from '@components/dashboard/containers/EngagementContainer'
import UsageContainer from '@components/dashboard/containers/UsageContainer'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { dashboardSelector } from '@/redux/slices/analytics'
import {
  getDashboardStatRequest,
  getFavoriteCharts,
} from '@/redux/slices/analytics/request'
import { useCallback, useEffect } from 'react'
import Loader from '@/components/elements/Loader'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { getDirFromLang, getErrorMessage } from '@/utils'
import DateSelectPane from '@/components/layout/DateSelectPane'
import FavoritesContainer from '@/components/dashboard/containers/FavoritesContainer'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/elements/radix/tab'

const Dashboard = () => {
  const { t } = useTranslation()
  const { data, loading, error } = useAppSelector(dashboardSelector)
  const language = useAppSelector(state => state.companyConfig.language);

  const dispatch = useAppDispatch()

  useEffect(() => {
    getDashboardStats()
    dispatch(getFavoriteCharts())
  }, [])

  const getDashboardStats = useCallback(() => {
    try {
      dispatch(getDashboardStatRequest())
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('feedback.errorWrong'))
    }
  }, [])

  useEffect(() => {
    if(error && typeof error === 'string') {
      toast.error(error)
    }
  }, [error])

  return (
    <section className='flex flex-col flex-1'>
      <DateSelectPane />
      {data ? (
        <div className='ps-4 pe-4 pt-4 h-full max-h-page-scroll'>
          <MainContainer />
          <Tabs dir={getDirFromLang(language)} defaultValue='keyMetrics' className='w-full'>
            <TabsList className='w-full !justify-start border-b rounded-none h-12 bg-transparent p-0'>
              <TabsTrigger
                value='keyMetrics'
                className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4'
              >
                {t('chart.keyMetrics')}
              </TabsTrigger>
              <TabsTrigger
                value='favorites'
                className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4'
              >
                {t('chart.favorites')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='favorites' className='mt-6'>
              <FavoritesContainer />
            </TabsContent>

            <TabsContent value='keyMetrics' className='mt-6'>
              <ConversionContainer />
              <EngagementContainer />
              <UsageContainer />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <>
          {loading ? (
            <Loader />
          ) : (
            <div className='flex flex-col w-full h-2/3 items-center justify-center gap-3'>
              <p>{t('feedback.errorLoadingData')}</p>
              <button
                onClick={getDashboardStats}
                className='app-bg-blue text-white rounded-xl px-4 py-2'
              >
                {t('button.refresh')}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Dashboard
