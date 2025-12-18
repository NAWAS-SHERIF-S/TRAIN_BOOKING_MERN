import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrain, FaInfoCircle, FaList, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { trainService } from '../../services/trainService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { TRAIN_TYPES, TRAIN_CLASSES, RUNNING_DAYS } from '../../utils/constants';

const AddEditTrain = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        trainNumber: '',
        trainName: '',
        trainType: 'Express',
        runningDays: [],
        classes: [],
        pricing: {
            SL: 195,
            '3A': 695,
            '2A': 1075,
            '1A': 1675,
            CC: 695,
            '2S': 195,
        },
        stations: [
            { name: '', stationCode: '', arrivalTime: '--', departureTime: '', platform: '', distance: 0 },
        ],
    });

    useEffect(() => {
        if (isEditMode) {
            fetchTrain();
        }
    }, [id]);

    const fetchTrain = async () => {
        try {
            const response = await trainService.getTrainById(id);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching train:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const list = prev[field];
            if (checked) {
                return { ...prev, [field]: [...list, value] };
            } else {
                return { ...prev, [field]: list.filter((item) => item !== value) };
            }
        });
    };

    const handleStationChange = (index, field, value) => {
        const newStations = [...formData.stations];
        newStations[index][field] = value;
        setFormData((prev) => ({ ...prev, stations: newStations }));
    };

    const addStation = () => {
        setFormData((prev) => ({
            ...prev,
            stations: [
                ...prev.stations,
                { name: '', stationCode: '', arrivalTime: '', departureTime: '', platform: '', distance: 0 },
            ],
        }));
    };

    const removeStation = (index) => {
        const newStations = formData.stations.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, stations: newStations }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditMode) {
                await trainService.updateTrain(id, formData);
                alert('Train updated successfully');
            } else {
                await trainService.createTrain(formData);
                alert('Train created successfully');
            }
            navigate('/admin/trains');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to save train');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <FaTrain className="text-primary-600" /> {isEditMode ? 'Edit Train' : 'Add New Train'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaInfoCircle className="text-gray-400" /> Basic Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Train Number"
                                name="trainNumber"
                                value={formData.trainNumber}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Train Name"
                                name="trainName"
                                value={formData.trainName}
                                onChange={handleChange}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Train Type</label>
                                <select
                                    name="trainType"
                                    value={formData.trainType}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    {TRAIN_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Running Days</label>
                            <div className="flex flex-wrap gap-4">
                                {RUNNING_DAYS.map((day) => (
                                    <label key={day} className="flex items-center space-x-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            value={day}
                                            checked={formData.runningDays.includes(day)}
                                            onChange={(e) => handleCheckboxChange(e, 'runningDays')}
                                            className="form-checkbox h-4 w-4 text-primary-600 rounded"
                                        />
                                        <span>{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Classes</label>
                            <div className="flex flex-wrap gap-4">
                                {TRAIN_CLASSES.map((cls) => (
                                    <label key={cls.value} className="flex items-center space-x-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            value={cls.value}
                                            checked={formData.classes.includes(cls.value)}
                                            onChange={(e) => handleCheckboxChange(e, 'classes')}
                                            className="form-checkbox h-4 w-4 text-primary-600 rounded"
                                        />
                                        <span>{cls.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Base Pricing (₹)</label>
                            <div className="grid md:grid-cols-3 gap-4">
                                {TRAIN_CLASSES.map((cls) => (
                                    <div key={cls.value}>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">{cls.label}</label>
                                        <input
                                            type="number"
                                            value={formData.pricing[cls.value]}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                pricing: {
                                                    ...prev.pricing,
                                                    [cls.value]: parseInt(e.target.value) || 0
                                                }
                                            }))}
                                            className="input-field"
                                            min="0"
                                            step="10"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Base prices per passenger. Final fare will be calculated based on distance.</p>
                        </div>
                    </Card>

                    <Card className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FaList className="text-gray-400" /> Stations & Schedule
                            </h2>
                            <Button type="button" onClick={addStation} size="sm" className="flex items-center gap-2">
                                <FaPlus /> Add Station
                            </Button>
                        </div>

                        {formData.stations.map((station, index) => (
                            <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">Station {index + 1}</h3>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStation(index)}
                                            className="text-red-600 text-sm hover:text-red-800 flex items-center gap-1 font-medium"
                                        >
                                            <FaTrash className="text-xs" /> Remove
                                        </button>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Input
                                        label="Station Name"
                                        value={station.name}
                                        onChange={(e) => handleStationChange(index, 'name', e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Station Code"
                                        value={station.stationCode}
                                        onChange={(e) => handleStationChange(index, 'stationCode', e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Distance (km)"
                                        type="number"
                                        value={station.distance}
                                        onChange={(e) => handleStationChange(index, 'distance', e.target.value)}
                                    />
                                    <Input
                                        label="Arrival Time"
                                        type="time"
                                        value={station.arrivalTime === '--' ? '' : station.arrivalTime}
                                        onChange={(e) => handleStationChange(index, 'arrivalTime', e.target.value)}
                                    />
                                    <Input
                                        label="Departure Time"
                                        type="time"
                                        value={station.departureTime}
                                        onChange={(e) => handleStationChange(index, 'departureTime', e.target.value)}
                                    />
                                    <Input
                                        label="Platform"
                                        value={station.platform}
                                        onChange={(e) => handleStationChange(index, 'platform', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/admin/trains')}
                            className="flex items-center gap-2"
                        >
                            <FaTimes /> Cancel
                        </Button>
                        <Button type="submit" loading={saving} className="flex items-center gap-2">
                            <FaSave /> {isEditMode ? 'Update Train' : 'Create Train'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditTrain;
