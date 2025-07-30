import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from '@datadog/browser-rum-react'
import { ToastContainer } from 'react-toastify';
import Router from '@components/navigation/Router';
import { useAuth } from './hook/useAuth';
import { useEffect, useRef, useState } from 'react';
import useKeycloakConfig from './hook/useKeycloakConfig';
import { useCompanyConfig } from './hook/useCompanyConfig';
import I18nProvider from './components/language/I18nProvider';
import { isDev } from './utils/constants';
import ErrorFallback from './components/errorFallback';

function App() {
  const { isAuth, setAuth, keycloakClient } = useAuth();
  const { isConfig, fetchCompanyConfig } = useKeycloakConfig();
  const isRun = useRef(false);
  const isConfigRun = useRef(false);
  const [_authLoaded, setAuthLoaded] = useState(false);
  const [keycloakConfigLoaded, setKeycloakConfigLoaded] = useState(false);
  const [keycloakLoaded, setKeycloakLoaded] = useState(false);
  const [configLoaded, _setConfigLoaded] = useState(true);

  useEffect(() => {
    if (isDev) {
      setAuth(true);
      setKeycloakConfigLoaded(true); 
      setKeycloakLoaded(true); 
      return;
    }
    if (isAuth) return
    async function config() {
      await fetchCompanyConfig(isRun.current);
      setKeycloakConfigLoaded(true);
    }
    if (isConfigRun.current) return;
    config();
    isConfigRun.current = true;
  }, [isConfig, fetchCompanyConfig, isAuth, isDev]);

  useEffect(() => {
    if (isDev) return;
    setAuth(isRun.current);
    isRun.current = false
    if (keycloakClient) {
      setAuthLoaded(false)
      setAuthLoaded(true)
    }
  }, [keycloakConfigLoaded])

  useEffect(() => {
    if (isDev) return;
    if (keycloakClient?.authenticated) {

      setKeycloakLoaded(true)
    }
  }, [keycloakClient?.authenticated])

  useCompanyConfig()


  return isAuth && keycloakConfigLoaded && keycloakLoaded && configLoaded || isDev ? (
    <ErrorBoundary fallback={ErrorFallback}>
      <I18nProvider>
        <div className='min-h-screen flex flex-col'>
          <Router />
          <ToastContainer className="z-[99999999999]" />
        </div>
      </I18nProvider>
    </ErrorBoundary>

    
  ) : (
    <></>
  );
}

export default App;