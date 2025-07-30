import { FieldsToCollectGroup } from '@/types/agent-builder'
import { useMemo, useState } from 'react'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'

interface FieldGroupsManagerProps {
  allFields: { properties: { name: string } }[]
  initialGroups?: FieldsToCollectGroup[]
  addFieldsGroup: (group: FieldsToCollectGroup) => void
  updateFieldsGroup: (index: number, updatedGroup: FieldsToCollectGroup) => void
  removeFieldsGroup: (index: number) => void
}

const FieldGroupsManager = ({
  allFields,
  initialGroups = [],
  addFieldsGroup,
  updateFieldsGroup,
  removeFieldsGroup,
}: FieldGroupsManagerProps) => {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null
  )

  const groups = initialGroups

  const usedFields = useMemo(
    () => groups.flatMap((g) => g.fields_to_collect),
    [groups]
  )

  const availableFields = useMemo(() => {
    return allFields
      .map((f) => f.properties.name)
      .filter((name) => !usedFields.includes(name))
  }, [allFields, usedFields])

  const handleInitialFieldAdd = (field: string) => {
    const newGroup: FieldsToCollectGroup = {
      name: 'Group 1',
      required: 'all',
      fields_to_collect: [field],
    }
    addFieldsGroup(newGroup)
    setDropdownVisible(false)
  }

  const addGroup = () => {
    const newGroup: FieldsToCollectGroup = {
      name: `Group ${groups.length + 1}`,
      required: 'all',
      fields_to_collect: [],
    }
    addFieldsGroup(newGroup)
  }

  const updateGroup = (
    index: number,
    partial: Partial<FieldsToCollectGroup>
  ) => {
    const updated = { ...groups[index], ...partial }
    updateFieldsGroup(index, updated)
  }

  const removeGroup = (index: number) => {
    removeFieldsGroup(index)
    if (activeDropdownIndex === index) setActiveDropdownIndex(null)
  }

  const addFieldToGroup = (groupIndex: number, field: string) => {
    const updated = {
      ...groups[groupIndex],
      fields_to_collect: [...groups[groupIndex].fields_to_collect, field],
    }
    updateFieldsGroup(groupIndex, updated)
    setActiveDropdownIndex(null)
  }

  const removeField = (groupIndex: number, field: string) => {
    const updated = {
      ...groups[groupIndex],
      fields_to_collect: groups[groupIndex].fields_to_collect.filter(
        (f) => f !== field
      ),
    }
    updateFieldsGroup(groupIndex, updated)
  }

  return (
    <div>
      {groups.length === 0 && (
        <div className='mb-4'>
          <div className='flex justify-center items-center'>
            <button
              className='w-full border px-3 py-2 rounded text-sm hover:bg-gray-100 text-center'
              onClick={() => setDropdownVisible((prev) => !prev)}
            >
              Add Fields to Collect
            </button>
          </div>

          {dropdownVisible && (
            <div className='relative mt-2'>
              <div className='absolute bg-white border rounded w-full z-10 shadow'>
                {availableFields.length > 0 ? (
                  availableFields.map((f, i) => (
                    <p
                      key={i}
                      className='cursor-pointer text-center py-1 hover:bg-gray-100'
                      onClick={() => handleInitialFieldAdd(f)}
                    >
                      {f}
                    </p>
                  ))
                ) : (
                  <p className='text-center text-gray-400'>
                    No fields available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {groups.length > 0 && (
        <>
          <div className='flex justify-between items-center mb-2'>
            <strong>Groups of Fields To Collect</strong>
            <button
              className='text-sm border px-2 py-1 rounded hover:bg-gray-100'
              onClick={addGroup}
            >
              Add Group
            </button>
          </div>

          {groups.map((group, groupIndex) => {
            const groupAvailableFields = availableFields

            return (
              <div key={groupIndex} className='border p-2 mt-4 rounded'>
                <div className='flex flex-col gap-2 mb-2'>
                  <div className='w-full flex items-center gap-2'>
                    <label className='text-sm font-semibold text-gray-700 whitespace-nowrap'>
                      Group Name:
                    </label>
                    <input
                      className='text-sm px-2 py-1 border border-gray-300 rounded-md outline-none w-full focus:ring-1 focus:ring-blue-500'
                      placeholder='Enter group name'
                      value={group.name}
                      onChange={(e) =>
                        updateGroup(groupIndex, { name: e.target.value })
                      }
                    />
                  </div>

                  <div className='w-full flex items-center gap-2'>
                    <label className='text-sm font-semibold text-gray-700 whitespace-nowrap'>
                      Required Fields:
                    </label>
                    <select
                      className='text-sm px-2 py-1 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500 w-full'
                      value={group.required}
                      onChange={(e) =>
                        updateGroup(groupIndex, {
                          required: e.target.value as 'none' | 'all' | 'any',
                        })
                      }
                    >
                      <option value='all'>All</option>
                      <option value='none'>None</option>
                      <option value='any'>Any</option>
                    </select>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  {group.fields_to_collect.map((field) => (
                    <div key={field} className='flex justify-between'>
                      <p>{field}</p>
                      <FiMinusCircle
                        className='cursor-pointer'
                        size={18}
                        onClick={() => removeField(groupIndex, field)}
                      />
                    </div>
                  ))}

                  <div className='relative mt-2 flex justify-between items-center'>
                    <button
                      className='text-sm text-blue-600 flex items-center gap-1 hover:underline'
                      onClick={() =>
                        setActiveDropdownIndex(
                          activeDropdownIndex === groupIndex ? null : groupIndex
                        )
                      }
                    >
                      <FiPlusCircle size={16} />
                      Add Field
                    </button>

                    <button
                      className='text-sm text-red-600 hover:underline'
                      onClick={() => removeGroup(groupIndex)}
                    >
                      Remove Group
                    </button>

                    {activeDropdownIndex === groupIndex && (
                      <div className='absolute bg-white border rounded w-full z-10 shadow mt-1 left-0'>
                        {groupAvailableFields.length > 0 ? (
                          groupAvailableFields.map((f, i) => (
                            <p
                              key={i}
                              className='cursor-pointer text-center py-1 hover:bg-gray-100'
                              onClick={() => addFieldToGroup(groupIndex, f)}
                            >
                              {f}
                            </p>
                          ))
                        ) : (
                          <p className='text-center text-gray-400'>
                            No fields available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default FieldGroupsManager
