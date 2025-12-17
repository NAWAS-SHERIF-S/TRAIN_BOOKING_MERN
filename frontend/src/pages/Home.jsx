import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaTrain, FaMousePointer, FaMobileAlt } from 'react-icons/fa';
import Button from '../components/common/Button';

const Home = () => {
    const navigate = useNavigate();

    const popularRoutes = [
        { from: 'New Delhi', to: 'Mumbai', icon: <FaTrain /> },
        { from: 'Mumbai', to: 'Bangalore', icon: <FaTrain /> },
        { from: 'Delhi', to: 'Kolkata', icon: <FaTrain /> },
        { from: 'Chennai', to: 'Bangalore', icon: <FaTrain /> },
    ];

    const features = [
        {
            icon: <FaSearch />,
            title: 'Search Trains',
            description: 'Find trains between any two stations with real-time availability',
        },
        {
            icon: <FaMapMarkerAlt />,
            title: 'Live Tracking',
            description: 'Track your train in real-time with current location and delays',
        },
        {
            icon: <FaMousePointer />,
            title: 'Easy Booking',
            description: 'Book tickets in minutes with a simple and intuitive interface',
        },
        {
            icon: <FaMobileAlt />,
            title: 'Mobile Friendly',
            description: 'Access from anywhere on any device with our responsive design',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Book Train Tickets & Track Live Status
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100">
                            Your one-stop solution for train bookings and real-time tracking
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Popular Routes */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12">Popular Routes</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularRoutes.map((route, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5 }}
                                className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 cursor-pointer border-2 border-transparent hover:border-primary-600 transition-all"
                                onClick={() => navigate(`/search?from=${route.from}&to=${route.to}`)}
                            >
                                <div className="text-4xl mb-3 text-primary-600">{route.icon}</div>
                                <h3 className="font-semibold text-lg mb-1">{route.from}</h3>
                                <div className="flex items-center text-gray-600">
                                    <span className="text-sm">to</span>
                                    <span className="mx-2">→</span>
                                    <span className="font-semibold">{route.to}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="text-5xl mb-4 text-primary-600 flex justify-center">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Join thousands of travelers who trust us for their train bookings
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/search">
                            <Button variant="secondary" size="lg">
                                Search Trains
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                                Sign Up Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
