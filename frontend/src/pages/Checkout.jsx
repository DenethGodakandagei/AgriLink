
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, CheckCircle, ArrowLeft, ShieldCheck, Banknote, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// ─── Load Stripe outside of component render ─────────────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ─── Card Element Styling ─────────────────────────────────────────────────────
const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#1f2937',
            fontFamily: '"Outfit", sans-serif',
            '::placeholder': { color: '#9ca3af' },
        },
        invalid: { color: '#ef4444' },
    },
    hidePostalCode: true,
};

// ─── Inner Checkout Form (needs Stripe hooks) ────────────────────────────────
const CheckoutForm = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [payStatus, setPayStatus] = useState(''); // 'success' | 'failed'

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'cod',
    });

    const handleInputChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePaymentMethodChange = (method) =>
        setFormData({ ...formData, paymentMethod: method });

    // ── COD order (existing flow) ────────────────────────────────────────────
    const placeCodOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const payload = {
            items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
            shipping_address: formData.address,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            zip: formData.zip,
            payment_method: 'cod',
        };

        await axios.post('http://localhost:8000/api/orders', payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setPayStatus('success');
        setStep(3);
        clearCart();
    };

    // ── Card order via Stripe ─────────────────────────────────────────────────
    const placeCardOrder = async () => {
        if (!stripe || !elements) throw new Error('Stripe not loaded');

        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        // 1. Create PaymentIntent + pending order on backend
        const { data } = await axios.post(
            'http://localhost:8000/api/stripe/payment-intent',
            {
                items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
                shipping_address: formData.address,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                zip: formData.zip,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const { client_secret } = data;

        // 2. Confirm the card payment on Stripe
        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                },
            },
        });

        if (stripeError) {
            throw new Error(stripeError.message);
        }

        if (paymentIntent.status === 'succeeded') {
            setPayStatus('success');
        } else {
            setPayStatus('failed');
        }

        setStep(3);
        clearCart();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.paymentMethod === 'card') {
                await placeCardOrder();
            } else {
                await placeCodOrder();
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Empty cart guard ────────────────────────────────────────────────────
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
                    /* ── Confirmation Screen ── */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                    >
                        {payStatus === 'success' ? (
                            <>
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    {formData.paymentMethod === 'card'
                                        ? 'Your payment was successful! Your order is being processed and will be shipped soon.'
                                        : 'Thank you for your order! Pay when you receive the items.'}
                                </p>
                                {formData.paymentMethod === 'card' && (
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
                                        <ShieldCheck size={16} />
                                        Payment secured by Stripe
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                                    <XCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Your payment could not be processed. Please try again or choose a different payment method.
                                </p>
                            </>
                        )}

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
                                View Orders
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
                                                type="text" name="firstName" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.firstName} onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                type="text" name="lastName" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.lastName} onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email" name="email" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.email} onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel" name="phone" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.phone} onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                            <input
                                                type="text" name="address" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.address} onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                type="text" name="city" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.city} onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                            <input
                                                type="text" name="zip" required
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                value={formData.zip} onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-emerald-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {/* ── Card Option ── */}
                                        <div
                                            onClick={() => handlePaymentMethodChange('card')}
                                            className={`border rounded-xl p-4 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-300' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'card' ? 'border-emerald-600' : 'border-gray-300'}`}>
                                                        {formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                                                    </div>
                                                    <span className="font-medium text-gray-900">Credit / Debit Card</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* Visa / MC icons */}
                                                    <span className="px-2 py-0.5 text-xs font-bold border border-gray-200 rounded text-blue-700 bg-white">VISA</span>
                                                    <span className="px-2 py-0.5 text-xs font-bold border border-gray-200 rounded text-red-600 bg-white">MC</span>
                                                    <span className="px-2 py-0.5 text-xs font-bold border border-gray-200 rounded text-blue-500 bg-white">AMEX</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Stripe Card Element ── */}
                                        {formData.paymentMethod === 'card' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="ml-0 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <ShieldCheck size={16} className="text-emerald-600" />
                                                    <span className="text-xs text-gray-500">Your card details are encrypted and secured by Stripe.</span>
                                                </div>
                                                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                                                    <CardElement options={cardElementOptions} />
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    Test card: <code className="bg-gray-100 px-1 rounded">4242 4242 4242 4242</code> · any future date · any CVC
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* ── COD Option ── */}
                                        <div
                                            onClick={() => handlePaymentMethodChange('cod')}
                                            className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-300' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-emerald-600' : 'border-gray-300'}`}>
                                                    {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
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
                                                        return 'https://placehold.co/100';
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
                                        {formData.paymentMethod === 'card'
                                            ? 'Your card details are encrypted and securely processed by Stripe.'
                                            : 'Place your order now securely. You will pay when you receive the items.'}
                                    </p>
                                </div>

                                <button
                                    form="checkout-form"
                                    type="submit"
                                    disabled={loading || (formData.paymentMethod === 'card' && !stripe)}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <>
                                            {formData.paymentMethod === 'card' ? 'Pay Now' : 'Place Order'}
                                            {formData.paymentMethod === 'card' ? <CreditCard size={20} /> : <Truck size={20} />}
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

// ─── Outer Checkout wraps CheckoutForm with <Elements> provider ───────────────
const Checkout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default Checkout;
