import { LIVE_STATUS, BOOKING_STATUS, PAYMENT_STATUS } from '../../utils/constants';

const Badge = ({ status, type = 'status', variant, className = '', children }) => {
    const getStatusColor = () => {
        if (variant) {
            switch (variant) {
                case 'success':
                    return 'bg-green-100 text-green-800';
                case 'warning':
                    return 'bg-yellow-100 text-yellow-800';
                case 'error':
                    return 'bg-red-100 text-red-800';
                case 'info':
                    return 'bg-blue-100 text-blue-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        }
        
        if (type === 'status') {
            switch (status) {
                case LIVE_STATUS.ON_TIME:
                    return 'bg-green-100 text-green-800';
                case LIVE_STATUS.DELAYED:
                    return 'bg-yellow-100 text-yellow-800';
                case LIVE_STATUS.CANCELLED:
                    return 'bg-red-100 text-red-800';
                case LIVE_STATUS.DIVERTED:
                    return 'bg-orange-100 text-orange-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        } else if (type === 'booking') {
            switch (status) {
                case BOOKING_STATUS.CONFIRMED:
                    return 'bg-green-100 text-green-800';
                case BOOKING_STATUS.WAITLISTED:
                    return 'bg-yellow-100 text-yellow-800';
                case BOOKING_STATUS.CANCELLED:
                    return 'bg-red-100 text-red-800';
                case BOOKING_STATUS.RAC:
                    return 'bg-orange-100 text-orange-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        } else if (type === 'payment') {
            switch (status) {
                case PAYMENT_STATUS.COMPLETED:
                    return 'bg-green-100 text-green-800';
                case PAYMENT_STATUS.PENDING:
                    return 'bg-yellow-100 text-yellow-800';
                case PAYMENT_STATUS.FAILED:
                    return 'bg-red-100 text-red-800';
                case PAYMENT_STATUS.REFUNDED:
                    return 'bg-blue-100 text-blue-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        }
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} ${className}`}
        >
            {status === LIVE_STATUS.ON_TIME && type === 'status' && (
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            )}
            {children || status}
        </span>
    );
};

export default Badge;
