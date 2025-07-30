import {
  CreateShape,
  CustomToolTip,
  axisTick,
  barSizeAndRadius,
  barchartMargin,
  toolTipConfig,
} from '@/config/chartOptions'
import { APP_WHITE } from '@/config/colors'
import { createGradient } from '@/config/gradients'
import { ProductPopularityPropsType } from '@/types/dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import ChartLoader from '../layout/ChartLoader'
import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import useChartDataFetch from '@/hook/useChartDataFetch'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const ProductPopularity = (props: ProductPopularityPropsType) => {
  const { selectedMonth, setSelectedMonth, chartData } = useChartDataFetch(
    props.chartData,
    'product',
    'dashboard',
    'productPopularityData'
  )
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

  return (
        <>
        {chartConfigData.includes('productPopularity') ?
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
            {/* Header */}
            <MonthSelectWithTitle
              title={`Product Popularity`}
              value={selectedMonth}
              onValueChange={value => setSelectedMonth(value)}
            />
      
            {/* Chart */}
            <ChartLoader type='dashboard' hasData={Array.isArray(chartData)}>
              <ResponsiveContainer width='100%' height='80%'>
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={barchartMargin}
                >
                  {createGradient('gradient', '#1BA3F2', '#067CC1')}
      
                  <CartesianGrid
                    strokeDasharray='7 7'
                    fill={APP_WHITE}
                    opacity={0.6}
                    horizontal={false}
                    vertical={false}
                  />
                  <XAxis
                    tickLine={false}
                    strokeOpacity={0.4}
                    dataKey='name'
                    tick={axisTick}
                  />
                  <YAxis
                    tickLine={false}
                    strokeOpacity={0.4}
                    padding={{ top: 10 }}
                    tick={axisTick}
                  />
                  <Tooltip
                    cursor={toolTipConfig}
                    content={<CustomToolTip additionalText={'people'} />}
                  />
                  <Bar
                    dataKey='value'
                    fill='url(#gradient)'
                    {...barSizeAndRadius}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartLoader>
          </div>:<></>}
          </>
  )
}

export default ProductPopularity
