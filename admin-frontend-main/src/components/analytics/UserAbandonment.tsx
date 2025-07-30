import { UserAbandonmentPropsType } from '@/types/analytics'
import ChartLoader from '../layout/ChartLoader'
import { funnelChartOptions } from '@/config/chartOptions'
import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'

const UserAbandonment = ({ title, chartData, loading }: UserAbandonmentPropsType) => {
  const { t } = useTranslation()

  const sortedData = chartData?.slice().sort((a, b) => b.value - a.value)

  const sortedApexData = {
    data: sortedData?.map(item => item.value),
    categories: sortedData?.map(item => item.name),
  }

  return (
    <div className='col-span-1 bg-white px-3 rounded-xl h-[325px] mb-8 md:mb-0 w-full overflow-hidden'>
      <h4 className='text-xl p-4 bolder-text'>{t('chart.userPassThroughRate')}</h4>

      <ChartLoader type='analytics' loading={loading} hasData={Array.isArray(chartData)}>
        {sortedApexData?.data && sortedApexData.data.length > 0 && (
          <div className=''>
            <Chart
              className="flex justify-center"
              type='bar'
              //@ts-ignore
              options={funnelChartOptions(sortedApexData.categories)}
              series={[
                {
                  data: sortedApexData.data,
                },
              ]}
              height={250}
              width={'100%'}
            />
          </div>
        )}
      </ChartLoader>

      {title && (
        <p className='font-semibold text-center pt-0 pb-4 mr-[200px]'>
          {title}
        </p>
      )}
    </div>
  )
}

export default UserAbandonment
