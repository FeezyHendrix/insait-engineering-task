import {
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
    Legend,
  } from 'recharts'
  import ChartLoader from '../layout/ChartLoader'
  import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getChartDataWithDates } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { BarChartType } from '@/types/chart'
import { useTranslation } from 'react-i18next'
import { UserMessagesPerConversationProps } from '@/types/dashboard'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'

  const ConversationDuration: React.FC<UserMessagesPerConversationProps> = ({ includeUpdate, title, description, xAxisLabel, yAxisLabel }) => {
        const { t } = useTranslation()
        const [data, setData] = useState<Array<BarChartType>>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
        const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
        const chartType = 'conversationDuration'
        const { isFavorite } = useFavoriteCharts(chartType);

        const dispatch = useAppDispatch();
        const fetchChartData = async () => {
          try {
            setLoading(true)
            const response = await dispatch(getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow}));
            if (!Array.isArray(response.payload)) return;
            setData(response.payload);            
          } catch (error: any) {
            toast.error(error?.message || t('feedback.errorWrong'));
          } finally {
            setLoading(false);
          };
        };

        const checkDataHasNonZeros = (data: Array<BarChartType>) => {
            return !data.every((item) => item.value === 0);
        };
      
        useEffect(() => {
          fetchChartData();
        }, [globalDate]);

        return (
          <>
          {
          <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
            
              <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
                <div className='flex justify-between items-center p-4'>
                  <h4 className='text-md font-medium'>
                    {title || t('dashboard.conversationDurationTitle')}
                  </h4>
                  <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
                </div>
                <p className='pb-4 ps-4 text-sm'>
                  {description || t('dashboard.conversationDurationSub')}
                </p>
                <ChartLoader
                  loading={loading}
                  type='dashboard'
                  hasData={Array.isArray(data)}
                >
                  {
                    checkDataHasNonZeros(data) ?
                    <ResponsiveContainer width='100%' height='80%'>
                    <BarChart
                      width={500}
                      height={300}
                      data={data}
                      margin={barchartMargin}
                    >
                      {createGradient('gradientBlue', '#067CC1', '#4bc5ff')}
                      {createGradient('gradientPurple', '#8A2BE2', '#D8BFD8')}
        
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
                          value: xAxisLabel ?? t('dashboard.conversationDuration'),
                          offset: -4,
                          position: 'insideBottom',
                        }}
                      />
                      
                      <YAxis
                        tickLine={false}
                        strokeOpacity={0.4}
                        padding={{ top: 10 }}
                        tick={axisTick}
                        label={{
                          value: yAxisLabel ?? t('dashboard.conversations'),
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' },
                        }}
                      />
                    {includeUpdate === true ? (
                      <>
                        <Legend />

                        <Bar
                          dataKey='Current Version'
                          stackId='c'
                          fill='url(#gradientBlue)'
                          {...barSizeAndRadius}
                        />
                        <Bar
                          dataKey='Update'
                          stackId='b'
                          fill='url(#gradientPurple)'
                          {...barSizeAndRadius}
                        />
                        <Tooltip 
                        cursor={toolTipConfig} 
                        formatter={(value): any => `${value}%`}
                        />

                      </>
                    ) : (
                      <>
                      <Tooltip cursor={toolTipConfig} content={<CustomToolTip />} />
                      <Bar
                        dataKey='value'
                        fill='url(#gradientBlue)'
                        {...barSizeAndRadius}
                      />
                      </>
                    )}
                    </BarChart>
                  </ResponsiveContainer>
                  :
                  <div className="flex items-center justify-center h-full">
                    <p>{t('feedback.noData')}</p>
                  </div>
                  }
                </ChartLoader>
              </div>
            </div>
            }
            </>
        );
      }
  
export default ConversationDuration
  