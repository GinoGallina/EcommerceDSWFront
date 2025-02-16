import { toast, ToastOptions } from 'react-toastify';

const options: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
};

const info = (message: string, customOptions: ToastOptions = {}) => {
    toast.info(message, { ...options, ...customOptions });
};

const success = (message: string, customOptions: ToastOptions = {}) => {
    toast.success(message, { ...options, ...customOptions });
};

const warning = (message: string, customOptions: ToastOptions = {}) => {
    toast.warn(message, { ...options, ...customOptions });
};

const error = (message: string, customOptions: ToastOptions = {}) => {
    toast.error(message, { ...options, ...customOptions });
};

export default {
    info,
    success,
    warning,
    error,
};
