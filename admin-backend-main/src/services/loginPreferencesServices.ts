import axios from "axios";
import constants, { defaultAdminSSOAssignees, requiredLoginParams } from "../constants";
import { PreferenceType, LoginProviderOptions, LoginProviderOptionType, CreateReportEmailType, TicketPriority, TicketRequestType, TicketStatus } from "../types/interfaces";
import logger from "../libs/pino";
import axiosInstance from "../utils/axiosInstance";
import { runPrefectFlow } from "./prefectService";
import { OperationalError } from "../utils/error";
import { createClickUpTicket } from "../utils/reportUtil";

export const validatePreferenceParams = (givenParams: PreferenceType) => {
    const { provider, clientId, tenantId, hostedDomain, realm, keycloakUrl } = givenParams
    const paramsToCheck: { [key: string]: string | null | undefined } = { clientId, tenantId, hostedDomain, realm, keycloakUrl }
    if (!provider) {
        return 'provider missing';
    };
    if (!LoginProviderOptions.includes(provider)) {
        return `provider must be one of '${LoginProviderOptions.join(', ')}', not '${provider}'`;
    };
    const missingParams = requiredLoginParams[provider].filter(param => !paramsToCheck[param]);
    if (missingParams.length) {
        return `missing params: ${missingParams.join(', ')}`;
    }
    return null
};

export const cleanPreferenceParams = (givenParams: PreferenceType): PreferenceType => {
    const { provider, clientId, clientSecret, tenantId, hostedDomain, realm, keycloakUrl } = givenParams;
    switch (provider) {
        case 'google':
            return { provider, clientId, clientSecret, hostedDomain, realm, keycloakUrl }
        case 'microsoft':
            return { provider, clientId, clientSecret, tenantId, realm, keycloakUrl }
        case 'other':
            return { provider, realm, keycloakUrl }
        default:
            return givenParams
    }
};

export const fetchLastIDPData = async (realm: string, keycloakUrl: string, provider: LoginProviderOptionType) => {
    const url = `${keycloakUrl}/admin/realms/${realm}/identity-provider/instances/${provider}`
    const headers = await generateKeycloakAuthHeaders(keycloakUrl);
    try {
        const currentLoginData = await axiosInstance.get(url, { headers });
        return {
            clientId: currentLoginData.data.config.clientId,
            tenantId: currentLoginData.data.config.tenantId,
            hostedDomain: currentLoginData.data.config.hostedDomain,
        };
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            logger.info(`No login data found for realm: ${realm} and provider: ${provider}, at ${url}:`);
            logger.info(JSON.stringify(error.response?.data?.error) || '');
            return {};
        }
        throw error;
    }
};

const generateKeycloakAuthHeaders = async (keycloakUrl: string) => {
    try {
        const url = `${keycloakUrl}/realms/master/protocol/openid-connect/token`;
        const data = {
            client_id: 'admin-cli',
            username: constants.KEYCLOAK_USERNAME,
            password: constants.KEYCLOAK_PASSWORD,
            grant_type: 'password'
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const response = await axiosInstance.post(url, data, { headers });
        const accessToken = response.data.access_token;
        return {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };
    } catch (error) {
        logger.error(`Error generating keycloak auth headers: ${error}`);
        throw error;
    }
};

export const fetchPrefectFlowStatus = async (prefectFlowId: string) => {
    try {
        const url = `${constants.PREFECT_API_URL}/flow_runs/${prefectFlowId}`;
        const response = await axiosInstance.get(url);
        const flowStatus = response.data.state.name;
        return flowStatus;
    } catch (error) {
        logger.error(`Error fetching Prefect flow status for flow ${prefectFlowId}: ${error}`);
        throw error;
    }
};

export async function createSSOInPrefect(flowId: string, givenParams: PreferenceType): Promise<void> {
    const { provider, clientId, clientSecret, tenantId, hostedDomain, realm, keycloakUrl } = givenParams;
    try {
      logger.info(`Triggering Prefect flow to create IDP for provider ${provider} in realm ${realm} at ${keycloakUrl}...`);
      const prefectResponse = await runPrefectFlow(flowId, {
        realm,
        keycloak_url: keycloakUrl,
        provider: provider.toLowerCase(),
        client_id: clientId,
        client_secret: clientSecret,
        tenant_id: tenantId,
        hosted_domain: hostedDomain,
      });
      const flowRunId = prefectResponse.id;
      logger.info(`...Prefect flow ${flowRunId} triggered to create IDP in Prefect for provider ${provider} in realm ${realm} at ${keycloakUrl}`);
      return flowRunId;
    } catch (error) {
      const errorMessage = `Error creating SSO in Prefect for provider ${provider} in realm ${realm} at ${keycloakUrl}: ${error}`;
      logger.error(errorMessage);
      throw new OperationalError(errorMessage, error as Error);
    }
  };
  
  export const openSSOClickupTicket = async (givenParams: PreferenceType): Promise<{ clickupTicketUrl: string | null }> => {
    try {
        const { realm, username } = givenParams;
        const subject = `Login Setup for ${realm?.toUpperCase() || 'UNKNOWN'}`;
        const message = `${realm} selected "Other" in the Admin SSO Configuration. Reach out to ${username}.\n This ticket was generated automatically from the Admin.`
        const clickupPayload: CreateReportEmailType = {
            subject,
            message,
            companyName: realm || 'unknown',
            startDate: new Date().getTime(),
            sender: username || 'unknown',
            priority: TicketPriority.high,
            requestType: TicketRequestType.feature,
            status: TicketStatus.toDo,
            assigneeOverride: defaultAdminSSOAssignees
        };
        const clickupTicketUrl = await createClickUpTicket(clickupPayload);
        if (!clickupTicketUrl) {
            const errorMessage = `Error creating ClickUp ticket for SSO setup for ${realm}`;
            throw new OperationalError(errorMessage, Error(errorMessage));
        }
        return { clickupTicketUrl };
    } catch (error) {
        logger.error(`Error opening ClickUp ticket for SSO setup: ${error}`);
        throw error;
    }
  };
