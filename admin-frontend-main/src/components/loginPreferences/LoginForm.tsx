import { useEffect, useState, Dispatch, SetStateAction, MouseEvent, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { CurrentLoginPreferences, LoginFormFields, LoginOptions } from '@/types/login';
import { InputWithIcon } from '@/components/elements/Input';
import Button from '@/components/elements/Button';
import { getFlowStatus, getLastLoginPreferences, postLoginPreferences } from '@/redux/slices/analytics/request';
import constants from '@/utils/constants';
import ConfirmationBody from '@/components/batchSend/mini-elements/confirmation-body';
import Modal from '@/components/elements/Modal';
import { copyTimeout } from "@/utils/data"
import { useAppDispatch } from '@/hook/useReduxHooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setButtonAndLoading } from '@/redux/slices/loginPreferences';
import CustomTooltip from '../elements/CustomTooltip';
import backIcon from '@image/icons/arrow-left.svg'

const { TENANT, KEYCLOAK_URL } = constants;
const LoginForm = ({ provider, setProviderToView }: { provider: LoginOptions, setProviderToView: Dispatch<SetStateAction<LoginOptions | null>>  }) => { 
    const emptyLoginForm: LoginFormFields = { 
        provider,
        clientId: null, 
        clientSecret: null, 
        tenantId: null, 
        hostedDomain: null
    };
    const [inputValues, setInputValues] = useState<LoginFormFields>(emptyLoginForm);
    const [fieldsValid, setFieldsValid] = useState<boolean>(false);
    const [currentPreferencesData, setCurrentPreferencesData] = useState<CurrentLoginPreferences | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [secretWasEdited, setSecretWasEdited] = useState<boolean>(false);
    const [fieldsWereEdited, setFieldsWereEdited] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const { buttonText, loading } = useSelector((state: RootState) => state.loginPreferences[provider]);

    const dispatch = useAppDispatch();

    const providerFormTexts = {
        google: {
            clientId: 'OAuth Client ID',
            clientSecret: 'OAuth Client Secret',
            placeholder: 'Can be found in your Google Cloud Console',
            },
        microsoft: {
            clientId: 'Application (client) ID',
            clientSecret: 'Client Secret',
            placeholder: 'Can be found in your Azure Portal'
        }
    };
    const realm = TENANT

    const handleBackClick = (e: MouseEvent<HTMLDivElement>) => {
        setProviderToView(null)
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInputValues(prev => ({ ...prev, [name]: value }))
        setFieldsWereEdited(true);
        if (name === 'clientSecret') { setSecretWasEdited(true) }
    };

    const validateFields = () => {
        if (provider === 'other') return true;
        if (!inputValues.clientId || !inputValues.clientSecret) return false;
        if (provider === 'google' && !inputValues.hostedDomain) return false;
        if (provider === 'microsoft' && !inputValues.tenantId) return false;
        return true;
    };

    const handleSubmitPreference = async () => {
        setShowConfirmation(false);
        const keycloakUrl = KEYCLOAK_URL;
        if (!secretWasEdited) delete inputValues.clientSecret;
        const requestPayload = { ...inputValues, realm, keycloakUrl }
        try {
            dispatch(setButtonAndLoading({
                provider,
                buttonText: "Sending...",
                loading: true
            }))
            const flowRunId = await postLoginPreferences(requestPayload);
            if (provider === 'other') {
                toast.success(`We have recorded your request and will reach out to you shortly`);
                dispatch(setButtonAndLoading({
                    provider,
                    buttonText: "Submit",
                    loading: false
                }));
                return;
            };
            trackStatus(provider, flowRunId, buttonText);
        } catch (error: any) {
            toast.error(error?.message || "Error submitting data")
            dispatch(setButtonAndLoading({
                provider,
                buttonText: "Submit",
                loading: false
            }));
            fetchLastLoginPreference()
        };
    };

    const fetchLastLoginPreference = async () => {
        if (!provider) return;
        try {
            const response = await getLastLoginPreferences(realm, provider);
            if (!Object.keys(response).length) return;
            setCurrentPreferencesData(response)
        } catch (error: any) {
            toast.error(error?.message || "Error fetching data")
        }
    };

    const fetchFlowStatus = async (flowRunId: string) => {
        if (!flowRunId) return;
        try {
            const response = await getFlowStatus(flowRunId);
            const flowCompleted = response === "Completed";
            const flowFailed = response === "Failed";
            dispatch(setButtonAndLoading({
                provider,
                buttonText: flowCompleted || flowFailed ? "Submit" : `${response}...`,
                loading: !(flowCompleted || flowFailed)
            }));
            if ((flowCompleted || flowFailed)&& interval) {
                clearInterval(interval);
                flowCompleted ? toast.success(`Login preferences for "${provider}" set`)
                : toast.error(`Failed to set login preferences for "${provider}"`);
                fetchLastLoginPreference()
                setFieldsWereEdited(false);
                setSecretWasEdited(false);
            };
        } catch (error) {
            toast.error('Failed to fetch flow status');
        }
    };
    let interval: NodeJS.Timeout | null = null;


    const trackStatus = (provider: "google" | "microsoft" | "other", flowRunId: string | null, buttonText: string) => {
        if (!provider || !flowRunId) return;
        if (['Scheduled...', 'Pending...', 'Running...', 'Submit'].includes(buttonText)) {
            interval = setInterval(() => {
                fetchFlowStatus(flowRunId);
            }, 1000);
        }
    };

    useEffect(() => {
        setFieldsValid(validateFields())
    }, [inputValues])

    useEffect(() => {
        fetchLastLoginPreference()
    }, [provider]);

    useEffect(() => {
        if (!currentPreferencesData || !Object.keys(currentPreferencesData).length) return;
        setInputValues({
            provider,
            clientId: currentPreferencesData.clientId,
            clientSecret: "123456789",
            tenantId: currentPreferencesData.tenantId,
            hostedDomain: currentPreferencesData.hostedDomain
        })
    }, [currentPreferencesData]);

    useEffect(() => {
        copyTimeout(copied, setCopied);
    }, [copied]);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen w-full col-span-1 mt-8">
        <div className="flex flex-col items-center justify-start min-h-screen w-1/2 col-span-1">
            <div
                className="flex items-center cursor-pointer border border-gray-300 rounded-md p-2 hover:bg-gray-100 mb-4 self-start"
                onClick={handleBackClick}
                >
                <img
                    src={backIcon}
                    className='logo inline'
                    alt='upload icon'
                    width={20}
                    height={20}
                />
                <h3 className="font-bold ml-2">Back</h3>
            </div>
            
            {   
                provider === 'other' ? <p>If you choose to log into the Admin using a method other than Google or Microsoft, please click "Submit" and we will be notified automatically. Our team will then contact you to assist with the setup process.</p>
                :
                <>
                <InputWithIcon
                label={providerFormTexts[provider]?.clientId}
                extraClass='!pt-2 w-full mb-4'
                placeholder={providerFormTexts[provider]?.placeholder}
                name='clientId'
                onChange={handleChangeInput}
                value={inputValues.clientId || ''} 
                disabled={loading}
                />

                <InputWithIcon
                label={providerFormTexts[provider]?.clientSecret}
                extraClass='!pt-2 w-full mb-4'
                placeholder={providerFormTexts[provider]?.placeholder}
                name='clientSecret'
                onChange={handleChangeInput}
                value={inputValues.clientSecret || ''}
                type="password"
                disabled={loading}
                />

                {
                    provider === 'google' ?
                    <InputWithIcon
                    label={"Hosted Domain"}
                    extraClass='!pt-2 w-full mb-4'
                    placeholder={"The domain of your organization's email addresses"}
                    name='hostedDomain'
                    onChange={handleChangeInput}
                    value={inputValues.hostedDomain || ''}
                    disabled={loading}
                    />
                    :
                    <InputWithIcon
                    label={"Directory (tenant) ID"}
                    extraClass='!pt-2 w-full mb-4'
                    placeholder={providerFormTexts.microsoft?.placeholder}
                    name='tenantId'
                    onChange={handleChangeInput}
                    value={inputValues.tenantId || ''}
                    disabled={loading}
                    />
                }
                <div className="w-full mb-4">
                    <label className={`bold-text`}>Your Redirect URI (click to copy): <CustomTooltip title={copied ? "Copied" : "Copy URI"}>
                <p
                    className='bold-text text-left cursor-pointer hover:text-blue-500 bg-gray-outline p-2 rounded'
                    onClick={() => {
                        navigator.clipboard.writeText(`${KEYCLOAK_URL}/realms/${realm}/broker/${provider}/endpoint`);
                        setCopied(true);
                    }}>
                    {`${KEYCLOAK_URL}/realms/${realm}/broker/${provider}/endpoint`}
                </p>
                        </CustomTooltip>
                    </label>
                </div>
                </>     
            }
            <div className='flex items-center justify-center gap-4'>
                <Button
                disabled={provider !== 'other' && (!fieldsValid || loading || !fieldsWereEdited)} 
                loading={loading}
                text={buttonText}
                variant='contained'
                className='flex px-6 mt-4'
                onClick={() => setShowConfirmation(true)}
                />
            </div>
            {showConfirmation && 
                <Modal
                    isOpen={showConfirmation}
                    toggle={() => setShowConfirmation(false)}
                    additionalClass={
                    showConfirmation
                        ? 'max-h-[450px] min-w-[450px] w-[450px]'
                        : 'p-6 !max-h-[85%] min-w-[70%]'
                    }
                >
                    <ConfirmationBody
                        toggle={() => setShowConfirmation(false)}
                        title={`Are you sure you'd like to submit this form?`}
                        confirm={handleSubmitPreference}
                        buttonText={"Confirm"}
                    />
                </Modal>
            }
        </div>
        </div>
    );
};

export default LoginForm;
