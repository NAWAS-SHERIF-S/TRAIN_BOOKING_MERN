import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTrain, FaClock, FaRoute } from 'react-icons/fa';
import { externalDataService } from '../services/externalDataService';
import Button from './common/Button';
import Card from './common/Card';
import Input from './common/Input';
import StationAutocomplete from './StationAutocomplete';
import Badge from './common/Badge';
import Loader from './common/Loader';

const ExternalTrainSearch = () => {
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        date: ''
    });
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!searchData.from || !searchData.to) return;

        try {
            setLoading(true);
            setError('');
            const response = await externalDataService.searchExternalTrains(
                searchData.from,
                searchData.to,
                searchData.date
            );
            setTrains(response.data || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to search trains');
            setTrains([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="p-6 mb-6">
                <div className="text-center mb-6">
                    <FaTrain className="text-primary-600 text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Live Train Search</h2>
                    <p className="text-gray-600">Search trains from external railway APIs</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StationAutocomplete
                            label="From Station"
                            placeholder="e.g., CBE, Coimbatore"
                            value={searchData.from}
                            onChange={(value) => setSearchData({ ...searchData, from: value })}
                            required
                        />
                        <StationAutocomplete
                            label="To Station"
                            placeholder="e.g., NDLS, New Delhi"
                            value={searchData.to}
                            onChange={(value) => setSearchData({ ...searchData, to: value })}
                            required
                        />
                        <Input
                            label="Journey Date"
                            type="date"
                            value={searchData.date}
                            onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                        />
                        <div className="flex items-end">
                            <Button type="submit" loading={loading} className="w-full">
                                <FaSearch className="mr-2" />
                                Search
                            </Button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
                        {error}
                    </div>
                )}
            </Card>

            {loading && (
                <Card className="p-6">
                    <div className="flex items-center justify-center">
                        <Loader />
                        <span className="ml-2">Searching trains from external APIs...</span>
                    </div>
                </Card>
            )}

            {trains.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Found {trains.length} trains
                        </h3>

                        <div className="space-y-4">
                            {trains.map((train, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <FaTrain className="text-primary-600 mr-2" />
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    {train.trainName}
                                                </h4>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    #{train.trainNumber}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                <div className="flex items-center">
                                                    <FaRoute className="text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">
                                                        {train.from} → {train.to}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <FaClock className="text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">
                                                        {train.departureTime} - {train.arrivalTime}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-600">
                                                        Duration: {train.duration}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <Badge variant="info">{train.trainType}</Badge>
                                                {train.classes?.map((cls, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                        {cls}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                Source: {train.source}
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0">
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {!loading && trains.length === 0 && searchData.from && searchData.to && (
                <Card className="p-6 text-center">
                    <div className="text-gray-500">
                        No trains found for the selected route. Try different stations or check the spelling.
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ExternalTrainSearch;