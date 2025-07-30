import { SwitchInput } from './Input'
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks'
import { setShowInternalPage } from '@/redux/slices/settings'
import { INSAIT_DOMAIN } from '@/utils/data'
import { useTranslation } from 'react-i18next'

const ToggleRegularInternalUser = () => {
  const { showInternalPage } = useAppSelector(state => state.settings)
  const { currentUser } = useAppSelector(state => state.auth)
  
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  return (
    <div className='w-fit'>
      {currentUser?.includes(INSAIT_DOMAIN) ? (
        <SwitchInput
          onChange={e => dispatch(setShowInternalPage(e.target.checked))}
          label={''}
          placeholder={t('menu.viewAsInternal')}
          secondaryPlaceholder={t('menu.viewAsClient')}
          checked={showInternalPage}
          showEnableDisableText={false}
          name='internalPage'
        />
      ) : null}
    </div>
  )
}

export default ToggleRegularInternalUser
