import { CustomToolTip, axisTick } from '@/config/chartOptions'
import { createGradientWithOpacity } from '@/config/gradients'
import { ErrorAnalysisPropsType } from '@/types/dashboard'
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
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const ErrorAnalysis = (props: ErrorAnalysisPropsType) => {
  const { selectedMonth, setSelectedMonth, chartData } = useChartDataFetch(
    props.chartData,
    'weekly',
    'dashboard',
    'errorAnalysisData'
  )
  const companyCharts = useSelector((state: RootState) => state.companyConfig.charts)


  return (
        <>
        {companyCharts.includes('errorAnalytsis') ?
        <div className='col-span-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
            {/* Header */}
            <MonthSelectWithTitle
              title={`Error Analysis`}
              value={selectedMonth}
              onValueChange={value => setSelectedMonth(value)}
            />
      
            {/* Chart */}
            <ChartLoader type='dashboard' hasData={Array.isArray(chartData)}>
              <ResponsiveContainer width='100%' height='80%'>
                <AreaChart width={500} height={300} data={chartData}>
                  <CartesianGrid
                    strokeDasharray='7 7'
                    fill='#FFFFFF'
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
                  <Tooltip content={<CustomToolTip additionalText={'Errors'} />} />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#067CC1'
                    dot={false}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill='url(#colorUv)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartLoader>
          </div>:<></>}
          </>
   
  )
}

export default ErrorAnalysis
