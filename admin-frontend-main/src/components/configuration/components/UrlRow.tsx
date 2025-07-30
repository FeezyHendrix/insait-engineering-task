// components/UrlRow.tsx
import { FiX } from 'react-icons/fi';

interface UrlRowProps {
  url: string;
  onRemove: () => void;
}

const UrlRow = ({ url, onRemove }: UrlRowProps) => {
  return (
    <div className='flex items-center bg-[#f0f9ff] justify-between p-2 bg-primary-200 rounded-md'>
      <span className='text-sm'>{url}</span>
      <button className='h-6 w-6' onClick={onRemove}>
        <FiX className='h-4 w-4' />
      </button>
    </div>
  );
};

export default UrlRow;