import { donutChartOptions, getChartDataOrPlaceholder } from '@/config/chartOptions'
import { UserPersonaPropsType } from '@/types/analytics'
import Chart from 'react-apexcharts'
import ChartLoader from '../layout/ChartLoader'
import { useTranslation } from 'react-i18next'

const UserPersona = ({ chartData, loading }: UserPersonaPropsType) => {
  const { t } = useTranslation()
  const data = getChartDataOrPlaceholder(chartData, 'pie')

  return (
      <div className='flex mb-5 pe-3'>
        <div
          id='userPersona'
          className='col-span-1 h-[325px] p-4 w-full rounded-xl bg-white '
        >
          <h4 className='text-xl bolder-text py-4'>
            {t('chart.userPersonaClassification')}
          </h4>

          {/* Chart */}
          <ChartLoader loading={loading} type='analytics' hasData={Array.isArray(chartData?.data)}>
            <div className='w-full h-full'>
              <Chart
                options={donutChartOptions(
                  [
                    '#1BA3F2',
                    '#49DE61',
                    '#F8B11B',
                    '#9132DC',
                    '#49DE61',
                    '#96DC00',
                  ],
                  data?.label,
                  data?.data
                )}
                series={data?.data}
                type='donut'
                width={'100%'}
                height={'80%'}
              />
            </div>
          </ChartLoader>
        </div>
      </div>
  )
}

export default UserPersona
