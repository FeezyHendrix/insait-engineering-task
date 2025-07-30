import { useState } from 'react';
import BatchSendComponent from '@/components/batchSend/batchSend';
import Papa from "papaparse";
import ContactsList from '@/pages/secured/ContactList';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { BatchTableData, EmailBatchType, PhoneBatchType } from '@/types/batch';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const BatchSend = () => {
  const { t } = useTranslation();
  const [contactPage, setContactPage] = useState(false);
  const batchChannels = useSelector((state: RootState) => state.companyConfig.batchChannels);
  const [selectedOption, setSelectedOption] = useState(batchChannels[0]);
  const [tableData, setTableData] = useState<BatchTableData>({
    header: [],
    data: [],
    emails: [],
    numbers: [],
  });

  const toggleContactPage = () => {
    setContactPage(false);
  };

  const setData = (selectedEmails: EmailBatchType[], selectedPhones: PhoneBatchType[]) => {
    setTableData((prevData) => ({
      ...prevData,
      emails: selectedEmails,
      numbers: selectedPhones,
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        if(!results?.data?.length) {
          toast.error(t('feedback.fileProcessingFailed'))
          return;
        }
        const headers: string[] = Object.keys(results.data[0]);
        const requiredValue = selectedOption.toLowerCase() === 'email' ? 'email' : 'phone'
        const isRequiredFieldPresent = headers.includes(requiredValue);
        if (isRequiredFieldPresent === false) {
          toast.error(t('feedback.fileInclude', {name : requiredValue }))
          return;
        }
        setTableData({
          header: headers,
          data: results.data,
          emails: [],
          numbers: [],
        });
        setContactPage(true);
      },
    });
  };

  return (
    <section className='flex-1 p-5 bg-white rounded-2xl flex m-5'>
      {contactPage ? (
        <ContactsList
          toggle={toggleContactPage}
          data={tableData}
          setData={setData}
        />
      ) : (
        <BatchSendComponent
          key={selectedOption}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          tableData={tableData}
          setTableData={setTableData}
          handleFileUpload={handleFileUpload}
        />
      )}
    </section>
  );
};

export default BatchSend;
