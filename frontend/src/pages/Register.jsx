
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Tractor,
    ShoppingCart,
    User,
    MapPin,
    Lock,
    Eye,
    EyeOff,
    ChevronDown,
    ShieldCheck,
    Banknote,
    Headset,
    ArrowRight
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';

const Register = () => {
    const [role, setRole] = useState('farmer'); // 'farmer' or 'buyer'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phonePrefix: '+94',
        phoneNumber: '',
        location: '',
        password: '',
        agreeToTerms: false
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Prepare payload
        const payload = {
            name: formData.fullName,
            email: formData.email,
            phone: `${formData.phonePrefix}${formData.phoneNumber}`,
            address: formData.location,
            password: formData.password,
            password_confirmation: formData.password, // Send confirmation same as password
            role: role
        };

        try {
            const response = await api.post('/register', payload);
            console.log('Registration success:', response.data);

            // Store token and user
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('auth-change'));

            // Navigate to dashboard/home on success
            navigate('/');
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 font-outfit">Join the Agri Market</h1>
                    <p className="text-gray-500">Start your journey in the digital agricultural ecosystem</p>
                </div>

                {/* Main Card */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100"
                >
                    <div className="space-y-6">

                        {/* Role Toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setRole('farmer')}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'farmer'
                                        ? 'bg-white text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Tractor size={18} />
                                    <span>Farmer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('buyer')}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'buyer'
                                        ? 'bg-white text-emerald-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <ShoppingCart size={18} />
                                    <span>Buyer</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50/50"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50/50"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <div className="flex gap-3">
                                    <div className="relative w-24">
                                        <select
                                            name="phonePrefix"
                                            value={formData.phonePrefix}
                                            onChange={handleInputChange}
                                            className="block w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none bg-gray-50/50 text-gray-700"
                                        >
                                            <option value="+94">+94</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                    <div className="relative flex-1">
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50/50"
                                            placeholder="712 345 678"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <MapPin size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50/50"
                                        placeholder="Enter City or Region"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50/50"
                                        placeholder="Min. 8 characters"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        checked={formData.agreeToTerms}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-500">
                                        By creating an account, I agree to the <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 underline decoration-1 underline-offset-2">Terms of Service</a> and <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 underline decoration-1 underline-offset-2">Privacy Policy</a>.
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>

                            <div className="text-center mt-4 text-sm text-gray-500">
                                Already have an account? <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">Sign in</Link>
                            </div>
                        </form>
                    </div>
                </Motion.div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Secure Data</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                            <Banknote size={20} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Safe Escrow</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                            <Headset size={20} />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">24/7 Help</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
