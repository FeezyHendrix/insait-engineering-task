import {
    CreateShape,
    axisTick,
    barSizeAndRadius,
    barchartMargin,
  } from '@/config/chartOptions'
  import { APP_WHITE } from '@/config/colors'
  import { createGradient } from '@/config/gradients'
  import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
  } from 'recharts'
  import ChartLoader from '../layout/ChartLoader'
  import { useAppDispatch } from '@/hook/useReduxHooks'
  import { toast } from 'react-toastify'
  import { useEffect, useState } from 'react'
  import { getChartDataWithDates, updateFavoriteCharts } from '@/redux/slices/analytics/request'
  import { getErrorMessage } from '@/utils'
  import { useTranslation } from 'react-i18next'
  import { useSelector } from 'react-redux'
  import { RootState } from '@/redux/store'
import { barChartYAxisFormatting } from '@/utils/data'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
  
  const SuccessfulPercentage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()  
    const [data, setData] = useState<Array<{ [key: string]: number }>>([])
    const [loading, setLoading] = useState(false)
    const [highestPercentage, setHighestPercentage] = useState<number>(0);
    const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
    const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
    const language = useSelector((state: RootState) => state.companyConfig.language);
    const chartType = 'successfulPercentage'
    const { isFavorite } = useFavoriteCharts(chartType);

    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await dispatch(
          getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, language, flowId: selectedFlow})
        )
        const responsePayload = await response.payload
        if (Array.isArray(responsePayload)) {
          setData(responsePayload);
          setHighestPercentage(generateYAxisPeak(responsePayload));
          return
        }
        toast.error(t('feedback.errorWrong'))
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        toast.error(errorMessage || t('feedback.errorWrong'))
      } finally {
        setLoading(false)
      }
    }

    const isDataEmpty = (data: Array<{ [key: string]: number }>): boolean => {
      return data.length === 1 && data[0][t('chart.successful')] === 0
    };

    const generateYAxisPeak = (responsePayload: Array<{ [key: string]: number }>): number => {
      return Math.min(
        (Math.round((responsePayload.reduce((acc, item) => item[t('chart.successful')] > acc ? item[t('chart.successful')] : acc, 0) 
          / barChartYAxisFormatting.percentThreshold * 100) 
          / barChartYAxisFormatting.roundOff) * 
          barChartYAxisFormatting.roundOff), 
        100)
    };
    
    useEffect(() => {
      fetchChartData()
    }, [globalDate])
  
    return (
      <div className='flex w-full mb-5 pr-3'>
        <div className='col-span-1 w-full bg-white px-3 rounded-xl h-[490px] md:h-[390px] pb-4 mb-8 md:mb-0'>
          <div className='flex justify-between items-center p-4'>
            <h4 className='text-md font-medium'>{t('chart.successfulConversationPercentage')}</h4>
            <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
          </div>
          <p className='pb-4 pl-4'></p>
  
          <ChartLoader
            type='dashboard'
            hasData={Array.isArray(data)}
            loading={loading}
          > 
            { !isDataEmpty(data) ?
              <ResponsiveContainer width='100%' height='80%'>
              <ComposedChart
                        width={500}
                        height={300}
                        data={data}
                        margin={barchartMargin}
                        >
                        {createGradient('gradientBlue', '#067CC1', '#4bc5ff')}
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
                            dataKey='label'
                            tick={axisTick}
                            angle={-30}
                            interval={0}
                            tickMargin={10}
                        />
                        <YAxis
                            tickLine={false}
                            strokeOpacity={0.4}
                            padding={{ top: 10 }}
                            tick={axisTick}
                            label={{
                              value: t('chart.successPercentage'),
                              angle: -90,
                              position: 'insideLeft',
                              style: { textAnchor: 'middle' },
                            }}
                            allowDataOverflow={true}
                            domain={[0, highestPercentage]}
                        />
                        <Tooltip
                            formatter={(value, name): any => {
                            const ignorePercentage: boolean = name.toString().includes("FAQ");
                            return`${value}${ignorePercentage ? '' : '%'}`
                            }} 
                        />
                        <Bar 
                            dataKey={t('chart.successful')}
                            stackId="a" 
                            fill='url(#gradientGreen)'
                            {...barSizeAndRadius}
                        />
                        </ComposedChart>
            </ResponsiveContainer>
            :
            <div className='flex justify-center items-center h-full'>
              <p>{t('feedback.noData')}</p>
            </div>
            }
          </ChartLoader>
        </div>
      </div>
    )
  }
  
  export default SuccessfulPercentage