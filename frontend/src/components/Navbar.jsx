import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tractor, LogOut, User, Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/useCart';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../config/translations';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    // Pages that have a dark hero section where navbar should be transparent initially
    const isHeroPage = ['/', '/orders', '/marketplace', '/saved'].includes(location.pathname);

    const [isScrolled, setIsScrolled] = useState(false);
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
    const { language, switchLanguage } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { to: '/marketplace', label: 'Marketplace' },
        ...(user ? [
            { to: '/orders', label: 'Orders' },
            { to: '/saved', label: 'Saved' },
        ] : []),
    ];

    const isTransparent = isHeroPage && !isScrolled;

    return (
        <nav className="sticky top-0 z-50 bg-transparent">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`mt-4 mb-4 flex justify-between h-16 sm:h-20 items-center rounded-xl px-4 sm:px-6 transition-all duration-300 ${isTransparent
                        ? 'backdrop-blur-md text-white border border-white/10 bg-white/5'
                        : 'bg-white border border-gray-200 shadow-sm'
                        }`}
                >

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <span
                            className={`text-xl font-bold font-outfit tracking-tight ${isTransparent ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            AGRILINK.
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${isTransparent
                                    ? isActive(to)
                                        ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                    : isActive(to)
                                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                                        : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={() => switchLanguage(language === 'en' ? 'si' : 'en')}
                            className={`hidden sm:flex items-center justify-center p-2 h-9 min-w-[36px] rounded-lg font-semibold text-xs tracking-wide transition-all border shadow-sm ${isTransparent
                                ? 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700'
                                }`}
                        >
                            {t.languageBtn}
                        </button>
                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className={`relative p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
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
                                    className={`flex items-center gap-2 pl-4 border-l focus:outline-none ${isTransparent ? 'border-white/30' : 'border-gray-100'
                                        }`}
                                >
                                    <div
                                        className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm border-2 flex-shrink-0 ${isTransparent
                                            ? 'bg-white/10 text-white border-white/40'
                                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            }`}
                                    >
                                        {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span
                                            className={`text-sm font-semibold ${isTransparent ? 'text-white' : 'text-gray-900'
                                                }`}
                                        >
                                            {user.name}
                                        </span>
                                        <span
                                            className={`text-xs capitalize ${isTransparent ? 'text-white/70' : 'text-gray-400'
                                                }`}
                                        >
                                            {user.role || 'User'}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 ${isTransparent ? 'text-white/80' : 'text-gray-400'
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
                                            {dashboardLink && (
                                                <Link
                                                    to={dashboardLink.to}
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Tractor size={15} />
                                                    {dashboardLink.label}
                                                </Link>
                                            )}
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
                                    className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${isTransparent
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
                                    className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${isTransparent
                                        ? 'bg-white text-emerald-950 hover:bg-emerald-50'
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
                            className={`md:hidden p-1 transition-colors ${isTransparent ? 'text-white hover:text-emerald-200' : 'text-gray-500 hover:text-emerald-600'
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
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden shadow-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {/* Mobile Language Toggle */}
                            <div className="flex items-center justify-between px-3 py-2 mb-2">
                                <span className="text-sm font-medium text-gray-500">Language</span>
                                <button
                                    onClick={() => switchLanguage(language === 'en' ? 'si' : 'en')}
                                    className="flex items-center justify-center px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-emerald-700 bg-emerald-50"
                                >
                                    {language === 'en' ? 'English' : 'සිංහල'}
                                </button>
                            </div>
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

                            {/* NOTE: Mobile menu background is always white, so we don't use isTransparent here for the content logic, 
                                except maybe for uniformity, but better to keep it clean. 
                                The previous code had conditional styling `isHome ?` for mobile menu items but the container was `bg-white`?
                                Wait, original code line 261: `bg-white`. 
                                But line 270 used `isHome`.
                                `isHome` was used to determine if the text was white?
                                BUT the container is `bg-white` (line 261).
                                So white text on white bg?
                                Let's check original code.
                                Line 261: `bg-white`.
                                Line 270: `isHome ? ... 'bg-white text-emerald-700' : 'text-white/85...'`
                                Wait, if `isHome` is true, 
                                    if active: `bg-white text-emerald-700`.
                                    if not active: `text-white/85`.
                                    But container is `bg-white`. 
                                    So `text-white/85` on `bg-white` is invisible.
                                    The original code might have had a bug or `isHome` meant something else for mobile.
                                    
                                Actually, checking original code:
                                `className="md:hidden border-t border-gray-100 bg-white overflow-hidden"`
                                So mobile menu IS white.
                                Then why did it checks `isHome` for link colors?
                                `isHome ? ... 'text-white/85'`
                                This looks like a BUG in the original code or I am misreading.
                                
                                Ah, wait. `isHome` logic was:
                                ` isHome ? isActive ? ... : 'text-white/85' `
                                This suggests the mobile menu intended to be transparent/dark too? 
                                But the container says `bg-white`.
                                
                                I will fix this to be always readable (Dark text on White bg) for Mobile Menu, as it slides down.
                            */}

                            {user ? (
                                <div className="border-t border-gray-100 pt-3 mt-3">
                                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                        <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-100 text-emerald-700">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-center px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors text-gray-700 border-gray-200 hover:bg-gray-50"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-white bg-emerald-600 hover:bg-emerald-700"
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
