import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrain, FaTicketAlt, FaUsers, FaMoneyBillWave, FaEdit, FaMapMarkerAlt, FaList } from 'react-icons/fa';
import Card from '../../components/common/Card';

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

                <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                        <Link key={index} to={action.link} className="block group">
                            <Card className="text-center h-full group-hover:border-primary-500 transition-colors">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 text-2xl group-hover:bg-primary-50 group-hover:scale-110 transition-all duration-300">
                                    {action.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">{action.title}</h3>
                                <p className="text-gray-500 text-sm">{action.description}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
