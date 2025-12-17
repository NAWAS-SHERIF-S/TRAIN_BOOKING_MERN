import api from './api';

export const liveStatusService = {
    // Get live status for a specific train
    getLiveStatus: async (trainNumber) => {
        const response = await api.get(`/status/${trainNumber}`);
        return response.data;
    },

    // Get PNR status
    getPNRStatus: async (pnrNumber) => {
        const response = await api.get(`/status/pnr/${pnrNumber}`);
        return response.data;
    },

    // Refresh all train statuses (admin only)
    refreshAllStatuses: async () => {
        const response = await api.post('/status/refresh-all');
        return response.data;
    },

    // Update live status (admin only)
    updateLiveStatus: async (trainNumber, statusData) => {
        const response = await api.put(`/status/${trainNumber}`, statusData);
        return response.data;
    }
};