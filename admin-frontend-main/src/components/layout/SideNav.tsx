import { NavLink } from 'react-router-dom';
import { Fragment } from 'react';
import IconComponent from '../icons';
import { useLocation } from 'react-router-dom';
import { pageOptions } from '@/utils/data';
import { useAuth } from '@/hook/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuth, setIsAuth, setToken } from '@/redux/slices/auth';
import { IoMdClose } from "react-icons/io";
import { SideNavProp } from '@/types/layout.type';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next'
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage';
import { isLinkActive, normalizeMenuLink } from '@/utils';
import { useAppSelector } from '@/hook/useReduxHooks';
import { formatMenuTextDisplay } from '@/utils/stringHelper';
import { RxHamburgerMenu } from "react-icons/rx";
import insaitLogo from '@image/logo.svg'
import { RELEASE_VERSION } from '@/utils/constants';

const SideNav = ({showNav, toggleNav}: SideNavProp) => {  
  const location = useLocation();
  const dispatch = useDispatch();
  const { keycloakClient } = useAuth();
  const { t } = useTranslation()
  const specialTerms = useAppSelector((state) => state.companyConfig.specialTerms)
  const isAdminOrInternalUser = useIsInternalOrAdminUser()


  const logout = () => {
    dispatch(setIsAuth(false));
    dispatch(setToken(""));
    dispatch(resetAuth());
    if (keycloakClient) {
      keycloakClient.logout();
    }
  };

  const visiblePages = useSelector((state: RootState) => state.companyConfig.pages);
  const pagesToShow = pageOptions.filter(option => visiblePages.regularUsers.includes(normalizeMenuLink(option.link)))
  
  if (isAdminOrInternalUser) {
      const internalPages = pageOptions.filter(option => visiblePages.internal.includes(option.link))
      const newInternalPages = internalPages.filter(option => !pagesToShow.some(page => page.id === option.id))
      pagesToShow.push(...newInternalPages)
  }

  return (
    <section
      className={`${ showNav ? 'fixed' : 'hidden'} md:relative top-0 bottom-0 left-0 right-0 md:flex bg-white md:w-64 flex-col border-e border-border h-screen animate-fade-in z-[100]`}
    >
      <div className='flex justify-between items-center  w-full h-[65px] border-b px-6'>
        <img src={insaitLogo} className='logo' alt='Insait logo' width={150} />
        <RxHamburgerMenu onClick={toggleNav} className='text-2xl md:hidden' />
      </div>
      <div className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
        {pagesToShow.map(option =>
          option.title !== 'menu.logout' ? (
            <Fragment key={option.id}>
              <NavLink
                to={option.link}
                onClick={toggleNav}
                className={() =>
                  isLinkActive(option.link, location.pathname)
                    ? 'nav-active'
                    : ''
                }
              >
                <div className={`flex flex-row items-center nav-list-item bold-text w-fit md:w-full gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group text-white font-medium mt-0.5 ${isLinkActive(option.link, location.pathname) ? '' : 'hover:bg-gray-100'}`}>
                  <IconComponent
                    name={option.image}
                    active={isLinkActive(option.link, location.pathname)}
                  />
                  <span className='text-sm text-gray-600 nav-title'>
                    {formatMenuTextDisplay(option.title, specialTerms)}
                  </span>
                  {option.isBeta === true && (
                    <span className='text-white bg-green-500 rounded-full px-2 py-0.5 text-[10px] uppercase bold-text'>
                      {t('feedback.beta')}
                    </span>
                  )}
                </div>
              </NavLink>
            </Fragment>
          ) : null
        )}
      </div>

      <div
        className='flex flex-row items-center gap-3 py-3 ps-4 pe-8 nav-list-item mb-2 bold-text cursor-pointer'
        onClick={logout}
      >
        <IconComponent name="logout" active={location.pathname === `logout`} />
        <span className="text-sm text-gray-600">{t("menu.logout")}</span>
      </div>
      <div className='flex flex-row self-center gap-3 ps-4 pe-8 nav-list-item mb-2 bold-text cursor-pointer'>
        <span className="text-xs text-gray-400">v{RELEASE_VERSION || 'DEV'}</span>
      </div>

      <IoMdClose
        onClick={toggleNav}
        className='absolute top-8 end-8 text-2xl md:hidden'
      />
    </section>
  );
};

export default SideNav;
