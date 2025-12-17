import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaTrain, FaCalendarAlt, FaUtensils, FaChevronRight, FaTimes, FaPlus } from 'react-icons/fa';
import { trainService } from '../services/trainService';
import { bookingService } from '../services/bookingService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatTime } from '../utils/formatters';

const BookingPage = () => {
    const { trainId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        journeyDate: new Date().toISOString().split('T')[0],
        class: searchParams.get('class') || 'SL',
        quota: 'General',
        passengers: [],
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.passengers.length === 0) {
            alert('Please add at least one passenger');
            return;
        }
        
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
            fare: formData.passengers.length * 695
        };
        
        navigate('/payment', { state: bookingData });
    };

    if (loading) return <Loader fullScreen />;

    const fromStation = train.stations?.[0];
    const toStation = train.stations?.[train.stations.length - 1];

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
                                    <div className="flex justify-between">
                                        <span>Base Fare</span>
                                        <span>₹{formData.passengers.length * 695}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{formData.passengers.length * 695}</span>
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
        </div>
    );
};

export default BookingPage;
