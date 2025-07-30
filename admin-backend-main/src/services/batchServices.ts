import axios from "axios";
import logger from "../libs/pino";
import constants from "../constants";
import { OperationalError } from "../utils/error";
import axiosInstance from "../utils/axiosInstance";

export const fetchWhatsappTemplates = async () => {
      const response = await axiosInstance.get('https://content.twilio.com/v1/Content', {
        auth: {
          username: constants.TWILIO_ACCOUNT_SID,
          password: constants.TWILIO_AUTH_TOKEN
        }
      });
      return response.data
};