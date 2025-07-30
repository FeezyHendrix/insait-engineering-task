import { axiosInstance } from "@/utils/axios";
import constants from "@/utils/constants";

const { CONFIGURATION_API_URL } = constants

export const getCompanyConfig = async (companyName: string) => {    
    return await axiosInstance.get(`${CONFIGURATION_API_URL}?name=${companyName}&product=admin&section=ui`);
}