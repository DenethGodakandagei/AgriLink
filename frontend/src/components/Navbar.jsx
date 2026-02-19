
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tractor, LogOut, User, Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/useCart';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const isHome = location.pathname === '/';

    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { toggleCart, cartItems } = useCart();

    useEffect(() => {
        const handleAuthChange = () => {
            const storedUser = localStorage.getItem('user');
            const next = storedUser ? JSON.parse(storedUser) : null;
            setUser(next && (next.name || next.email || next.role) ? next : null);
        };

        const handleRouteChange = () => {
            setMobileOpen(false);
            setDropdownOpen(false);
        };

        window.addEventListener('storage', handleAuthChange);
        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

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
        <nav
            className={`sticky top-0 z-50 transition-colors ${
                isHome ? 'bg-transparent border-b border-transparent' : 'bg-white border-b border-gray-100 shadow-sm'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`flex justify-between h-20 items-center ${
                        isHome ? 'mt-4 rounded-full px-4 sm:px-6 bg-black/10 backdrop-blur-md border border-white/20 text-white' : ''
                    }`}
                >

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div
                            className={`p-2 rounded-lg text-white transition-colors ${
                                isHome ? 'bg-emerald-500/90 group-hover:bg-emerald-400' : 'bg-emerald-500 group-hover:bg-emerald-600'
                            }`}
                        >
                            <Tractor size={22} />
                        </div>
                        <span
                            className={`text-xl font-bold font-outfit tracking-tight ${
                                isHome ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            AgriLink
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                                    isHome
                                        ? isActive(to)
                                            ? 'bg-white text-emerald-700 shadow-sm'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                        : isActive(to)
                                            ? 'text-emerald-700 bg-emerald-50'
                                            : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
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
                            className={`relative p-2 rounded-full transition-colors ${
                                isHome ? 'text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                            }`}
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
                                    className={`flex items-center gap-2 pl-4 border-l focus:outline-none ${
                                        isHome ? 'border-white/30' : 'border-gray-100'
                                    }`}
                                >
                                    <div
                                        className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm border-2 flex-shrink-0 ${
                                            isHome
                                                ? 'bg-white/10 text-white border-white/40'
                                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        }`}
                                    >
                                        {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span
                                            className={`text-sm font-semibold ${
                                                isHome ? 'text-white' : 'text-gray-900'
                                            }`}
                                        >
                                            {user.name}
                                        </span>
                                        <span
                                            className={`text-xs capitalize ${
                                                isHome ? 'text-white/70' : 'text-gray-400'
                                            }`}
                                        >
                                            {user.role || 'User'}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${
                                            isHome ? 'text-white/80' : 'text-gray-400'
                                        } ${dropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <Motion.div
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
                                            </Motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* ── Logged-out: Login + Register buttons ── */
                            <div className="hidden md:flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                                        isHome
                                            ? 'text-white/90 hover:text-white hover:bg-white/10'
                                            : isActive('/login')
                                                ? 'text-emerald-700 bg-emerald-50'
                                                : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                                        isHome
                                            ? 'bg-white text-emerald-700 hover:bg-emerald-50'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200'
                                    }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`md:hidden p-1 transition-colors ${
                                isHome ? 'text-white hover:text-emerald-200' : 'text-gray-500 hover:text-emerald-600'
                            }`}
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
                    <Motion.div
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
                                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isHome
                                            ? isActive(to)
                                                ? 'bg-white text-emerald-700'
                                                : 'text-white/85 hover:bg-white/10'
                                            : isActive(to)
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            {user ? (
                                <>
                                    <div className={`border-t pt-3 mt-3 ${isHome ? 'border-white/15' : 'border-gray-100'}`}>
                                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                            <div
                                                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    isHome ? 'bg-white/10 text-white' : 'bg-emerald-100 text-emerald-700'
                                                }`}
                                            >
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        isHome ? 'text-white' : 'text-gray-900'
                                                    }`}
                                                >
                                                    {user.name}
                                                </p>
                                                <p
                                                    className={`text-xs ${
                                                        isHome ? 'text-white/70' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                isHome ? 'text-red-200 hover:bg-white/10' : 'text-red-600 hover:bg-red-50'
                                            }`}
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={`border-t pt-3 mt-3 space-y-2 ${isHome ? 'border-white/15' : 'border-gray-100'}`}>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className={`block text-center px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                                            isHome
                                                ? 'text-white border-white/40 hover:bg-white/10'
                                                : 'text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className={`block text-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            isHome
                                                ? 'text-emerald-700 bg-white hover:bg-emerald-50'
                                                : 'text-white bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
