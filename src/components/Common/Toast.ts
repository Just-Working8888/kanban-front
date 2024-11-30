import { toast, ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "warning" | "info";

interface ExtendedToastOptions extends ToastOptions {
  capture?: boolean;
}

const createToast = (type: ToastType) => {
  return (message: string, options?: ExtendedToastOptions) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      capture: true,
      ...options,
    });
  };
};

export const showToast = {
  success: createToast("success"),
  error: createToast("error"),
  warning: createToast("warning"),
  info: createToast("info"),
};
