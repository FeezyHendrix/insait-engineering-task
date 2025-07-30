import { SourceListProp } from '@/types/knowledge'
import { useTranslation } from 'react-i18next'

const SourceList = ({
  data,
  handleSelectSource,
  selectedSource,
}: SourceListProp) => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-2 pt-2 md:pe-5 w-full'>
      <div className="flex flex-col md:flex-row">
        {data.map(source => (
            <div key={source.value} className='inline-block'>
              <button
                onClick={() => handleSelectSource(source)}
                key={source.value}
                className={`px-2 py-1 text-sm rounded-t-lg mr-2 text-start ${
                  selectedSource.value === source.value
                    ? 'bold-text app-bg-blue text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {t(source.label)}
              </button>
            </div>
          ))}
        </div>
    </div>
  )
}

export default SourceList
