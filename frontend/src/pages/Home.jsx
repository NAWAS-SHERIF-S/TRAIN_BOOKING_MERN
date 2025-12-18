import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaTrain, FaTicketAlt, FaClock, FaRoute, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import Button from '../components/common/Button';

const Home = () => {
    const navigate = useNavigate();

    const quickActions = [
        {
            icon: <FaTicketAlt />,
            title: 'PNR Status',
            description: 'Check your booking status',
            link: '/pnr-status',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: <FaMapMarkerAlt />,
            title: 'Live Train Status',
            description: 'Track trains in real-time',
            link: '/search',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: <FaRoute />,
            title: 'My Bookings',
            description: 'View booking history',
            link: '/bookings',
            color: 'from-purple-500 to-purple-600'
        }
    ];

    const features = [
        {
            icon: <FaShieldAlt />,
            title: 'Secure Booking',
            description: 'Bank-grade security for all transactions'
        },
        {
            icon: <FaClock />,
            title: 'Real-time Updates',
            description: 'Live train status and delay notifications'
        },
        {
            icon: <FaHeadset />,
            title: '24/7 Support',
            description: 'Round-the-clock customer assistance'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                <div className="relative container-custom py-24 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
                            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
                            <span className="text-white/90 font-medium">India's Most Trusted Railway Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
                            Book Train Tickets
                            <span className="block bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                                Like a Pro
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Experience seamless train bookings with real-time tracking, smart seat selection, and instant confirmations
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/search">
                                <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all">
                                    Start Booking Now
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Quick Actions</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Access essential railway services instantly</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group"
                            >
                                <Link to={action.link} className="block">
                                    <div className="card-elevated text-center hover:shadow-2xl transition-all duration-300">
                                        <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                            {action.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-900">{action.title}</h3>
                                        <p className="text-slate-600">{action.description}</p>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <span className="text-sm text-primary-600 font-semibold group-hover:text-primary-700">Access Now →</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose RailBook</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">Trusted by millions for reliable and secure train bookings</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100 transition-all duration-300"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                <div className="relative container-custom section-padding text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to Start Your Journey?</h2>
                        <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join over 10 million travelers who trust RailBook for seamless train bookings
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link to="/register">
                                <Button size="lg" className="px-10 py-4 text-lg font-bold bg-accent-500 hover:bg-accent-600 shadow-2xl">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-12 flex justify-center items-center gap-8 text-primary-200">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">10M+</div>
                                <div className="text-sm">Happy Users</div>
                            </div>
                            <div className="w-px h-12 bg-primary-400"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">99.9%</div>
                                <div className="text-sm">Uptime</div>
                            </div>
                            <div className="w-px h-12 bg-primary-400"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">24/7</div>
                                <div className="text-sm">Support</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8">
                <div className="container-custom text-center">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-slate-300">For any queries, contact us at:</p>
                        <a href="mailto:nawassherif525@gmail.com" className="text-primary-400 hover:text-primary-300 font-semibold">
                            nawassherif525@gmail.com
                        </a>
                    </div>
                    <div className="border-t border-slate-700 pt-4">
                        <p className="text-slate-400 text-sm">
                            © 2024 RailBook. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
