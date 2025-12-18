import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';
import { stationService } from '../services/stationService';

const StationDropdown = ({ 
    label, 
    value, 
    onChange, 
    required = false,
    className = '',
    placeholder = 'Select station'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        try {
            setLoading(true);
            const stationMap = await stationService.getAllStations();
            const stationList = Array.from(stationMap.entries()).map(([code, name]) => ({
                code,
                name,
                display: `${name} (${code})`
            }));
            console.log(`Loaded ${stationList.length} stations in dropdown`);
            setStations(stationList);
        } catch (error) {
            console.error('Error loading stations:', error);
            setStations([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredStations = (() => {
        if (!searchTerm) return [];
        
        const searchTermLower = searchTerm.toLowerCase();
        const codeMatches = [];
        const nameMatches = [];
        
        stations.forEach(station => {
            const codeLower = station.code.toLowerCase();
            const nameLower = station.name.toLowerCase();
            
            if (codeLower.startsWith(searchTermLower)) {
                codeMatches.push(station);
            } else if (codeLower.includes(searchTermLower)) {
                codeMatches.push(station);
            } else if (nameLower.includes(searchTermLower)) {
                nameMatches.push(station);
            }
        });
        
        // Return code matches first, then name matches
        return [...codeMatches, ...nameMatches].slice(0, 50);
    })();

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
                        {value || placeholder}
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
                        
                        <div className="max-h-80 overflow-y-auto">
                            {loading && (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                    Loading stations...
                                </div>
                            )}
                            
                            {!loading && searchTerm.length === 0 && (
                                <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                    <div>Type station name or code</div>
                                    <div className="mt-1 text-xs">{stations.length} stations available</div>
                                </div>
                            )}
                            
                            {!loading && searchTerm.length > 0 && searchTerm.length < 2 && (
                                <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                    Type at least 2 characters
                                </div>
                            )}
                            
                            {!loading && searchTerm.length > 0 && filteredStations.length === 0 && (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                    No stations found for "{searchTerm}"
                                </div>
                            )}
                            
                            {!loading && filteredStations.map((station) => (
                                <button
                                    key={station.code}
                                    type="button"
                                    onClick={() => handleSelect(station)}
                                    className="w-full px-4 py-3 text-left hover:bg-primary-50 focus:bg-primary-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="font-medium text-gray-900">{station.name}</div>
                                    <div className="text-sm text-gray-500">Code: {station.code}</div>
                                </button>
                            ))}
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