// import { getCompanyConfig } from "@/redux/companyConfig/requests";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useReduxHooks";
import { selectIsConfig, setIsConfig, setKeycloakClientID, setKeycloakRealm, setKeycloakUrl } from "@/redux/companyConfig";
import { isProduction } from "@/utils/constants";
import constants from "@/utils/constants";

const { KEYCLOAK_URL, TENANT  } = constants

const useKeycloakConfig = () => {
    const dispatch = useAppDispatch();    
    const isConfig = useSelector(selectIsConfig)


    const fetchCompanyConfigDev = async (): Promise<void> => {                                        
        dispatch(setKeycloakClientID("insait-client"));
        dispatch(setKeycloakRealm("test-company"));
        dispatch(setKeycloakUrl(KEYCLOAK_URL));
        dispatch(setIsConfig(true))
    }

    const fetchCompanyConfigProd = async (current: boolean): Promise<void> => {       
        if (current) return;
        current = true; 
        const companyName = TENANT

        dispatch(setKeycloakClientID("insait-client"));
        dispatch(setKeycloakRealm(companyName));
        dispatch(setKeycloakUrl(KEYCLOAK_URL));
        dispatch(setIsConfig(true))         
    }
    
    const fetchCompanyConfig = !isProduction ? fetchCompanyConfigDev : fetchCompanyConfigProd;
    return { isConfig, fetchCompanyConfig }
};

export default useKeycloakConfig