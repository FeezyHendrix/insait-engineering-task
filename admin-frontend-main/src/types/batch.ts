import { Dispatch, SetStateAction, ChangeEvent } from "react"

export interface BatchRequestType {
  type: string
  defaultMessage: string
  messageData?: Array<EmailBatchType | PhoneBatchType>
  sender?: string
  subject?: string
}

export interface BatchTableData {
  header: string[];
  data: Array<{ [key: string]: string }>;
  emails?: EmailBatchType[];
  numbers?: PhoneBatchType[];
}

export interface EmailBatchType {
  email: string, 
  message?: string
}
export interface PhoneBatchType {
  phone: string, 
  message?: string
}

export interface BatchSendComponentProps {
  selectedOption: string
  setSelectedOption: Dispatch<SetStateAction<string>>
  tableData: BatchTableData
  setTableData: Dispatch<SetStateAction<BatchTableData>>
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface ContactList {
  isOpen?: boolean,
  data: BatchTableData,
  setData: (selectedEmails: EmailBatchType[], selectedPhones: PhoneBatchType[]) => void,
  toggle: () => void,
}

export interface CountryInfoType {
  name: string;
  code: string;
}