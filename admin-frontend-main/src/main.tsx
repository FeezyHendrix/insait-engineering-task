import './lib/datadog.ts'
import './utils/sentry.ts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import io from 'socket.io-client'
import { socketUrl } from './utils/network/index.ts'
import { MSW_ENABLED } from './utils/constants.ts'
import constants from './utils/constants.ts'
const { BASENAME, isProduction } = constants
export const socket = socketUrl ? io(socketUrl) : null

async function enableMocking() {
  if (!MSW_ENABLED) {
    return
  }
  const { worker } = await import('../tests/mswUtils/browser')
  const publicPath = isProduction ? '/admin' : ''
  return worker.start({
    serviceWorker: {
      url: `${publicPath}/mockServiceWorker.js`,
      options: {
        scope: `${publicPath}/`,
      }
    },
    onUnhandledRequest: 'bypass'
  }).catch((error) => {
    console.error('MSW Worker registration failed:', error)
  })
}
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter
        basename={BASENAME}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  )
})
