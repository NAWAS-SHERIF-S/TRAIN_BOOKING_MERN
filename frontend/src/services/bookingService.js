import api from './api';

export const bookingService = {
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    getUserBookings: async () => {
        const response = await api.get('/bookings/user');
        return response.data;
    },

    getAllBookings: async (page = 1, limit = 20) => {
        const response = await api.get(`/bookings/all?page=${page}&limit=${limit}`);
        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    },
};
