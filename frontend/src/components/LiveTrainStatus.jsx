import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrain, FaClock, FaMapMarkerAlt, FaTachometerAlt, FaSync } from 'react-icons/fa';
import { liveStatusService } from '../services/liveStatusService';
import Button from './common/Button';
import Card from './common/Card';
import Badge from './common/Badge';
import Loader from './common/Loader';

const LiveTrainStatus = ({ trainNumber, autoRefresh = true }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await liveStatusService.getLiveStatus(trainNumber);
            setStatus(response.data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch live status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (trainNumber) {
            fetchStatus();
        }
    }, [trainNumber]);

    useEffect(() => {
        if (autoRefresh && trainNumber) {
            const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh, trainNumber]);

    const getStatusColor = (statusText) => {
        switch (statusText?.toLowerCase()) {
            case 'on time':
                return 'success';
            case 'running late':
                return 'warning';
            case 'delayed':
            case 'significantly delayed':
                return 'error';
            default:
                return 'info';
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--';
        return timeString;
    };

    const formatLastUpdated = (date) => {
        if (!date) return '';
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    if (loading && !status) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <Loader />
                    <span className="ml-2">Fetching live status...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <div className="text-red-600 mb-4">{error}</div>
                    <Button onClick={fetchStatus} variant="outline">
                        <FaSync className="mr-2" />
                        Retry
                    </Button>
                </div>
            </Card>
        );
    }

    if (!status) {
        return (
            <Card className="p-6">
                <div className="text-center text-gray-500">
                    No live status available for this train
                </div>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <FaTrain className="text-primary-600 text-2xl mr-3" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {status.train?.trainName || `Train ${trainNumber}`}
                            </h3>
                            <p className="text-gray-600">#{trainNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(status.status)}>
                            {status.status}
                        </Badge>
                        <Button
                            onClick={fetchStatus}
                            variant="outline"
                            size="sm"
                            loading={loading}
                        >
                            <FaSync className="mr-1" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaMapMarkerAlt className="text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-800">Current Station</span>
                        </div>
                        <div className="text-lg font-bold text-blue-900">
                            {status.currentStation}
                        </div>
                        <div className="text-sm text-blue-700">
                            ({status.currentStationCode})
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaMapMarkerAlt className="text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">Next Station</span>
                        </div>
                        <div className="text-lg font-bold text-green-900">
                            {status.nextStation || 'Destination'}
                        </div>
                        <div className="text-sm text-green-700">
                            ETA: {formatTime(status.nextStationETA)}
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg ${
                        status.delayMinutes > 0 ? 'bg-red-50' : 'bg-green-50'
                    }`}>
                        <div className="flex items-center mb-2">
                            <FaClock className={`mr-2 ${
                                status.delayMinutes > 0 ? 'text-red-600' : 'text-green-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                                status.delayMinutes > 0 ? 'text-red-800' : 'text-green-800'
                            }`}>
                                Delay Status
                            </span>
                        </div>
                        <div className={`text-lg font-bold ${
                            status.delayMinutes > 0 ? 'text-red-900' : 'text-green-900'
                        }`}>
                            {status.delayMinutes > 0 ? `+${status.delayMinutes} min` : 'On Time'}
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaTachometerAlt className="text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-purple-800">Current Speed</span>
                        </div>
                        <div className="text-lg font-bold text-purple-900">
                            {status.currentSpeed || 0} km/h
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                        Last updated: {formatLastUpdated(lastUpdated)}
                    </div>
                    <div>
                        Source: {status.source || 'Live Data'}
                    </div>
                </div>

                {autoRefresh && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center text-blue-700">
                            <FaSync className="mr-2 animate-spin" />
                            <span className="text-sm">Auto-refreshing every 30 seconds</span>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default LiveTrainStatus;