import arrowDown from '@image/icons/arrowDown.svg'
import UserMessagesPerConversation from '../UserMessagesPerConversation'
import { useState } from 'react'
import AnsweredAndUnanswered from '../AnsweredAndUnanswered'
import { useTranslation } from 'react-i18next'

const EngagementContainer = () => {      
    const { t } = useTranslation()
    const [isClicked, setIsClicked] = useState(false)
    
    
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
                <p className='conversionContainer__title'>{t('dashboard.engagement')}</p>
            </div>
            {isClicked && (
              <div className='conversionContainer__charts-container w-full'>
                <div
                  className={`conversionContainer__chart flex-col md:flex-row conversionContainer__chart_active w-full gap-4 lg:w-[99%]`}
                >
                  <AnsweredAndUnanswered />
                  <UserMessagesPerConversation />
                </div>
              </div>
            )}
        </div>
        :
        <button className={`container ${isClicked && 'container_opened'}`} onClick={handleClick}>
                <div className='conversionContainer__btn' >
                <img
                    className={`conversionContainer__arror ${isClicked && 'conversionContainer__arror_active'}`}
                    src={arrowDown}
                    alt='arrow-down'
                />
              <p className='conversionContainer__title'>
                {t('dashboard.engagement')}
              </p>
            </div>
        </button>
      }
    </>
    )
}    

export default EngagementContainer

