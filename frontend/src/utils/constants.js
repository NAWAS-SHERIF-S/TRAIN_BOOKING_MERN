export const TRAIN_CLASSES = [
    { value: 'SL', label: 'Sleeper (SL)', baseRate: 0.5 },
    { value: '3A', label: 'AC 3 Tier (3A)', baseRate: 1.2 },
    { value: '2A', label: 'AC 2 Tier (2A)', baseRate: 1.8 },
    { value: '1A', label: 'AC 1st Class (1A)', baseRate: 3.0 },
    { value: 'CC', label: 'AC Chair Car (CC)', baseRate: 1.5 },
    { value: '2S', label: 'Second Sitting (2S)', baseRate: 0.3 },
];

export const TRAIN_TYPES = [
    'Express',
    'Superfast',
    'Passenger',
    'Duronto',
    'Rajdhani',
    'Shatabdi',
];

export const BOOKING_STATUS = {
    CONFIRMED: 'Confirmed',
    WAITLISTED: 'Waitlisted',
    CANCELLED: 'Cancelled',
    RAC: 'RAC',
};

export const PAYMENT_STATUS = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
};

export const LIVE_STATUS = {
    ON_TIME: 'On Time',
    DELAYED: 'Delayed',
    CANCELLED: 'Cancelled',
    DIVERTED: 'Diverted',
};

export const BERTH_PREFERENCES = [
    'Lower',
    'Middle',
    'Upper',
    'Side Lower',
    'Side Upper',
    'No Preference',
];

export const GENDERS = ['Male', 'Female', 'Other'];

export const RUNNING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};
