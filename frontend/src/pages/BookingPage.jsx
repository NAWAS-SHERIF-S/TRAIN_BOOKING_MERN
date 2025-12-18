import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaTrain, FaCalendarAlt, FaUtensils, FaChevronRight, FaTimes, FaPlus, FaCouch } from 'react-icons/fa';
import { trainService } from '../services/trainService';
import { bookingService } from '../services/bookingService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import SeatLayout from '../components/SeatLayout';
import { formatTime } from '../utils/formatters';

const BookingPage = () => {
    const { trainId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);

    const [step, setStep] = useState(1);
    const [showSeatLayout, setShowSeatLayout] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        journeyDate: new Date().toISOString().split('T')[0],
        class: searchParams.get('class') || 'SL',
        quota: 'General',
        passengers: [],
        selectedSeats: [],
        autoUpgrade: false,
        cateringService: false
    });
    const [currentPassenger, setCurrentPassenger] = useState({
        name: '',
        age: '',
        gender: 'Male',
        berthPreference: 'No Berth',
        mealPreference: 'Veg',
        nationality: 'India'
    });

    useEffect(() => {
        fetchTrain();
    }, [trainId]);

    const fetchTrain = async () => {
        try {
            const response = await trainService.getTrainById(trainId);
            setTrain(response.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPassenger = () => {
        if (currentPassenger.name && currentPassenger.age) {
            setFormData({
                ...formData,
                passengers: [...formData.passengers, currentPassenger]
            });
            setCurrentPassenger({
                name: '',
                age: '',
                gender: 'Male',
                berthPreference: 'No Berth',
                mealPreference: 'Veg',
                nationality: 'India'
            });
        }
    };

    const removePassenger = (index) => {
        setFormData({
            ...formData,
            passengers: formData.passengers.filter((_, i) => i !== index)
        });
    };

    const handleSeatSelection = () => {
        if (formData.passengers.length === 0) {
            alert('Please add passengers first');
            return;
        }
        setShowSeatLayout(true);
    };

    const handleSeatConfirm = (seats) => {
        setSelectedSeats(seats);
        setFormData({...formData, selectedSeats: seats});
        setShowSeatLayout(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.passengers.length === 0) {
            alert('Please add at least one passenger');
            return;
        }
        
        // Calculate fare using train-specific pricing
        const basePrice = train?.pricing?.[formData.class] || 500;
        const distance = Math.abs((toStation?.distance || 0) - (fromStation?.distance || 0)) || 100;
        const distanceMultiplier = Math.max(1, distance / 500);
        const calculatedFare = Math.round(basePrice * distanceMultiplier * Math.max(1, formData.passengers.length));
        
        // Navigate to payment page with booking data
        const bookingData = {
            trainId: train._id,
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            from: `${fromStation.name} (${fromStation.stationCode})`,
            to: `${toStation.name} (${toStation.stationCode})`,
            departureTime: fromStation.departureTime,
            arrivalTime: toStation.arrivalTime,
            journeyDate: formData.journeyDate,
            class: formData.class,
            passengers: formData.passengers,
            selectedSeats: selectedSeats,
            fare: calculatedFare
        };
        
        navigate('/payment', { state: bookingData });
    };

    if (loading) return <Loader fullScreen />;
    if (!train) {
        navigate('/search');
        return null;
    }

    const fromStation = train.stations?.[0] || { name: 'Unknown', stationCode: 'UNK', distance: 0 };
    const toStation = train.stations?.[train.stations.length - 1] || { name: 'Unknown', stationCode: 'UNK', distance: 100 };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Steps */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>1</div>
                            <span className="font-medium">Train Selection</span>
                        </div>
                        <FaChevronRight className="text-gray-400" />
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>2</div>
                            <span className="font-medium">Passenger Details</span>
                        </div>
                        <FaChevronRight className="text-gray-400" />
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>3</div>
                            <span className="font-medium">Review and Pay</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-5xl">
                {/* Train Info Card */}
                <Card className="mb-6 bg-gradient-to-r from-primary-50 to-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold mb-1">{train.trainNumber} - {train.trainName}</h2>
                            <p className="text-sm text-gray-600">{formData.class} | {formData.quota} Quota</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Thursday, Dec 18</div>
                                    <div className="font-bold">{formatTime(fromStation?.departureTime)}, {fromStation?.stationCode}</div>
                                    <div className="text-sm">{fromStation?.name}</div>
                                </div>
                                <FaTrain className="text-primary-600" />
                                <div>
                                    <div className="text-sm text-gray-600">Thursday, Dec 18</div>
                                    <div className="font-bold">{formatTime(toStation?.arrivalTime)}, {toStation?.stationCode}</div>
                                    <div className="text-sm">{toStation?.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="md:col-span-2">
                            <Card className="mb-6">
                                <h3 className="font-semibold mb-4">Passengers - {formData.passengers.length} Selected</h3>
                                <p className="text-sm text-gray-600 mb-4">Add passenger details</p>

                                {/* Gender Tabs */}
                                <div className="flex gap-2 mb-4">
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setCurrentPassenger({...currentPassenger, gender: g})}
                                            className={`px-4 py-2 rounded ${currentPassenger.gender === g ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>

                                {/* Passenger Form */}
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name (As per Gov. ID)"
                                        value={currentPassenger.name}
                                        onChange={(e) => setCurrentPassenger({...currentPassenger, name: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            placeholder="Age"
                                            value={currentPassenger.age}
                                            onChange={(e) => setCurrentPassenger({...currentPassenger, age: e.target.value})}
                                            className="px-4 py-2 border rounded-lg"
                                        />
                                        <select
                                            value={currentPassenger.berthPreference}
                                            onChange={(e) => setCurrentPassenger({...currentPassenger, berthPreference: e.target.value})}
                                            className="px-4 py-2 border rounded-lg"
                                        >
                                            <option>No Berth</option>
                                            <option>Lower</option>
                                            <option>Middle</option>
                                            <option>Upper</option>
                                            <option>Side Lower</option>
                                            <option>Side Upper</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            value={currentPassenger.mealPreference}
                                            onChange={(e) => setCurrentPassenger({...currentPassenger, mealPreference: e.target.value})}
                                            className="px-4 py-2 border rounded-lg"
                                        >
                                            <option>Veg</option>
                                            <option>Non-Veg</option>
                                            <option>No Meal</option>
                                        </select>
                                        <select
                                            value={currentPassenger.nationality}
                                            onChange={(e) => setCurrentPassenger({...currentPassenger, nationality: e.target.value})}
                                            className="px-4 py-2 border rounded-lg"
                                        >
                                            <option>India</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <Button type="button" onClick={addPassenger} className="w-full">
                                        <FaPlus className="inline mr-2" /> ADD PASSENGER
                                    </Button>
                                </div>

                                {/* Added Passengers */}
                                {formData.passengers.length > 0 && (
                                    <div className="mt-6 space-y-2">
                                        {formData.passengers.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                                <div>
                                                    <span className="font-medium">{p.name}</span>
                                                    <span className="text-gray-600 ml-2">({p.age}Y, {p.gender})</span>
                                                </div>
                                                <button type="button" onClick={() => removePassenger(i)} className="text-red-600">
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Seat Selection */}
                                {formData.passengers.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-3">Seat Selection</h4>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">Select Seats ({formData.class})</p>
                                                    <p className="text-sm text-gray-600">
                                                        {selectedSeats.length > 0 
                                                            ? `Selected: ${selectedSeats.join(', ')}` 
                                                            : 'No seats selected (Auto-assign)'}
                                                    </p>
                                                </div>
                                                <Button 
                                                    type="button" 
                                                    onClick={handleSeatSelection}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <FaCouch className="mr-2" />
                                                    Choose Seats
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Preferences */}
                                <div className="mt-6 space-y-3">
                                    <h4 className="font-semibold">Additional Preference</h4>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.autoUpgrade}
                                            onChange={(e) => setFormData({...formData, autoUpgrade: e.target.checked})}
                                        />
                                        <span>Consider for auto upgradation</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.cateringService}
                                            onChange={(e) => setFormData({...formData, cateringService: e.target.checked})}
                                        />
                                        <span>I don't want Food/Beverages</span>
                                    </label>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <Card className="sticky top-20">
                                <h3 className="font-semibold mb-4">Booking Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Passengers</span>
                                        <span className="font-semibold">{formData.passengers.length}</span>
                                    </div>
                                    {selectedSeats.length > 0 && (
                                        <div className="flex justify-between text-xs">
                                            <span>Seats</span>
                                            <span>{selectedSeats.join(', ')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Base Fare</span>
                                        <span>₹{(() => {
                                            try {
                                                const basePrice = train?.pricing?.[formData.class] || 500;
                                                const distance = Math.abs((toStation?.distance || 0) - (fromStation?.distance || 0)) || 100;
                                                const distanceMultiplier = Math.max(1, distance / 500);
                                                return Math.round(basePrice * distanceMultiplier * Math.max(1, formData.passengers.length));
                                            } catch (e) {
                                                return 500 * Math.max(1, formData.passengers.length);
                                            }
                                        })()}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{(() => {
                                            try {
                                                const basePrice = train?.pricing?.[formData.class] || 500;
                                                const distance = Math.abs((toStation?.distance || 0) - (fromStation?.distance || 0)) || 100;
                                                const distanceMultiplier = Math.max(1, distance / 500);
                                                return Math.round(basePrice * distanceMultiplier * Math.max(1, formData.passengers.length));
                                            } catch (e) {
                                                return 500 * Math.max(1, formData.passengers.length);
                                            }
                                        })()}</span>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full mt-4"
                                    disabled={formData.passengers.length === 0}
                                >
                                    Proceed to Pay
                                </Button>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>

            {/* Seat Layout Modal */}
            {showSeatLayout && (
                <SeatLayoutModal 
                    trainClass={formData.class}
                    passengerCount={formData.passengers.length}
                    onClose={() => setShowSeatLayout(false)}
                    onConfirm={handleSeatConfirm}
                    preSelectedSeats={selectedSeats}
                />
            )}
        </div>
    );
};

// Seat Layout Modal Component
const SeatLayoutModal = ({ trainClass, passengerCount, onClose, onConfirm, preSelectedSeats }) => {
    const [selectedSeats, setSelectedSeats] = useState(preSelectedSeats || []);

    const handleSeatToggle = (seatNum) => {
        if (selectedSeats.includes(seatNum)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
        } else if (selectedSeats.length < passengerCount) {
            setSelectedSeats([...selectedSeats, seatNum]);
        } else {
            alert(`You can only select ${passengerCount} seats for ${passengerCount} passengers`);
        }
    };

    const handleConfirm = () => {
        if (selectedSeats.length !== passengerCount) {
            alert(`Please select exactly ${passengerCount} seats for ${passengerCount} passengers`);
            return;
        }
        onConfirm(selectedSeats);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Select Seats - {trainClass}</h2>
                        <p className="text-sm text-primary-100">
                            Select {passengerCount} seats for {passengerCount} passengers
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-primary-700 p-2 rounded">
                        <FaTimes size={20} />
                    </button>
                </div>

                <SeatLayout 
                    trainClass={trainClass}
                    selectedSeats={selectedSeats}
                    onSeatToggle={handleSeatToggle}
                    maxSelection={passengerCount}
                />

                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Selected: {selectedSeats.length}/{passengerCount} seats
                        {selectedSeats.length > 0 && (
                            <span className="ml-2 font-semibold">{selectedSeats.join(', ')}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirm}
                            disabled={selectedSeats.length !== passengerCount}
                        >
                            Confirm Seats
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
