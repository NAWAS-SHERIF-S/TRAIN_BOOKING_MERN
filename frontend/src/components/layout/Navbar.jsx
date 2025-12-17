import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    FaTrain,
    FaUser,
    FaSignOutAlt,
    FaTicketAlt,
    FaChartLine,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Navbar = () => {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
        setShowUserMenu(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Search Trains', path: '/search', icon: <FaSearch className="mr-2" /> },
        { name: 'PNR Status', path: '/pnr-status', icon: <FaTicketAlt className="mr-2" /> },
    ];

    if (isAuthenticated()) {
        navLinks.push({
            name: 'My Bookings',
            path: '/bookings',
            icon: <FaTicketAlt className="mr-2" />
        });
    }

    if (isAdmin()) {
        navLinks.push({
            name: 'Admin Dashboard',
            path: '/admin',
            icon: <FaChartLine className="mr-2" />
        });
    }

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <FaTrain className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-bold text-primary-900">RailBook</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated() ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                        <FaUser />
                                    </div>
                                    <span>{user?.name?.split(' ')[0]}</span>
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/bookings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <FaTicketAlt className="mr-2" /> My Bookings
                                            </Link>
                                            {isAdmin() && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <FaChartLine className="mr-2" /> Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                            >
                                                <FaSignOutAlt className="mr-2" /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="outline" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-primary-600 focus:outline-none"
                        >
                            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="block text-gray-600 hover:text-primary-600 font-medium flex items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.icon}
                                    <span className="ml-2">{link.name}</span>
                                </Link>
                            ))}

                            {isAuthenticated() ? (
                                <>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left text-red-600 font-medium flex items-center"
                                        >
                                            <FaSignOutAlt className="mr-2" /> Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
