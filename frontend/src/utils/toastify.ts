import { toast, ToastOptions } from 'react-toastify';

const toastify_settings: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
};

export const notify_success = (message: string) =>
  toast.success(message, toastify_settings);

export const notify_update = (message: string) =>
  toast.info(message, toastify_settings);

export const notify_error = (message: string) =>
  toast.error(message, toastify_settings);
