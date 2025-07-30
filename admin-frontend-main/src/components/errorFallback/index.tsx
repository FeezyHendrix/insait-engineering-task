import logo from '@/assets/images/logo.svg';
import { isDev } from '@/utils/constants';
import { FaRegFaceSadTear } from "react-icons/fa6";

type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

function ErrorFallback({ resetError, error }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 relative">
      <div className="absolute top-4 left-4">
        <img src={logo} alt="Company Logo" className="h-10" />
      </div>

      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <FaRegFaceSadTear className="h-12 w-12 text-gray-800" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
        <div className="text-gray-600 mb-6">
          <p className="mb-2">Don't worry — it’s not you, it’s us.</p>
          <p className="mb-2">Try refreshing or give it another go.</p>
          {isDev &&
            <pre className="bg-gray-100 p-3 rounded text-sm text-left overflow-auto max-h-32 mt-4">
              {String(error)}
            </pre>
          }
        </div>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Refresh Page
          </button>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback