import { PreviousNextPaginationProps } from '@/types/pagination'
import { useTranslation } from 'react-i18next'

const PreviousNextPagination: React.FC<PreviousNextPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const { t } = useTranslation()

  const totalPages = Math.ceil((totalItems || 0) / itemsPerPage)

  const handlePrevious = () => {
    onPageChange(Math.max(currentPage - 1, 1))
  }

  const handleNext = () => {
    onPageChange(Math.min(currentPage + 1, totalPages))
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <nav
      className='flex items-center justify-between p-3'
      aria-label='Table navigation'
    >
      <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
        {t('pagination.showing', {
          start: startItem,
          end: endItem,
          total: totalItems,
        })}
      </span>
      <ul className='inline-flex -space-x-px rtl:space-x-reverse text-sm h-8'>
        <li>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {t('button.previous')}
          </button>
        </li>
        <li>
          <span className='flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-300'>
            {t('pagination.pageCount', {
              current: currentPage,
              total: totalPages,
            })}
          </span>
        </li>
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {t('button.next')}
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default PreviousNextPagination
