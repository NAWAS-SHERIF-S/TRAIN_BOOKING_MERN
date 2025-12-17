import { useState } from 'react';
import { FaCouch, FaTimes } from 'react-icons/fa';

const SeatLayout = ({ trainClass, onClose }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const getSeatLayout = () => {
        switch (trainClass) {
            case 'SL': // Sleeper Class
                return {
                    name: 'Sleeper Class (SL)',
                    description: '72 berths per coach',
                    layout: [
                        { type: 'Lower', seats: Array.from({ length: 8 }, (_, i) => i + 1) },
                        { type: 'Middle', seats: Array.from({ length: 8 }, (_, i) => i + 9) },
                        { type: 'Upper', seats: Array.from({ length: 8 }, (_, i) => i + 17) },
                        { type: 'Side Lower', seats: Array.from({ length: 9 }, (_, i) => i + 25) },
                        { type: 'Side Upper', seats: Array.from({ length: 9 }, (_, i) => i + 34) },
                    ]
                };
            case '3A': // AC 3 Tier
                return {
                    name: 'AC 3 Tier (3A)',
                    description: '64 berths per coach',
                    layout: [
                        { type: 'Lower', seats: Array.from({ length: 8 }, (_, i) => i + 1) },
                        { type: 'Middle', seats: Array.from({ length: 8 }, (_, i) => i + 9) },
                        { type: 'Upper', seats: Array.from({ length: 8 }, (_, i) => i + 17) },
                        { type: 'Side Lower', seats: Array.from({ length: 8 }, (_, i) => i + 25) },
                        { type: 'Side Upper', seats: Array.from({ length: 8 }, (_, i) => i + 33) },
                    ]
                };
            case '2A': // AC 2 Tier
                return {
                    name: 'AC 2 Tier (2A)',
                    description: '48 berths per coach',
                    layout: [
                        { type: 'Lower', seats: Array.from({ length: 8 }, (_, i) => i + 1) },
                        { type: 'Upper', seats: Array.from({ length: 8 }, (_, i) => i + 9) },
                        { type: 'Side Lower', seats: Array.from({ length: 8 }, (_, i) => i + 17) },
                        { type: 'Side Upper', seats: Array.from({ length: 8 }, (_, i) => i + 25) },
                    ]
                };
            case '1A': // First AC
                return {
                    name: 'First AC (1A)',
                    description: '24 berths per coach (4 cabins)',
                    layout: [
                        { type: 'Cabin 1 - Lower', seats: [1, 2] },
                        { type: 'Cabin 1 - Upper', seats: [3, 4] },
                        { type: 'Cabin 2 - Lower', seats: [5, 6] },
                        { type: 'Cabin 2 - Upper', seats: [7, 8] },
                        { type: 'Cabin 3 - Lower', seats: [9, 10] },
                        { type: 'Cabin 3 - Upper', seats: [11, 12] },
                        { type: 'Cabin 4 - Lower', seats: [13, 14] },
                        { type: 'Cabin 4 - Upper', seats: [15, 16] },
                    ]
                };
            case 'CC': // Chair Car
                return {
                    name: 'AC Chair Car (CC)',
                    description: '78 seats per coach',
                    layout: [
                        { type: 'Row 1-10', seats: Array.from({ length: 40 }, (_, i) => i + 1) },
                        { type: 'Row 11-20', seats: Array.from({ length: 38 }, (_, i) => i + 41) },
                    ]
                };
            case '2S': // Second Sitting
                return {
                    name: 'Second Sitting (2S)',
                    description: '108 seats per coach',
                    layout: [
                        { type: 'Row 1-15', seats: Array.from({ length: 54 }, (_, i) => i + 1) },
                        { type: 'Row 16-30', seats: Array.from({ length: 54 }, (_, i) => i + 55) },
                    ]
                };
            default:
                return {
                    name: 'General Layout',
                    description: 'Standard seating',
                    layout: [
                        { type: 'Seats', seats: Array.from({ length: 72 }, (_, i) => i + 1) },
                    ]
                };
        }
    };

    const layout = getSeatLayout();
    const bookedSeats = Array.from({ length: 15 }, () => Math.floor(Math.random() * 72) + 1);

    const getSeatStatus = (seatNum) => {
        if (bookedSeats.includes(seatNum)) return 'booked';
        if (selectedSeats.includes(seatNum)) return 'selected';
        return 'available';
    };

    const getSeatColor = (status) => {
        switch (status) {
            case 'booked':
                return 'bg-gray-300 text-gray-500 cursor-not-allowed';
            case 'selected':
                return 'bg-green-500 text-white';
            case 'available':
                return 'bg-blue-100 hover:bg-blue-200 text-blue-900 cursor-pointer';
            default:
                return 'bg-gray-100';
        }
    };

    const toggleSeat = (seatNum) => {
        const status = getSeatStatus(seatNum);
        if (status === 'booked') return;
        
        if (selectedSeats.includes(seatNum)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
        } else {
            setSelectedSeats([...selectedSeats, seatNum]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">{layout.name}</h2>
                        <p className="text-sm text-primary-100">{layout.description}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-primary-700 p-2 rounded">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Legend */}
                <div className="p-4 bg-gray-50 border-b flex gap-6 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 border border-blue-300 rounded"></div>
                        <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <span className="text-sm">Booked</span>
                    </div>
                </div>

                {/* Seat Layout */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {layout.layout.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaCouch className="text-primary-600" />
                                {section.type}
                            </h3>
                            <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
                                {section.seats.map((seatNum) => {
                                    const status = getSeatStatus(seatNum);
                                    return (
                                        <button
                                            key={seatNum}
                                            onClick={() => toggleSeat(seatNum)}
                                            disabled={status === 'booked'}
                                            className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold transition-colors ${getSeatColor(status)}`}
                                        >
                                            {seatNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Selected Seats: <span className="font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatLayout;
