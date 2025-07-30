import { FC } from 'react'
import { FaPlus } from 'react-icons/fa'

interface SectionHeaderProps {
  title: string
  onAddClick: () => void
}

const SectionHeader: FC<SectionHeaderProps> = ({ title, onAddClick }) => (
  <div className='flex justify-between items-center mb-2'>
    <h3 className='text-md font-medium text-gray-800'>{title}</h3>
    <button onClick={onAddClick} className='hover:text-blue-500'>
      <FaPlus size={14} />
    </button>
  </div>
)

export default SectionHeader
