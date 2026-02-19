import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const stored = localStorage.getItem('user');
        if (!stored) {
            return null;
        }
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700">
                                <User size={22} />
                            </span>
                            Account profile
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Review your account details and keep your contact information up to date.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-semibold text-gray-900">{user.name || 'Unnamed user'}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mt-2 capitalize">
                                    {user.role || 'user'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Email
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                    <Mail size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-800 break-all">{user.email}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Phone
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                    <Phone size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-800">
                                        {user.phone || 'Not added yet'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Location
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                    <MapPin size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-800">
                                        {user.address || user.location || 'Not added yet'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Member since
                                </p>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                                    <ShieldCheck size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-800">
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleDateString()
                                            : 'Recently joined'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
                            These details are used to help farmers and buyers contact each other and to improve delivery accuracy.
                        </div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 text-sm"
                    >
                        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Account status
                        </p>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-800">
                            <ShieldCheck size={18} />
                            <div>
                                <p className="text-sm font-semibold">Secure and active</p>
                                <p className="text-xs text-emerald-900/80">
                                    Your AgriLink account is protected. Keep your login details private.
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            For any changes to your core account details, such as email or role, contact platform support or your local AgriLink administrator.
                        </p>
                    </Motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
