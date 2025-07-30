import {
    CreateShape,
    axisTick,
    barSizeAndRadius,
    barchartMargin,
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
  Rectangle,
  Legend,
} from 'recharts'
import ChartLoader from '../layout/ChartLoader'
import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getChartDataWithMonth } from '@/redux/slices/analytics/request'
import { getErrorMessage } from '@/utils'
import { toast } from 'react-toastify'
import useChartsFetch from '@/hook/useChartsFetch'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'

  const ThumbsUpAndDownCount = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<any[]>([])
    const [updatedChartData, setUpdatedChartData] = useState<any[]>([])
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [dataIsEmpty, setDataIsEmpty] = useState<boolean>(false);
    const chartType = 'messageReactionsChart';
    const { isFavorite } = useFavoriteCharts(chartType);
    
    const checkIfDataIsEmpty = (data: any[]) => {
      const totalLikes = data.reduce((sum, item) => sum + item.Likes, 0);
      const totalDislikes = data.reduce((sum, item) => sum + item.Dislikes, 0);
      setDataIsEmpty(!data || totalLikes + totalDislikes === 0);
    };

    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await dispatch(getChartDataWithMonth({ month: selectedMonth, chartType }));
        setData(response.payload);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('feedback.errorWrong'));
      } finally {
        setLoading(false)
      };
    };

    useEffect(() => {
      fetchChartData();
    }, []);
    
    const { selectedMonth, setSelectedMonth, chartData } = useChartsFetch(
      data,
      'messageReactionsChart',
      'charts',
      'messageReactionsChart'
    );

    useEffect(() => {
      if (!chartData || !chartData.length) return;
      setUpdatedChartData(chartData);
    }, [chartData]);

    useEffect(() => {
      checkIfDataIsEmpty(updatedChartData);
    }, [updatedChartData]);

  
    
    return (
      <>
    <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
          <div className='flex justify-between items-center p-4'>
            <MonthSelectWithTitle
              title={t('menu.messageReactions')}
              value={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
            />
            <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
            </div>
            {loading ? (
              <div>
                <p>{t('feedback.fetching')}</p>
              </div>
            ) : dataIsEmpty ? (
              <strong className="ml-4">{t('chart.noMessageReactions')}</strong>
            ) : (
              <>
                <p className="pb-4 ps-4">{t('chart.totalMsgLikeDislike')}</p>
                <ChartLoader type="dashboard" hasData={Array.isArray(updatedChartData)}>
                  <ResponsiveContainer width="100%" height="70%">
                    <BarChart
                      width={500}
                      height={300}
                      data={updatedChartData}
                      margin={barchartMargin}
                    >
                      {createGradient('gradientGreen', 'forestgreen', '#90EE90')}
                      {createGradient('gradientRed', '#8B0000', '#FF6347')}
  
                      <CartesianGrid
                        strokeDasharray="7 7"
                        fill={APP_WHITE}
                        opacity={0.6}
                        horizontal={false}
                        vertical={false}
                      />
                      <XAxis
                        tickLine={false}
                        strokeOpacity={0.4}
                        dataKey="name"
                        tick={axisTick}
                      />
                      <YAxis
                        tickLine={false}
                        strokeOpacity={0.4}
                        padding={{ top: 10 }}
                        tick={axisTick}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Likes"
                        fill="forestgreen"
                        activeBar={<Rectangle fill="pink" stroke="indianred" />}
                        {...barSizeAndRadius}
                      />
                      <Bar
                        dataKey="Dislikes"
                        fill="indianred"
                        activeBar={<Rectangle fill="gold" stroke="forestgreen" />}
                        {...barSizeAndRadius}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartLoader>
              </>
            )}
          </div>
        </div>
      </>
    )
  }
  
  export default ThumbsUpAndDownCount
