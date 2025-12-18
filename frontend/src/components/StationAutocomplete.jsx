import { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { stationService } from '../services/stationService';

const StationAutocomplete = ({
    label,
    placeholder,
    value,
    onChange,
    required = false,
    className = ''
}) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [allStations, setAllStations] = useState([]);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        const stationMap = await stationService.getAllStations();
        const stationList = Array.from(stationMap.entries()).map(([code, name]) => ({
            code,
            name
        }));
        setAllStations(stationList);
    };

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);

        if (inputValue.length >= 2) {
            const searchTerm = inputValue.toLowerCase();
            const codeMatches = [];
            const nameMatches = [];
            
            allStations.forEach(station => {
                const codeLower = station.code.toLowerCase();
                const nameLower = station.name.toLowerCase();
                
                if (codeLower.startsWith(searchTerm)) {
                    codeMatches.push({ ...station, type: 'code' });
                } else if (codeLower.includes(searchTerm)) {
                    codeMatches.push({ ...station, type: 'code' });
                } else if (nameLower.includes(searchTerm)) {
                    nameMatches.push({ ...station, type: 'name' });
                }
            });
            
            const results = [...codeMatches, ...nameMatches].slice(0, 20);
            setSuggestions(results);
            setShowSuggestions(true);
            setSelectedIndex(-1);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        onChange(inputValue);
    };

    const handleSuggestionClick = (suggestion) => {
        const selectedValue = `${suggestion.name} (${suggestion.code})`;
        setQuery(selectedValue);
        onChange(selectedValue);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const clearInput = () => {
        setQuery('');
        onChange('');
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.focus();
    };

    const handleBlur = (e) => {
        // Delay hiding suggestions to allow click events
        setTimeout(() => {
            if (!suggestionsRef.current?.contains(e.relatedTarget)) {
                setShowSuggestions(false);
            }
        }, 150);
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    placeholder={placeholder}
                    required={required}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearInput}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="h-4 w-4" />
                    </button>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.code}-${index}`}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 ${index === selectedIndex ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{suggestion.name}</div>
                                    <div className="text-sm text-gray-500">
                                        Code: {suggestion.code}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 capitalize">
                                    {suggestion.type === 'code' ? 'By Code' : 'By Name'}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                    No stations found for "{query}"
                </div>
            )}
        </div>
    );
};

export default StationAutocomplete;