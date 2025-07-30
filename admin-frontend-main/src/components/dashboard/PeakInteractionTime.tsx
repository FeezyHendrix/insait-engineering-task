import { heatMapOptions } from '@/config/chartOptions'
import Chart from 'react-apexcharts'
import ChartLoader from '../layout/ChartLoader'
import HeatMapLegend from '../elements/HeatMapLegend'
import { arrangePeakDataDayOrder } from '@/utils/chartHelper'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getChartDataWithDates } from '@/redux/slices/analytics/request'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/utils'
import { useTranslation } from 'react-i18next'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'

const PeakInteractionTime = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<ApexAxisChartSeries>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)
  const dispatch = useAppDispatch();
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
  const chartType = 'peakInteractionTime'
  const { isFavorite } = useFavoriteCharts(chartType);

  const fetchChartData = async () => {
    try {
      setLoading(true)
      const response = await dispatch(getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow}));
      const updatedData = arrangePeakDataDayOrder(response.payload)
      setData(updatedData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('feedback.errorWrong'));
    } finally {
      setLoading(false)
    };
  };

  useEffect(() => {
    fetchChartData();
  }, [globalDate]);

  return (
    <>
    {chartConfigData.includes('peakInteractionTimes') ?
      <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[390px] pb-4 mb-8 md:mb-0'>
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
          <div className='flex justify-between items-center p-4'>
                <h4 className='text-md font-medium'>
                  {t('dashboard.peakInteractionTimes')}
                </h4>
                  <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
          </div>
          <p className='pb-4 ps-4 text-sm'>
            {t('dashboard.frequencyOfConversations')}
          </p>
          {/* Chart */}
          <ChartLoader loading={loading} type='dashboard' hasData={Array.isArray(data)}>
            <Chart
              options={heatMapOptions()}
              series={data}
              type='heatmap'
              width={'100%'}
              height={220}
            />
            <HeatMapLegend />
          </ChartLoader>
        </div>
    </div>:<></>}
    </>
  )
}

export default PeakInteractionTime
