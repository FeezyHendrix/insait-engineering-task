import { useEffect, useState } from 'react'
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Rectangle,
  LabelList,
} from 'recharts'
import useChartsFetch from '@/hook/useChartsFetch'
import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
import { getChartDataWithMonth } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getErrorMessage } from '@/utils'
import { useTranslation } from 'react-i18next'
import { CustomToolTipType } from '@/types/chart'
import { transformRatingDataForChart } from '@/utils/chartHelper'
import { formatRating } from '@/utils/stringHelper'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'

const UserRating = () => {
    const { t } = useTranslation()
    const [data, setData] = useState<any[]>([])
    const [updatedChartData, setUpdatedChartData] = useState<any[]>([])
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false);
    const [dataIsEmpty, setDataIsEmpty] = useState<boolean>(false);
    const [totalRatings, setTotalRatings] = useState<number | null>(null);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const chartType = 'userRating'
    const { isFavorite } = useFavoriteCharts(chartType);

    const PercentTooltip = ({
      payload,
    }: CustomToolTipType) => {
      const data = payload?.[0]?.payload
      return (
        data?.count ? (
        <div className="bg-white p-2 rounded border border-gray-300">
          {`${data.percent}%, ${data.count} rating${data.count > 1 ? 's': ''}`}
        </div>
        ) : null
      )
    }

    const checkIfDataIsEmpty = (data: any[]) => {
      const totalPercent = data?.reduce((sum, item) => sum + item.percent, 0);
      setDataIsEmpty(!data || totalPercent === 0);
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
      'userRating',
      'charts',
      'userRating'
    )

    useEffect(() => {
      if (!chartData) return
      const { transformedData, totalRatings, averageRating } = transformRatingDataForChart(chartData);
      if (!transformedData || transformedData.length === 0) return
      setUpdatedChartData(transformedData);   
      setTotalRatings(totalRatings)
      setAverageRating(averageRating)
    }, [chartData])

    useEffect(() => {
    }, [totalRatings])

    useEffect(() => {
      checkIfDataIsEmpty(updatedChartData);
    }, [updatedChartData]);
    return (
      <>
    <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
      <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
        <div className='flex justify-between items-center p-4'>
          <MonthSelectWithTitle
          title={t('chart.userRatingTitle')}
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
          <strong className="ml-4">{t('chart.noUserRating')}</strong>
          ) : (
          <>
          { averageRating &&
            <h4 className="ml-4">
              {t('chart.averageRating')}: <strong>{formatRating(averageRating)}/5</strong>
            </h4>
          }
            <ResponsiveContainer width="100%" height="70%">
            <BarChart
              width={500}
              height={300}
              data={updatedChartData}
              margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
              <YAxis type="category" dataKey="name" />
              <Tooltip content={<PercentTooltip />} />
              <Bar dataKey="percent" fill="#FCD34D" activeBar={<Rectangle stroke="blue" />}>
              <LabelList dataKey="percentageString" position={'end'} fill="#0000000" />
              </Bar>
            </BarChart>
            </ResponsiveContainer>
          </>
          )}
        </div>
        </div>
     
      </>
    );
             
      }
  
  export default UserRating
  