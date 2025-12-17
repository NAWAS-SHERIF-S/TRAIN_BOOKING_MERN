import axios from 'axios';

const testAPI = async () => {
    try {
        console.log('Testing API endpoints...');
        
        // Test trains endpoint
        const trainsResponse = await axios.get('http://localhost:5000/api/trains/search?from=New Delhi&to=Mumbai');
        console.log('Trains API Response:', trainsResponse.data);
        
        // Test live status
        if (trainsResponse.data.data.length > 0) {
            const trainNumber = trainsResponse.data.data[0].trainNumber;
            const statusResponse = await axios.get(`http://localhost:5000/api/status/${trainNumber}`);
            console.log('Live Status Response:', statusResponse.data);
        }
        
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
    }
};

testAPI();