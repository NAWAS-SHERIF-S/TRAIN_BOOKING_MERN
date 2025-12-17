import { useState } from 'react';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { STATION_CODES } from '../utils/stationCodes';

const StationDropdown = ({ 
    label, 
    value, 
    onChange, 
    required = false,
    className = '' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const stations = Object.entries(STATION_CODES).map(([code, name]) => ({
        code,
        name,
        display: `${name} (${code})`
    }));

    const filteredStations = stations.filter(station =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.code.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 20);

    const handleSelect = (station) => {
        onChange(station.display);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full pl-10 pr-10 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                        {value || 'Select station'}
                    </span>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="p-2 border-b">
                            <input
                                type="text"
                                placeholder="Search stations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto">
                            {filteredStations.map((station) => (
                                <button
                                    key={station.code}
                                    type="button"
                                    onClick={() => handleSelect(station)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="font-medium text-gray-900">{station.name}</div>
                                    <div className="text-sm text-gray-500">Code: {station.code}</div>
                                </button>
                            ))}
                            
                            {filteredStations.length === 0 && (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                    No stations found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default StationDropdown;