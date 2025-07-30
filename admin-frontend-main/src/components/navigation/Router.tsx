import { Suspense, useEffect, useState } from 'react';
import NotFound from '@/pages/general/NotFound'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SuspenseLoading from './SuspenseLoading'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '@/hook/useAuth'
import { routeOptions } from '@/utils/data';
import { useAppSelector } from '@/hook/useReduxHooks';
import { RootState } from '@/redux/store';
import { useIsInternalOrAdminUser } from '@/hook/useShowRegularInternalPage';
import { normalizeMenuLink } from '@/utils';

const Router = () => {
  const { keycloakClient } = useAuth()
  const [realmAccess, setRealmAccess] = useState(keycloakClient?.realmAccess)
  const { pages: visiblePages, company } = useAppSelector((state: RootState) => state.companyConfig);
  const activeRoutes = routeOptions.filter(option => visiblePages.regularUsers.includes(normalizeMenuLink(option.path)))
  const isAdminOrInternalUser = useIsInternalOrAdminUser()
  const pageLoading = activeRoutes.length === 0 && !company;
  if (isAdminOrInternalUser) {
    const allInternalPages = routeOptions.filter(option => visiblePages.internal.includes(normalizeMenuLink(option.path)));
    const newInternalPages = allInternalPages.filter(option => !activeRoutes.some(page => page.id === option.id))
    activeRoutes.push(...newInternalPages)
  }

  useEffect(() => {
    if (keycloakClient?.realmAccess !== undefined) {
      setRealmAccess(keycloakClient.realmAccess);
    }
  }, [keycloakClient?.realmAccess]);

  if (pageLoading) {
    return <SuspenseLoading />
  }

    
  return (
    <main className='flex-1 flex flex-col'>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          {activeRoutes.map(page => (
            <Route
              key={page.id}
              path={page.path}
              element={
                <ProtectedRoute secured={page.secured}>
                  <page.component />
                </ProtectedRoute>
              }
            ></Route>
          ))}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  )
}

export default Router
