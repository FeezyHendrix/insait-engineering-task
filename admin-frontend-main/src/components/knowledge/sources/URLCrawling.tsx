import { CrawledURLType } from '@/types/knowledge'
import  { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdDelete, MdOutlineInfo } from 'react-icons/md'
import { toast } from 'react-toastify'

const URLCrawling = ({
  urlData,
  setUrlData,
  confirmDelete,
}: URLCrawlingProp) => {
  const { t } = useTranslation()

  const [url, setUrl] = useState('')

  const isValidURL = (string: string) => {
    const urlPattern =
      /^https:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?$/
    return urlPattern.test(string)
  }

  const handleAddURL = () => {
    if (!url || !isValidURL(url)) {
      toast.error(
        !url ? t('knowledge.specifyURL') : t('knowledge.enterValidURL')
      )
      return
    }
    // API Call here
    const crawledUrls = [
      { id: `1`, url: `${url}/`, chars: 324 },
      { id: `2`, url: `${url}/about`, chars: 243 },
      { id: `3`, url: `${url}/contact`, chars: 564 },
    ]
    setUrlData(prevData => [...prevData, ...crawledUrls])
    setUrl('')
  }

  return (
    <div>
      <div className='flex gap-3 pt-1'>
        <input
          onChange={e => setUrl(e.target.value)}
          value={url}
          className='rounded-md h-10 w-10/12 outline-none px-2 text-md border border-gray-300'
          placeholder={t('input.enterValidURL') + 'aa'}
        />
        <button
          onClick={handleAddURL}
          className='app-bg-blue px-4 rounded text-white text-md'
        >
          {t('button.submit')}
        </button>
      </div>

      <p className='text-xs mt-1'>{t('knowledge.crawlLinkOnSite')}</p>

      <hr className='w-full h-0.5 bg-gray-300 my-5' />
      <div className='flex flex-col gap-2 max-h-[40vh] overflow-y-auto'>
        <div className='flex justify-between mb-2'>
          {urlData.length > 0 && (
            <button
              className='bg-red-50 pl-2 py-1 flex justify-end text-sm text-red-600 w-12/12 items-center gap-1'
              onClick={() => confirmDelete('all')}
            >
              {t('button.deleteAll')}
              <MdDelete className='text-red-500 text-lg' />
            </button>
          )}
        </div>
        {urlData.map(item => (
          <div className='flex gap-2 items-center' key={item.id}>
            {item.trained === true && (
              <div className='border border-green-300 px-2 py-1 flex bg-green-100 rounded-md items-center justify-between gap-2'>
                <p className='text-green-600 text-md'>{t('general.trained')}</p>
                <MdOutlineInfo className='text-green-600' />
              </div>
            )}
            <span className='flex-1 border border-gray-300 px-2 bg-gray-50 text-md py-1 rounded-md me-4'>
              {item.url}
            </span>
            <span className='text-sm text-gray-500'>{item.chars} {t('general.chars')}</span>
            <MdDelete
              className='text-red-500 text-lg cursor-pointer'
              onClick={() => confirmDelete(item)}
            />
          </div>
        ))}
        {urlData.length === 0 && <p>{t('feedback.noData')}</p>}
      </div>
    </div>
  )
}

export default URLCrawling

type URLCrawlingProp = {
  urlData: Array<CrawledURLType>;
  setUrlData: React.Dispatch<React.SetStateAction<Array<CrawledURLType>>>;
  confirmDelete: (item: CrawledURLType | 'all') => void;
  refetchItems: () => void;
};
