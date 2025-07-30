export type LoginOptions = 'google' | 'microsoft' | 'other';

export interface LoginFormFields {
    provider: LoginOptions | null;
    clientId: string | null;
    clientSecret?: string | null;
    tenantId: string | null;
    hostedDomain: string | null;
};

export interface LoginPreferencesRequest {
    provider: LoginOptions | null;
    clientId: string | null;
    clientSecret?: string | null;
    tenantId: string | null;
    hostedDomain: string | null;
    realm: string | null;
    keycloakUrl: string | null;
};

export type LoginPreferenceStatus = 'PENDING' |'COMPLETED' | 'ERROR' | 'LOADING';

export interface CurrentLoginPreferences {
    provider: LoginOptions;
    clientId: string | null;
    tenantId: string | null;
    hostedDomain: string | null;
};
