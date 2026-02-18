
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, CheckCircle, ArrowLeft, ShieldCheck, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Input, 3: Confirmation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'cod' // Default to COD
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodChange = (method) => {
        setFormData({ ...formData, paymentMethod: method });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // If not logged in, maybe redirect to login or show error
                navigate('/login');
                return;
            }

            const payload = {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                })),
                shipping_address: formData.address, // Combine if needed
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                zip: formData.zip,
                payment_method: formData.paymentMethod
            };

            await axios.post('http://localhost:8000/api/orders', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setStep(3);
            clearCart();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-gray-50 font-outfit">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Add some products to proceed to checkout.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-outfit">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    {step !== 3 && (
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-4 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back</span>
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                {step === 3 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate('/buyer-dashboard')}
                                className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                View Order
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-7 space-y-6">

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
                                    {error}
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handleSubmit}>
                                {/* Shipping Details */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="text-emerald-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Preview */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-emerald-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Card Option (Disabled visual for now or enabled if you want) */}
                                        <div
                                            onClick={() => handlePaymentMethodChange('card')}
                                            className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${formData.paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'card' ? 'border-emerald-600' : 'border-gray-300'}`}>
                                                    {formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
                                                </div>
                                                <span className="font-medium text-gray-900">Credit / Debit Card</span>
                                            </div>
                                            <div className="flex gap-2 text-gray-400">
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>

                                        {/* Card Details - Show only if card selected */}
                                        {formData.paymentMethod === 'card' && (
                                            <div className="grid grid-cols-2 gap-4 pl-8 mb-4">
                                                <div className="col-span-2">
                                                    <input
                                                        disabled
                                                        type="text"
                                                        placeholder="Card Number (Disabled for Demo)"
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* COD Option */}
                                        <div
                                            onClick={() => handlePaymentMethodChange('cod')}
                                            className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-emerald-600' : 'border-gray-300'}`}>
                                                    {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Banknote size={20} className="text-gray-600" />
                                                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-5">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={(() => {
                                                        let img = item.images;
                                                        if (Array.isArray(img) && img.length > 0) return img[0];
                                                        if (typeof img === 'string') {
                                                            try {
                                                                const parsed = JSON.parse(img);
                                                                return Array.isArray(parsed) ? parsed[0] : parsed;
                                                            } catch { return img; }
                                                        }
                                                        return "https://placehold.co/100";
                                                    })()}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-emerald-600 font-medium">${Number(item.price).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 bg-emerald-50 p-4 rounded-xl mb-6">
                                    <ShieldCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                                    <p className="text-xs text-emerald-800">
                                        Place your order now securely. You will pay when you receive the items.
                                    </p>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            Place Order
                                            <Truck size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Checkout;
