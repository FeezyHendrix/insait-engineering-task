import Chart from 'react-apexcharts'
import { donutChartOptions, getChartDataOrPlaceholder } from '@/config/chartOptions'
import { CompletionDisplayType, CompletionRateProps } from '@/types/dashboard'
import useModal from '@hook/useModal'
import { useEffect, useState } from 'react'
import CompletionRateModal from './mini-elements/CompletionRateModal'
import ChartLoader from '../layout/ChartLoader'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

const CompletionRate = ({ chartData }: CompletionRateProps) => {
  const { t } = useTranslation();
  const { toggle, isOpen } = useModal()
  const location = useLocation()

  const [selected, setSelected] = useState('')
  const [display, setDisplay] = useState<CompletionDisplayType>({
    id: null,
    value: 'table',
  })
  const data = getChartDataOrPlaceholder(chartData, 'pie')
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

  const handleOpenModal = (label: string) => {
    setSelected(label)
    setDisplay({ id: null, value: 'table' })
    toggle()
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const chatIdParam = params.get('chatId')

    if (chatIdParam) {
      setDisplay({ id: (chatIdParam), value: 'message' })
      toggle(true)
    }
  }, [location.search])

  return (
    <>
    {chartConfigData.includes('completionRate') ? 
    <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[390px] pb-4 mb-8 md:mb-0'>
      <div className='col-span-1 flex-1 w-full bg-white px-3 rounded-xl h-[325px] pb-4 mb-8 md:mb-0'>
        <h4 className='text-lg p-4 bolder-text'>{t("chart.completionRate")}</h4>
        <p className='ps-4 pb-4'>
          {t('chart.showCompletionRateOfConversations')}
        </p>
        {/* Chart */}
        <ChartLoader type='dashboard' hasData={!Array.isArray(chartData?.data)}>
          <div className='w-full h-full'>
            <Chart
              options={donutChartOptions(
                ['#1BA3F2', '#2ECA8C', '#F8B11B'],
                data?.label,
                data?.data,
                handleOpenModal
              )}
              series={data?.data}
              type='donut'
              width={'80%'}
              height={'80%'}
            />
          </div>
        </ChartLoader>
      </div>
      <CompletionRateModal
        display={display}
        selected={selected}
        toggle={toggle}
        isOpen={isOpen}
        setDisplay={setDisplay}
      /> 
    </div>
    :<></>}
    </>
  )
}

export default CompletionRate
