import React from 'react'
import { cn } from '@/utils/stringHelper'
import { IconType } from 'react-icons/lib'

type StatusCardProps = {
  title: string
  value: string | number
  icon?: IconType
  className?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon: Icon,
  className,
  trend,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'premium-card hover:shadow-lg group transition-all duration-300 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
          <div className='mt-1 flex items-baseline flex-wrap'>
            <p className='text-3xl font-semibold'>{value}</p>
            {trend && (
              <span
                className={cn(
                  'ml-2 text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className='rounded-full p-2 bg-gray-100 group-hover:bg-muted transition-colors'>
            <Icon className='h-5 w-5 text-primary' />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusCard
