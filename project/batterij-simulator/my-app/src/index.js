import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'; // Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey="YOUR_RECAPTCHA_SITE_KEY" // Add your reCAPTCHA site key here
      scriptProps={{
        async: true,           // Optional: Load script asynchronously
        defer: true,           // Optional: Defer loading the script
        appendTo: 'body',      // Optional: Specify where to inject the script tag
        nonce: undefined,      // Optional: Set a CSP nonce if required
      }}
    >
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
