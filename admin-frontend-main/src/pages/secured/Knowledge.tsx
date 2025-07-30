import { useState } from 'react';
import KnowledgeBaseTable from '@/components/knowledge/KnowledgeBaseTable';

const Knowledge = () => {
  const [openAddModal, setOpenAddModal] = useState(false)

  const toggleAddBtn = (value: boolean) => {
    setOpenAddModal(value)
  }

  return (
    <section className='flex-1 p-5 bg-white rounded-2xl flex m-5 flex-col gap-4 max-h-page-scroll-150'>
          <KnowledgeBaseTable
            openAddBtn={openAddModal}
            toggleAddBtn={toggleAddBtn}
          />

    </section>
  )
}

export default Knowledge