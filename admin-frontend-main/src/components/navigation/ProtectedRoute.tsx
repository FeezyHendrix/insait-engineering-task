import { ReactNode, Suspense } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import SuspenseLoading from './SuspenseLoading'

interface ProtectedRouteType {
  children: ReactNode
  secured: boolean
}

const ProtectedRoute = ({ children, secured }: ProtectedRouteType) => {
  return (
    <DashboardLayout>
      <Suspense fallback={<SuspenseLoading />}>
        {children}
      </Suspense>
    </DashboardLayout>
  )
}

export default ProtectedRoute
