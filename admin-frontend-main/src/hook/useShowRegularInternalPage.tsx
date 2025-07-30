import { ADMIN_USERNAME, INSAIT_DOMAIN } from '@/utils/data'
import { useAppSelector } from './useReduxHooks'

export const useIsInternalOrAdminUser = () => {
  const { showInternalPage } = useAppSelector(state => state.settings)
  const { currentUser } = useAppSelector(state => state.auth)

  return (
    (currentUser && ADMIN_USERNAME.includes(currentUser)) ||
    (showInternalPage && currentUser?.includes(INSAIT_DOMAIN)) || false
  )
}
