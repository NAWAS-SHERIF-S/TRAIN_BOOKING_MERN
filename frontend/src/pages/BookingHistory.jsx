import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaTrain, FaMapMarkerAlt, FaUsers, FaRupeeSign, FaTimesCircle, FaSearch } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loader, { SkeletonList } from '../components/common/Loader';
import { formatDate, formatCurrency } from '../utils/formatters';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getUserBookings();
            setBookings(response.data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await bookingService.cancelBooking(id);
            fetchBookings();
            alert('Booking cancelled successfully');
        } catch (error) {
            alert('Failed to cancel booking');
        }
    };

    if (loading) return <SkeletonList count={3} />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FaTicketAlt className="text-primary-600" /> My Bookings
                </h1>

                {bookings.length === 0 ? (
                    <Card className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTicketAlt className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">No Bookings Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                            You haven't booked any tickets yet. Search for trains to start your journey!
                        </p>
                        <Button onClick={() => (window.location.href = '/search')} className="flex items-center gap-2 mx-auto">
                            <FaSearch /> Search Trains
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                                <FaTrain className="text-primary-600" /> {booking.trainName}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 ml-7">PNR: <span className="font-mono text-gray-900 font-medium bg-gray-100 px-2 py-0.5 rounded">{booking.pnr}</span></p>
                                        </div>
                                        <div className="text-left md:text-right w-full md:w-auto flex justify-between md:block items-center">
                                            <Badge status={booking.bookingStatus} type="booking" className="mb-1" />
                                            <p className="text-sm text-gray-600 font-medium flex items-center gap-2 md:justify-end">
                                                <span className="text-gray-400">Journey Date:</span> {formatDate(booking.journeyDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">From</p>
                                            <p className="font-bold text-gray-900 text-lg">{booking.from}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">To</p>
                                            <p className="font-bold text-gray-900 text-lg">{booking.to}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Class</p>
                                            <p className="font-bold text-gray-900 text-lg">{booking.class}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaUsers className="text-gray-400" />
                                                <span className="font-medium">{booking.passengers.length} passenger(s)</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Fare</p>
                                                <p className="text-2xl font-bold text-primary-600 flex items-center justify-end">
                                                    <FaRupeeSign className="text-lg" /> {formatCurrency(booking.fare).replace('₹', '')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.bookingStatus === 'Confirmed' && (
                                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleCancel(booking._id)}
                                                className="flex items-center gap-2"
                                            >
                                                <FaTimesCircle /> Cancel Booking
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
