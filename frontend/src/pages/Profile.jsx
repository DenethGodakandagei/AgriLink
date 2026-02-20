import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, MapPin, Phone, ShieldCheck, Calendar, Edit3, Camera } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../config/translations';
import api from '../api/axios';

const Profile = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language].profile;

    const [user, setUser] = useState(() => {
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
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(() => ({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
            });
        }
    }, [user, navigate]);

    const isValidSriLankaPhone = (phone) => {
        if (!phone) return true;
        const normalized = phone.replace(/\s+/g, '');
        return /^(0\d{9}|\+94\d{9})$/.test(normalized);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        if (!isValidSriLankaPhone(formData.phone)) {
            setError('Enter a valid Sri Lanka phone number (0XXXXXXXXX or +94XXXXXXXXX)');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                address: formData.address || null,
            };

            const response = await api.put('/me', payload);
            const updated = response.data;

            setUser(updated);
            localStorage.setItem('user', JSON.stringify(updated));
            window.dispatchEvent(new Event('auth-change'));
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className={`min-h-screen bg-slate-50 ${language === 'si' ? 'font-sinhala' : ''}`}>
            {/* Hero Section - Matching Home UI */}
            <section className="relative h-[40vh] sm:h-[50vh] w-full overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px]" />

                <div className="relative z-10 flex flex-col h-full">
                    <Navbar />

                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center px-4">
                            <Motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl sm:text-5xl font-semibold text-white tracking-tight"
                            >
                                {t.title}
                            </Motion.h1>
                            <Motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mt-4 text-slate-100 text-lg sm:text-xl font-light max-w-2xl mx-auto"
                            >
                                {t.subtitle}
                            </Motion.p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar / User Card */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4"
                    >
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                            <div className="relative h-32 bg-gradient-to-br from-lime-400 to-emerald-600">
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20 capitalize">
                                        {user.role || t.role}
                                    </span>
                                </div>
                            </div>
                            <div className="px-8 pb-8">
                                <div className="relative -mt-16 mb-6">
                                    <div className="h-32 w-32 rounded-[2rem] bg-white p-2 shadow-lg mx-auto">
                                        <div className="h-full w-full rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-4xl font-bold text-emerald-600 relative overflow-hidden group cursor-pointer">
                                            {user.name?.charAt(0).toUpperCase() || <User size={40} />}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="text-white" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-bold text-emerald-950">{user.name || t.unnamedUser}</h2>
                                    <p className="text-slate-500 font-medium">{user.email}</p>
                                    <div className="pt-4 flex justify-center gap-3">
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-lime-400 text-emerald-950 rounded-full text-sm font-semibold hover:bg-lime-300 transition-colors shadow-lg shadow-lime-400/40"
                                        >
                                            <Edit3 size={16} />
                                            {t.editProfile}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="mt-6 bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-950">{t.accountStatus}</h3>
                                    <p className="text-sm text-emerald-600 font-medium">{t.verifiedActive}</p>
                                </div>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Main Content Details */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8 space-y-6"
                    >
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-emerald-950">{t.personalInfo}</h3>
                                    <p className="text-slate-500 mt-1">{t.personalInfoDesc}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {editing ? (
                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                            {t.fullName || 'Full Name'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                            {t.email}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                            {t.phone}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                            {t.location}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            />
                                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                            {t.memberSince}
                                        </label>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : t.recentMember}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {saving ? (t.saving || 'Saving...') : (t.saveChanges || 'Save Changes')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData({
                                                    name: user.name || '',
                                                    email: user.email || '',
                                                    phone: user.phone || '',
                                                    address: user.address || '',
                                                });
                                                setError('');
                                            }}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            {t.cancel || 'Cancel'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                    <InfoItem
                                        icon={<Mail className="text-emerald-500" size={20} />}
                                        label={t.email}
                                        value={user.email}
                                    />
                                    <InfoItem
                                        icon={<Phone className="text-emerald-500" size={20} />}
                                        label={t.phone}
                                        value={user.phone || t.notProvided}
                                        isEmpty={!user.phone}
                                    />
                                    <InfoItem
                                        icon={<MapPin className="text-emerald-500" size={20} />}
                                        label={t.location}
                                        value={user.address || user.location || t.notProvided}
                                        isEmpty={!user.address && !user.location}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="text-emerald-500" size={20} />}
                                        label={t.memberSince}
                                        value={user.created_at ? new Date(user.created_at).toLocaleDateString() : t.recentMember}
                                    />
                                </div>
                            )}

                            {/* Additional Info / Bio Placeholder */}
                            <div className="mt-10 pt-10 border-t border-slate-100">
                                <h4 className="font-semibold text-emerald-950 mb-4">{t.bio}</h4>
                                <p className="text-slate-500 leading-relaxed">
                                    {t.bioDesc}
                                </p>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// Helper component for display consistent info items
const InfoItem = ({ icon, label, value, isEmpty }) => (
    <div className="group">
        <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${isEmpty ? 'bg-slate-50 text-slate-400' : 'bg-emerald-50 text-emerald-600'} transition-colors group-hover:bg-emerald-100`}>
                {icon}
            </div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{label}</span>
        </div>
        <div className={`pl-11 text-base font-medium ${isEmpty ? 'text-slate-400 italic' : 'text-slate-700'}`}>
            {value}
        </div>
    </div>
);

export default Profile;
