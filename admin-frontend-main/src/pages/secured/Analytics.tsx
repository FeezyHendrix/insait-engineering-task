import Persona from '@/components/analytics/Persona'
import SentimentAnalysis from '@/components/analytics/SentimentAnalysis'
import UserPersona from '@/components/analytics/UserPersona'
import UserRating from '@/components/analytics/UserRating'
import UserReturnRate from '@/components/analytics/UserReturnRate'
import Loader from '@/components/elements/Loader'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { analyticsSelector } from '@/redux/slices/analytics'
import { getDashboardStatRequest } from '@/redux/slices/analytics/request'
import TopQuestions from '@/components/analytics/TopQuestions'
import UserAbandonment from '@/components/analytics/UserAbandonment'
import UserFeedback from '@/components/analytics/UserFeedback'
import UserMessagesPerConversation from '@/components/dashboard/UserMessagesPerConversation'
import {
  feedbackMockData,
  mockUserAbadonmentFunnel,
  mockUserReturnData,
  singleDataCollectedMock,
  topFAQMockData,
  topQuestionGroupingDescription,
  topQuestionMockData,
  userPersonaSample,
} from '@/utils/mock'

import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import ThumbsUpAndDownCount from '@/components/dashboard/MessageReactionsChart'
import TopLinks from '@/components/analytics/TopLinks'
import Nodes from '@/components/dashboard/Nodes'
import DateSelectPane from '@/components/layout/DateSelectPane'
import PolicyCounterWeekly from '@/components/dashboard/PolicyCounterWeekly'
import UserExposureMedia from '@/components/analytics/UserExposureMedia'
import UniqueFields from '@/components/analytics/UniqueFields'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs'
import { getDirFromLang } from '@/utils'
import { MSW_ENABLED } from '@/utils/constants'

const Analytics = () => {
  const { t } = useTranslation()
  const chartConfigData = useAppSelector(state => state.companyConfig.charts)
  const language = useAppSelector(state => state.companyConfig.language);
  const { loading } = useAppSelector(analyticsSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    getFirstConversationMonth()
  }, [])

  const getFirstConversationMonth = useCallback(() => {
    try {
      dispatch(getDashboardStatRequest())
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
    }
  }, [])
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className='flex flex-1 flex-col flex-wrap'>
          <DateSelectPane className='!me-0 !h-fit' />
          <Tabs dir={getDirFromLang(language)} defaultValue='overview' className='w-full mt-2 flex-1'>
            <TabsList
              className={`grid w-full max-w-md bg-gray-200 rounded-md ms-6 p-1.5 ${
                MSW_ENABLED ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              <TabsTrigger className='analytics-tab-trigger' value='overview'>
              {t("analytics.overview")}
              </TabsTrigger>
              {MSW_ENABLED && 
                <TabsTrigger className='analytics-tab-trigger' value='engagement'>
                {t("analytics.engagement")}
                </TabsTrigger>
              }
              <TabsTrigger
                className='analytics-tab-trigger'
                value='performance'
              >
              {t("analytics.performance")}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='overview'
              className='mt-3 max-h-page-scroll-230 grid md:grid-cols-2 gap-4 px-5'
            >
              {chartConfigData.includes('userAbandonment') && (
                <UserAbandonment chartData={mockUserAbadonmentFunnel} />
              )}
              {chartConfigData.includes('userReturnRate') && (
                <UserReturnRate chartData={mockUserReturnData} />
              )}

              {chartConfigData.includes('topFAQs') && (
                <TopQuestions
                  data={topFAQMockData}
                  title={t('chart.topFAQTitle')}
                />
              )}

              {chartConfigData.includes('topQuestionsAsked') && (
                <TopQuestions
                  data={topQuestionMockData}
                  description={topQuestionGroupingDescription}
                />
              )}

              <SentimentAnalysis />
              <UniqueFields />
              <Persona />
              <UserExposureMedia />
              <Nodes />
              <PolicyCounterWeekly />
            </TabsContent>

            <TabsContent
              value='engagement'
              className='max-h-page-scroll-230 grid md:grid-cols-2 gap-4 px-5'
            >
              {chartConfigData.includes('userPersonaClassification') && (
                <UserPersona chartData={userPersonaSample} />
              )}
              {chartConfigData.includes('dataCollectedInConversation') && (
                <UserMessagesPerConversation
                  chartData={singleDataCollectedMock}
                  title={t('chart.dataCollectedInConversation')}
                  description={t('chart.dataCollectedInConversationPercent')}
                  xAxisLabel={t('abTesting.conversationPercent')}
                  yAxisLabel={t('abTesting.dataCollectedPercent')}
                />
              )}
              {chartConfigData.includes('userFeedback') && (
                <UserFeedback
                  averageRating={feedbackMockData?.feedbackData?.averageRating}
                  data={feedbackMockData?.feedbackData.data}
                />
              )}
            </TabsContent>

            <TabsContent
              value='performance'
              className='max-h-page-scroll-230 grid md:grid-cols-2 gap-4 px-5'
            >
              <TopLinks />
              <UserRating />
              <ThumbsUpAndDownCount />
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  )
}

export default Analytics
