import api from './api';
import { STATION_CODES } from '../utils/stationCodes';

export const stationService = {
    // Get all unique stations from trains in database
    getAllStations: async () => {
        try {
            console.log('Fetching fresh stations from API...');
            const response = await api.get('/trains/stations');
            const stations = response.data.data || [];
            
            const stationMap = new Map();
            
            // Add static stations first
            Object.entries(STATION_CODES).forEach(([code, name]) => {
                stationMap.set(code.toUpperCase(), name);
            });
            
            // Add stations from database (admin-added trains)
            stations.forEach(station => {
                if (station.code && station.name) {
                    stationMap.set(station.code.toUpperCase(), station.name);
                }
            });
            
            console.log(`Total stations: ${stationMap.size} (${Object.keys(STATION_CODES).length} static + ${stations.length} from DB)`);
            
            return stationMap;
        } catch (error) {
            console.error('Error fetching stations:', error);
            // Fallback to static stations
            return new Map(Object.entries(STATION_CODES));
        }
    },

    // Search stations
    searchStations: async (query) => {
        if (!query || query.length < 2) return [];
        
        const stations = await stationService.getAllStations();
        const searchTerm = query.toLowerCase();
        const results = [];
        
        stations.forEach((name, code) => {
            const codeLower = code.toLowerCase();
            const nameLower = name.toLowerCase();
            
            if (codeLower.startsWith(searchTerm)) {
                results.unshift({ code, name }); // Priority for code matches
            } else if (codeLower.includes(searchTerm) || nameLower.includes(searchTerm)) {
                results.push({ code, name });
            }
        });
        
        return results.slice(0, 20);
    },


};
