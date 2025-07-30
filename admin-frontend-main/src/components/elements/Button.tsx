import React from 'react'
import cx from 'classnames'

const variants = {
  contained: 'text-white',
  outlined: 'text-primary bg-white',
}

const colors = {
  primary: 'bg-primary',
  warning: '',
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  text: string
  variant?: 'contained' | 'outlined'
  color?: 'primary' | 'warning',
  loading?: boolean,
}

const Button = ({
  text,
  loading = false,
  className = '',
  variant = 'contained',
  color = 'primary',
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={rest.disabled || loading}
      className={cx([
        className,
        `border rounded-lg disabled:border-gray-50 border-primary py-2 px-16 text-md md:text-xl font-bold ${loading ? 'disabled:bg-primary' : ''} gap-2 items-center`,
        variants[variant],
        colors[color],
      ])}
      {...rest}
    >
     {loading && <div className='inline-app-loader' />}
      {text}
    </button>
  )
}

export default Button
