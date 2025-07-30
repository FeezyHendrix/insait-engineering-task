import { TitleProps } from '@/types/agent-builder'

const Title = ({
  isEditing = false,
  label = '',
  onLabelChange,
  onKeyDown,
  onLabelClick,
  onBlur,
  Icon,
  iconClassName = 'text-4xl bg-white p-2',
}: TitleProps) => {
  return (
    <div className='flex w-full'>
      <div className='flex-1 flex items-center pt-2'>
        {isEditing ? (
          <input
            type='text'
            value={label}
            onChange={onLabelChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoFocus
            className='text-base text-gray-500 font-bold border border-gray-400 bg-transparent w-full pointer-events-auto focus:outline-none me-2 px-1 rounded'
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <strong className='cursor-pointer' onClick={onLabelClick}>
            {label}
          </strong>
        )}
      </div>
      {Icon && <Icon className={iconClassName} />}
    </div>
  )
}

export default Title
