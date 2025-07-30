import { Fragment, ReactNode, useState } from 'react'
import Header from './Header'
import SideNav from './SideNav'

interface DashboardLayoutType {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutType) => {
 
  const [showNav, setShowNav] = useState(false)

  const toggleNav = () => {
    setShowNav(prev => !prev);
  }

  return (
    <Fragment>
      <div className='flex-1 flex flex-row page-container ps-1 md:ps-0'>
        <SideNav showNav={showNav} toggleNav={toggleNav} />

        <div className='flex-1 flex flex-col'>
          <Header toggleNav={toggleNav} />
          {children}
        </div>
      </div>
    </Fragment>
  )
}

export default DashboardLayout
