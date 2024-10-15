import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const Captcha = ({ onVerifyCaptcha }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();  // Hook to execute the reCAPTCHA
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    // Execute reCAPTCHA for the "submit" action
    const token = await executeRecaptcha('submit');
    console.log('Generated reCAPTCHA token:', token);

    // Pass the token back to the parent (LoginForm)
    if (onVerifyCaptcha) {
      onVerifyCaptcha(token);
    }

    // You can now submit the form data along with the token to your backend
    // For now, just log it and show a message
    setFormSubmitted(true);
    alert('Captcha verified with token! Form submitted.');
  };

  return (
    <div>
      {formSubmitted && <p>Form successfully submitted with reCAPTCHA v3!</p>}
    </div>
  );
};

export default Captcha;
