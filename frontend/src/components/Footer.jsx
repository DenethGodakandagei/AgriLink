import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-16 bg-transparent">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1600"
                        alt="Green farm landscape at sunset"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-emerald-900/10" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    <div className="max-w-xl mx-auto text-center mb-12 sm:mb-16">
                        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-100/80 mb-3">
                            AgriLink Support
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-outfit font-semibold text-white mb-3">
                            Make farming smarter, stronger, and simpler
                        </h2>
                        <p className="text-sm sm:text-base text-emerald-50/90">
                            Straightforward tools and support to help you make confident decisions for your farm every season.
                        </p>
                        <button className="mt-6 inline-flex items-center justify-center px-6 sm:px-8 py-2.5 rounded-full text-sm font-semibold bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-300 transition-colors">
                            Contact Us
                        </button>
                    </div>

                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-emerald-900/20 border border-white/60">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-8 py-10 sm:px-10 sm:py-12">
                            <div className="space-y-4 md:col-span-1">
                                <div className="inline-flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                                        A
                                    </div>
                                    <span className="text-lg font-bold text-emerald-900 font-outfit">
                                        AgriLink
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    AgriLink connects farmers, buyers, and agribusinesses with smarter tools for better yields and fairer markets.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Mail size={16} className="text-emerald-600" />
                                    <a href="mailto:hello@agrilink.com" className="hover:text-emerald-700">
                                        hello@agrilink.com
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Quick Links
                                </h3>
                                <div className="space-y-2">
                                    <Link to="/" className="block text-gray-600 hover:text-emerald-700">
                                        Home
                                    </Link>
                                    <Link to="/buyer-dashboard" className="block text-gray-600 hover:text-emerald-700">
                                        Dashboard
                                    </Link>
                                    <Link to="/orders" className="block text-gray-600 hover:text-emerald-700">
                                        Orders
                                    </Link>
                                    <Link to="/profile" className="block text-gray-600 hover:text-emerald-700">
                                        Profile
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Services
                                </h3>
                                <div className="space-y-2">
                                    <span className="block text-gray-600">
                                        Smart crop monitoring
                                    </span>
                                    <span className="block text-gray-600">
                                        Direct farmer marketplace
                                    </span>
                                    <span className="block text-gray-600">
                                        Price transparency tools
                                    </span>
                                    <span className="block text-gray-600">
                                        Logistics coordination
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Company
                                </h3>
                                <div className="space-y-2">
                                    <span className="block text-gray-600">
                                        About
                                    </span>
                                    <span className="block text-gray-600">
                                        Help & FAQ
                                    </span>
                                    <span className="block text-gray-600">
                                        Emergency support
                                    </span>
                                </div>
                                <div className="pt-3">
                                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-2">
                                        Social
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button className="h-8 w-8 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors">
                                            <Linkedin size={16} />
                                        </button>
                                        <button className="h-8 w-8 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors">
                                            <Facebook size={16} />
                                        </button>
                                        <button className="h-8 w-8 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors">
                                            <Instagram size={16} />
                                        </button>
                                        <button className="h-8 w-8 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition-colors">
                                            <Twitter size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-emerald-50 px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                            <p>© {new Date().getFullYear()} AgriLink. All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <button className="hover:text-emerald-600">
                                    Terms of Service
                                </button>
                                <button className="hover:text-emerald-600">
                                    Privacy Policy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;

