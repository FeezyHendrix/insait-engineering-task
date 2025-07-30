import {
    CreateShape,
    axisTick,
    barSizeAndRadius,
    barchartMargin,
  } from '@/config/chartOptions'
  import { APP_WHITE } from '@/config/colors'
  import { createGradient } from '@/config/gradients'
  import { AverageLengthOfUserAndBotMessagesPropsType } from '@/types/dashboard'
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Rectangle,
    Legend,
  } from 'recharts'
  import ChartLoader from '../layout/ChartLoader'
  import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
  import useChartDataFetch from '@/hook/useChartDataFetch'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

  const AverageLengthOfUserAndBotMessages = (props: AverageLengthOfUserAndBotMessagesPropsType) => {
    const { t } = useTranslation();
    const { selectedMonth, setSelectedMonth, chartData } = useChartDataFetch(
      props.chartData,
      'averageLengthOfUserAndBotMessages',
      'dashboard',
      'averageLengthOfUserAndBotMessages'
    )
    const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

    return (
      <>
      {chartConfigData.includes('averageLengthOfUserAndBotMessages') ?
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[390px] pb-4 mb-8 md:mb-0'>
          <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0 '>
            <MonthSelectWithTitle
              title={t('chart.averageMessageLength')}
              value={selectedMonth}
              onValueChange={value => setSelectedMonth(value)}
            />
            <p className='pb-4 ps-4'>{t('chart.averageMessageLengthofUserAndBot')}</p>
              <ChartLoader type='dashboard' hasData={Array.isArray(chartData)}>
                <ResponsiveContainer width='100%' height='80%'>
                  <BarChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={barchartMargin}
                  >
                    {createGradient('gradientGreen', 'forestgreen', '#90EE90')}
                    {createGradient('gradientBlue', '#067CC1', '#4bc5ff')}
                    
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
                      label={{
                        fontSize: 10,
                        value: t('chart.avgNumOfWordsPerMsg'),
                        angle: -90,
                        position: 'insideBottomLeft',
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="Bot" 
                      fill='url(#gradientBlue)'
                      activeBar={<Rectangle fill="pink" stroke="indianred" />} 
                      {...barSizeAndRadius}
                    />
                    <Bar 
                      dataKey="User"
                      fill='url(#gradientGreen)'
                      activeBar={<Rectangle fill="gold" stroke="forestgreen" />} 
                      {...barSizeAndRadius}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartLoader>
            </div>
          </div> : <></>}</>
    )
  }
  
  export default AverageLengthOfUserAndBotMessages