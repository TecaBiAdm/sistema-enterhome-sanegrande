import { toast } from 'react-hot-toast';

const NotificationManager = {
    success: (message) => {
        toast.success(message, {
            position: 'top-right',
            duration: 3000, 
        });
    },
    error: (message) => {
        toast.error(message, {
            position: 'top-right',
            duration: 3000,
        });
    },
    info: (message) => {
        toast(message, {
            icon: 'ℹ️',
            position: 'top-right',
            duration: 3000,
        });
    },
    loading: (message) => {
        toast.loading(message, {
            position: 'top-right',
        });
    },
    dismiss: () => {
        toast.dismiss(); 
    },
};

export default NotificationManager;
