import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrain, FaSearch, FaMapMarkerAlt, FaClock, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { trainService } from '../../services/trainService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { LIVE_STATUS } from '../../utils/constants';

const ManageLiveStatus = () => {
    const [trainNumber, setTrainNumber] = useState('');
    const [train, setTrain] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [statusForm, setStatusForm] = useState({
        currentStation: '',
        status: 'On Time',
        delayMinutes: 0,
        nextStation: '',
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trainNumber) return;

        setLoading(true);
        setTrain(null);
        setLiveStatus(null);

        try {
            const response = await trainService.getTrainByNumber(trainNumber);
            setTrain(response.data);
            if (response.data.liveStatus) {
                setLiveStatus(response.data.liveStatus);
                setStatusForm({
                    currentStation: response.data.liveStatus.currentStation,
                    status: response.data.liveStatus.status,
                    delayMinutes: response.data.liveStatus.delayMinutes,
                    nextStation: response.data.liveStatus.nextStation,
                });
            }
        } catch (error) {
            alert('Train not found');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const currentStationObj = train.stations.find(
                (s) => s.name === statusForm.currentStation
            );

            const updateData = {
                ...statusForm,
                currentStationCode: currentStationObj?.stationCode || 'UNK',
            };

            await trainService.updateLiveStatus(trainNumber, updateData);
            const response = await trainService.getTrainByNumber(trainNumber);
            setLiveStatus(response.data.liveStatus);
            alert('Live status updated successfully');
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-2xl">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-600" /> Manage Live Status
                </h1>

                <Card className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Enter Train Number"
                                value={trainNumber}
                                onChange={(e) => setTrainNumber(e.target.value)}
                                required
                                className="pl-10"
                                icon={<FaSearch className="text-gray-400" />}
                            />
                        </div>
                        <Button type="submit" loading={loading}>
                            Search
                        </Button>
                    </form>
                </Card>

                {train && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold">{train.trainName}</h2>
                                    <p className="text-gray-600">Train #{train.trainNumber}</p>
                                </div>
                                {liveStatus && <Badge status={liveStatus.status} type="status" />}
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Station
                                    </label>
                                    <select
                                        value={statusForm.currentStation}
                                        onChange={(e) =>
                                            setStatusForm({ ...statusForm, currentStation: e.target.value })
                                        }
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select Station</option>
                                        {train.stations.map((station) => (
                                            <option key={station._id} value={station.name}>
                                                {station.name} ({station.stationCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={statusForm.status}
                                        onChange={(e) =>
                                            setStatusForm({ ...statusForm, status: e.target.value })
                                        }
                                        className="input-field"
                                    >
                                        {Object.values(LIVE_STATUS).map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Input
                                    label="Delay (in minutes)"
                                    type="number"
                                    value={statusForm.delayMinutes}
                                    onChange={(e) =>
                                        setStatusForm({ ...statusForm, delayMinutes: parseInt(e.target.value) })
                                    }
                                />

                                <Button type="submit" loading={updating} className="w-full">
                                    Update Status
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ManageLiveStatus;
