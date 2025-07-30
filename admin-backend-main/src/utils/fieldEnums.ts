import constants from "../constants";
import logger from "../libs/pino";
import axiosInstance from "./axiosInstance";

export const fetchEnumFieldNames = async (companyName: string): Promise<string[]> => {
    try {
        const agentEndpointUrl = `${constants.AGENT_URL}:${constants.AGENT_PORT}/analytics/enums`;
        const jwtToken = constants.AGENT_JWT_TOKEN;

        if (!jwtToken) {
            throw new Error('JWT token is missing');
        }

        const headers = {
            "Authorization": `Bearer ${jwtToken}`,
        };
        const params = {
            product_type: companyName,
        };

        try{
            const response = await axiosInstance.get(agentEndpointUrl, {
                headers,
                params,
            });
            const data = response.data;
    
            if (!data || !Array.isArray(data.fields)) {
                throw new Error("Invalid response format from /enums");
            }
    
            const fields = data.fields.map((item: { field_name: string }) => item.field_name);
            return fields;
        } catch (error) {
            logger.error(`Error fetching enum field names: ${(error as Error).message}`);
            return [];
        }
    } catch (error) {
        throw new Error(`Unexpected error in fetchEnumFieldNames: ${(error as Error).message || error}`);
    }
};
