import comingSoonImg from '@image/soon.svg'

const ComingSoon = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      <img src={comingSoonImg} className='logo' alt='coming soon' width={444} />
      <h4 className='app-text-blue  text-2xl'>COMING SOON</h4>
      <p className='text-gray text-lg'>Are you ready?</p>
      <button className='text-white app-bg-blue px-6 py-2 rounded-md bold-text mt-4'>
        Notify me
      </button>
    </div>
  )
}

export default ComingSoon
