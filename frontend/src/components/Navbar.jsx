
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tractor, LogOut, User, Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    const [user, setUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { toggleCart, cartItems } = useCart();

    // Read auth state from localStorage
    const readAuth = () => {
        try {
            const stored = localStorage.getItem('user');
            setUser(stored ? JSON.parse(stored) : null);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        readAuth();
        // Listen for login/logout events from other tabs or same page
        window.addEventListener('storage', readAuth);
        window.addEventListener('auth-change', readAuth);
        return () => {
            window.removeEventListener('storage', readAuth);
            window.removeEventListener('auth-change', readAuth);
        };
    }, []);

    // Re-read on route change (handles same-tab login redirect)
    useEffect(() => {
        readAuth();
        setMobileOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setDropdownOpen(false);
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return null;
        if (user.role === 'farmer') return { to: '/seller-dashboard', label: 'Dashboard' };
        if (user.role === 'buyer') return { to: '/buyer-dashboard', label: 'Dashboard' };
        return null;
    };

    const dashboardLink = getDashboardLink();

    const navLinks = [
        { to: '/', label: 'Home' },
        ...(dashboardLink ? [dashboardLink] : []),
        ...(user ? [
            { to: '/orders', label: 'Orders' },
            { to: '/saved', label: 'Saved' },
        ] : []),
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="bg-emerald-500 p-2 rounded-lg text-white group-hover:bg-emerald-600 transition-colors">
                            <Tractor size={22} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 font-outfit tracking-tight">AgriLink</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`text-sm font-medium transition-colors border-b-2 py-1 ${isActive(to)
                                    ? 'text-emerald-600 border-emerald-600'
                                    : 'text-gray-500 border-transparent hover:text-emerald-600'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ShoppingCart size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        {user ? (
                            /* ── Logged-in: avatar + dropdown ── */
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 pl-4 border-l border-gray-100 focus:outline-none"
                                >
                                    <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border-2 border-emerald-200 flex-shrink-0">
                                        {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                        <span className="text-xs text-gray-400 capitalize">{user.role || 'User'}</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden"
                                        >
                                            <div className="px-4 py-2 border-b border-gray-50">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User size={15} />
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={15} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* ── Logged-out: Login + Register buttons ── */
                            <div className="hidden md:flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive('/login')
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-gray-500 hover:text-emerald-600 p-1 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(to)
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            {user ? (
                                <>
                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-center px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                                    >
                                        Get Started
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
