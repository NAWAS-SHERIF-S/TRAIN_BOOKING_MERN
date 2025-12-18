import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaTrain, FaCheckCircle } from 'react-icons/fa';
import { bookingService } from '../services/bookingService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatTime } from '../utils/formatters';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state;
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    if (!bookingData) {
        navigate('/search');
        return null;
    }

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const response = await bookingService.createBooking({
                trainId: bookingData.trainId,
                from: bookingData.from,
                to: bookingData.to,
                journeyDate: bookingData.journeyDate,
                class: bookingData.class,
                passengers: bookingData.passengers,
                fare: bookingData.fare,
            });
            
            // Show success and navigate
            navigate('/payment-success', { 
                state: { 
                    pnr: response.data.pnr,
                    booking: response.data
                } 
            });
        } catch (error) {
            alert(error.response?.data?.error || 'Payment failed');
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <FaLock className="text-green-600" />
                        <h1 className="text-xl font-bold">Secure Payment</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Payment Form */}
                    <div className="md:col-span-2">
                        <Card className="mb-6">
                            <h3 className="font-semibold mb-4">Select Payment Method</h3>
                            <div className="space-y-3">
                                {['card', 'upi', 'netbanking', 'wallet'].map(method => (
                                    <label key={method} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <FaCreditCard className="text-gray-400" />
                                        <span className="font-medium capitalize">{method === 'card' ? 'Credit/Debit Card' : method === 'upi' ? 'UPI' : method === 'netbanking' ? 'Net Banking' : 'Wallet'}</span>
                                    </label>
                                ))}
                            </div>
                        </Card>

                        {paymentMethod === 'card' && (
                            <Card>
                                <h3 className="font-semibold mb-4">Card Details</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        maxLength="16"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cardholder Name"
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="px-4 py-2 border rounded-lg"
                                            maxLength="5"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            className="px-4 py-2 border rounded-lg"
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {paymentMethod === 'upi' && (
                            <Card>
                                <h3 className="font-semibold mb-4">UPI Payment</h3>
                                <input
                                    type="text"
                                    placeholder="Enter UPI ID (e.g., name@upi)"
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </Card>
                        )}
                    </div>

                    {/* Booking Summary */}
                    <div>
                        <Card className="sticky top-20">
                            <h3 className="font-semibold mb-4">Booking Summary</h3>
                            
                            <div className="mb-4 pb-4 border-b">
                                <div className="font-semibold mb-1">{bookingData.trainNumber} - {bookingData.trainName}</div>
                                <div className="text-sm text-gray-600">{bookingData.class}</div>
                            </div>

                            <div className="mb-4 pb-4 border-b space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">From</span>
                                    <span className="font-medium">{bookingData.from.split('(')[0].trim()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">To</span>
                                    <span className="font-medium">{bookingData.to.split('(')[0].trim()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date</span>
                                    <span className="font-medium">{new Date(bookingData.journeyDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Passengers</span>
                                    <span className="font-medium">{bookingData.passengers.length}</span>
                                </div>
                            </div>

                            <div className="mb-4 pb-4 border-b">
                                <h4 className="font-medium mb-2 text-sm">Passengers</h4>
                                {bookingData.passengers.map((p, i) => (
                                    <div key={i} className="text-sm text-gray-600 mb-1">
                                        {i + 1}. {p.name} ({p.age}Y, {p.gender})
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span>Ticket Fare</span>
                                    <span>₹{bookingData.fare}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Convenience Fee</span>
                                    <span>₹{Math.round(bookingData.fare * 0.02)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total Amount</span>
                                    <span>₹{bookingData.fare + Math.round(bookingData.fare * 0.02)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handlePayment}
                                className="w-full"
                                loading={processing}
                            >
                                <FaLock className="inline mr-2" />
                                Pay ₹{bookingData.fare + Math.round(bookingData.fare * 0.02)}
                            </Button>

                            <div className="mt-4 text-xs text-gray-500 text-center">
                                <FaLock className="inline mr-1" />
                                Your payment is secure and encrypted
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
