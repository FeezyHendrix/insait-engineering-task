import { donutChartOptions } from '@/config/chartOptions'
import Chart from 'react-apexcharts'
import ChartLoader from '../layout/ChartLoader'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hook/useReduxHooks'
import { getChartData, getChartDataWithDates } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { PieChartType } from '@/types/chart'
import { useTranslation } from 'react-i18next'
import ChatTableModal from './mini-elements/ChatTableModal'
import useModal from '@/hook/useModal'
import useFavoriteCharts from '@/hook/useFavoriteCharts'
import ChartFavoriteStar from '../elements/ChartFavoriteStar'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const Persona = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<PieChartType>({data: [], label: []})
  const [loading, setLoading] = useState<boolean>(false);
  const [personaValue, setPersonaValue] = useState('')
  const { toggle, isOpen } = useModal()
  const dispatch = useAppDispatch()
  const globalDate = useSelector((state: RootState) => state.analytics.globalFilters);
  const selectedFlow = useSelector((state: RootState) => state.analytics.globalFilters.flowId);
  const chartType = 'persona'
  const { isFavorite } = useFavoriteCharts(chartType);

  const fetchChartData = async () => {
    try {
      setLoading(true)
      const { payload: response } = await dispatch(
        getChartDataWithDates({ chartType, startDate: globalDate.startDate, endDate: globalDate.endDate, flowId: selectedFlow })
      )
      const formattedData = {
        data: response.data,
        label: response.label.map((label: string) => label.charAt(0).toUpperCase() + label.slice(1)),
      }
      setData(formattedData)
    } catch (error) {
      toast.error(t('feedback.errorWrong'))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (label: string) => {
    setPersonaValue(label)
    toggle()
  }

  useEffect(() => {
    fetchChartData();
  }, [globalDate]);



  return (
    <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[450px] md:h-[390px] pb-4 mb-8 md:mb-0'>
        <div className='col-span-1 h-[325px] p-4 w-full rounded-xl bg-white '>
          <div className='flex justify-between items-center p-4'>
            <h4 className='text-xl bolder-text pt-4'>{t('chart.persona')}</h4>
            <ChartFavoriteStar isFavorite={isFavorite} chartType={chartType} />
          </div>            
          <p className='text-sm pb-3'>{t('chart.breakdownOfActiveApplicantsVsSeekers')}</p>
            <>
              {loading ? 
                <div>
                  <p>{t('chart.fetchingData')}</p>
                </div>
                :
              <ChartLoader type='analytics' hasData={Array.isArray(data?.data)}>
                <div className='w:full h-full'>
                  <Chart
                    options={donutChartOptions(
                      ['#1BA3F2', '#49DE61', '#F8B11B'],
                      data?.label,
                      data?.data,
                      handleOpenModal
                    )}
                    series={data?.data}
                    type='donut'
                    width={'100%'}
                    height={'80%'}                  
                  />
                </div>
              </ChartLoader>}
            </>
        </div>
        <ChatTableModal 
          toggle={toggle}
          isOpen={isOpen}
          value={personaValue}
          type={'persona'}
        />
      </div>
     
   
  )
}

export default Persona
