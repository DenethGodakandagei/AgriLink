import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, RefreshCw, Package } from 'lucide-react';
import api from '../../../api/axios';

const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatus] = useState('all');

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

    const getStatusColor = (status) =>
        STATUS_COLORS[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-800';

    const capitalize = (s) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                    <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
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
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
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
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                                                    {order.customer?.charAt(0) ?? '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{order.customer}</p>
                                                    <p className="text-xs text-gray-400">{order.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.items} item{order.items !== 1 ? 's' : ''}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            LKR {Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {capitalize(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                                            {order.payment ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer count */}
                    <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
                        Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
