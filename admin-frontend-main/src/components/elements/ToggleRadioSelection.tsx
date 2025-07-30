import { useTranslation } from "react-i18next";
import { ToggleRadioSelectionProp } from "@/types/input"

const ToggleRadioSelection = ({
  selectedOption,
  data,
  name,
  handleOptionChange,
}: ToggleRadioSelectionProp) => {
  const { t } = useTranslation();

  const onInputChange = (value: string) => {
    handleOptionChange(value);
  };

  return (
    <ul className='items-center text-sm font-medium text-gray-900 bg-white rounded-lg sm:flex'>
      {data.map((list, index) => (
        <li
          style={{cursor: 'pointer'}}
          key={list.value}
          className={`basis-1/4 m-2 border border-gray-200 rounded ${
            selectedOption === list.value ? 'bg-blue-50' : ''
          }`}
          onClick={() => handleOptionChange(list.value)}
        >
          <div className='flex items-center ps-3'>
            <input
              id={`${name}-${index}`}
              checked={selectedOption === list.value}
              type='radio'
              value={list.value}
              onChange={() => onInputChange(list.value)}
              name={name}
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer'
            />
            <label
              style={{cursor: 'pointer'}}
              htmlFor={`${name}-${index}`}
              className={`w-full py-3 ms-2 text-sm font-medium text-blue-600 capitalize ${
                selectedOption === list.value ? 'font-bold' : ''
              }`}
            >
              {t(list.label)}
            </label>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ToggleRadioSelection
