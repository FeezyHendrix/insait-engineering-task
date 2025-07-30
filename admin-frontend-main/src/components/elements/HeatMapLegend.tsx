import { heatMapRangeColors } from '@/config/chartOptions'
import { useTranslation } from 'react-i18next'

const HeatMapLegend = () => {
  const { t } = useTranslation()

  const lowFrequencyName = heatMapRangeColors[0]?.name
  const highFrequencyName =
    heatMapRangeColors[heatMapRangeColors.length - 1]?.name

  return (
    <div className='ps-[10%]'>
      <div className='h-3 w-full flex flex-row '>
        {heatMapRangeColors.map(item => (
          <div
            className='w-full'
            style={{
              backgroundColor: item.color,
            }}
            key={item.color}
          />
        ))}
      </div>
      <div className='flex flex-row justify-between'>
        <p className='text-sm'>{lowFrequencyName ? t(lowFrequencyName) : ''}</p>
        <p className='text-sm'>
          {highFrequencyName ? t(highFrequencyName) : ''}
        </p>
      </div>
    </div>
  )
}

export default HeatMapLegend
