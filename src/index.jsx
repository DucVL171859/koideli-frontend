import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId='568177000480-k8breplbn16ojtv45njdltfm2928svlh.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
)
