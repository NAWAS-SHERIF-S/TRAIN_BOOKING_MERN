import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaCalendarAlt, FaTrain, FaClock, FaRupeeSign, FaChevronRight, FaCouch } from 'react-icons/fa';
import { trainService } from '../services/trainService';
import StationAutocomplete from '../components/StationAutocomplete';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { SkeletonList } from '../components/common/Loader';
import SeatLayout from '../components/SeatLayout';
import { formatTime, calculateDuration } from '../utils/formatters';

const SearchTrains = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        from: searchParams.get('from') || '',
        to: searchParams.get('to') || '',
        date: new Date().toISOString().split('T')[0]
    });
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [filters, setFilters] = useState({
        quota: 'General',
        sortBy: 'Recommended'
    });
    const [showSeatLayout, setShowSeatLayout] = useState(false);
    const [selectedClass, setSelectedClass] = useState('SL');
    const [expandedLiveStatus, setExpandedLiveStatus] = useState({});

    useEffect(() => {
        if (searchParams.get('from') && searchParams.get('to')) {
            handleSearch();
        }
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        console.log('Search initiated:', searchData);
        setLoading(true);
        setSearched(true);

        try {
            const response = await trainService.searchTrains(searchData.from, searchData.to);
            console.log('Search response:', response);
            setTrains(response.data || []);
        } catch (error) {
            console.error('Search error:', error);
            setTrains([]);
        } finally {
            setLoading(false);
        }
    };

    const getClassPrice = (trainClass) => {
        const prices = { 'SL': 195, '3A': 695, '2A': 1075, '1A': 1675, 'CC': 695, '2S': 195 };
        return prices[trainClass] || 500;
    };

    const getAvailability = () => {
        const statuses = ['Available', 'Waitlist', 'RAC'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const count = Math.floor(Math.random() * 200) + 1;
        return { status, count };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <form onSubmit={handleSearch} className="flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <StationAutocomplete
                                placeholder="From"
                                value={searchData.from}
                                onChange={(value) => setSearchData({ ...searchData, from: value })}
                            />
                        </div>
                        <button type="button" className="p-2 hover:bg-gray-100 rounded">
                            <FaExchangeAlt className="text-primary-600" />
                        </button>
                        <div className="flex-1 min-w-[200px]">
                            <StationAutocomplete
                                placeholder="To"
                                value={searchData.to}
                                onChange={(value) => setSearchData({ ...searchData, to: value })}
                            />
                        </div>
                        <input
                            type="date"
                            value={searchData.date}
                            onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <Button type="submit" loading={loading}>Modify Search</Button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg p-4 mb-4 flex gap-4 items-center flex-wrap">
                    <span className="font-semibold">Quota:</span>
                    {['General', 'Tatkal', 'Ladies', 'Sr. Citizen'].map(q => (
                        <button key={q} onClick={() => setFilters({...filters, quota: q})} className={`px-3 py-1 rounded ${filters.quota === q ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>{q}</button>
                    ))}
                    <span className="font-semibold ml-4">Sorted By:</span>
                    <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})} className="px-3 py-1 border rounded">
                        <option>Recommended</option>
                        <option>Fastest</option>
                        <option>Cheapest</option>
                    </select>
                </div>

                {loading && <SkeletonList count={3} />}

                {!loading && searched && trains.length === 0 && (
                    <Card className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">No Trains Found</h3>
                        <p className="text-gray-600">Try different stations or dates</p>
                    </Card>
                )}

                {!loading && trains.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-gray-600">We have found {trains.length} trains on or near this route</p>
                        {trains.map((train) => {
                            const fromStation = train.stations?.[0];
                            const toStation = train.stations?.[train.stations.length - 1];
                            const isLiveExpanded = expandedLiveStatus[train._id];
                            return (
                                <Card key={train._id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-bold">{train.trainNumber} {train.trainName}</h3>
                                                <FaChevronRight className="text-gray-400" />
                                                {train.liveStatus && (
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        train.liveStatus.status === 'On Time' ? 'bg-green-100 text-green-700' :
                                                        train.liveStatus.status === 'Delayed' || train.liveStatus.status === 'Running Late' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {train.liveStatus.status}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                                <span className="flex items-center gap-2">
                                                    <FaTrain />
                                                    {fromStation?.stationCode}, {formatTime(fromStation?.departureTime)}
                                                    <span className="font-semibold">{fromStation?.name}</span>
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <FaClock />
                                                    {calculateDuration(fromStation?.departureTime, toStation?.arrivalTime)}
                                                </span>
                                                <span>{train.stations.length - 2} halts | {toStation?.distance} kms</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <span>Runs on: {train.runningDays.map(d => d.charAt(0)).join(' ')}</span>
                                                {train.liveStatus && (
                                                    <button
                                                        onClick={() => setExpandedLiveStatus({...expandedLiveStatus, [train._id]: !isLiveExpanded})}
                                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                    >
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                        {isLiveExpanded ? 'Hide' : 'View'} Live Status
                                                    </button>
                                                )}
                                            </div>
                                            {train.liveStatus && isLiveExpanded && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="text-sm space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">Current Station:</span>
                                                            <span className="font-semibold text-blue-900">{train.liveStatus.currentStation} ({train.liveStatus.currentStationCode})</span>
                                                        </div>
                                                        {train.liveStatus.nextStation && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">Next Station:</span>
                                                                <span className="font-semibold">{train.liveStatus.nextStation} {train.liveStatus.nextStationETA && `(ETA: ${train.liveStatus.nextStationETA})`}</span>
                                                            </div>
                                                        )}
                                                        {train.liveStatus.delayMinutes > 0 && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">Delay:</span>
                                                                <span className="font-semibold text-orange-600">{train.liveStatus.delayMinutes} min</span>
                                                            </div>
                                                        )}
                                                        {train.liveStatus.currentSpeed && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">Speed:</span>
                                                                <span className="font-semibold">{train.liveStatus.currentSpeed} km/h</span>
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-gray-500 pt-2 border-t">
                                                            Updated: {new Date(train.liveStatus.lastUpdated).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="text-lg font-bold">{formatTime(toStation?.arrivalTime)}, {toStation?.stationCode}</div>
                                            <div className="text-sm text-gray-600">{toStation?.name}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {train.classes.map(cls => {
                                            const avail = getAvailability();
                                            return (
                                                <div key={cls} className="border rounded p-3">
                                                    <div className="text-sm font-semibold mb-1">{cls}</div>
                                                    <div className="flex items-center gap-1 text-lg font-bold text-green-600 mb-1">
                                                        <FaRupeeSign className="text-sm" />{getClassPrice(cls)}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mb-2">
                                                        {avail.count} {avail.status}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedClass(cls);
                                                                setShowSeatLayout(true);
                                                            }} 
                                                            className="flex-1"
                                                        >
                                                            <FaCouch className="inline" />
                                                        </Button>
                                                        <Button size="sm" onClick={() => navigate(`/book/${train._id}?class=${cls}`)} className="flex-1">Book</Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Seat Layout Modal */}
                {showSeatLayout && (
                    <SeatLayout 
                        trainClass={selectedClass} 
                        onClose={() => setShowSeatLayout(false)} 
                    />
                )}
            </div>
        </div>
    );
};

export default SearchTrains;
