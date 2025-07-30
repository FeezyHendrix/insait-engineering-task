import './styles/index.css';
import durationImg from '@image/icons/duration.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/hook/useReduxHooks';
import { useEffect, useState } from 'react';
import { getChartDataWithDates } from '@/redux/slices/analytics/request';
import { formatInteractionDuration } from '@/utils/chartHelper';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import useFavoriteCharts from '@/hook/useFavoriteCharts';
import ChartFavoriteStar from '../elements/ChartFavoriteStar';

interface AverageInteractionDurationProp {
  title?: string
  value?: number
  showValue?: boolean
  showFull?: boolean
}

const AverageInteractionDuration: React.FC<AverageInteractionDurationProp> = ({ title, showFull, value, showValue }) => {
  const { t } = useTranslation();
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts);
  const [data, setData] = useState<number | null>(null);
  const [displayDuration, setDisplayDuration] = useState<string>("-")
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
  const chartType = 'interactionDuration'
  const { isFavorite } = useFavoriteCharts(chartType);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getChartDataWithDates({chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow}));
      setData(response.payload);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.message || t('feedback.errorWrong'))
      setLoading(false);
    };
  };

  useEffect(() => {
    if (!data) {
      setDisplayDuration("-");
      return;
    };
    const durationToDisplay = showValue ? `${data}` : formatInteractionDuration(data);    
    setDisplayDuration(durationToDisplay);
  }, [data]);

  useEffect(() => {
    if(value) {
      setData(value)
    } else {
      fetchChartData();
    }
  }, [globalDate]);


  return (
    <>
    { chartConfigData.includes('interactionDuration') ?
    <div className={`col-span-1 md:grid ${showFull ? 'md:grid-cols-5': 'md:grid-cols-10'} gap-4 w-full `}>
        {
              <div className={`col-span-5 flex flex-col  items-center bg-white rounded-2xl measure_container p-5 gap-5 mb-8 md:mb-0 relative`}>
                <div className="w-full flex justify-end">
                  <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
                </div>
                <img src={durationImg} alt='duration' width={72} height={72} />
                <h2 className='text-3xl bolder-text'>{loading ? t('feedback.loading') : displayDuration}</h2>
                <p className='text-gray text-xl text-center'>
                  { title ? title : (
                  <>
                  {t('dashboard.averageConversation')} <br /> {t('dashboard.duration')}
                  </>
                  )}
                </p>
              </div>
        }
    </div> : <></>}
    </>
  )
}

export default AverageInteractionDuration
