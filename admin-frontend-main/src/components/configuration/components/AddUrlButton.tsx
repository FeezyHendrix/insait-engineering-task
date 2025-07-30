import { FiPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'


interface AddUrlButtonProps {
  onAddToList: () => void;
}

const AddUrlButton = ({ onAddToList }: AddUrlButtonProps) => {
  const { t } = useTranslation()
  return (
    <button
        className='justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-white  hover:bg-primary/90 h-10 px-4 py-2 shrink-0 flex items-center gap-2'
        onClick={onAddToList}
    >
        <FiPlus className='h-4 w-4' />
        {t('configurations.settings.addToList')}
    </button>
  );
};

export default AddUrlButton;

