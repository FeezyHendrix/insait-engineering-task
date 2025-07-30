import React, { useEffect } from 'react'
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
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getUserInteractionChartData } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'

const UserInteractionsMonthlyAndDaily = () => {
  const { t } = useTranslation()
  const [showLastWeekData, setShowLastWeekData] = React.useState(true)
  const [userInteractionWeekly, setUserInteractionWeekly] = React.useState<any[]>([])
  const [userInteractionDaily, setUserInteractionDaily] = React.useState<any[]>([])
  const dispatch = useAppDispatch()
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)
  const chartType = 'userInteraction'
  const { isFavorite } = useFavoriteCharts(chartType);

  function handleMonthlyBtnClick() {
    setShowLastWeekData(!showLastWeekData)
  }

      const userInteractionChartData = async (chartType: string) => {
        try {
            const result = await dispatch(getUserInteractionChartData(chartType));
            setUserInteractionWeekly(result.payload.lastMonthData)
            setUserInteractionDaily(result.payload.lastWeekData)
        } catch (error) {
            toast.error(t('feedback.error'));
        }
      };

      useEffect(() => {
        userInteractionChartData(chartType)
      }, [])

    return (
      <>
        {chartConfigData.includes('userInteractions') ?
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
          <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
            <div className='flex flex-row justify-between items-start py-4 px-2 pb-2'>
              <h4 className='text-md font-medium'>
                {t('dashboard.interaction')}
              </h4>
                <div className='flex items-center space-x-2'>
                  <button
                    className='border rounded-lg py-2 px-2 h-fit pe-2 text-gray text-lg outline-none'
                    onClick={handleMonthlyBtnClick}
                  >
                    {showLastWeekData
                    ? t('dashboard.lastWeek')
                    : t('dashboard.lastMonth')}
                  </button>
                  <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
                </div>
            </div>

            <p className='pb-4 ps-4 text-sm'>
              {showLastWeekData
                ? t('dashboard.totalConversationCountWeek')
                : t('dashboard.totalConversationCountMonth')}
            </p>

            <ChartLoader type='dashboard' hasData={Array.isArray(showLastWeekData? userInteractionDaily : userInteractionWeekly)}>
              <ResponsiveContainer width='100%' height='80%'>
                <BarChart
                  width={500}
                  height={300}
                  data={showLastWeekData? userInteractionDaily : userInteractionWeekly}
                  margin={barchartMargin}
                >
                  {createGradient('gradientBlue', '#10b3e8', '#10b3e8')}
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
                    label={{value: "", offset: -5, position: "insideBottom"}}
                  />
                  <YAxis
                    tickLine={false}
                    strokeOpacity={0.4}
                    padding={{ top: 10 }}
                    tick={axisTick}
                    label={{
                      value: t('dashboard.conversations'),
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip cursor={toolTipConfig} content={<CustomToolTip />} />
                  <Bar
                    dataKey='value'
                    fill='url(#gradientBlue)'
                    {...barSizeAndRadius}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartLoader>
          </div>
        </div>:<></>}
        </>
    );
    
  }
  
  export default UserInteractionsMonthlyAndDaily
  