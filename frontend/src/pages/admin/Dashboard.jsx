import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTrain, FaTicketAlt, FaUsers, FaMoneyBillWave, FaEdit, FaMapMarkerAlt, FaList, FaUser, FaEnvelope } from 'react-icons/fa';
import Card from '../../components/common/Card';
import api from '../../services/api';

const Dashboard = () => {
    const stats = [
        { title: 'Total Trains', value: '8', icon: <FaTrain />, color: 'bg-blue-500' },
        { title: 'Total Bookings', value: '156', icon: <FaTicketAlt />, color: 'bg-green-500' },
        { title: 'Active Users', value: '1,234', icon: <FaUsers />, color: 'bg-purple-500' },
        { title: 'Revenue', value: '₹2.5L', icon: <FaMoneyBillWave />, color: 'bg-yellow-500' },
    ];

    const quickActions = [
        { title: 'Manage Trains', link: '/admin/trains', icon: <FaTrain />, description: 'Add, edit, or remove trains' },
        { title: 'Update Live Status', link: '/admin/live-status', icon: <FaMapMarkerAlt />, description: 'Update current location and delays' },
        { title: 'View Bookings', link: '/admin/bookings', icon: <FaList />, description: 'View all system bookings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1 font-medium">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h2>
                        <div className="grid gap-4">
                            {quickActions.map((action, index) => (
                                <Link key={index} to={action.link} className="block group">
                                    <Card className="flex items-center p-4 group-hover:border-primary-500 transition-colors">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-primary-600 text-xl group-hover:bg-primary-50 transition-all">
                                            {action.icon}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{action.title}</h3>
                                            <p className="text-gray-500 text-sm">{action.description}</p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <UsersSection />
                </div>
            </div>
        </div>
    );
};

const UsersSection = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Fetch from auth endpoint since user routes are disabled
            const response = await api.get('/auth/users');
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback - show mock data
            setUsers([
                { _id: '1', name: 'Admin User', email: 'admin@trainbooking.com', role: 'admin', createdAt: new Date() },
                { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: new Date() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Users</h2>
            <Card>
                {loading ? (
                    <div className="text-center py-4">Loading users...</div>
                ) : (
                    <div className="space-y-3">
                        {users.slice(0, 5).map((user) => (
                            <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <FaUser className="text-primary-600" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <FaEnvelope className="mr-1" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="text-center py-4 text-gray-500">No users found</div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
