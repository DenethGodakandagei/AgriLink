
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Leaf, Users, Star, ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const fetchProducts = async (url = 'http://localhost:8000/api/products') => {
        try {
            setLoading(true);
            const response = await axios.get(url);

            if (url === 'http://localhost:8000/api/products') {
                setProducts(response.data.data || response.data);
            } else {
                setProducts(prev => [...prev, ...(response.data.data || response.data)]);
            }

            setNextPageUrl(response.data.next_page_url);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const trustLogos = ['Chase', 'John Deere', 'Leader', 'Kubota', 'Gleaner'];

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative min-h-screen w-full overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/21393/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Bright green crop fields under sky"
                    className="absolute inset-0 h-full w-full object-cover blur-sm"
                />
                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />

                    <div className="flex-1 flex">
                        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-end w-full pb-12">
                            <div className="max-w-xl space-y-6">
                               

                                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-semibold leading-tight text-white">
                                    Smart Farming for Future
                                    <span className="block italic text-lime-100">
                                        Generations
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base text-slate-100/90 max-w-md">
                                    Send, receive, and track your finances in one secure platform built for speed, clarity, and everyday financial control.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-1">
                                    <button className="inline-flex items-center justify-center rounded-full bg-lime-400 px-6 sm:px-7 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-lime-400/40 hover:bg-lime-300 transition-colors">
                                        Start Investing
                                        <ArrowRight size={16} className="ml-2" />
                                    </button>
                                    <button className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-6 sm:px-7 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                                        Meet the Farmers
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-white/20 pt-4 flex items-center gap-4 text-xs sm:text-sm text-slate-100/85">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase">
                                        Scroll
                                    </span>
                                </div>
                                <div className="ml-auto flex items-center gap-6">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={14} className="text-amber-300" />
                                        <span>4.9</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1">
                                            <span className="h-7 w-7 rounded-full bg-white/35 border border-white/50" />
                                            <span className="h-7 w-7 rounded-full bg-white/35 border border-white/50" />
                                            <span className="h-7 w-7 rounded-full bg-white/35 border border-white/50" />
                                        </div>
                                        <span>10k+ Farmers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <main className="max-w-8xl mx-auto px-4 sm:px-6 ">
                <section className="rounded-3xl bg-emerald-50  px-6 sm:px-10 py-10 sm:py-12">
                    <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700 mb-5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Our platform
                    </p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-emerald-950 max-w-4xl">
                        Our platform is built to support farmers and buyers by delivering
                        practical tools that connect both sides and improve productivity.
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-3xl">
                        AgriLink brings producers, markets, and logistics together in one place so fresh
                        products move faster, waste is reduced, and everyone has clearer visibility into each season.
                    </p>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 items-start">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            About AgriLink
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-semibold text-emerald-950">
                            Smart Farming Solutions
                            <span className="block italic font-normal text-emerald-700">
                                Real Results for Farms and Markets
                            </span>
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 max-w-xl">
                            Our marketplace links farmers and buyers in one trusted space for fair prices and steady demand.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-start justify-between rounded-2xl bg-gray-50 px-4 py-3 border border-gray-100">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        Proven farm productivity
                                    </p>
                                    <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                                        Reach more buyers, cut middlemen, and keep harvests moving.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start justify-between rounded-2xl bg-white px-4 py-3 border border-emerald-100 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                                        AI
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Intelligent crop optimization
                                        </p>
                                        <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                                            Use market and weather data to choose crops and timing for better prices.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start justify-between rounded-2xl bg-gray-50 px-4 py-3 border border-gray-100">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        Seamless buyer integration
                                    </p>
                                    <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                                        Buyers source directly from farms, track orders, and build strong partnerships.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="overflow-hidden rounded-3xl border border-emerald-100 shadow-md bg-emerald-900/5">
                            <img
                                src="https://images.pexels.com/photos/1268101/pexels-photo-1268101.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="Farmers discussing crops in a field"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        Trusted by thousands of growers and agribusinesses
                    </p>
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-sm text-gray-400">
                        {trustLogos.map((logo) => (
                            <span key={logo} className="font-medium tracking-wide">
                                {logo}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 items-start">
                    <div className="hidden lg:block">
                        <div className="sticky top-28">
                            <FilterSidebar />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Live marketplace listings
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Discover fresh produce, feed, and supplies available right now from verified farmers.
                                </p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400">
                                {products.length > 0 ? `${products.length} active listings` : 'No active listings yet'}
                            </p>
                        </div>

                        <Motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {loading && products.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500 py-10">
                                    Loading products...
                                </p>
                            ) : products.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500 py-10">
                                    No products found.
                                </p>
                            ) : (
                                products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            )}
                        </Motion.div>

                        {nextPageUrl && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => fetchProducts(nextPageUrl)}
                                    disabled={loading}
                                    className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 text-sm"
                                >
                                    {loading ? 'Loading...' : 'Load more products'}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
