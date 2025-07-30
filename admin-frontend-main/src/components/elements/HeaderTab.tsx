interface HeaderTabProp {
  data: Array<{ value: string; name: string }>
  onPress: (value: string) => void
  valueSelected: string
}
import { SlDislike, SlLike } from 'react-icons/sl'

const HeaderTab = ({ data, valueSelected, onPress }: HeaderTabProp) => {
  return (
    <div className='border-b border-gray-200 dark:border-gray-700'>
      <ul className='flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
        {data.map(tab => (
          <li key={tab.value} className='me-2'>
            <div
              className={`inline-flex items-center justify-center p-4  border-transparent rounded-t-lg  ${
                tab.value === valueSelected
                  ? 'border-b-4 text-blue-400 border-b-blue-400 '
                  : 'text-gray-600 border-b-gray-300'
              } group cursor-pointer gap-2`}
              onClick={() => onPress(tab.value)}
            >
              {tab.value === 'negative' && <SlDislike className='text-xl' />}
              {tab.value === 'positive' && <SlLike className='text-xl' />}
              <p
                className={`text-lg ${
                  tab.value === valueSelected
                    ? 'text-blue-400'
                    : 'text-gray-600'
                }`}
              >
                {tab.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HeaderTab
