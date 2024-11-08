import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import './style/SuccessAlert.css';

const ErrorAlert = ({ title, message }) => {
  useEffect(() => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal-small'
      }
    });
  }, [title, message]);

  return null;
};

export default ErrorAlert;
