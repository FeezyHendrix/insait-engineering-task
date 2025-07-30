import PreviousNextPagination from "@/components/pagination/PreviousNextPagination";
import { ContactList, EmailBatchType, PhoneBatchType } from "@/types/batch";
import { ITEMS_PER_PAGE } from "@/utils/data";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ContactsList: React.FC<ContactList> = ({ toggle, data, setData }) => {
    const { t } = useTranslation();
    const [selectedEmails, setSelectedEmails] = useState<EmailBatchType[]>([]);
    const [selectedPhones, setSelectedPhones] = useState<PhoneBatchType[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<typeof data.data>([])
    const handleCheckboxChange = (email: string, phone: string, message: string) => {
    const isEmailChecked = selectedEmails.some(item => item.email === email);
    const isPhoneChecked = selectedPhones.some(item => item.phone === phone);
    
    if (isEmailChecked || isPhoneChecked) {
        setSelectedEmails((prevEmails) => prevEmails.filter((item) => item.email !== email));
        setSelectedPhones((prevPhones) => prevPhones.filter((item) => item.phone !== phone));
      } else {
        if (email?.trim()) setSelectedEmails((prevEmails) => [...prevEmails, { email, message }]);
        if (phone?.trim()) setSelectedPhones((prevPhones) => [...prevPhones, { phone, message }]);
    }
    };

    const getData= ()=>{
        toggle();
        setData(selectedEmails, selectedPhones)
    }

    useEffect(() => {
        if (data?.data) {
            const emails = data.data
                .filter(item => item.email?.trim())
                .map(item => ({ email: item.email, message: item.message }));
            const phones = data.data
                .filter(item => item.phone?.trim())
                .map(item => ({ phone: item.phone, message: item.message }));
            setSelectedEmails(emails);
            setSelectedPhones(phones);
        }
    }, [data?.data]);

    useEffect(() => {
        if (data?.data) {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const pageData = data.data.slice(startIndex, endIndex);
            setPaginatedData(pageData);
        }
    }, [data?.data, currentPage]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <section className='flex-1'>
            {
                data &&
                <>
                    <div className='h-full w-full max-h-[70vh]'>
                        <div className="relative overflow-auto shadow-md sm:rounded-lg h-full">
                        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-white uppercase bg-blue-700 primary-style sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="p-4"></th>
                                {data.header.map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3">
                                    {header}
                                </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
                                    <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                        id={`checkbox-table-search-${rowIndex}`}
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        onChange={() => handleCheckboxChange(row['email'], row['phone'], row['message'])}
                                        checked={
                                            selectedEmails.some(item => item.email === row['email']) ||
                                            selectedPhones.some(item => item.phone === row['phone'])
                                        }
                                        />
                                        <label htmlFor={`checkbox-table-search-${rowIndex}`} className="sr-only">
                                        checkbox
                                        </label>
                                    </div>
                                    </td>
                                    {data.header.map((header, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        {row[header]}
                                    </td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        <PreviousNextPagination
                            currentPage={currentPage}
                            totalItems={data.data.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    </div>
                    <div className='flex justify-center mt-5 mb-5'>
                        <button type="button" onClick={getData} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{t('button.next')}</button>
                    </div>
                </>
            }
        </section>
    )
}

export default ContactsList
