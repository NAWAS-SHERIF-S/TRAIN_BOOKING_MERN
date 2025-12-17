import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrain, FaMapMarkerAlt, FaClock, FaList, FaInfoCircle, FaCalendarCheck, FaClock as FaTime } from 'react-icons/fa';
import { trainService } from '../services/trainService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { formatTime, getTimeAgo } from '../utils/formatters';
import LiveTrainStatus from '../components/LiveTrainStatus';

const TrainDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [train, setTrain] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainDetails();
    }, [id]);

    const fetchTrainDetails = async () => {
        try {
            const response = await trainService.getTrainById(id);
            setTrain(response.data);
            setLiveStatus(response.data.liveStatus);
        } catch (error) {
            console.error('Error fetching train details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!train) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="text-center p-8">
                    <FaTrain className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Train Not Found</h2>
                    <p className="text-gray-600 mb-6">The train you are looking for does not exist.</p>
                    <Button onClick={() => navigate('/search')}>Back to Search</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="mb-6 border-t-4 border-t-primary-600">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
                                    <FaTrain className="text-primary-600" /> {train.trainName}
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2 ml-10">
                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm font-medium text-gray-700">#{train.trainNumber}</span>
                                </p>
                            </div>
                            <Badge status={train.trainType} type="info" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-2">
                                    <FaList /> Classes Available
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {train.classes.map(cls => (
                                        <span key={cls} className="bg-white border border-gray-200 px-2 py-1 rounded text-sm font-medium text-gray-700">
                                            {cls}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-2">
                                    <FaCalendarCheck /> Running Days
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {train.runningDays.map(day => (
                                        <span key={day} className="text-sm font-medium text-gray-700">
                                            {day.slice(0, 3)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 flex items-center gap-2">
                                    <FaInfoCircle /> Train Type
                                </p>
                                <p className="font-semibold text-gray-900">{train.trainType}</p>
                            </div>
                        </div>

                        <Button onClick={() => navigate(`/book/${train._id}`)} className="w-full text-lg py-3">
                            Book Tickets
                        </Button>
                    </Card>

                    <LiveTrainStatus trainNumber={train.trainNumber} />

                    <Card>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                            <FaClock className="text-primary-600" /> Station Schedule
                        </h2>
                        <div className="relative">
                            {/* Vertical line connecting stations */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200 hidden md:block"></div>

                            <div className="space-y-6">
                                {train.stations.map((station, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-start md:items-center justify-between relative group"
                                    >
                                        {/* Dot on time line */}
                                        <div className="absolute left-[15px] w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-300 group-hover:border-primary-500 group-hover:bg-primary-50 hidden md:block z-10 transition-colors"></div>

                                        <div className="flex-1 pl-0 md:pl-10 mb-2 md:mb-0">
                                            <p className="font-bold text-gray-900 text-lg">{station.name}</p>
                                            <p className="text-sm text-gray-500 font-mono bg-gray-100 inline-block px-1.5 rounded">{station.stationCode}</p>
                                        </div>

                                        <div className="w-full md:w-auto flex justify-between md:justify-end gap-4 md:gap-12">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 uppercase">Arrival</p>
                                                <p className="font-bold text-gray-900">{formatTime(station.arrivalTime)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500 uppercase">Departure</p>
                                                <p className="font-bold text-gray-900">{formatTime(station.departureTime)}</p>
                                            </div>
                                            <div className="text-center min-w-[60px]">
                                                <p className="text-xs text-gray-500 uppercase">Platform</p>
                                                <p className="font-medium text-gray-900">{station.platform}</p>
                                            </div>
                                            <div className="text-right min-w-[70px]">
                                                <p className="text-xs text-gray-500 uppercase">Distance</p>
                                                <p className="font-medium text-gray-700">{station.distance} km</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default TrainDetailsPage;
