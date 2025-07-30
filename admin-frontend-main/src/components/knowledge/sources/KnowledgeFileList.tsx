import {
  ITEMS_PER_PAGE,
  fileListHeader,
  generateStatusTextColor,
  getKnowledgeHeaderKey,
} from '@/utils/data'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FaSortAlphaUp, FaSortAlphaDown } from 'react-icons/fa'
import { MdDelete, MdDownload, MdFileOpen } from 'react-icons/md'

import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Loader from '@/components/elements/Loader'
import { KnowledgeFileItemType, KnowledgeFileListProp } from '@/types/knowledge'
import CustomTooltip from '@/components/elements/CustomTooltip'
import { KnowledgeFileViewModal } from '../KnowledgeFileViewModal'
import { fetchFileDocumentBuffer } from '@/redux/slices/knowledgeHub/request'
import { handleTxtExport } from '@/utils/export'

const KnowledgeFileList = ({
  data,
  handleOpenModal,
  loading,
  totalCount,
  orderBy,
  order,
  currentPage,
  handleRequestSort,
  handlePageChange,
  closeModal,
  selectedFile,
  setSelectedFile
}: KnowledgeFileListProp) => {
  const { t } = useTranslation()

  const viewFile = async (knowledgeFile: KnowledgeFileItemType) => {      
    setSelectedFile(knowledgeFile)
  };

  const downloadFile = async (knowledgeFile: KnowledgeFileItemType) => {
    try {
      const arrayBuffer = await fetchFileDocumentBuffer(knowledgeFile.id);
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
      
      handleTxtExport(
        await blob.arrayBuffer(),
        knowledgeFile.name,
        blob.type
      );
      
      toast.success(t('feedback.fileDownloadSuccess'));
    } catch (error) {
      console.error('Download error:', error);
      toast.error(t('feedback.fileDownloadError'));
    }
  };

  return (
    <>
      <div className='flex-1 overflow-y-auto'>
        <table className={`table-auto w-full rounded-corners`}>
          <thead className='primary-style sticky top-0 z-10'>
            <tr>
              {fileListHeader.map(headingKey => {
                const heading = headingKey ? t(`tableHeader.${headingKey}`) : '';
                const fieldKey = getKnowledgeHeaderKey(headingKey)
                return (
                  <th
                    onClick={() =>
                      handleRequestSort && handleRequestSort(fieldKey)
                    }
                    key={heading}
                    className='bolder-text'
                  >
                    <div className='flex justify-center items-center'>
                      <span className='flex items-center gap-1 capitalize whitespace-nowrap'>
                        {heading}
                        {orderBy === fieldKey && (
                          <span className='text-xl'>
                            {order === 'asc' ? (
                              <FaSortAlphaUp />
                            ) : (
                              <FaSortAlphaDown />
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className='overflow-y-auto'>
            {data.map(detail => (
              <tr key={detail.id}>
                <td className='bold-text text-center'>{detail.name}</td>
                <td className='bold-text text-center'>{dayjs(detail.createdAt).format('YYYY-MM-DD')}</td>
                <td className={`bold-text text-center text-${generateStatusTextColor(detail.status)}-600`}>{detail.status}</td>
                <td>
                    <div className='flex gap-4'>
                        <span
                            onClick={() => viewFile(detail)}
                            className={`mx-auto cursor-pointer app-text-blue text-xl flex justify-center items-center`}
                        >
                              <CustomTooltip title={t('knowledge.viewFile')} noWrap={false}>
                                <MdFileOpen />
                              </CustomTooltip>
                          </span>
                          <span
                            onClick={() => downloadFile(detail)}
                            className={`mx-auto cursor-pointer app-text-blue text-xl flex justify-center items-center`}
                        >
                              <CustomTooltip title={t('knowledge.downloadFile')} noWrap={false}>
                                <MdDownload />
                              </CustomTooltip>
                              </span>
                        <span
                            onClick={() => handleOpenModal('delete', detail)}
                            className='mx-auto cursor-pointer text-red-500 text-xl flex justify-center items-center'
                        >
                            <CustomTooltip title={t('knowledge.deleteFile')} noWrap={false}>
                            <MdDelete />
                            </CustomTooltip>
                        </span>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <Loader
            hasNoData={data.length === 0}
            loading={loading}
            title={t('feedback.fetching')}
          />
        )}
      </div>
      <KnowledgeFileViewModal
        isOpen={selectedFile !== null}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        closeModal={closeModal}
      />
      {data.length > 0 && (
        <div className='flex md:justify-end'>
          <ReactPaginate
            previousLabel='&#x2C2;'
            previousLinkClassName='text-xl flex items-center justify-center border border-blue-400 px-2 rounded-lg app-text-blue w-full h-full'
            nextLabel='&#x2C3;'
            nextLinkClassName='text-xl flex items-center justify-center text-center text-white app-bg-blue px-3 rounded-lg w-full h-full'
            pageLinkClassName='px-3 py-1 border rounded-lg flex items-center justify-center w-full h-full'
            breakLinkClassName='page-link'
            pageCount={Math.ceil(totalCount / ITEMS_PER_PAGE)}
            onPageChange={(selectedItem) => handlePageChange(selectedItem.selected)}
            containerClassName='flex gap-3 justify-start md:justify-end md:mr-10 pt-5'
            activeClassName='text-white app-bg-blue rounded-lg'
            forcePage={currentPage}
          />
        </div>
      )}
    </>
  )
}

export default KnowledgeFileList
