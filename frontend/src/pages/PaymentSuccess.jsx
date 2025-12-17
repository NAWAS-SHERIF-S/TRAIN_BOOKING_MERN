import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaTrain, FaCalendarAlt, FaPrint } from 'react-icons/fa';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatTime } from '../utils/formatters';
import { useRef } from 'react';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pnr, booking } = location.state || {};
    const ticketRef = useRef();

    const downloadTicket = () => {
        const printContent = ticketRef.current;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    if (!pnr) {
        navigate('/search');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Success Message */}
                <Card className="text-center mb-6">
                    <div className="mb-6">
                        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600">Your train ticket has been booked successfully</p>
                    </div>

                    <div className="bg-primary-50 rounded-lg p-6 mb-6">
                        <div className="text-sm text-gray-600 mb-1">PNR Number</div>
                        <div className="text-3xl font-bold text-primary-600">{pnr}</div>
                    </div>

                    <div className="text-left space-y-4 mb-6">
                        <div className="flex items-center gap-3 pb-3 border-b">
                            <FaTrain className="text-primary-600 text-xl" />
                            <div>
                                <div className="font-semibold">{booking.trainNumber} - {booking.trainName}</div>
                                <div className="text-sm text-gray-600">{booking.class}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-600">From</div>
                                <div className="font-semibold">{booking.from}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">To</div>
                                <div className="font-semibold">{booking.to}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-gray-400" />
                            <div>
                                <div className="text-sm text-gray-600">Journey Date</div>
                                <div className="font-semibold">{new Date(booking.journeyDate).toLocaleDateString('en-IN', { 
                                    weekday: 'short', 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-600 mb-2">Passengers ({booking.passengers.length})</div>
                            {booking.passengers.map((p, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-sm text-gray-600">
                                        Age: {p.age} | Gender: {p.gender} | Seat: {booking.seatDetails?.seats?.[i] || 'TBA'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-green-50 p-4 rounded">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Paid</span>
                                <span className="text-xl font-bold text-green-600">₹{booking.fare}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Payment Status: {booking.paymentStatus}</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={() => navigate('/bookings')} className="flex-1">
                            View My Bookings
                        </Button>
                        <Button variant="outline" onClick={downloadTicket} className="flex-1">
                            <FaDownload className="inline mr-2" />
                            Download Ticket
                        </Button>
                    </div>

                    <div className="mt-6 text-sm text-gray-500">
                        A confirmation email has been sent to your registered email address
                    </div>
                </Card>

                {/* Printable Ticket */}
                <div ref={ticketRef} className="hidden print:block">
                    <div className="bg-white p-8 max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="border-b-4 border-primary-600 pb-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-primary-600 mb-2">INDIAN RAILWAYS</h1>
                                    <p className="text-lg font-semibold">E-Ticket / Reservation Slip</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-green-100 px-4 py-2 rounded">
                                        <div className="text-xs text-gray-600">Booking Status</div>
                                        <div className="text-lg font-bold text-green-600">CONFIRMED</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PNR Section */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">PNR Number</div>
                                    <div className="text-2xl font-bold text-primary-600">{pnr}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Transaction ID</div>
                                    <div className="text-lg font-semibold">{booking._id?.slice(-12).toUpperCase()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Booking Date</div>
                                    <div className="font-semibold">{new Date(booking.createdAt || Date.now()).toLocaleString('en-IN')}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Class</div>
                                    <div className="font-semibold">{booking.class}</div>
                                </div>
                            </div>
                        </div>

                        {/* Train Details */}
                        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
                            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                                <FaTrain className="text-primary-600" />
                                Train Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Train Number & Name</div>
                                    <div className="font-bold text-lg">{booking.trainNumber} - {booking.trainName}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Journey Date</div>
                                    <div className="font-semibold">{new Date(booking.journeyDate).toLocaleDateString('en-IN', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="text-sm text-gray-600">From</div>
                                    <div className="font-bold text-lg">{booking.from.split('(')[0].trim()}</div>
                                    <div className="text-sm text-gray-500">{booking.from.match(/\(([^)]+)\)/)?.[1]}</div>
                                </div>
                                <div className="px-4">
                                    <div className="text-3xl text-primary-600">→</div>
                                </div>
                                <div className="flex-1 text-right">
                                    <div className="text-sm text-gray-600">To</div>
                                    <div className="font-bold text-lg">{booking.to.split('(')[0].trim()}</div>
                                    <div className="text-sm text-gray-500">{booking.to.match(/\(([^)]+)\)/)?.[1]}</div>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details */}
                        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
                            <h2 className="font-bold text-lg mb-3">Passenger Details</h2>
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-2 border">S.No</th>
                                        <th className="text-left p-2 border">Name</th>
                                        <th className="text-left p-2 border">Age</th>
                                        <th className="text-left p-2 border">Gender</th>
                                        <th className="text-left p-2 border">Seat/Berth</th>
                                        <th className="text-left p-2 border">Coach</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {booking.passengers.map((p, i) => (
                                        <tr key={i}>
                                            <td className="p-2 border">{i + 1}</td>
                                            <td className="p-2 border font-semibold">{p.name}</td>
                                            <td className="p-2 border">{p.age}</td>
                                            <td className="p-2 border">{p.gender}</td>
                                            <td className="p-2 border font-bold text-primary-600">{booking.seatDetails?.seats?.[i] || 'TBA'}</td>
                                            <td className="p-2 border font-semibold">{booking.seatDetails?.coach || `${booking.class}1`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Fare Details */}
                        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
                            <h2 className="font-bold text-lg mb-3">Fare Details</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Ticket Fare ({booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''})</span>
                                    <span className="font-semibold">₹ {booking.fare}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Reservation Charges</span>
                                    <span>₹ 0</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Service Charges</span>
                                    <span>₹ 0</span>
                                </div>
                                <div className="border-t-2 pt-2 flex justify-between text-lg font-bold">
                                    <span>Total Fare</span>
                                    <span className="text-green-600">₹ {booking.fare}</span>
                                </div>
                            </div>
                        </div>

                        {/* Important Instructions */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <h3 className="font-bold mb-2">Important Instructions:</h3>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>Please carry a valid photo ID proof during journey</li>
                                <li>Boarding point cannot be changed after chart preparation</li>
                                <li>Please be present at the station at least 20 minutes before departure</li>
                                <li>This ticket is valid only for the date and train mentioned above</li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-600 border-t pt-4">
                            <p className="mb-1">This is a computer-generated ticket and does not require signature</p>
                            <p>For any queries, please contact Indian Railways Customer Care</p>
                            <p className="mt-2 font-semibold">Wish you a pleasant journey!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:block, .print\\:block * {
                        visibility: visible;
                    }
                    .print\\:block {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess;
