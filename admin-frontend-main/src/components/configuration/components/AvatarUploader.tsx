import { MdOutlineFileUpload } from 'react-icons/md'
import { CiImageOn } from 'react-icons/ci'
import { FaRegMessage } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

interface AvatarUploaderProps {
    url: string | null
    imageUnsaved: boolean
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>
}

const AvatarUploader = ({ url, imageUnsaved, handleFileUpload }: AvatarUploaderProps) => {
  const { t } = useTranslation()

  return (
    <div className='mb-6'>
      <div className='flex items-center gap-4 mb-4'>
        <div className='relative w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border overflow-hidden'>
          {url ? (
            <img
              src={url}
              alt='Bot avatar'
              className='w-full h-full object-cover'
            />
          ) : (
            <FaRegMessage className='h-8 w-8 text-muted-foreground' />
          )}
          {imageUnsaved && (
            <span className="absolute bottom-1 right-1 bg-orange-500 bg-opacity-80 text-white text-[10px] px-1.5 py-[1px] rounded-full shadow-sm">
              {t('configurations.ui.unsavedLogo')}
            </span>
          )}
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <CiImageOn className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-medium'>
              {t('configurations.ui.agentLogo')}
            </h2>
          </div>
          <div>
            <label htmlFor='bot-image' className='cursor-pointer'>
              <div className='flex items-center gap-2 p-2 rounded-md border border-input hover:bg-muted'>
                <MdOutlineFileUpload className='h-4 w-4' />
                <span>{t('configurations.ui.uploadImage')}</span>
              </div>
              <input
                id='bot-image'
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />
            </label>
          </div>
        </div>
      </div>
      <p className='text-sm text-muted-foreground'>
        {t('configurations.ui.recommendedImageDim')}
      </p>
    </div>
  )
}

export default AvatarUploader
