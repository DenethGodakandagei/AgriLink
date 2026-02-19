import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Bookmark, Sparkles } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Saved = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Heart className="text-emerald-500" size={26} />
                            Saved items
                        </h1>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Save your favorite crops and sellers to quickly find them later when you are ready to buy.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                            <Bookmark size={32} className="text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">No saved items yet</h2>
                        <p className="text-gray-500 mb-6 max-w-md">
                            Tap the heart icon on any product to keep it here. This is the perfect place to build your shortlist before placing an order.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-colors"
                        >
                            Browse marketplace
                        </Link>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-emerald-600 text-emerald-50 rounded-2xl p-8 space-y-6 shadow-lg shadow-emerald-300/40"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wide">
                            <Sparkles size={14} />
                            Tips
                        </div>
                        <div className="space-y-4 text-sm leading-relaxed">
                            <p className="font-semibold text-emerald-50">
                                Use saved items to compare prices and quality before you confirm a purchase.
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-emerald-50/90">
                                <li>Save seasonal crops you want to monitor.</li>
                                <li>Shortlist trusted farmers you buy from often.</li>
                                <li>Quickly re-order from your saved list when needed.</li>
                            </ul>
                        </div>
                    </Motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Saved;
