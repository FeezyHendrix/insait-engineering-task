import confirmFrame from '@image/icons/confirm-frame.svg'
import { useTranslation } from 'react-i18next'

interface ConfirmationBodyProp {
  title: string
  toggle: (val?: boolean) => void
  confirm: () => void
  buttonText: string
  confirmClass?: string
  loading?: boolean
}

const ConfirmationBody = ({
  title,
  toggle,
  confirm,
  loading = false,
  confirmClass = '',
  buttonText,
}: ConfirmationBodyProp) => {
  const { t } = useTranslation()
  return (
    <div className='w-3/5 m-auto'>
      <img src={confirmFrame} className='logo' alt='confirmation message' />
      <h2 className='text-lg text-bold text-center my-3'>{title}</h2>
      <div className='flex justify-evenly'>
        <button
          type='button'
          onClick={() => toggle(false)}
          className='w-24 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
        >
          {t('button.cancel')}
        </button>
        <button
          type='button'
          onClick={confirm}
          className={`min-w-24 text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex gap-2 items-center w-auto ${confirmClass}`}
        >
          {loading && <div className='inline-app-loader' />}
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default ConfirmationBody
