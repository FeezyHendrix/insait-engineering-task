  import {
    CreateShape,
    CustomToolTip,
    axisTick,
    barchartMargin,
    getChartDataOrPlaceholder,
    toolTipConfig,
  } from '@/config/chartOptions'
  import { APP_WHITE } from '@/config/colors'
  import { createGradient } from '@/config/gradients'
  import { SecurityModuleCostPropsType } from '@/types/dashboard'
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
  import useChartDataFetch from '@/hook/useChartDataFetch'
  import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

  const SecurityModuleCost = (props: SecurityModuleCostPropsType) => {
    const { t } = useTranslation();
  const { selectedMonth, setSelectedMonth, chartData } = useChartDataFetch(
    props.chartData,
    'securityModuleCost',
    'dashboard',
    'securityModuleCost'
  )
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

    return (
      <>
    {chartConfigData.includes('securityModuleCost') ?
    <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[390px] pb-4 mb-8 md:mb-0'>
      <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
        <MonthSelectWithTitle
          title={t('chart.moduleCost')}
          value={selectedMonth}
          onValueChange={value => setSelectedMonth(value)}
        />
        <p className='pb-4 ps-2'>{t('chart.costOfConversationsPerWeek')}</p>
        <ChartLoader type='dashboard' hasData={Array.isArray(chartData)}>
          <ResponsiveContainer width='100%' height='80%'>
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={barchartMargin}
            >
        
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
                unit="$"
              />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="Security" 
                stackId="a" 
                fill="#8884d8" 
                barSize={30}
              />
              <Bar 
                dataKey="Conversation" 
                stackId="a" 
                fill="#82ca9d" 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartLoader>
      </div>
    </div>: <></>}
    </>
    );
        
  }
  
  export default SecurityModuleCost
  