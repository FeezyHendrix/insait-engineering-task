import { useState } from 'react'
import arrowDown from '@image/icons/arrowDown.svg'
import PeakInteractionTime from '@components/dashboard/PeakInteractionTime'
import AverageInteractionDuration from '../AverageInteractionDuration'
import UserInteractionsMonthlyAndDaily from '../UserInteractionsMonthlyAndDaily'
import UserResponseTime from '../UserResponseTime'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/hook/useReduxHooks'
import ConversationDuration from '../ConversationDuration'

const UsageContainer = () => {      
    const { t } = useTranslation();    
    const [isClicked, setIsClicked] = useState(false)
    const chartConfigData = useAppSelector(state => state.companyConfig.charts)

    function handleClick() {
        setIsClicked(!isClicked)
    }

    return (
    <>
    {isClicked?
        <div className={`container ${isClicked && 'container_opened'}`}>
            <div className='conversionContainer__btn' onClick={handleClick}>
                <img
                    className={`conversionContainer__arror ${isClicked && 'conversionContainer__arror_active'}`}
                    src={arrowDown}
                    alt='arrow-down'
                />
                <p className='conversionContainer__title'>
                    {t('dashboard.usage')}
                </p>
            </div>
            <div className='conversionContainer__charts-container'>

                <div className={`conversionContainer__chart ${isClicked && 'conversionContainer__chart_active md:w-[49%]'}`}>
                    <PeakInteractionTime />
                </div>

                <div className={`conversionContainer__chart ${isClicked && 'conversionContainer__chart_active md:w-[49%]'}`}>
                <UserInteractionsMonthlyAndDaily />
                </div>
                <div className={`conversionContainer__chart ${isClicked && 'conversionContainer__chart_active md:w-[49%]'}`}>
                    <UserResponseTime />
                </div>
                <div className={`conversionContainer__chart ${isClicked && 'conversionContainer__chart_active md:w-[49%]'}`}>
                    <ConversationDuration />
                </div>
                <div className={`conversionContainer__chart gap-4 ${isClicked && 'conversionContainer__chart_active md:w-[49%]'}`}>
                <AverageInteractionDuration showFull={chartConfigData.includes('questionsAnswered')} />
                   {chartConfigData.includes('questionsAnswered') && <AverageInteractionDuration showFull title={t('dashboard.questionsAnswered')} value={517} showValue={true} />}
                </div>
            </div>
        </div>
        :
        <button className={`container ${isClicked && 'container_opened'}`} onClick={handleClick}>
            <div className='conversionContainer__btn'>
                <img
                    className={`conversionContainer__arror ${isClicked && 'conversionContainer__arror_active'}`}
                    src={arrowDown}
                    alt='arrow-down'
                />
                <p className='conversionContainer__title'>
                    {t('dashboard.usage')}
                </p>
            </div>
        </button>
    }
    </>
    )
}    

export default UsageContainer