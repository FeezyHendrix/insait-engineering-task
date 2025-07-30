import CustomTooltip from '@/components/elements/CustomTooltip'
import { FieldValidValue, FieldValidValueCSVRow } from '@/types/agent-builder'
import React, { useState, FormEvent, useRef, ChangeEvent } from 'react'
import { FiMinusCircle, FiSearch, FiRefreshCw } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import { handleExcelExport } from '@/utils/export'

type SearchType = 'value' | 'transformed_value' | 'both'

interface ValidValuesManagerProps {
  showTransformedValue?: boolean
  validValues: FieldValidValue[]
  setValidValues: React.Dispatch<React.SetStateAction<FieldValidValue[]>>
  onValidation?: (values: FieldValidValue[]) => boolean
}

const ValidValuesManager: React.FC<ValidValuesManagerProps> = ({
  showTransformedValue,
  validValues,
  setValidValues,
  onValidation,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searchType, setSearchType] = useState<SearchType>('both')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredValues, setFilteredValues] = useState<
    FieldValidValue[] | null
  >(null)

  const clearSearch = () => {
    setFilteredValues(null)
    setSearchQuery('')
  }

  const addValidValue = () => {
    if (onValidation && !onValidation(validValues)) return

    clearSearch()
    setValidValues([...validValues, { value: '', transformed_value: '' }])
  }

  const handleValidValueChange = (
    index: number,
    field: keyof FieldValidValue,
    newValue: string
  ) => {
    const updated = [...validValues]
    updated[index] = { ...updated[index], [field]: newValue }
    setValidValues(updated)
    setFilteredValues(null)
    setSearchQuery('')
  }

  const removeValidValue = (index: number) => {
    const updated = validValues.filter((_, i) => i !== index)
    setValidValues(updated)
    clearSearch()

    onValidation && onValidation(updated)
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      setFilteredValues(null)
      return
    }
    const filtered = validValues.filter(({ value, transformed_value }) => {
      const valLower = value.toLowerCase()
      const transLower = transformed_value.toLowerCase()
      if (searchType === 'value') return valLower.includes(q)
      if (searchType === 'transformed_value') return transLower.includes(q)
      return valLower.includes(q) || transLower.includes(q)
    })
    setFilteredValues(filtered)
  }

  const handleImportCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    Papa.parse<FieldValidValueCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (!results?.data?.length) {
          const msg = 'File processing failed.'
          toast.error(msg)
          onValidation && onValidation([])
          return
        }

        const firstRow = results.data[0] as FieldValidValueCSVRow
        const headers = Object.keys(firstRow)
        const requiredFields = ['values', 'transformed_values']

        const missingFields = requiredFields.filter(
          (field) => !headers.includes(field)
        )
        if (missingFields.length > 0) {
          const msg = `CSV file must include the following header(s): ${missingFields.join(
            ', '
          )}`
          toast.error(msg)
          onValidation && onValidation([])
          return
        }

        try {
          const newEnum: FieldValidValue[] = (
            results.data as FieldValidValueCSVRow[]
          )
            .filter((row) => row.values.trim() !== '')
            .map((row) => ({
              value: row.values,
              transformed_value: row.transformed_values ?? '',
            }))

          if (newEnum.length === 0) {
            const msg = 'No valid values to upload.'
            toast.error(msg)
            onValidation && onValidation([])
            return
          }

          if (onValidation && !onValidation(newEnum)) return

          setValidValues(newEnum)
          toast.success('CSV uploaded successfully.')
        } catch (error) {
          const errMsg = 'Error processing CSV file.'
          toast.error(errMsg)
          onValidation && onValidation([])
        }
      },
      error: function () {
        const errMsg = 'Error processing CSV file.'
        toast.error(errMsg)
        onValidation && onValidation([])
      },
    })
  }

  const handleExportCSV = () => {
    if (validValues.length === 0) {
      toast.info('No valid values to export.')
      return
    }

    const dataToExport: FieldValidValueCSVRow[] = validValues.map(
      ({ value, transformed_value }) => ({
        values: value,
        transformed_values: transformed_value,
      })
    )

    const fileName =
      window.prompt('Enter filename for export:', 'valid_values.csv') ||
      'valid_values.csv'

    handleExcelExport(dataToExport, fileName, 'Valid Values', 'csv')

    toast.success('CSV exported successfully.')
  }

  const valuesToRender = filteredValues ?? validValues

  return (
    <div
      className='border rounded-md mt-1 p-4 w-full flex flex-col'
      style={{ maxHeight: '400px' }}
    >
      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className='flex items-center gap-2 mb-2'
        aria-label='Search valid values'
      >
        <select
          aria-label='Search type'
          className='border rounded px-2 py-1'
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
        >
          <option value='value'>Value</option>
          {showTransformedValue && (
            <>
              <option value='transformed_value'>Transformed Value</option>
              <option value='both'>Both</option>
            </>
          )}
        </select>
        <input
          type='text'
          aria-label='Search query'
          placeholder='Search...'
          className='border rounded px-2 py-1 flex-grow'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className='flex gap-2'>
          <button
            type='submit'
            className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center'
            aria-label='Search'
          >
            <FiSearch size={20} />
          </button>
          <button
            type='button'
            onClick={clearSearch}
            className='bg-gray-400 text-white p-2 rounded hover:bg-gray-500 flex items-center justify-center'
            aria-label='Reset search'
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
      </form>

      {/* Headers */}
      <div className='flex items-center mb-1 font-semibold text-gray-700'>
        <div className={` px-1 ${showTransformedValue ? 'w-1/2' : 'w-full'} `}>
          Value
        </div>
        {showTransformedValue && <div className='w-1/2'>Transformed Value</div>}
      </div>

      {/* List */}
      <div
        className='overflow-y-auto flex-grow'
        style={{ maxHeight: '300px' }}
        aria-live='polite'
      >
        {valuesToRender.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>
            {searchQuery.trim() == '' ? 'No valid values' : 'No Results Found'}
          </p>
        ) : (
          valuesToRender.map((validValue, index) => (
            <div
              key={index}
              className='flex items-center gap-2 mb-2'
              aria-label={`Valid value row ${index + 1}`}
            >
              <input
                type='text'
                className={`px-2 py-1 border rounded bg-gray-50 focus:outline-blue-500 ${
                  showTransformedValue ? 'w-1/2' : 'w-full'
                }`}
                placeholder='Enter Value'
                value={validValue.value}
                onChange={(e) =>
                  handleValidValueChange(index, 'value', e.target.value)
                }
              />
              {showTransformedValue && (
                <input
                  type='text'
                  className='w-1/2 px-2 py-1 border rounded bg-gray-50 focus:outline-blue-500'
                  placeholder='Enter Transformed Value'
                  value={validValue.transformed_value}
                  onChange={(e) =>
                    handleValidValueChange(
                      index,
                      'transformed_value',
                      e.target.value
                    )
                  }
                />
              )}

              <button
                onClick={() => removeValidValue(index)}
                aria-label={`Remove valid value ${index + 1}`}
                className='text-red-600 hover:text-red-800'
                type='button'
              >
                <FiMinusCircle size={24} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Buttons */}
      <div className='flex justify-between mt-3 items-center gap-4'>
        <div className='flex items-center gap-3'>
          <CustomTooltip
            title={`CSV file must have a 'values' and 'transformed_values' headers`}
            noWrap={false}
          >
            <button
              type='button'
              className='bg-blue-600 text-sm text-white px-3 py-1 rounded hover:bg-blue-700 min-w-[110px]'
              onClick={() => fileInputRef.current?.click()}
              aria-label='Import from CSV'
            >
              Import from CSV
            </button>
          </CustomTooltip>

          <input
            id='dropzone-file'
            type='file'
            accept='.csv'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImportCSV}
          />

          <button
            type='button'
            onClick={handleExportCSV}
            className='bg-blue-600 text-sm text-white px-3 py-1 rounded hover:bg-blue-700 min-w-[110px]'
            aria-label='Export to CSV'
          >
            Export to CSV
          </button>
        </div>

        <button
          onClick={addValidValue}
          aria-label='Add new valid value'
          className={`bg-green-600 text-sm text-white px-3 py-1 rounded min-w-[110px] ${
            searchQuery.trim() == '' && 'hover:bg-green-700 '
          } `}
          type='button'
          disabled={searchQuery.trim() !== ''}
        >
          Add Value
        </button>
      </div>
    </div>
  )
}

export default ValidValuesManager
