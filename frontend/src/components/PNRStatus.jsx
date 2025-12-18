import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTicketAlt, FaTrain, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import api from '../services/api';
import Button from './common/Button';
import Card from './common/Card';
import Input from './common/Input';
import Badge from './common/Badge';
import Loader from './common/Loader';

const PNRStatus = () => {
    const [pnrNumber, setPnrNumber] = useState('');
    const [pnrData, setPnrData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pnrNumber.trim()) return;

        try {
            setLoading(true);
            setError('');
            const response = await api.get(`/bookings/pnr/${pnrNumber.trim()}`);
            setPnrData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'PNR not found. Please check the number and try again.');
            setPnrData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="p-6 mb-6">
                <div className="text-center mb-6">
                    <FaTicketAlt className="text-primary-600 text-4xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">PNR Status Check</h2>
                    <p className="text-gray-600">Enter your 10-digit PNR number to check booking status</p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter PNR Number"
                            value={pnrNumber}
                            onChange={(e) => setPnrNumber(e.target.value)}
                            maxLength={10}
                            pattern="[0-9]{10}"
                            className="flex-1"
                        />
                        <Button type="submit" loading={loading}>
                            <FaSearch className="mr-2" />
                            Check
                        </Button>
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
                        <span className="ml-2">Checking PNR status...</span>
                    </div>
                </Card>
            )}

            {pnrData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">PNR: {pnrData.pnr}</h3>
                                <p className="text-gray-600">Booking Details</p>
                                {pnrData.createdAt && (
                                    <p className="text-sm text-gray-500">
                                        Booked on: {new Date(pnrData.createdAt).toLocaleDateString('en-IN')}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <Badge 
                                    variant={pnrData.bookingStatus === 'Confirmed' ? 'success' : 
                                           pnrData.bookingStatus === 'Cancelled' ? 'error' : 'warning'}
                                >
                                    {pnrData.bookingStatus || 'Confirmed'}
                                </Badge>
                                {pnrData.paymentStatus && (
                                    <div className="mt-2">
                                        <Badge 
                                            variant={pnrData.paymentStatus === 'Completed' ? 'success' : 
                                                   pnrData.paymentStatus === 'Failed' ? 'error' : 'warning'}
                                            className="text-xs"
                                        >
                                            Payment: {pnrData.paymentStatus}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <FaTrain className="text-primary-600 mr-3" />
                                    <div>
                                        <p className="font-semibold">{pnrData.trainName}</p>
                                        <p className="text-sm text-gray-600">Train #{pnrData.trainNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <FaCalendarAlt className="text-primary-600 mr-3" />
                                    <div>
                                        <p className="font-semibold">Journey Date</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(pnrData.journeyDate).toLocaleDateString('en-IN', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">Route</p>
                                    <p className="text-sm text-gray-600">{pnrData.from} → {pnrData.to}</p>
                                </div>

                                <div>
                                    <p className="font-semibold">Class & Fare</p>
                                    <p className="text-sm text-gray-600">{pnrData.class} - ₹{pnrData.fare}</p>
                                </div>
                            </div>
                        </div>

                        {pnrData.passengers && pnrData.passengers.length > 0 && (
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaUsers className="text-primary-600 mr-2" />
                                    <h4 className="text-lg font-semibold">Passenger Details</h4>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border p-3 text-left">S.No</th>
                                                <th className="border p-3 text-left">Name</th>
                                                <th className="border p-3 text-left">Age</th>
                                                <th className="border p-3 text-left">Gender</th>
                                                <th className="border p-3 text-left">Seat</th>
                                                <th className="border p-3 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pnrData.passengers.map((passenger, index) => (
                                                <tr key={index}>
                                                    <td className="border p-3">{index + 1}</td>
                                                    <td className="border p-3 font-medium">{passenger.name}</td>
                                                    <td className="border p-3">{passenger.age}</td>
                                                    <td className="border p-3">{passenger.gender}</td>
                                                    <td className="border p-3">
                                                        {pnrData.seatDetails?.coach && pnrData.seatDetails?.seats?.[index] 
                                                            ? `${pnrData.seatDetails.coach}-${pnrData.seatDetails.seats[index]}`
                                                            : 'TBA'
                                                        }
                                                    </td>
                                                    <td className="border p-3">
                                                        <Badge variant="success">
                                                            {pnrData.bookingStatus || 'Confirmed'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default PNRStatus;