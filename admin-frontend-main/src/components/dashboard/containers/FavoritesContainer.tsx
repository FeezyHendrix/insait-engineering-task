import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hook/useReduxHooks';
import { chartNames } from '@/utils/data';
import { FaStar } from 'react-icons/fa';

const FavoritesContainer = () => {      
    const { t } = useTranslation();
    const { favoriteCharts } = useAppSelector(state => state.analytics)

    return ( 
      <div className={`container container_opened`}>
        <div className='conversionContainer__charts-container w-full'>
          { favoriteCharts.length ? favoriteCharts.map((favorite: string, index) => {
                const ChartComponent = chartNames[favorite];
                  if (!ChartComponent) return null;
                  return( 
                    <div key={index} className={`conversionContainer__chart conversionContainer__chart_active md:w-[49%]`}>
                      <ChartComponent key={index} />
                    </div>
                );
              })
            :
            <div className={`flex justify-center items-center h-full w-full `}>

                <p className='bg-white p-4 rounded-[10px] w-full h-full flex justify-center items-center text-center cursor-default mt-8'>
                  {t('chart.clickThe')}
                        <FaStar className={'w-5 h-5 m-2 text-gray-300'} />
                  {t('chart.toView')}
                </p>
                </div>
          }
          </div>
      </div>
    )
}

export default FavoritesContainer
