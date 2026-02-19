import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Package, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const PAY_STATUS_COLORS = {
    paid: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [notification, setNotification] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/seller-orders');
            setOrders(data);
            setFiltered(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Apply search + status filter whenever deps change
    useEffect(() => {
        let result = orders;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (o) =>
                    String(o.id).includes(q) ||
                    o.customer?.toLowerCase().includes(q) ||
                    o.email?.toLowerCase().includes(q) ||
                    o.city?.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter((o) => o.status === statusFilter);
        }

        setFiltered(result);
    }, [search, statusFilter, orders]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });

            // Update local state
            const updatedOrders = orders.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            );
            setOrders(updatedOrders);

            showNotification('success', `Order #${orderId} status updated to ${newStatus}`);
        } catch (err) {
            console.error(err);
            showNotification('error', 'Failed to update order status');
        } finally {
            setUpdatingId(null);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const getStatusColor = (status) =>
        STATUS_COLORS[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-800 border-gray-200';

    const capitalize = (s) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';

    return (
        <div className="relative">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <Motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-medium ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {notification.message}
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                    <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center transition-all hover:shadow-md">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by order ID, customer, city…"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatus(e.target.value)}
                            className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                    <RefreshCw size={32} className="animate-spin text-emerald-500" />
                    <p className="text-sm">Loading orders…</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-12 flex flex-col items-center justify-center gap-3 text-red-500">
                    <AlertCircle size={32} />
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                    <Package size={40} className="text-gray-300" />
                    <p className="font-medium text-gray-500">No orders found</p>
                    <p className="text-sm">
                        {orders.length === 0
                            ? 'You have no orders yet. Orders will appear here once customers purchase your products.'
                            : 'No orders match your current filters.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Items</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Payment Method</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Payment Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm">
                                                    {order.customer?.charAt(0) ?? '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{order.customer}</p>
                                                    <p className="text-xs text-gray-400">{order.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                                {order.items} item{order.items !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            LKR {Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group/status w-40">
                                                <select
                                                    disabled={updatingId === order.id}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className={`appearance-none w-full pl-3 pr-8 py-1.5 rounded-full text-xs font-medium border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500/30 transition-all ${getStatusColor(order.status)} ${updatingId === order.id ? 'opacity-50 cursor-not-allowed' : 'hover:border-opacity-50'}`}
                                                >
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {updatingId === order.id ? (
                                                        <RefreshCw size={12} className="animate-spin text-gray-500" />
                                                    ) : (
                                                        <ChevronDown size={12} className="text-current opacity-60" />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                                            <div className="flex items-center gap-2">
                                                {/* Simple icon mapping based on payment method */}
                                                <span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {order.payment ?? '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAY_STATUS_COLORS[order.payment_status?.toLowerCase()] ?? 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {capitalize(order.payment_status ?? 'pending')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer count */}
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex justify-between">
                        <span>Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
