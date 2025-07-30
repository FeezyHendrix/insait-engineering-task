import errorImg from '@image/icons/error.svg'
import { Fragment, useEffect, useState } from 'react'

interface NotificationType {
  message: string
  position?: 'bottom' | 'top'
}
const Notification = ({ message }: NotificationType) => {
  const [text, setText] = useState(message)

  const close = () => setText('')

  useEffect(() => setText(message), [message])

  return (
    <Fragment>
      {text && (
        <div
          className={`flex flex-row py-3 items-center gap-3 justify-between border px-4 bold-text w-10/12 md:w-4/12 absolute bottom-2 md:bottom-5`}
          style={styles.container}
        >
          <div className='flex flex-row gap-3'>
            <img src={errorImg} alt='error' width={26} height={26} />
            <p className=' text-red-600'>{text}</p>
          </div>
          <span onClick={close} className='cursor-pointer text-red-600'>
            &times;
          </span>
        </div>
      )}
    </Fragment>
  )
}

const styles = {
  container: {
    borderRadius: 10,
    borderColor: '#FAE5E5',
    backgroundColor: '#FFF4F4',
  },
}

export default Notification
