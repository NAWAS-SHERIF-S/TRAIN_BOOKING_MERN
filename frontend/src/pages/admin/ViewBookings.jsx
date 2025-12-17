import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaList } from 'react-icons/fa';
import { bookingService } from '../../services/bookingService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { formatDate, formatCurrency } from '../../utils/formatters';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getAllBookings(1, 100);
            setBookings(response.data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <FaList className="text-primary-600" /> All Bookings
                </h1>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        PNR / User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Train Info
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Journey Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <motion.tr
                                        key={booking._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-primary-600">
                                                {booking.pnr}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {booking.user?.name || 'Unknown User'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {booking.user?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {booking.train?.trainName || booking.trainName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                #{booking.train?.trainNumber || booking.trainNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {booking.from} → {booking.to}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(booking.journeyDate)} • {booking.class}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(booking.fare)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {booking.passengers.length} passengers
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge status={booking.bookingStatus} type="booking" />
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

export default ViewBookings;
