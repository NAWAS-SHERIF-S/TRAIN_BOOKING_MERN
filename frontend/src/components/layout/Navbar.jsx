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
    FaTimes,
    FaSearch
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
        <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                            <FaTrain className="text-white text-xl" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">RailBook</span>
                            <div className="text-xs text-slate-500 font-medium">Professional Booking</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-slate-600 hover:text-primary-600 font-medium transition-all duration-200 flex items-center px-4 py-2 rounded-xl hover:bg-primary-50"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated() ? (
                            <div className="relative ml-4">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 text-slate-700 hover:text-primary-600 font-medium focus:outline-none px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                        <FaUser className="text-sm" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-semibold">{user?.name?.split(' ')[0]}</div>
                                        <div className="text-xs text-slate-500">{user?.role}</div>
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 backdrop-blur-md"
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
                            <div className="flex items-center gap-3 ml-4">
                                <Link to="/login">
                                    <Button variant="secondary" size="sm" className="font-semibold">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm" className="font-semibold shadow-lg">
                                        Get Started
                                    </Button>
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
