import axios from "axios"
import constants from "../../src/constants"
import jwt from 'jsonwebtoken';
import { CompanyConfigType } from "./types";

export const generateCompanyConfig = async (): Promise<CompanyConfigType | undefined> => {
    const companyConfigUrl = constants.COMPANY_CONFIG_BASE_URL
    const companyConfigSecret = constants.COMPANY_CONFIG_SECRET    
    if (!companyConfigUrl || !companyConfigSecret) return
    try {
        const token = jwt.sign({ name: "test-company" }, companyConfigSecret)           
        const configResponse = await axios.get(`${constants.COMPANY_CONFIG_BASE_URL}?name=test-company&product=admin&section=api`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })        
        const keycloakPublicKey = configResponse.data.data.keycloak_pub_key
        const keycloakPassword = configResponse.data.data.keycloak_password
        const keycloakUsername = configResponse.data.data.keycloak_username
        const keycloakClientID = configResponse.data.data.keycloak_client_id
        const keycloakClientSecret = configResponse.data.data.keycloak_client_secret
        return { keycloakPublicKey, keycloakPassword, keycloakUsername, keycloakClientID, keycloakClientSecret }
    } catch (e) {
        console.error(e)
    }
}