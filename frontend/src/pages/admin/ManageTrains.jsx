import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTrain } from 'react-icons/fa';
import { trainService } from '../../services/trainService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { formatTime } from '../../utils/formatters';

const ManageTrains = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrains();
    }, []);

    const fetchTrains = async () => {
        try {
            const response = await trainService.getAllTrains(1, 100);
            setTrains(response.data || []);
        } catch (error) {
            console.error('Error fetching trains:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this train?')) return;

        try {
            await trainService.deleteTrain(id);
            fetchTrains();
            alert('Train deleted successfully');
        } catch (error) {
            alert('Failed to delete train');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FaTrain className="text-primary-600" /> Manage Trains
                    </h1>
                    <Link to="/admin/trains/add">
                        <Button className="flex items-center gap-2">
                            <FaPlus /> Add New Train
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Train Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Route
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type/Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trains.map((train) => (
                                    <motion.tr
                                        key={train._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {train.trainName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        #{train.trainNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {train.stations[0]?.name} → {train.stations[train.stations.length - 1]?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatTime(train.stations[0]?.departureTime)} - {formatTime(train.stations[train.stations.length - 1]?.arrivalTime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge status={train.trainType} type="info" className="mb-1 block w-fit" />
                                            <div className="text-xs text-gray-500">
                                                {train.classes.join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${train.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {train.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/admin/trains/edit/${train._id}`}
                                                className="text-primary-600 hover:text-primary-900 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(train._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ManageTrains;
