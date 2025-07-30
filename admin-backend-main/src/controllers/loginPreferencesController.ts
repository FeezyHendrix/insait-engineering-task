import { RequestHandler } from "express";
import tryCatch from "../utils/tryCatch";
import { validatePreferenceParams, fetchLastIDPData, fetchPrefectFlowStatus, createSSOInPrefect, openSSOClickupTicket } from "../services/loginPreferencesServices";
import { getFlowIdByName } from "../services/prefectService";
import { LoginProviderOptionType, PreferenceType } from "../types/interfaces";
import logger from "../libs/pino";

export const getCurrentIDPData: RequestHandler = tryCatch(async (req, res, next) => {
    const { provider, realm, keycloakUrl } = req.body.data ?? req.body;
    const loginData = await fetchLastIDPData(realm, keycloakUrl, provider as LoginProviderOptionType);
    res.json(loginData)
});

export const postLoginPreference: RequestHandler = tryCatch(async (req, res, next) => {
    const { provider, clientId, clientSecret, tenantId, hostedDomain, realm, keycloakUrl, username } = req.body.data as PreferenceType;
    logger.info(`Creating new login preference for ${provider}...`);
    const givenParams: PreferenceType = { provider, clientId, clientSecret, realm, keycloakUrl, tenantId, hostedDomain, username }
    const paramsInvalid: string | null = validatePreferenceParams(givenParams);
    if (paramsInvalid) {
        res.status(400).json({ error: `Invalid parameters: ${paramsInvalid}` });
        return;
    };
    if (provider === 'other') {
        const { clickupTicketUrl } = await openSSOClickupTicket(givenParams)
        logger.info(`Clickup ticket created for SSO preference: ${clickupTicketUrl}`)
        res.status(200).json({ msg: "success" });
        return
    };
    const flowId = await getFlowIdByName('sso_creation')
    const flowRunId = await createSSOInPrefect(flowId, givenParams);
    res.status(200).json({ flowRunId })
});

export const getFlowStatus: RequestHandler = tryCatch(async (req, res, next) => {
    const { prefectFlowId } = req.params;
    const flowStatus = await fetchPrefectFlowStatus(prefectFlowId);
    return res.status(200).json({ flowStatus });
});