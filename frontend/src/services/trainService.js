import api from './api';

export const trainService = {
    getAllTrains: async (page = 1, limit = 10) => {
        const response = await api.get(`/trains?page=${page}&limit=${limit}`);
        return response.data;
    },

    getTrainById: async (id) => {
        const response = await api.get(`/trains/${id}`);
        return response.data;
    },

    getTrainByNumber: async (trainNumber) => {
        const response = await api.get(`/trains/number/${trainNumber}`);
        return response.data;
    },

    searchStations: async (query) => {
        const response = await api.get(`/stations/search?query=${query}`);
        return response.data;
    },

    searchTrains: async (from, to, date) => {
        console.log('Calling API with:', { from, to, date });
        const response = await api.get(`/trains/search?from=${from || ''}&to=${to || ''}${date ? `&date=${date}` : ''}`);
        console.log('API response:', response.data);
        return response.data;
    },

    createTrain: async (trainData) => {
        const response = await api.post('/trains', trainData);
        return response.data;
    },

    updateTrain: async (id, trainData) => {
        const response = await api.put(`/trains/${id}`, trainData);
        return response.data;
    },

    deleteTrain: async (id) => {
        const response = await api.delete(`/trains/${id}`);
        return response.data;
    },

    getLiveStatus: async (trainNumber) => {
        const response = await api.get(`/status/${trainNumber}`);
        return response.data;
    },

    updateLiveStatus: async (trainNumber, statusData) => {
        const response = await api.put(`/status/${trainNumber}`, statusData);
        return response.data;
    },
};
