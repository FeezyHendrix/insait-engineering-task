import { useState } from 'react'
import arrowDown from '@image/icons/arrowDown.svg'
import SuccessfulPercentage from '../SuccessfulPercentage';
import SuccessfulConversation from '../SuccessfulConversation'
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hook/useReduxHooks';

const ConversionContainer = () => {      
    const { t } = useTranslation();
    const specialTerms = useAppSelector((state) => state.companyConfig.specialTerms)
    const [isClicked, setIsClicked] = useState(false)

    function handleClick () {
        setIsClicked(!isClicked)
    }

  return (
    <div className={`container ${isClicked && 'container_opened'}`}>
      <div className='conversionContainer__btn' onClick={handleClick}>
        <img
          className={`conversionContainer__arror ${
            isClicked && 'conversionContainer__arror_active'
          }`}
          src={arrowDown}
          alt='arrow-down'
        />
        <p className='conversionContainer__title'>{specialTerms?.conversion || t('chart.conversion')}</p>
      </div>
      {isClicked === true && (
        <div className='conversionContainer__charts-container w-full'>
          <div
            className={`conversionContainer__chart flex-col md:flex-row ${
              isClicked && 'conversionContainer__chart_active w-full lg:w-[99%]'
            }`}
          >
            <SuccessfulConversation />
            <SuccessfulPercentage />
          </div>
        </div>
      )}
    </div>
  )
}

export default ConversionContainer
