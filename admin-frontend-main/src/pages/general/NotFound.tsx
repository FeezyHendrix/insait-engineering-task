import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='flex-1 flex flex-col justify-center items-center gap-2'>
      <div className='flex gap-2 items-center'>
        <p>404</p>
        <div className='w-px h-8 bg-slate-500'></div>
        <p>This page could not be found.</p>
      </div>
      <Link to={'/'} className='mt-3'>
        Go home
      </Link>
    </section>
  )
}

export default NotFound
