import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getHeaderTitle } from '@/utils'
import { RxHamburgerMenu } from "react-icons/rx";
import { HeaderProp } from '@/types/layout.type'
import { useTranslation } from 'react-i18next';
import ToggleRegularInternalUser from '../elements/ToggleRegularInternalUser'
import { useAppSelector } from '@/hook/useReduxHooks'
import { formatMenuTextDisplay } from '@/utils/stringHelper'

const Header = ({ toggleNav }: HeaderProp) => {
  const { t } = useTranslation();
  let location = useLocation()
  const specialTerms = useAppSelector((state) => state.companyConfig.specialTerms)

  const [title, setTitle] = useState('')

  useEffect(() => {
    const headerTitle = getHeaderTitle(location.pathname)
    setTitle(headerTitle)
  }, [location.pathname])

  return (
    <nav className='flex flex-col md:flex-row justify-between px-5 md:px-5 py-4 md:py-2 bg-white border-b'>
      <div className='flex flex-row md:gap-10 items-center'>
        <div className="hidden md:block">
          <h3 className='text-lg font-extrabold capitalize whitespace-nowrap'>
            {t(`header.agentPlatform`)}
          </h3>
          <p className='text-sm'>{formatMenuTextDisplay(title, specialTerms)}</p>
        </div>
        <div className='flex gap-2 items-center md:hidden'>
          <RxHamburgerMenu onClick={toggleNav} className='text-2xl' />
          <p className='text-sm'>{formatMenuTextDisplay(title, specialTerms)}</p>
        </div>
        
      </div>
      <ToggleRegularInternalUser />

      {/* {
        // these elements (search, notifications, profile) are not active. maybe they will be reactivated in the future
        <div className='flex flex-row flex-wrap justify-start gap-4 mt-5 md:mt-0'>
        <Search placeholder={`Search`} />
        <div className='notification-container '>
          <img
            src={notificationImg}
            className='logo'
            alt='Notify logo'
            width={30}
            height={30}
          />
        </div>
        <img
          src={sampleImg}
          className='logo'
          alt='user profile picture'
          width={'auto'}
        />
      </div>
      } */}
    </nav>
  )
}

export default Header
