import { toast } from 'react-toastify';

const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, { ...toastConfig, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { ...toastConfig, ...options });
  },
  warning: (message, options = {}) => {
    toast.warning(message, { ...toastConfig, ...options });
  },
  info: (message, options = {}) => {
    toast.info(message, { ...toastConfig, ...options });
  },
  // Для заявок - особый стиль
  bookingCreated: (message) => {
    toast.success(message, {
      ...toastConfig,
      autoClose: 5000,
      icon: '🎉',
      style: {
        background: 'linear-gradient(135deg, #28A745, #20C997)',
        fontSize: '15px',
        fontWeight: 600,
      }
    });
  },
  // Для статусов
  statusChanged: (message) => {
    toast.info(message, {
      ...toastConfig,
      autoClose: 3000,
      icon: '📋',
    });
  },
  // Для отзывов
  reviewAdded: (message) => {
    toast.success(message, {
      ...toastConfig,
      autoClose: 3000,
      icon: '⭐',
    });
  }
};