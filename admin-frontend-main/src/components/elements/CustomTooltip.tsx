import { ReactNode, useState } from 'react'

interface CustomTooltipProps {
  children: ReactNode
  title: string
  noWrap?: boolean
}

const CustomTooltip = ({ children, title, noWrap = true }: CustomTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className='relative inline-block'>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 py-1 text-xs mb-1 text-white bg-gray-900 rounded shadow-lg z-50 ${noWrap ? 'whitespace-nowrap px-3' : 'px-1 text-center'}`}>
          {title}
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45' />
        </div>
      )}
    </div>
  )
}

export default CustomTooltip