import { ToggleSectionButtonProp } from '@/types/knowledge'
import arrowDown from '@image/icons/arrowDown.svg'

const ToggleSectionButton = ({
  toggle,
  isOpen,
  title,
  children,
}: ToggleSectionButtonProp) => {
  return (
    <div className='sticky top-0 z-10 px-4 flex items-center gap-4 w-full bg-blue-100'>
      <button className='w-2/3 flex items-center gap-4 py-4' onClick={toggle}>
        <img
          className={` w-4 h-4 ${isOpen ? 'rotate-0' : 'rotate-[270deg]'}`}
          src={arrowDown}
          alt='arrow-down'
        />
        <p className=''>{title}</p>
      </button>
      <div className='w-1/3 flex justify-end'>{children}</div>
    </div>
  )
}

export default ToggleSectionButton
