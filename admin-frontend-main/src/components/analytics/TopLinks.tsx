import { checkIfActiveArrray } from '@/utils'
import ChartLoader from '../layout/ChartLoader'
import QuestionRender from './mini-elements/QuestionRender'
import { QuestionRenderPropsType } from '@/types/analytics'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getChartData } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'

const TopLinks = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<Array<QuestionRenderPropsType>>([])
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const chartType = 'topLinks'
  const { isFavorite } = useFavoriteCharts(chartType);
  
  const fetchChartData = async () => {
    try {
      setLoading(true)
      const { payload: response } = await dispatch(getChartData(chartType));
      setData(response);          
    } catch (error) {
      toast.error(t('feedback.errorWrong'));
    } finally {
    setLoading(false)
    };
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className='col-span-1 md:h-[390px] p-4 w-full rounded-xl border bg-white '>
      <div className='flex justify-between items-center pe-4'>
        <h4 className='text-md text-black font-bold'>
          { t('chart.topLinks')}
        </h4>
        <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
      </div>

      <ChartLoader
        loading={loading}
        type='analytics'
        hasData={Array.isArray(data)}
      >
        <div className='mt-2 md:overflow-y-scroll h-full md:h-4/5 md:pr-6'>
          {data!.length > 0 && "description" && (
            <p className='pb-2 text-sm font-semibold'> {t('chart.linksDescription')}</p>
          )}
          {checkIfActiveArrray(data) ? (
            data!
              .sort((a: any, b: any) => b.count - a.count)
              .map((question: QuestionRenderPropsType) => (
                <QuestionRender
                  key={question.id}
                  count={question?.count || 1}
                  text={question.text}
                  displayAsLink={true}
                />
              ))
          ) : (
            <p className='w-full h-3/4 flex justify-center items-center'>
              {t('chart.noLinks')}
            </p>
          )}
        </div>
      </ChartLoader>
    </div>
  )
}

export default TopLinks
