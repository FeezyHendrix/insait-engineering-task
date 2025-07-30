import {  useEffect, useState } from 'react';
import { LoginOptions } from '@/types/login';
import LoginForm from '@/components/loginPreferences/LoginForm';
import LoginOptionsPage from '@/components/loginPreferences/LoginOptionsPage';
import { useAppDispatch, useAppSelector } from '@/hook/useReduxHooks';
import { setProvider } from '@/redux/slices/loginPreferences';

const LoginPreferences = () => {
    const [providerToView, setProviderToView] = useState<LoginOptions | null>(null);
    const dispatch = useAppDispatch();
    const { provider } = useAppSelector(state => state.loginPreferences);
    
    useEffect(() => {
        dispatch(setProvider(providerToView));
    }, [providerToView]);
    
    return (
        <>
            <div className='flex-1 md:m-5 border col-span-1 bg-white px-3 md:rounded-xl h-auto mb-8'>
                <h1 className='text-2xl bold-text m-4 capitalize'>SSO Integration {providerToView && ` - ${providerToView}`}</h1>
                <div className='w-full col-span-1 bg-white px-3 rounded-xl h-auto mb-8 md:mb-0'>
                    {provider ? <LoginForm provider={provider} setProviderToView={setProviderToView}/> : <LoginOptionsPage setProviderToView={setProviderToView}/>}
                </div>
            </div>
        </>
    )
};

export default LoginPreferences;
