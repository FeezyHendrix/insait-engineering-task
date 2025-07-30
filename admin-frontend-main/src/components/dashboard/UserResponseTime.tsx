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
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getChartDataWithDates } from '@/redux/slices/analytics/request'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { toast } from 'react-toastify'
import { BarChartType } from '@/types/chart'
import { useTranslation } from 'react-i18next'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'

  const UserResponseTime = () => {
        const { t } = useTranslation();
        const [data, setData] = useState<Array<BarChartType> | null>(null);
        const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts);
        const dispatch = useAppDispatch();
        const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
        const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
        const chartType = 'userResponseTime'
        const { isFavorite } = useFavoriteCharts(chartType);

        const fetchChartData = async () => {
          try {
            const response = await dispatch(getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow}));
            setData(response.payload);            
          } catch (error: any) {
            toast.error(error?.message || t('feedback.errorWrong'))
          };
        };

        useEffect(() => {
          fetchChartData();
        }, [globalDate]);
      
        return (
          <>
          {chartConfigData.includes('responseTimeFromAClient') ?
            <>
            <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[390px] pb-4 mb-8 md:mb-0'>
                <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
                <div className='flex justify-between items-center p-4'>
                  <h4 className='text-md font-medium'>
                    {t('dashboard.userResponseTime')}
                  </h4>
                  <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
                </div>
                  <p className='pb-4 ps-4 text-sm'>
                    {t('dashboard.distributionOfUserResponseTime')}
                  </p>
                  <>
                    {data ?
                      <ChartLoader type='dashboard' hasData={Array.isArray(data)}>
                        <ResponsiveContainer width='100%' height='80%'>
                          <BarChart
                            width={500}
                            height={300}
                            data={data}
                            margin={barchartMargin}
                          >
                            {createGradient('gradient', '#1BA3F2', '#10b3e8')}
              
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
                                value: t('dashboard.userResponseTime'),
                                offset: -5,
                                position: 'insideBottom',
                              }}
                            />
                            
                            <YAxis
                              tickLine={false}
                              strokeOpacity={0.4}
                              padding={{ top: 10 }}
                              tick={axisTick}
                              label={{
                                value: t('dashboard.messages'),
                                angle: -90,
                                offset: -10,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' },
                              }}
                            />
                            <Tooltip
                              cursor={toolTipConfig}
                              content={<CustomToolTip />}
                            />
                            <Bar
                              dataKey='value'
                              fill='url(#gradient)'
                              {...barSizeAndRadius}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartLoader>
                      :
                      <div className="flex justify-center items-center p-8">
                        <p className="main-small-container__result">
                          {t("feedback.loading")}
                        </p>
                      </div>

                    }
                  </>
                  
                </div>
              </div>
            </>
            :<></>}
            </>
        );
        
      }
  
  export default UserResponseTime
  