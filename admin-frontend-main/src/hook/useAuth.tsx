import Keycloak from "keycloak-js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { selectIsAuth, setCurrentUser, setIsAuth, setToken } from "@/redux/slices/auth";
import { axiosInstance } from "@/utils/axios";
import { selectKeycloakClientID, selectKeycloakRealm, selectKeycloakUrl } from "@/redux/companyConfig";
import * as Sentry from '@sentry/react';
import { datadogRum } from "@datadog/browser-rum";

let keycloakInstance: Keycloak | null = null;

const getKeycloakInstance = (url: string, realm: string, clientId: string) => {
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url,
      realm,
      clientId,
    });
  }
  return keycloakInstance;
};

export const useAuth = () => { 
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const keycloakURL = useSelector(selectKeycloakUrl);
  const keycloakRealm = useSelector(selectKeycloakRealm);
  const keycloakClientID = useSelector(selectKeycloakClientID);
  const [keycloakClient, setKeycloakClient] = useState(
    keycloakURL && keycloakRealm && keycloakClientID
      ? getKeycloakInstance(keycloakURL, keycloakRealm, keycloakClientID)
      : null
  );
  useEffect(() => {
    if (keycloakURL && keycloakRealm && keycloakClientID) {
      const client = getKeycloakInstance(keycloakURL, keycloakRealm, keycloakClientID);
      setKeycloakClient(client);
    }
  }, [keycloakURL, keycloakRealm, keycloakClientID]);

  const setAuth = useCallback(async (current: boolean) => {    
    if (current || !keycloakURL || !keycloakClientID || !keycloakRealm) return;    
    const initClient = async () => {      
      try {
        if (!keycloakClient) throw new Error("Authentication Error");
        const authenticated = await keycloakClient.init({
          onLoad: "login-required",
          checkLoginIframe: false,
        });
        if (!authenticated) {
          window.location.reload();
        }
        if (keycloakClient.token && keycloakClient.tokenParsed?.exp) {
          const {preferred_username , sub, email, sid, iss} = keycloakClient.tokenParsed
          axiosInstance.defaults.headers.common["authorization"] = `Bearer ${keycloakClient.token}`;
          dispatch(setIsAuth(authenticated));
          dispatch(setToken(keycloakClient.token));
          dispatch(setCurrentUser(preferred_username));
          Sentry.setUser({ username: preferred_username });
          datadogRum.setUser({
            id: sub ?? preferred_username, 
            email, 
            name: preferred_username, 
            sid,
            iss
          })
          const timeUntilExpiration =
            (keycloakClient.tokenParsed.exp - Math.floor(Date.now() / 1000)) * 1000;
          setInterval(async () => {
            try {
              const refreshed = await keycloakClient.updateToken(30);
              if (refreshed) {
                axiosInstance.defaults.headers.common["authorization"] = `Bearer ${keycloakClient.token}`;
                dispatch(setToken(keycloakClient.token || ''));
              }
            } catch (error) {
              keycloakClient.logout();
            }
          }, timeUntilExpiration);
        }
        return keycloakClient.authenticated
      } catch (error) {        
        keycloakClient?.logout();
      }
    };

    const initResponse = await initClient();
    return initResponse
  }, [keycloakClient, keycloakURL, keycloakClientID, keycloakRealm]);

  return { isAuth, setAuth, keycloakClient };
};