import React, { useState } from 'react'
import { FaRegStickyNote } from 'react-icons/fa'
import { MenuOption, ToolbarProps } from '@/types/agent-builder'

const Toolbar = ({ data, addNode, showComment = true }: ToolbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  let timeoutId: ReturnType<typeof setTimeout>

  const handleMouseEnter = (menuKey: string) => {
    clearTimeout(timeoutId)
    setActiveDropdown(menuKey)
  }

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setActiveDropdown(null), 300)
  }
  const handleNodeSelection = (
    e: React.MouseEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    const { clientX, clientY } = e
    addNode(nodeType, { x: clientX, y: clientY })
    setActiveDropdown(null)
  }

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const renderDropdown = (options: MenuOption[]) => {
    return (
      <div className='w-max absolute -top-8 left-[50px] ml-2 bg-white z-50 rounded-md border border-gray-200 shadow-lg'>
        {options?.length &&
          options.map(item => (
            <div
              key={item.id}
              className='flex items-center gap-3 p-3 cursor-grab border-b border-gray-300 transition-transform duration-200 ease-in-out hover:bg-gray-100 hover:scale-102'
              onClick={e => handleNodeSelection(e, item.value)}
              draggable
              onDragStart={e => onDragStart(e, item.value)}
            >
              {<item.icon size={20} className='text-gray' />}
              <span className='text-base font-medium text-gray'>
                {item.label}
              </span>
            </div>
          ))}
      </div>
    )
  }

  return (
    <>
      <div
        id='builder-toolbar'
        className='absolute top-5 left-5 z-10 flex flex-col gap-5 bg-white px-4 py-10 rounded-2xl items-center text-center shadow-lg border border-gray-200'
      >
        {Object.entries(data).map(([key, item]) => (
          <div
            key={key}
            className='relative flex flex-col items-center gap-2'
            onMouseEnter={() => handleMouseEnter(key)}
            onMouseLeave={handleMouseLeave}
            draggable={!item.options}
            onDragStart={e => !item.options && onDragStart(e, item.value)}
          >
            <item.icon
              size={20}
              className={
                !item.options
                  ? 'cursor-grab text-gray'
                  : 'cursor-pointer text-gray'
              }
            />
            <div className='text-xs font-medium text-center text-gray'>
              {item.label}
            </div>
            {activeDropdown === key &&
              item?.options?.length &&
              renderDropdown(item.options)}
          </div>
        ))}
      </div>
      {showComment && (
        <div className='absolute bottom-[150px] left-[10px] app-bg-blue px-2 py-5 rounded-xl flex flex-col gap-4 opacity-90'>
          <div
            className='w-fit cursor-move'
            draggable={true}
            onDragStart={e => onDragStart(e, 'Comment')}
          >
            <FaRegStickyNote className='text-white text-xl' />
          </div>
        </div>
      )}
    </>
  )
}

export default Toolbar
