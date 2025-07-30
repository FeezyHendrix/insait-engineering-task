import React from 'react';
import { BiSave } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
  onClick: () => void;
  hasUnsavedChanges?: boolean;
  label?: string;
  disabled? : boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  hasUnsavedChanges = false,
  label,
  disabled
}) => {
  const { t } = useTranslation();
  const finalLabel = label ?? t('configurations.ui.saveChanges');

  return (
    <div className="flex justify-end pt-4">
      <button
        type="button"
        className="flex items-center gap-2 text-white app-bg-blue hover:app-bg-blue focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:app-bg-blue dark:hover:app-bg-blue focus:outline-none dark:focus:ring-blue-800"
        onClick={onClick}
        disabled={disabled}
      >
        <BiSave className="h-4 w-4" />
        {finalLabel}
      </button>
    </div>
  );
};

export default SaveButton;