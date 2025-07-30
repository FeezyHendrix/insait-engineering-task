import { useEffect, useState } from 'react'
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
    Legend,
    ComposedChart,
  } from 'recharts'
  import useChartsFetch from '@/hook/useChartsFetch'
  import MonthSelectWithTitle from '../elements/MonthSelectWithTitle'
  import { getChartDataWithMonth } from '@/redux/slices/analytics/request'
  import { toast } from 'react-toastify'
  import { useAppDispatch } from '@/hook/useReduxHooks'
import { transformAnsweredQuestionsDataToPercent } from '@/utils/chartHelper'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getErrorMessage } from '@/utils'
import { useTranslation } from 'react-i18next'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import { KeyTranslations } from '@/types/chart'
const AnsweredAndUnanswered = () => {
    const { t } = useTranslation()
    const [initialData, setInitialData] = useState<any[]>([])
    const [updatedChartData, setUpdatedChartData] = useState<any[]>([])
    const dispatch = useAppDispatch()
    const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)
    const [loading, setLoading] = useState<boolean>(false);
    const [dataIsEmpty, setDataIsEmpty] = useState<boolean>(false);
    const chartType = 'answeredAndUnanswered'
    const { isFavorite } = useFavoriteCharts(chartType);
    const { language } = useSelector((state: RootState) => state.companyConfig);
    const { selectedMonth, setSelectedMonth, chartData } = useChartsFetch(
      initialData,
      'answeredAndUnanswered',
      'charts',
      'answeredAndUnanswered'
    )
    const keyTranslations: KeyTranslations = {
      answered: {
        en: "Answered Questions",
        he: "שאלות שנענו"
      },
      unanswered: {
        en: "Unanswered Questions",
        he: "שאלות שלא נענו"
      }
    };

    const checkIfDataIsEmpty = (data: any[]) => {
      setDataIsEmpty(data.every(item => item[keyTranslations["answered"][language]] === 0 && item[keyTranslations["unanswered"][language]] === 0));
    };

    const fetchChartData = async () => {
      try {
        setLoading(true)
        if (!language) return;
        const response = await dispatch(getChartDataWithMonth({ month: selectedMonth, chartType, language }));
        if(Array.isArray(response?.payload)) {
          setInitialData(response.payload);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('feedback.errorWrong'));
      } finally {
        setLoading(false)
      };
    };
  
    useEffect(() => {
      fetchChartData();
    }, [language]);


    useEffect(() => {
      const updatedData = transformAnsweredQuestionsDataToPercent(chartData, keyTranslations, language);
      setUpdatedChartData(updatedData);      
    }, [chartData])

    useEffect(() => {
      checkIfDataIsEmpty(updatedChartData);
    }, [updatedChartData]);

        return (
          <>

            { chartConfigData.includes('queryKnowledgebase') ?

              <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
                <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
                <div className='flex justify-between items-center py-4'>
                  <MonthSelectWithTitle
                  title={t('dashboard.answeredQuestionTitle')}
                  value={selectedMonth}
                  onValueChange={value => setSelectedMonth(value)}
                  />
                  <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
                </div>
                  <p className='pb-4 ps-4 text-sm'>
                    {t('dashboard.answeredQuestionPercentage')}
                  </p>
                  {loading ? (
                    <div>
                      <p>{t('feedback.fetching')}</p>
                    </div>
                  ) : dataIsEmpty ?
                    <strong className='ml-4 text-sm'>
                      {t('dashboard.noAnsweredQuestion')}
                    </strong> 
                      :
                      <ResponsiveContainer width='100%' height='80%'>
                        <ComposedChart
                        width={500}
                        height={300}
                        data={updatedChartData}
                        margin={barchartMargin}
                        >
                        {createGradient('gradientBlue', '#10b3e8', '#4bc5ff')}
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
                            dataKey='name'
                            tick={axisTick}
                        />
                        <YAxis
                            tickLine={false}
                            strokeOpacity={0.4}
                            padding={{ top: 10 }}
                            tick={axisTick}
                            label={{
                              value: t('dashboard.answeredChartPercentage'),
                              angle: -90,
                              position: 'insideLeft',
                              style: { textAnchor: 'middle' },
                            }}
                            allowDataOverflow={true}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            formatter={(value, name): any => {
                            const ignorePercentage: boolean = name.toString().includes("FAQ");
                            return`${value}${ignorePercentage ? '' : '%'}`
                            }} 
                        />
                        <Legend />
                        <Bar 
                            dataKey={t('dashboard.unanswered')}
                            stackId="a" 
                            fill='url(#gradientBlue)'
                            {...barSizeAndRadius}
                        />
                        <Bar 
                            dataKey={t('dashboard.answered')}
                            stackId="a" 
                            fill='url(#gradientGreen)'
                            {...barSizeAndRadius}
                        />
                        </ComposedChart>
                    </ResponsiveContainer>}
                </div>
                </div>
                : <></>}
          </>
        );
        
      }
  
  export default AnsweredAndUnanswered
  