import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { persistor, store } from './utils/store.js'
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider clientId='568177000480-k8breplbn16ojtv45njdltfm2928svlh.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
)
