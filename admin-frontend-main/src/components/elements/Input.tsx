import { InputWithIconType, KnowledgeQuestionInputType, TextareaWithIconType, UploadFileInputProps, SwitchInputType, ModalSize } from "@/types/input"
import { MdDelete } from 'react-icons/md'
import uploadIcon from '@image/icons/upload.svg'
import deactivate from '@image/icons/deactivate.svg'
import activate from '@image/icons/actvate.svg'
import { t } from "i18next"
import { FaExpand } from "react-icons/fa"
import { useState } from "react"
import Modal from "./Modal"

const inputToolong = (value?: string, limit?: number) => {
  return value && limit && value.length > limit
} 

const modalSizes: Record<ModalSize, string> = {
  s: 'w-[40vw] h-[30vh] top-2 left-2 fixed', 
  m: 'w-[60vw] h-[50vh] top-2 left-2 fixed',  
  l: 'w-[95vw] h-[90vh] top-2 left-2 fixed', 
}

export const InputWithIcon = ({
  startIcon,
  label,
  placeholder,
  onChange,
  name,
  value,
  limit,
  disabled,
  extraClass = '',
  type = ''
}: InputWithIconType) => {
  return (
    <div className={`pt-7 ${extraClass}`}>
      <label className={`bold-text ml-1`}>{label}</label>
      <div className={`flex flex-row bg-gray-outline py-2 rounded-xl px-2 mt-1 ${inputToolong(value, limit) ?  'border border-red-500 ring-1 ring-red-500' : ''}`}>
        {startIcon && <img src={startIcon} width={24} className='me-2' />}
        <input
          value={value}
          name={name}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none ${startIcon ? 'border-s px-3' : ''}`}
          type={type}
        />
      </div>
      {(limit) ? <p className={`text-${inputToolong(value, limit) ? 'red-' : ''}500 ml-2`}>{`${!value ? "0" : value.length}/${limit}`}</p> : null}
      {(value && limit && value.length > limit) ? <p className='text-red-500 ml-2'>{t('feedback.questionTooLong')}</p> : null}
    </div>
  )
}

export const TextareaWithIcon = ({
  className,
  startIcon,
  label,
  placeholder,
  onChange,
  name,
  rows,
  value,
  limit,
  onBlur
}: TextareaWithIconType) => {
  return (
    <div className={className || 'pt-7'}>
      <label className='bold-text ml-1'>{label}</label>
      <div className={`flex flex-row items-start bg-gray-outline py-2 rounded-xl px-2 mt-1 ${inputToolong(value, limit) ?  'border border-red-500 ring-1 ring-red-500' : ''}`}>
        {startIcon && (
          <div className='border-e'>
            <img src={startIcon} width={24} className='me-2' />
          </div>
        )}
        <textarea
          value={value}
          rows={rows || 4}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none ${startIcon ? 'px-3' : 'px-0'} `}
        />
      </div>
      {(limit) ? <p className={`text-${inputToolong(value, limit) ? 'red-' : ''}500 ml-2`}>{`${!value ? "0" : value.length}/${limit}`}</p> : null}
      {(value && limit && value.length > limit) ? <p className='text-red-500 ml-2'>{t('feedback.answerTooLong')}</p> : null}
    </div>
  )
}

export const TextareaWithExpand = ({
  className,
  label,
  placeholder,
  onChange,
  name,
  rows,
  value,
  onBlur,
  dir,
  modalSize = 'm',
}: TextareaWithIconType) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const closeModal = () => setIsExpanded(false)
  const modalClasses = modalSizes[modalSize]
  return (
    <div className={className || 'pt-7'}>
      {label && <label className='bold-text ml-1'>{label}</label>}
      <div
        className={`flex flex-row items-start bg-gray-outline py-2 rounded-xl px-2 mt-1 relative`}
      >
        <textarea
          value={value}
          rows={rows || 4}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none px-0 resize-none`}
          {...(dir ? { dir } : {})}
        />
        <button
          onClick={() => setIsExpanded(true)}
          className="
            absolute right-2 bottom-2
            p-1 rounded-full
            transition-colors duration-200 ease-in-out
            group
          "
        >
          <FaExpand
            className="
              text-gray-600 text-md
              transition-transform duration-200 ease-in-out
              group-hover:scale-110
              group-hover:text-gray-800
            "
          />
        </button>
      </div>
      <Modal
        isOpen={isExpanded}
        toggle={closeModal}
        additionalClass={`${modalClasses} !h-fit overflow-y-auto`}
      >
        <div className='p-4 w-full'>
          <h3 className='text-lg font-bold mb-3 text-center'>{label}</h3>
          <textarea
            value={value}
            rows={12}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className='w-full p-3 border outline-none border-gray-300 rounded-lg min-h-[300px]'
            autoFocus
            {...(dir ? { dir } : {})}
          />
          <div className='flex justify-end mt-4'>
            <button
              onClick={closeModal}
              className='px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-200'
              type='button'
            >
              {t('button.close')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export const KnowledgeQuestionInput = ({
  startIcon,
  label,
  placeholder,
  onChange,
  name,
  value,
  limit,
  handleDelete,
  handleActivation,
  onBlur,
  isActive,
}: KnowledgeQuestionInputType) => {
  return (
    <div className={`pt-7`}>
      <div className='flex justify-between'>
        <label className={`bold-text ml-1`}>{label}</label>
        <div className="flex gap-3 items-center">
          {isActive ? (
            <img
              className='cursor-pointer w-4'
              src={deactivate}
              alt='trash'
              title='Deactivate'
              onClick={() => handleActivation('deactivate')}
            />
          ) : (
            <img
              className='cursor-pointer w-4'
              src={activate}
              alt='trash'
              title='Activate'
              onClick={() => handleActivation('activate')}
            />
          )}
          <MdDelete
            className='text-red-500 text-lg cursor-pointer'
            onClick={handleDelete}
          />
        </div>
      </div>
      <div
        className={`flex flex-row bg-gray-outline py-2 rounded-xl px-2 mt-1 ${
          inputToolong(value, limit)
            ? 'border border-red-500 ring-1 ring-red-500'
            : ''
        }`}
      >
        <img src={startIcon} width={24} className='me-2' />
        <input
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none px-3 ${
            startIcon ? 'border-s' : ''
          }`}
        />
      </div>
      {limit ? (
        <p
          className={`text-${inputToolong(value, limit) ? 'red-' : ''}500 ml-2`}
        >{`${!value ? '0' : value.length}/${limit}`}</p>
      ) : null}
      {value && limit && value.length > limit ? (
        <p className='text-red-500 ml-2'>{t('feedback.questionTooLong')}</p>
      ) : null}
    </div>
  )
}

export const ColorInput = ({
  label,
  placeholder,
  onChange,
  name,
  value,
  disabled,
  extraClass = '',
}: InputWithIconType) => {
  return (
    <div className={`pt-7 ${extraClass}`}>
      {label && <label className={`bold-text ml-1`}>{label}</label>}
      <div className='flex flex-row items-center gap-2'>
        <div
          className={`flex flex-row bg-gray-outline rounded-md px-2 mt-1 max-w-[100px] gap-4 py-1`}
        >
          <input
            value={value}
            disabled={disabled}
            type='color'
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className={`flex-1 outline-none ${
              disabled ? 'cursor-not-allowed' : 'cursor-default'
            }`}
          />
        </div>
        <p>{value}</p>
      </div>
    </div>
  )
}

export const SwitchInput = ({
  placeholder,
  name,
  onChange,
  label,
  checked,
  disabled,
  secondaryPlaceholder,
  className = '',
  showEnableDisableText = true,
}: SwitchInputType) => {
  return (
    <div className={`flex flex-col gap-2 pt-6 ${className}`}>
      {label && <label className={`bold-text ml-1`}>{label}</label>}
      <label className='px-2 inline-flex items-center cursor-pointer'>
        <input
          disabled={disabled}
          name={name}
          type='checkbox'
          checked={checked}
          className='sr-only peer outline-none focus:outline-none'
          onChange={onChange}
        />
        {secondaryPlaceholder && <span className='me-3 text-sm font-medium text-gray-500'>
          {secondaryPlaceholder}
        </span>}
        <div className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        <span className='ms-3 text-sm font-medium  dark:text-gray-400'>
          {placeholder} <span className="text-gray-800"> {showEnableDisableText ? `${checked ? 'enabled' : 'disabled'}` : ''}</span>
        </span>
      </label>
    </div>
  )
}

export const UploadFileInput = ({
  className,
  customIcon,
  label,
  customPlaceholder,
  onChange,
  acceptFileType,
  disabled,
}: UploadFileInputProps) => {
  return (
    <div className={className}>
      {label && <label className='bold-text ml-1'>{label}</label>}
      <div className='flex items-center justify-center basis-3/12 mt-1'>
        <label
          htmlFor='dropzone-file'
          className={`flex flex-col px-24 py-6 items-center w-full border-2 border-gray-300 border-dashed rounded-xl ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } bg-gray-50 gap-3`}
        >
          <div>
            <img src={customIcon ? customIcon : uploadIcon} width={80} />
          </div>
          <div>
            <p
              className={`px-2 text-md ${
                disabled ? 'text-gray-500' : 'app-text-blue'
              }`}
            >
              <span className='font-semibold'>
                {customPlaceholder ? customPlaceholder : t('input.uploadFile')}{' '}
              </span>
            </p>
          </div>
          <input
            id='dropzone-file'
            type='file'
            accept={acceptFileType}
            className='hidden'
            onChange={onChange}
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  )
}
