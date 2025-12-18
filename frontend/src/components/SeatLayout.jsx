import { useState } from 'react';
import { FaCouch, FaTimes } from 'react-icons/fa';

// Sleeper/AC Layout Component
const SleeperLayout = ({ trainClass, selectedSeats, toggleSeat, getSeatStatus, getSeatColor }) => {
    const compartments = Array.from({ length: 9 }, (_, i) => i + 1);
    
    return (
        <div className="space-y-6">
            <div className="text-center text-sm text-gray-600 mb-4">
                <div className="inline-flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg">
                    <span>🚂 Engine</span>
                    <span>→</span>
                    <span>Coach Layout</span>
                    <span>→</span>
                    <span>🚃 End</span>
                </div>
            </div>
            
            {compartments.map(comp => (
                <div key={comp} className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="text-center text-sm font-semibold text-gray-700 mb-3">
                        Compartment {comp}
                    </div>
                    
                    <div className="flex justify-between">
                        {/* Main Berths (Left Side) */}
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-1">
                                {/* Bay 1 */}
                                <div className="space-y-1">
                                    {[1, 2, 3].slice(0, trainClass === '2A' ? 2 : 3).map(level => {
                                        const seatNum = (comp - 1) * 8 + level;
                                        const status = getSeatStatus(seatNum);
                                        return (
                                            <button
                                                key={seatNum}
                                                onClick={() => toggleSeat(seatNum)}
                                                disabled={status === 'booked'}
                                                className={`w-16 h-6 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-gray-400`}
                                                title={`${level === 1 ? 'Lower' : level === 2 ? 'Middle' : 'Upper'} Berth ${seatNum}`}
                                            >
                                                {seatNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Bay 2 */}
                                <div className="space-y-1">
                                    {[4, 5, 6].slice(0, trainClass === '2A' ? 2 : 3).map(level => {
                                        const seatNum = (comp - 1) * 8 + level;
                                        const status = getSeatStatus(seatNum);
                                        return (
                                            <button
                                                key={seatNum}
                                                onClick={() => toggleSeat(seatNum)}
                                                disabled={status === 'booked'}
                                                className={`w-16 h-6 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-gray-400`}
                                                title={`${level === 4 ? 'Lower' : level === 5 ? 'Middle' : 'Upper'} Berth ${seatNum}`}
                                            >
                                                {seatNum}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        {/* Aisle */}
                        <div className="w-8 flex items-center justify-center">
                            <div className="w-1 h-full bg-gray-300 rounded"></div>
                        </div>
                        
                        {/* Side Berths (Right Side) */}
                        <div className="w-20">
                            <div className="space-y-1">
                                {[7, 8].map(level => {
                                    const seatNum = (comp - 1) * 8 + level;
                                    const status = getSeatStatus(seatNum);
                                    return (
                                        <button
                                            key={seatNum}
                                            onClick={() => toggleSeat(seatNum)}
                                            disabled={status === 'booked'}
                                            className={`w-full h-6 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-gray-400`}
                                            title={`Side ${level === 7 ? 'Lower' : 'Upper'} Berth ${seatNum}`}
                                        >
                                            {seatNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// First AC Layout Component
const FirstACLayout = ({ selectedSeats, toggleSeat, getSeatStatus, getSeatColor }) => {
    const cabins = Array.from({ length: 4 }, (_, i) => i + 1);
    
    return (
        <div className="space-y-4">
            <div className="text-center text-sm text-gray-600 mb-4">
                <div className="inline-flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg">
                    <span>🚂 Luxury Cabins</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {cabins.map(cabin => (
                    <div key={cabin} className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
                        <div className="text-center text-sm font-semibold text-amber-800 mb-3">
                            🏠 Cabin {cabin}
                        </div>
                        
                        <div className="space-y-2">
                            {/* Lower Berths */}
                            <div className="flex gap-2">
                                {[1, 2].map(pos => {
                                    const seatNum = (cabin - 1) * 4 + pos;
                                    const status = getSeatStatus(seatNum);
                                    return (
                                        <button
                                            key={seatNum}
                                            onClick={() => toggleSeat(seatNum)}
                                            disabled={status === 'booked'}
                                            className={`flex-1 h-8 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-amber-400 rounded`}
                                            title={`Lower Berth ${seatNum}`}
                                        >
                                            L{pos}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Upper Berths */}
                            <div className="flex gap-2">
                                {[3, 4].map(pos => {
                                    const seatNum = (cabin - 1) * 4 + pos;
                                    const status = getSeatStatus(seatNum);
                                    return (
                                        <button
                                            key={seatNum}
                                            onClick={() => toggleSeat(seatNum)}
                                            disabled={status === 'booked'}
                                            className={`flex-1 h-8 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-amber-400 rounded`}
                                            title={`Upper Berth ${seatNum}`}
                                        >
                                            U{pos - 2}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Chair Car Layout Component
const ChairCarLayout = ({ trainClass, selectedSeats, toggleSeat, getSeatStatus, getSeatColor }) => {
    const rows = Array.from({ length: trainClass === '2S' ? 18 : 13 }, (_, i) => i + 1);
    
    return (
        <div className="space-y-2">
            <div className="text-center text-sm text-gray-600 mb-4">
                <div className="inline-flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg">
                    <span>🚂 Engine</span>
                    <span>→</span>
                    <span>{trainClass === '2S' ? 'Second Sitting' : 'Chair Car'}</span>
                    <span>→</span>
                    <span>🚃 End</span>
                </div>
            </div>
            
            {rows.map(row => (
                <div key={row} className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
                    <div className="w-8 text-xs font-semibold text-gray-600">{row}</div>
                    
                    {/* Left Side Seats */}
                    <div className="flex gap-1">
                        {[1, 2].map(pos => {
                            const seatNum = (row - 1) * (trainClass === '2S' ? 6 : 6) + pos;
                            const status = getSeatStatus(seatNum);
                            return (
                                <button
                                    key={seatNum}
                                    onClick={() => toggleSeat(seatNum)}
                                    disabled={status === 'booked'}
                                    className={`w-8 h-8 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-gray-400 rounded`}
                                    title={`Seat ${seatNum}`}
                                >
                                    {seatNum}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Aisle */}
                    <div className="w-6 flex justify-center">
                        <div className="w-0.5 h-6 bg-gray-300"></div>
                    </div>
                    
                    {/* Right Side Seats */}
                    <div className="flex gap-1">
                        {(trainClass === '2S' ? [3, 4, 5, 6] : [3, 4]).map(pos => {
                            const seatNum = (row - 1) * (trainClass === '2S' ? 6 : 6) + pos;
                            const status = getSeatStatus(seatNum);
                            return (
                                <button
                                    key={seatNum}
                                    onClick={() => toggleSeat(seatNum)}
                                    disabled={status === 'booked'}
                                    className={`w-8 h-8 text-xs font-semibold transition-colors ${getSeatColor(status)} border border-gray-400 rounded`}
                                    title={`Seat ${seatNum}`}
                                >
                                    {seatNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

const SeatLayout = ({ trainClass, onClose, selectedSeats: externalSelectedSeats, onSeatToggle, maxSelection }) => {
    const [selectedSeats, setSelectedSeats] = useState(externalSelectedSeats || []);

    const getLayoutInfo = () => {
        switch (trainClass) {
            case 'SL':
                return { name: 'Sleeper Class (SL)', description: '72 berths per coach' };
            case '3A':
                return { name: 'AC 3 Tier (3A)', description: '64 berths per coach' };
            case '2A':
                return { name: 'AC 2 Tier (2A)', description: '48 berths per coach' };
            case '1A':
                return { name: 'First AC (1A)', description: '24 berths per coach (4 cabins)' };
            case 'CC':
                return { name: 'AC Chair Car (CC)', description: '78 seats per coach' };
            case '2S':
                return { name: 'Second Sitting (2S)', description: '108 seats per coach' };
            default:
                return { name: 'General Layout', description: 'Standard seating' };
        }
    };

    const layout = getLayoutInfo();
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
        
        if (onSeatToggle) {
            onSeatToggle(seatNum);
        } else {
            if (selectedSeats.includes(seatNum)) {
                setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
            } else {
                setSelectedSeats([...selectedSeats, seatNum]);
            }
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
                    {trainClass === 'SL' || trainClass === '3A' || trainClass === '2A' ? (
                        <SleeperLayout trainClass={trainClass} selectedSeats={externalSelectedSeats || selectedSeats} toggleSeat={toggleSeat} getSeatStatus={getSeatStatus} getSeatColor={getSeatColor} />
                    ) : trainClass === '1A' ? (
                        <FirstACLayout selectedSeats={externalSelectedSeats || selectedSeats} toggleSeat={toggleSeat} getSeatStatus={getSeatStatus} getSeatColor={getSeatColor} />
                    ) : (
                        <ChairCarLayout trainClass={trainClass} selectedSeats={externalSelectedSeats || selectedSeats} toggleSeat={toggleSeat} getSeatStatus={getSeatStatus} getSeatColor={getSeatColor} />
                    )}
                </div>

                {onClose && (
                    <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Selected Seats: <span className="font-semibold">{(externalSelectedSeats || selectedSeats).length > 0 ? (externalSelectedSeats || selectedSeats).join(', ') : 'None'}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatLayout;
