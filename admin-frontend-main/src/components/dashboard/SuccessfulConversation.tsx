import { barchartMargin, barSizeAndRadius } from '@/config/chartOptions'
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
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { getChartDataWithDates } from '@/redux/slices/analytics/request'
import { getErrorMessage } from '@/utils'
import { LabelValueType } from '@/types/chat'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'

const SuccessfulConversation = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const [data, setData] = useState<LabelValueType[]>([])
  const [loading, setLoading] = useState(false)
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
  const chartType = 'successfulConversation'
  const { isFavorite } = useFavoriteCharts(chartType);

  const fetchChartData = async () => {
    try {
      setLoading(true)
      const response = await dispatch(
        getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow})
      )
      const responsePayload = await response.payload
      if (Array.isArray(responsePayload)) {
        setData(responsePayload)
        return
      }
      toast.error(t('feedback.errorWrong'))
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchChartData()
  }, [globalDate])

  return (
    <div className='flex w-full mb-5 pr-3'>
      <div className='col-span-1 w-full bg-white px-3 rounded-xl h-[490px] md:h-[390px] pb-4 mb-8 md:mb-0'>
        <div className='flex justify-between items-center p-4'>
          <h4 className='text-md font-medium'>{t('chart.successfulConversationCount')}</h4>
          <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
        </div>

        <ChartLoader
          type='dashboard'
          hasData={Array.isArray(data)}
          loading={loading}
        >
          {data.length ? (
            <ResponsiveContainer width='100%' height='80%'>
              <BarChart
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
                  interval={0}
                  angle={-30}
                  tick={{ fill: '#9298A4', fontSize: 12, dy: 10 }}
                  label={{ value: '', offset: -5, position: 'insideBottom' }}
                />
                <YAxis
                  tickLine={false}
                  strokeOpacity={0.4}
                  padding={{ top: 10 }}
                  tick={{ fill: '#9298A4', fontSize: 12 }}
                  label={{
                    value: t('chart.successfulConversions'),
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E9EDF2',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                />
                <Bar
                  dataKey='Successful'
                  stackId='a'
                  fill='url(#gradientGreen)'
                  {...barSizeAndRadius}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className='flex justify-center items-center h-full'>
              <p>{t('feedback.noData')}</p>
            </div>
          )}
        </ChartLoader>
      </div>
    </div>
  )
}

export default SuccessfulConversation