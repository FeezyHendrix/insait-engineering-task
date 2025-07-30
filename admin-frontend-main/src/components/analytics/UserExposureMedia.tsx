import { funnelChartOptions } from '@/config/chartOptions';
import Chart from 'react-apexcharts';
import ChartLoader from '../layout/ChartLoader';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hook/useReduxHooks';
import { getChartDataWithLanguage, getChartDataWithMedia } from '@/redux/slices/analytics/request';
import { toast } from 'react-toastify';
import { ExposureChartType } from '@/types/chart';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChartFavoriteStar from '../elements/ChartFavoriteStar';
import useFavoriteCharts from '@/hook/useFavoriteCharts';

const UserExposureMedia = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<ExposureChartType>({ data: [], categories: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const language = useSelector((state: RootState) => state.companyConfig.language);
  const chartType = 'userExposureMedia';
  const { isFavorite } = useFavoriteCharts(chartType);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [mediaOptions, setMediaOptions] = useState<string[]>([]);
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);

  const fetchChartData = async () => {
    try {
        setLoading(true);
        const { payload: response } = await dispatch(
            getChartDataWithMedia({ chartType, language, startDate: globalDate.startDate, endDate: globalDate.endDate, media: selectedMedia, flowId: selectedFlow })
        );
        if(!Array.isArray(response?.chartData?.data)) {
            setLoading(false);
            return
        };

      setData(response.chartData);
      setMediaOptions(response.mediaOptions);
    } catch (error) {
      toast.error(t('feedback.errorWrong'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [globalDate, selectedMedia]);

  return (
    true && (
      <>
        <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
          <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
            <div className='flex flex-row justify-between items-start py-4 px-2 pb-2'>
              <h4 className='text-xl bolder-text pt-4'>{t('chart.exposure')}</h4>
              <div className='flex items-center space-x-2'>
                <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
              </div>
            </div>
            <>
              {loading ? (
                <div>
                  <p>{t('chart.fetchingData')}</p>
                </div>
              ) : (
                <div className='flex flex-row items-center'>
                  <div className='flex flex-col items-start space-y-2'>
                    {mediaOptions.map((media, index) => (
                      <div key={index} className='flex items-center'>
                        <input
                          id={`checkbox-table-search-${index}`}
                          type='checkbox'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                          onChange={() => {
                            if (selectedMedia.includes(media)) {
                              setSelectedMedia(selectedMedia.filter((item) => item !== media));
                            } else {
                              setSelectedMedia([...selectedMedia, media]);
                            }
                          }}
                          checked={selectedMedia.includes(media)}
                        />
                        <label htmlFor={`checkbox-table-search-${index}`} className='ml-2'>
                          {media}
                        </label>
                      </div>
                    ))}
                  </div>
                  <ChartLoader type='analytics' hasData={Array.isArray(data?.data)}>
                    <div className='w:full h-full'>
                      <Chart
                        className='flex justify-center'
                        type='bar'
                        //@ts-ignore
                        options={funnelChartOptions(data.categories, true)}
                        series={[{ data: data.data }]}
                        height={250}
                        width={'100%'}
                      />
                    </div>
                  </ChartLoader>
                </div>
              )}
            </>
          </div>
        </div>
      </>
    )
  );
};

export default UserExposureMedia;