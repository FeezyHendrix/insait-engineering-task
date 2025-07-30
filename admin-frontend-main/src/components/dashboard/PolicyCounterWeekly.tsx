import { useEffect, useState } from 'react'
import {
  CreateShape,
  axisTick,
  barSizeAndRadius,
  barchartMargin,
} from '@/config/chartOptions'
import { APP_WHITE } from '@/config/colors'
import { createGradient } from '@/config/gradients'
import { PolicyCounterWeeklyPropsType } from '@/types/dashboard'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Rectangle,
} from 'recharts'
import ChartLoader from '../layout/ChartLoader'
import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import useChartsFetch from '@/hook/useChartsFetch'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { getUserInteractionChartData } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'

const PolicyCounterWeekly = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const [policyCounterWeekly, setPolicyCounterWeekly] = useState<any[]>([])
  const isAdminOrInternalUser = useIsInternalOrAdminUser()
  const policyCounterChartData = async (chartType: string) => {
    try {
        const result = await dispatch(getUserInteractionChartData(chartType));
        setPolicyCounterWeekly(result.payload)
    } catch (error) {
        toast.error(t('feedback.error'));
    }
  };
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)
  const { selectedMonth, setSelectedMonth, chartData } = useChartsFetch(
    policyCounterWeekly,
    'policyCounter',
    'charts',
    'policyCounter'
  );
  const chartType = 'policyCounter'
  const { isFavorite } = useFavoriteCharts(chartType);

  useEffect(() => {
    policyCounterChartData(chartType)
  }, [])

    return (
      <>
        {chartConfigData.includes('policyCounter') && isAdminOrInternalUser ?
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
          <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
            <div className='flex justify-between items-center p-4'>
              <MonthSelectWithTitle
                title={t('menu.securityViolation')}
                value={selectedMonth}
                onValueChange={value => setSelectedMonth(value)}
              />
              <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
            </div>
            <p className='pb-4 ps-4'>{t('chart.totalWeeklySecurityViolation')}</p>
              <ChartLoader type='dashboard' hasData={Array.isArray(chartData)}>
                <ResponsiveContainer width='100%' height='80%'>
                  <BarChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={barchartMargin}
                  >
                    {createGradient('gradientGreen', 'forestgreen', '#90EE90')}
                    
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
                      label={{
                        value: t("chart.weekly"),
                        offset: 0,
                        position: 'insideBottom',
                      }}
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
                    <Tooltip />

                    <Bar 
                      dataKey="value" 
                      fill="forestgreen" 
                      activeBar={<Rectangle fill="pink" stroke="indianred" />} 
                      {...barSizeAndRadius}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartLoader>
            </div>
          </div>:<></>}
          </>
    )
  }
  
  export default PolicyCounterWeekly
