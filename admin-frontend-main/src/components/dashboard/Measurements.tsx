import { MeasurementPropsType } from '@/types/dashboard'
import './styles/index.css'
import durationImg from '@image/icons/duration.svg'
import queriesImg from '@image/icons/queries.svg'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTranslation } from 'react-i18next'

const Measurements = ({
  interactionDuration,
  userQueries,
}: MeasurementPropsType) => {
  const { t } = useTranslation()
  const chartConfigData = useSelector((state: RootState) => state.companyConfig.charts)

  const displayDuration = interactionDuration ? 
    parseInt(interactionDuration?.slice(0, -1)) < 60 ? 
      `${parseInt(interactionDuration?.slice(0, -1)).toString()}s` : 
      `${Math.floor(parseInt(interactionDuration?.slice(0, -1)) / 60)}m ${parseInt(interactionDuration?.slice(0, -1)) % 60}s` :
    "-"

  return (
    <div className='col-span-1 md:grid md:grid-cols-10 gap-4 w-full '>
      
        <>
        {
            chartConfigData.includes('interactionDuration') ?
              <div className='col-span-5 flex flex-col justify-center items-center bg-white rounded-2xl measure_container p-5  gap-5 mb-8 md:mb-0'>
                <img src={durationImg} alt='duration' width={72} height={72} />
                <h2 className='text-3xl bolder-text'>{displayDuration}</h2>
                <p className='text-gray text-xl text-center'>
                  {t('dashboard.averageConversation')}<br />{t('dashboard.duration')}
                </p>
              </div>
              : null
        }

        </>
        <>
          {
            chartConfigData.includes('userQueries') ?
            <div className='col-span-5 flex flex-col justify-center items-center bg-white rounded-2xl measure_container p-5 gap-5 blue_measure_container mb-8 md:mb-0'>
              <img src={queriesImg} alt='queries' width={72} height={72} />
              <h2 className='text-3xl bolder-text'>{userQueries || '-'}</h2>
              <p className='text-gray text-xl text-center'>{t('dashboard.averageBot')}<br></br>{t('dashboard.responseTime')}</p>
            </div>
            : null
          }
        </>
    </div>
  )
}

export default Measurements
