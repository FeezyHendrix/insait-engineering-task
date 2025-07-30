import emailIcon from '@image/icons/email.svg'
import TagsInput from 'react-tagsinput'
import closeIcon from '@image/icons/close-circle.svg'
import { useTranslation } from 'react-i18next'

interface EmailInputBoxProp {
  type: 'email' | 'phone' | 'text'
  value: string[]
  label?: string
  containerClass?: string
  onChange: (tags: string[]) => void
  clearEntries?: () => void
}

const EmailInputBox = ({
  type = 'email',
  value,
  onChange,
  label,
  containerClass = '',
  clearEntries
}: EmailInputBoxProp) => {
  const { t } = useTranslation();
  const validateTag = (tag: string): boolean => {
    if (type === 'text') return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d+$/;
    return type === 'email' ? emailRegex.test(tag) : phoneRegex.test(tag)
  }

  return (
    <>
      <div className={`h-4/5 ${containerClass}`}>
       {label && <label className={`bold-text`}>{label}</label>}
        <div className='bg-gray-50 h-full border border-grey-200 flex rounded-md p-2 heightAndOverflowY'>
          {type !== 'text' && (
            <div className='me-2'>
              <img
                src={emailIcon}
                className='logo marginTop5px'
                alt='email icon'
                width={30}
                height={30}
              />
            </div>
          )}
          <TagsInput
            className='w-full h-full'
            value={value}
            validate={validateTag}
            addKeys={[9, 13, 188]}
            removeKeys={[8]}
            onChange={onChange}
            addOnBlur={true}
            inputProps={{ placeholder: t('input.entries') }}
            renderTag={renderTag}
          />
        </div>
        <h3>{t('input.commaSeperated')}</h3>
        {clearEntries && <button 
          disabled={value.length === 0 ? true : false} 
          type="button" 
          onClick={clearEntries} 
          className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 disabled:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-2">
          {t('button.clearEntries')}
        </button>}
      </div>
    </>
  )
}

export default EmailInputBox

function renderTag (props: any) {
  let {
    tag,
    key,
    disabled,
    onRemove,
    classNameRemove,
    getTagDisplayValue,
    ...other
  } = props
  return (
    <div key={key} className='react-tagsinput-tag-div'>
      <div {...other}>
        {getTagDisplayValue(tag)}
        {!disabled && (
          <a className={classNameRemove} onClick={e => onRemove(key)}>
            <img
              src={closeIcon}
              className='logo inline'
              alt='upload icon'
              width={20}
              height={20}
            />
          </a>
        )}
      </div>
    </div>
  )
}
