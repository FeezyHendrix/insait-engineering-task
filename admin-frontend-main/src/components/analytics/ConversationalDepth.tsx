import { barSizeAndRadius, CreateShape } from '@/config/chartOptions'
import { APP_WHITE } from '@/config/colors'
import { multipleBargradientDefinition } from '@/config/gradients'
import { ConversationalDepthPropsType } from '@/types/analytics'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import ChartLoader from '../layout/ChartLoader'
import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import useChartDataFetch from '@/hook/useChartDataFetch'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

const ConversationalDepth = (props: ConversationalDepthPropsType) => {
  const { t } = useTranslation()
  const { selectedMonth, setSelectedMonth, chartData } = useChartDataFetch(
    props.chartData,
    'multichart',
    'analytics',
    'conversationDepthBarData'
  )
  const companyCharts = useSelector((state: RootState) => state.companyConfig.charts)

  return (
      <>
      {companyCharts.includes('conversationalDepth') ?
      <div className='flex md:w-1/2 mb-5 pr-3'>
        <div style={{width: "100%"}} className='col-span-1 bg-white px-3 rounded-xl h-[325px] mb-8 md:mb-0'>
          {/* Header */}
          <MonthSelectWithTitle
            title={t('chart.conversationalDepth')}
            value={selectedMonth}
            onValueChange={value => setSelectedMonth(value)}
          />

          {/* Chart */}
          <ChartLoader type='analytics' hasData={Array.isArray(chartData)}>
            <ResponsiveContainer width='100%' height='80%'>
              <BarChart width={730} height={250} data={chartData}>
                {multipleBargradientDefinition(
                  'gradient1',
                  'gradient2',
                  'gradient3'
                )}
                <CartesianGrid
                  strokeDasharray='7 7'
                  fill={APP_WHITE}
                  opacity={0.6}
                  horizontal={false}
                  vertical={false}
                />
                <XAxis dataKey='name' tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey='complex'
                  fill='url(#gradient1)'
                  {...barSizeAndRadius}
                />
                <Bar
                  dataKey='moderate'
                  fill='url(#gradient2)'
                  {...barSizeAndRadius}
                />
                <Bar
                  dataKey='simple'
                  fill='url(#gradient3)'
                  {...barSizeAndRadius}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartLoader>
        </div>
        </div>:<></>
      }      
      </>

  )
}

export default ConversationalDepth
