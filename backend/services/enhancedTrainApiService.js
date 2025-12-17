import axios from 'axios';

class EnhancedTrainApiService {
    constructor() {
        // Multiple API endpoints for comprehensive data
        this.apis = {
            indianRail: {
                baseURL: 'https://indianrailapi.com/api/v2',
                key: process.env.INDIAN_RAIL_API_KEY || 'demo'
            },
            railwayAPI: {
                baseURL: 'https://railways-api.onrender.com/api',
                key: process.env.RAILWAY_API_KEY
            },
            rapidAPI: {
                baseURL: 'https://irctc1.p.rapidapi.com/api/v3',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo',
                    'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
                }
            },
            trainman: {
                baseURL: 'https://trainman.in/api',
                key: process.env.TRAINMAN_API_KEY
            }
        };
    }

    // Fetch comprehensive train data
    async getTrainData(trainNumber) {
        const [liveStatus, schedule] = await Promise.allSettled([
            this.getLiveTrainStatus(trainNumber),
            this.getTrainSchedule(trainNumber)
        ]);

        return {
            liveStatus: liveStatus.status === 'fulfilled' ? liveStatus.value : null,
            schedule: schedule.status === 'fulfilled' ? schedule.value : null
        };
    }

    // Fetch live train status from multiple sources
    async getLiveTrainStatus(trainNumber) {
        const sources = [
            () => this.fetchFromIndianRailAPI(trainNumber),
            () => this.fetchFromRapidAPI(trainNumber),
            () => this.fetchFromRailwayAPI(trainNumber)
        ];

        for (const source of sources) {
            try {
                const result = await source();
                if (result) return result;
            } catch (error) {
                console.error(`API source failed:`, error.message);
            }
        }

        return this.generateMockLiveStatus(trainNumber);
    }

    // Fetch from Indian Rail API
    async fetchFromIndianRailAPI(trainNumber) {
        try {
            const response = await axios.get(
                `${this.apis.indianRail.baseURL}/TrainRunning/apikey/${this.apis.indianRail.key}/TrainNumber/${trainNumber}`,
                { timeout: 8000 }
            );

            if (response.data?.ResponseCode === '200') {
                return this.formatIndianRailResponse(response.data, trainNumber);
            }
        } catch (error) {
            throw new Error(`IndianRail API failed: ${error.message}`);
        }
    }

    // Fetch from RapidAPI
    async fetchFromRapidAPI(trainNumber) {
        try {
            const response = await axios.get(
                `${this.apis.rapidAPI.baseURL}/trains/live-status/${trainNumber}`,
                { 
                    headers: this.apis.rapidAPI.headers,
                    timeout: 8000 
                }
            );

            if (response.data?.success) {
                return this.formatRapidAPIResponse(response.data, trainNumber);
            }
        } catch (error) {
            throw new Error(`RapidAPI failed: ${error.message}`);
        }
    }

    // Fetch from Railway API
    async fetchFromRailwayAPI(trainNumber) {
        try {
            const response = await axios.get(
                `${this.apis.railwayAPI.baseURL}/trains/${trainNumber}/live-status`,
                { timeout: 8000 }
            );

            if (response.data?.status === 'success') {
                return this.formatRailwayAPIResponse(response.data, trainNumber);
            }
        } catch (error) {
            throw new Error(`Railway API failed: ${error.message}`);
        }
    }

    // Format Indian Rail API response
    formatIndianRailResponse(apiData, trainNumber) {
        const trainData = apiData.TrainRoute?.[0] || {};
        
        return {
            trainNumber,
            currentStation: trainData.StationName || 'Unknown',
            currentStationCode: trainData.StationCode || 'UNK',
            delayMinutes: parseInt(trainData.DelayMinutes) || 0,
            status: this.getStatusFromDelay(parseInt(trainData.DelayMinutes) || 0),
            nextStation: trainData.NextStationName || '',
            nextStationETA: trainData.NextStationETA || '',
            currentSpeed: parseInt(trainData.Speed) || Math.floor(Math.random() * 80) + 40,
            lastUpdated: new Date(),
            source: 'IndianRailAPI'
        };
    }

    // Format RapidAPI response
    formatRapidAPIResponse(apiData, trainNumber) {
        const liveData = apiData.data || {};
        
        return {
            trainNumber,
            currentStation: liveData.current_station?.name || 'Unknown',
            currentStationCode: liveData.current_station?.code || 'UNK',
            delayMinutes: parseInt(liveData.delay_minutes) || 0,
            status: liveData.status || this.getStatusFromDelay(parseInt(liveData.delay_minutes) || 0),
            nextStation: liveData.next_station?.name || '',
            nextStationETA: liveData.next_station?.eta || '',
            currentSpeed: parseInt(liveData.speed) || Math.floor(Math.random() * 80) + 40,
            lastUpdated: new Date(),
            source: 'RapidAPI'
        };
    }

    // Format Railway API response
    formatRailwayAPIResponse(apiData, trainNumber) {
        const trainInfo = apiData.train || {};
        
        return {
            trainNumber,
            currentStation: trainInfo.currentStation || 'Unknown',
            currentStationCode: trainInfo.currentStationCode || 'UNK',
            delayMinutes: parseInt(trainInfo.delay) || 0,
            status: trainInfo.status || this.getStatusFromDelay(parseInt(trainInfo.delay) || 0),
            nextStation: trainInfo.nextStation || '',
            nextStationETA: trainInfo.nextETA || '',
            currentSpeed: parseInt(trainInfo.speed) || Math.floor(Math.random() * 80) + 40,
            lastUpdated: new Date(),
            source: 'RailwayAPI'
        };
    }

    // Get comprehensive train schedule from multiple sources
    async getTrainSchedule(trainNumber) {
        const sources = [
            () => this.fetchScheduleFromIndianRail(trainNumber),
            () => this.fetchScheduleFromRapidAPI(trainNumber),
            () => this.fetchScheduleFromRailwayAPI(trainNumber)
        ];

        for (const source of sources) {
            try {
                const result = await source();
                if (result) return result;
            } catch (error) {
                console.error(`Schedule API failed:`, error.message);
            }
        }

        return null;
    }

    // Fetch schedule from Indian Rail API
    async fetchScheduleFromIndianRail(trainNumber) {
        const response = await axios.get(
            `${this.apis.indianRail.baseURL}/TrainSchedule/apikey/${this.apis.indianRail.key}/TrainNumber/${trainNumber}`,
            { timeout: 8000 }
        );

        if (response.data?.ResponseCode === '200') {
            return this.formatIndianRailSchedule(response.data);
        }
    }

    // Format Indian Rail schedule
    formatIndianRailSchedule(apiData) {
        return {
            trainNumber: apiData.TrainNumber,
            trainName: apiData.TrainName,
            trainType: apiData.TrainType || 'Express',
            from: apiData.Source || '',
            to: apiData.Destination || '',
            runningDays: apiData.RunningDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            classes: apiData.Classes || ['SL', '3A', '2A'],
            stations: apiData.TrainRoute?.map(station => ({
                name: station.StationName,
                stationCode: station.StationCode,
                arrivalTime: station.ArrivalTime || '--',
                departureTime: station.DepartureTime || '--',
                platform: station.Platform || 'TBD',
                distance: parseInt(station.Distance) || 0
            })) || [],
            source: 'IndianRailAPI'
        };
    }

    // Search trains between stations
    async searchTrains(from, to, date) {
        const sources = [
            () => this.searchFromIndianRail(from, to, date),
            () => this.searchFromRapidAPI(from, to, date)
        ];

        for (const source of sources) {
            try {
                const result = await source();
                if (result && result.length > 0) return result;
            } catch (error) {
                console.error(`Train search API failed:`, error.message);
            }
        }

        return this.generateMockTrainSearch(from, to, date);
    }

    // Search from Indian Rail API
    async searchFromIndianRail(from, to, date) {
        const response = await axios.get(
            `${this.apis.indianRail.baseURL}/TrainBetweenStation/apikey/${this.apis.indianRail.key}/From/${from}/To/${to}/Date/${date}`,
            { timeout: 8000 }
        );

        if (response.data?.ResponseCode === '200') {
            return response.data.Trains?.map(train => ({
                trainNumber: train.TrainNumber,
                trainName: train.TrainName,
                trainType: train.TrainType,
                from: train.Source,
                to: train.Destination,
                departureTime: train.DepartureTime,
                arrivalTime: train.ArrivalTime,
                duration: train.TravelTime,
                classes: train.AvailableClasses || ['SL', '3A', '2A'],
                runningDays: train.RunningDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                source: 'IndianRailAPI'
            })) || [];
        }
    }

    // Fetch PNR status from multiple sources
    async getPNRStatus(pnrNumber) {
        const sources = [
            () => this.fetchPNRFromIndianRail(pnrNumber),
            () => this.fetchPNRFromRapidAPI(pnrNumber)
        ];

        for (const source of sources) {
            try {
                const result = await source();
                if (result) return result;
            } catch (error) {
                console.error(`PNR API failed:`, error.message);
            }
        }

        return this.generateMockPNRStatus(pnrNumber);
    }

    // Fetch PNR from Indian Rail API
    async fetchPNRFromIndianRail(pnrNumber) {
        const response = await axios.get(
            `${this.apis.indianRail.baseURL}/PNRCheck/apikey/${this.apis.indianRail.key}/PNRNumber/${pnrNumber}`,
            { timeout: 8000 }
        );

        if (response.data?.ResponseCode === '200') {
            return this.formatIndianRailPNR(response.data);
        }
    }

    // Format Indian Rail PNR
    formatIndianRailPNR(apiData) {
        return {
            pnr: apiData.PNRNumber,
            trainNumber: apiData.TrainNumber,
            trainName: apiData.TrainName,
            journeyDate: apiData.DateOfJourney,
            from: apiData.From,
            to: apiData.To,
            reservationUpto: apiData.ReservationUpto,
            boardingPoint: apiData.BoardingPoint,
            class: apiData.Class,
            passengers: apiData.PassengerStatus?.map(passenger => ({
                number: passenger.Number,
                prediction: passenger.Prediction,
                currentStatus: passenger.CurrentStatus
            })) || [],
            source: 'IndianRailAPI'
        };
    }

    // Generate mock data methods
    generateMockLiveStatus(trainNumber) {
        const stations = [
            { name: 'New Delhi', code: 'NDLS' },
            { name: 'Kanpur Central', code: 'CNB' },
            { name: 'Prayagraj Junction', code: 'PRYJ' },
            { name: 'Mughal Sarai', code: 'MGS' },
            { name: 'Patna Junction', code: 'PNBE' },
            { name: 'Howrah Junction', code: 'HWH' }
        ];

        const randomStation = stations[Math.floor(Math.random() * stations.length)];
        const nextStation = stations[Math.min(stations.indexOf(randomStation) + 1, stations.length - 1)];
        const delayMinutes = Math.floor(Math.random() * 60);

        return {
            trainNumber,
            currentStation: randomStation.name,
            currentStationCode: randomStation.code,
            delayMinutes,
            status: this.getStatusFromDelay(delayMinutes),
            nextStation: nextStation.name,
            nextStationETA: this.generateETA(),
            currentSpeed: Math.floor(Math.random() * 80) + 40,
            lastUpdated: new Date(),
            source: 'Mock Data'
        };
    }

    generateMockPNRStatus(pnrNumber) {
        return {
            pnr: pnrNumber,
            trainNumber: '12345',
            trainName: 'Sample Express',
            journeyDate: new Date().toISOString().split('T')[0],
            from: 'New Delhi',
            to: 'Mumbai Central',
            reservationUpto: 'Mumbai Central',
            boardingPoint: 'New Delhi',
            class: '3A',
            passengers: [
                {
                    number: 1,
                    prediction: 'Confirmed',
                    currentStatus: 'CNF/A1/23'
                }
            ],
            source: 'Mock Data'
        };
    }

    generateMockTrainSearch(from, to, date) {
        return [
            {
                trainNumber: '12345',
                trainName: 'Sample Express',
                trainType: 'Express',
                from,
                to,
                departureTime: '08:00',
                arrivalTime: '20:00',
                duration: '12:00',
                classes: ['SL', '3A', '2A', '1A'],
                runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                source: 'Mock Data'
            }
        ];
    }

    // Helper methods
    getStatusFromDelay(delayMinutes) {
        if (delayMinutes === 0) return 'On Time';
        if (delayMinutes <= 15) return 'Running Late';
        if (delayMinutes <= 60) return 'Delayed';
        return 'Significantly Delayed';
    }

    generateETA() {
        const now = new Date();
        const eta = new Date(now.getTime() + Math.random() * 2 * 60 * 60 * 1000);
        return eta.toTimeString().slice(0, 5);
    }

    // Batch update multiple trains
    async batchUpdateTrains(trainNumbers) {
        const results = [];
        
        for (const trainNumber of trainNumbers) {
            try {
                const liveStatus = await this.getLiveTrainStatus(trainNumber);
                results.push({
                    trainNumber,
                    success: true,
                    data: liveStatus
                });
            } catch (error) {
                results.push({
                    trainNumber,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }
}

export default new EnhancedTrainApiService();