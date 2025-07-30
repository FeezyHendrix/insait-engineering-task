import useModal from '@hook/useModal'
import emailIcon from '@image/icons/email.svg'
import uploadIcon from '@image/icons/upload.svg'
import profileIcon from '@image/icons/profile.svg'
import infoIcon from '@image/icons/info-circle.svg'
import ConfirmationModal from './mini-elements/confirmation-modal'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector} from '@/hook/useReduxHooks'
import { getWhatsappTemplateTextsRequest, sendBatchRequest } from '@/redux/slices/analytics/request'
import { toast } from 'react-toastify'
import { BatchRequestType, BatchSendComponentProps, CountryInfoType, EmailBatchType, PhoneBatchType } from '@/types/batch'
import './styles/index.css'
import MessageInput from '../elements/MessageInput'
import ToggleRadioSelection from '../elements/ToggleRadioSelection'
import EmailInputBox from '../elements/EmailInputBox'
import { useTranslation } from 'react-i18next'
import { RootState } from '@/redux/store'
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { addCountryCode } from '@/utils'

const ContactType = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
};

const BatchSendComponent = ({handleFileUpload, tableData, setTableData, selectedOption, setSelectedOption}:BatchSendComponentProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch();
  const { toggle, isOpen } = useModal()
  const [emails, setEmails] = useState<EmailBatchType[]>([]);
  const [numbers, setNumbers] = useState<PhoneBatchType[]>([]);
  const [emailStrings, setEmailStrings] = useState<string[]>([]);
  const [numberStrings, setNumberStrings] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [whatsappTemplateTexts, setWhatsappTemplateTexts] = useState<string[]>([]);
  const { batchChannels, countryInfo } = useAppSelector((state: RootState) => state.companyConfig);

  const [country, setCountry] = useState<CountryInfoType>({
    name: countryInfo.name,
    code: countryInfo.code,
  });

  const minCardHeightClass= selectedOption === 'EMAIL' ? 'min-h-[250px]' : 'min-h-[290px]';

  useEffect(() => {
    if (tableData?.emails) {
      setEmails(tableData.emails);
      setEmailStrings(tableData.emails.map(e => e.email));
    }
    if (tableData?.numbers) {
      setNumbers(tableData.numbers);
      setNumberStrings(tableData.numbers.map(n => n.phone));
    }
  }, [tableData]);
  
  // for tags
  const handleChange = (tags: string[]) => {
    if(selectedOption === ContactType.EMAIL) {
      setEmailStrings(tags);
      setEmails(prevEmails => {
        return tags.map(email => {
          const existingEmail = prevEmails.find(e => e.email === email);
          return existingEmail || { email, message: message || '' };
        });
      });
    }
    if(selectedOption === ContactType.SMS || selectedOption === ContactType.WHATSAPP) {
      setNumberStrings(tags);
      setNumbers(prevNumbers => {
        return tags.map(phone => {
          const existingNumber = prevNumbers.find(n => n.phone === phone);
          return existingNumber || { phone, message: message || '' };
        });
      });
    }
  };

  //for message handle
  const messageChange = (value:string) => {
    setMessage(value);
  };
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };
  const subjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };
  const senderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSender(e.target.value);
  };

  const hasEmptyMessage = (arr: EmailBatchType[] | PhoneBatchType[]) => 
    arr.some(item => !item.message || item.message.trim() === '');
  
  const confirmRequest = () => {
    if (!message && (hasEmptyMessage(emails) || hasEmptyMessage(numbers))) {
      toast.error(t("batch.validation.message"));
      return;
    }
    if(!emails && !numbers) { toast.error(t("batch.validation.emails")); return }
    if(selectedOption === ContactType.EMAIL && !subject) { toast.error(t("batch.validation.subject")); return }
    if(selectedOption === ContactType.EMAIL && !sender) { toast.error(t("batch.validation.sender")); return }
    toggle();
  }

  const handleSubmission = async () => {
    toggle();
    setLoading(true)
    let formData : BatchRequestType = {
      type: selectedOption,
      defaultMessage: message,
    };

    if(selectedOption === ContactType.EMAIL ){
      formData.sender = sender;
      formData.subject = subject
      formData.messageData = emails;
    }
    else if(selectedOption === ContactType.SMS || selectedOption === ContactType.WHATSAPP ){
      formData.messageData = numbers.map(item => ({
        ...item,
        phone: addCountryCode(item.phone, country.code)
      }));
    }

    dispatch(sendBatchRequest(formData))
    .then(
      (res:any)=>{
        setLoading(false)
        if(res.error){
          toast.error(res.payload.message)
        }
        else{
          toast.success(t('batch.requestSuccessful'))
          setNumbers([]);
          setNumberStrings([]);
          setMessage('');
          setEmails([]);
          setEmailStrings([]);
          setTableData({
            header: [],
            data: [],
            emails: [],
            numbers: []
          })
        }
      }
    ).catch(
      (err:any)=>{
        setLoading(false)
        toast.error(t('feedback.requestFailed'))
        toast.error(err)
      }
    )

  }

  const toggleDropdown = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleCountrySelect = (value: string, data: CountryData ) => {
    setCountry({ name: data.name, code: value });
  };

  const getWhatsappTemplateTexts = useCallback(async () => {
      const result = await dispatch(getWhatsappTemplateTextsRequest());
      const payload = await result.payload
      const payloadMessage = await result.payload?.message
      if (!payload || payloadMessage === t("feedback.errorWrong")) {
        return
      }
      setWhatsappTemplateTexts(result.payload.whatsappTemplateTexts)
  }, []);


  useEffect(() => {
    getWhatsappTemplateTexts()
  }, []);

  const clearEntries = () => {
    setEmails([]);
    setEmailStrings([]);
    setNumbers([]);
    setNumberStrings([]);
    setTableData({
      header: [],
      data: [],
      emails: [],
      numbers: [],
    })
  };

  return (
    <div className='w-full col-span-1 bg-white px-3 rounded-xl h-auto mb-8 md:mb-0'>
      <div className='medium'>
        {batchChannels.length > 1 ? 
          <>
            <h2 className="my-2 text-lg font-bold text-gray-900">{t('batch.chooseSendMessageWay')}</h2>
            <ToggleRadioSelection 
              selectedOption={selectedOption}
              name="batch-send"
              data={[
                { label: 'batch.option.email', value: ContactType.EMAIL },
                { label: 'batch.option.sms', value: ContactType.SMS },
                { label: 'batch.option.whatsapp', value: ContactType.WHATSAPP },
              ].filter(option => batchChannels.includes(option.value))}
              handleOptionChange={handleOptionChange}
            />
          </>
          :
          <h2 className="my-2 text-lg font-bold text-gray-900">{t(`batch.title.${batchChannels[0]}`)}</h2>
        }
      </div>

      <div className="my-4">
        <h3 className="my-2 text-lg font-semibold text-gray-900">{t('batch.uploadCommaSeperatedList')}</h3>
        <div className={`flex flex-col md:flex-row ${minCardHeightClass}`}>
          <div className="flex items-center justify-center basis-3/12 ">
              <label htmlFor="dropzone-file" className={`${minCardHeightClass} flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50`}>
                  <div className="flex flex-col items-center justify-center pt-8 pb-8">
                  <img src={uploadIcon} className='logo' alt='upload icon' width={40} height={40} />
                  <p className="my-2 text-sm text-blue-600">
                    <span className="font-semibold">{ 'Upload CSV File'} </span>
                  </p>
                  </div>
                  <input id="dropzone-file" type="file" accept=".csv" className="hidden" onChange={handleFileUpload}  />
              </label>
          </div> 

          <div className="orblock flex items-center justify-center basis-1/12">
            <h3 className="text-gray-400">{t('batch.or')}</h3>
          </div>
          
          <div className={`basis-6/12 card rounded-md bg-white border border-grey-50 p-3 ${minCardHeightClass}`}>
          {selectedOption !== ContactType.EMAIL && <h4 className="text-gray-400">{t('batch.phoneFormat')}</h4>}
            <div className='flex flex-col h-full'>
            {selectedOption !== ContactType.EMAIL && (
              <div className='flex gap-2 items-center my-2'>
                <PhoneInput
                  value={country.code}
                  onChange={handleCountrySelect}
                  enableSearch={true}
                  disableSearchIcon={true}
                  countryCodeEditable={false}
                  containerClass='!w-auto'
                  inputClass='!w-[100px]'
                />
                <p className='bold-text'>{country.name}</p>
              </div>
            )}
            <EmailInputBox
              value={selectedOption === ContactType.EMAIL ? emailStrings : numberStrings}
              onChange={handleChange}
              type={selectedOption === ContactType.EMAIL ? 'email' : 'phone'}
              clearEntries={clearEntries}
            />
            </div>
          </div>
          
        </div>
      </div>

      {
        selectedOption === ContactType.EMAIL ?
          <div className="my-4 ms-1">
            <div className='flex flex-row'>
              <div className="basis-3/12">
                <label htmlFor="emailTitle" className="block mb-2 text-md font-semibold text-gray-900">{t('batch.emailSubject')}</label>
                <div className="relative">
                    <div className="absolute p-2 pointer-events-none">
                        <img src={emailIcon} className='logo' alt='email icon' width={25} height={25} />
                    </div>
                    <input type="text" id="emailTitle" onChange={subjectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Subject" />
                </div>
              </div> 

              <div className="orblock flex items-center justify-center basis-1/12">
              </div>
              <div className="basis-4/12">
                <label htmlFor="sender" className="block mb-2 text-md font-semibold text-gray-900">{t('batch.senderName')}</label>
                  <div className="relative">
                      <div className="absolute p-2 pointer-events-none">
                            <img src={profileIcon} className='logo' alt='email icon' width={25} height={25} />
                      </div>
                      <input type="text" id="sender" onChange={senderChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" pattern='/^[^\s@]+@[^\s@]+\.[^\s@]+$/' placeholder="Eg. thomas@mail.com" />
                  </div>
              </div>
              
            </div>
          </div>
          :''
      }
      
      {
        selectedOption === ContactType.WHATSAPP ?
        <div className="messageBlock my-4">
          <h3 className="my-2 text-lg font-semibold text-gray-900 inline">{t('batch.selectMessage')}</h3>
          <div className='tooltip relative inline'>
          <img
            src={infoIcon}
            className='logo inline'
            alt='upload icon'
            width={20}
            height={20}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
            {showTooltip && (
              <div
                id="tooltip-message"
                className="tooltip-message block absolute z-10 inline-block px-1 py-0 text-sm font-sm text-white transition-opacity duration-300 bg-gray-500 rounded-md shadow-sm"
              >
                {t('batch.selectTemplateInfo')}
              </div>

            )}
          </div>
          <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center"
          >
            <span>{message}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-.707.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {optionsOpen && (
            <div
            className="absolute end-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto optionsOpen"
            role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
              <div className="py-1">
                {whatsappTemplateTexts.map((text, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    onClick={ () => {
                      setMessage(text)
                      setOptionsOpen(false)
                    }}
                  >
                    {text}
                  </a>
                ))}
              </div>
            </div>
          )}

    </div>
        </div>
        :
        <MessageInput 
          onChange={(value) => messageChange(value)}
          value={message}
          label={t('batch.typeYourMessage')}
          toolTipText={t('support.enterHTMLCodeForTemplate')}
        />
      }
      

      <div className='flex justify-center mb-5'>
        <button 
          disabled={loading || (emails.length === 0 && numbers.length === 0)} 
          type="button" 
          onClick={confirmRequest} 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:bg-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            {t('button.sendMessage')}
        </button>
      </div>

      <ConfirmationModal isOpen={isOpen} toggle={toggle} confirm={handleSubmission}></ConfirmationModal>
    </div>
  )
}

export default BatchSendComponent
