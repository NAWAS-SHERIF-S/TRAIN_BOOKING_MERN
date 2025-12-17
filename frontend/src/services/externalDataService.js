import api from './api';

export const externalDataService = {
    // Sync train data from external APIs
    syncTrainData: async (trainNumber) => {
        const response = await api.post(`/external/sync/${trainNumber}`);
        return response.data;
    },

    // Search trains from external APIs
    searchExternalTrains: async (from, to, date) => {
        const response = await api.get('/external/search', {
            params: { from, to, date }
        });
        return response.data;
    },

    // Get PNR status from external APIs
    getExternalPNRStatus: async (pnrNumber) => {
        const response = await api.get(`/external/pnr/${pnrNumber}`);
        return response.data;
    },

    // Bulk sync multiple trains (admin only)
    bulkSyncTrains: async (trainNumbers) => {
        const response = await api.post('/external/bulk-sync', {
            trainNumbers
        });
        return response.data;
    }
};