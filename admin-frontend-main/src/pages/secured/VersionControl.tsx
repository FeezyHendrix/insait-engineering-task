import UserAbandonment from '@/components/analytics/UserAbandonment'
import AverageInteractionDuration from '@/components/dashboard/AverageInteractionDuration'
import UserMessagesPerConversation from '@/components/dashboard/UserMessagesPerConversation'
import { donutChartOptions } from '@/config/chartOptions'
import { CardVersionControl } from '@/types/chart'
import {
  apexMockFunnelCurrent,
  apexMockFunnelUpdate,
  dataCollectedInConversationData,
  sentimentMockData,
  sentimentMockDataUpdate,
  userMessageByConversationData,
} from '@/utils/mock'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

const VersionControl = () => {
  const { t } = useTranslation()

  return (
    <section className='flex-1 px-5 pt-0 pb-5 rounded-2xl flex flex-col'>
      <section className='w-full flex flex-col md:flex-row rounded-xl h-fit mb-5 gap-1'>
        <Card
          title={t('dashboard.totalMessageCount')}
          current={'15,614'}
          update={'1,583'}
        />
        <Card
          title={t('dashboard.totalConversations')}
          current={'1,841'}
          update={'172'}
        />
        <Card
          title={t('dashboard.chatCompletion')}
          current={'18%'}
          update={'21%'}
        />
      </section>

      <section className='flex flex-col gap-6'>
        <div className='flex flex-col md:flex-row gap-2'>
          <div className='w-full md:w-1/2'>
            <UserMessagesPerConversation
              includeUpdate={true}
              chartData={userMessageByConversationData}
            />
          </div>
          <div className='w-full md:w-1/2'>
            <div className='flex gap-4 h-[390px]'>
              <AverageInteractionDuration
                value={835}
                title={t('abTesting.currentVersion')}
                showFull={true}
              />
              <AverageInteractionDuration
                value={860}
                title={t('abTesting.update')}
                showFull={true}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-2'>
          <div className='w-full md:w-1/2'>
            <UserAbandonment
              title={t('abTesting.currentVersion')}
              chartData={apexMockFunnelCurrent}
            />
          </div>
          <div className='w-full md:w-1/2'>
            <UserAbandonment
              title={t('abTesting.update')}
              chartData={apexMockFunnelUpdate}
            />
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-2'>
          <div className='w-full md:w-1/2'>
            <UserMessagesPerConversation
              includeUpdate={true}
              chartData={dataCollectedInConversationData}
              title={t('abTesting.dataCollectedInConversation')}
              description={t('abTesting.percOfDatCollectedInConversation')}
              xAxisLabel={t('abTesting.conversationPercent')}
              yAxisLabel={t('abTesting.dataCollectedPercent')}
            />
          </div>

          <div className='w-full md:w-1/2 md:h-[400px] flex-1 bg-white px-4 rounded-xl h-[390px] pb-4 pt-4 mb-8 md:mb-0'>
            <h4 className='text-xl bolder-text py-4'>
              {t('chart.sentimentAnalysis')}
            </h4>

            <div className='w-full h-full flex justify-center items-center'>
              <div className='h-full w-1/2 min-h-[300px]'>
                <p className='text-center bold-text md:mb-6'>
                  {t('abTesting.currentVersion')}
                </p>

                <Chart
                  options={donutChartOptions(
                    ['#1BA3F2', '#49DE61', '#F8B11B'],
                    sentimentMockData?.label,
                    sentimentMockData?.data
                  )}
                  series={sentimentMockData.data}
                  type='donut'
                  width={'100%'}
                  height={'80%'}
                />
              </div>
              <div className='h-full w-1/2 min-h-[300px]'>
                <p className='text-center bold-text md:mb-6'>
                  {t('abTesting.update')}
                </p>

                <Chart
                  options={donutChartOptions(
                    ['#1BA3F2', '#49DE61', '#F8B11B'],
                    sentimentMockDataUpdate?.label,
                    sentimentMockDataUpdate?.data
                  )}
                  series={sentimentMockDataUpdate.data}
                  type='donut'
                  width={'100%'}
                  height={'80%'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

export default VersionControl


const Card = ({ title, current, update }: CardVersionControl) => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center justify-center w-full md:w-1/3 rounded-xl h-8 md:h-64 bg-white p-5 m-1'>
      <h3 className='text-xl text-center font-medium mb-4'>{title}</h3>
      <div className='flex gap-4'>
        <div className='flex flex-col items-center'>
          <p className='font-semibold text-current'>
            {t('abTesting.currentVersion')}
          </p>
          <p>{current}</p>
        </div>
        <div className='h-full w-px bg-slate-300' />
        <div className='flex flex-col items-center'>
          <p className=' font-semibold text-update'>{t('abTesting.update')}</p>
          <p>{update}</p>
        </div>
      </div>
    </div>
  )
}
