import { datadogRum } from '@datadog/browser-rum';
import constants, { RELEASE_VERSION, ENVIRONMENT, MODE, USE_DD } from "../utils/constants";

const {TENANT, DD_APP_ID, DD_CLIENT_TOKEN} = constants
const devMode = MODE === 'development'

if(USE_DD && !devMode && ENVIRONMENT !== 'na'){
    datadogRum.init({
        applicationId: DD_APP_ID,
        clientToken: DD_CLIENT_TOKEN,
        site: 'datadoghq.eu',
        service:'admin-frontend',
        env: ENVIRONMENT,
        
        version: RELEASE_VERSION,
        allowedTracingUrls: [
            /^https:\/\/.*\.insait\.io\/admin/,
            /^https:\/\/.*\.insait-internal\.com\/admin/
        ],        
        sessionSampleRate:  100,
        sessionReplaySampleRate: 20,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        defaultPrivacyLevel: 'mask-user-input',
    });

    datadogRum.setGlobalContextProperty('tenant', TENANT);
    
} else if (devMode) {
    console.log('Running in DEV mode - DD Rum is disabled')
} else {
    console.log(`Datadog RUM not initialized — ENVIRONMENT is "${ENVIRONMENT}"`);
}