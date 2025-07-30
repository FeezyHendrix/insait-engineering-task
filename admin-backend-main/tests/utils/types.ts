export interface CompanyConfigType {
    keycloakPublicKey: string;
    keycloakPassword: string;
    keycloakUsername: string;
    keycloakClientID: string;
    keycloakClientSecret: string;
}

export interface KeyCloakRequestBody {
    client_id: string;
    client_secret: string;
    grant_type: string;
    username: string;
    password: string;
  }