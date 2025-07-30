import { LoginOptions } from "@/types/login";
import { Dispatch, SetStateAction } from "react";
import { loginButtonOptions } from "@/utils/data";

const LoginOptionsPage = ({ setProviderToView }: { setProviderToView: Dispatch<SetStateAction<LoginOptions | null>> }) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const provider = e.currentTarget.getAttribute('data-provider') as LoginOptions;
        setProviderToView(provider);
    };

    return (
        <div className="flex flex-col items-center justify-start">
            <h1 className="my-4 text-xl text-gray-900">Choose a Provider</h1>
             {loginButtonOptions.map((button) => (
                    <div
                      key={button.provider}
                      data-provider={button.provider}
                      className="flex items-center justify-between w-full md:w-1/2 m-4 cursor-pointer border border-gray-300 rounded-md p-2 hover:bg-gray-100"
                      onClick={handleClick}
                    >
                      <div className="flex items-center">
                        <img src={button.image} alt={button.provider} className="w-10 h-10 m-2" />
                        <div className="ml-4">
                          <h3 className="font-bold">{button.title}</h3>
                          <p className="text-sm">{button.description}</p>
                        </div>
                      </div>
                    </div>
            ))}
        </div>
    );
};

export default LoginOptionsPage;