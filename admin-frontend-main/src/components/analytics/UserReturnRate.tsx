import { CustomToolTip, axisTick } from '@/config/chartOptions'
import { APP_WHITE } from '@/config/colors'
import { createGradientWithOpacity } from '@/config/gradients'
import { UserReturnRatePropsType } from '@/types/analytics'
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts'
import ChartLoader from '../layout/ChartLoader'
import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import useChartDataFetch from '@/hook/useChartDataFetch'
import { useTranslation } from 'react-i18next'

const UserReturnRate = (props: UserReturnRatePropsType) => {
  const { t } = useTranslation()
  const { selectedMonth, setSelectedMonth, chartData } = useChartDataFetch(
    props.chartData,
    'weekly',
    'analytics',
    'userReturnData'
  )

  return (
      <div className='flex mb-5 pe-3'>
        <div className='col-span-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
          {/* Header */}
          <MonthSelectWithTitle
            title={t('chart.userReturnRate')}
            value={selectedMonth}
            onValueChange={value => setSelectedMonth(value)}
          />

          {/* Chart */}
          <ChartLoader loading={props?.loading} type='analytics' hasData={Array.isArray(chartData)}>
            <ResponsiveContainer width='100%' height='65%'>
              <AreaChart width={500} height={300} data={chartData}>
                <CartesianGrid
                  strokeDasharray='7 7'
                  fill={APP_WHITE}
                  opacity={0.6}
                  horizontal={false}
                />
                {createGradientWithOpacity(
                  'colorUv',
                  '#109AEB',
                  '#109AEB',
                  0.13,
                  0
                )}
                <XAxis dataKey='name' tick={axisTick} />
                <YAxis
                  tickMargin={10}
                  tickSize={1}
                  tickLine={false}
                  padding={{ top: 10 }}
                  tick={axisTick}
                />
                <Tooltip content={<CustomToolTip />} />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='#10b3e8'
                  dot={false}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill='url(#colorUv)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartLoader>
        </div>
      </div>
  )
}

export default UserReturnRate
