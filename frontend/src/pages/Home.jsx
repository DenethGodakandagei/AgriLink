
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
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/75 via-emerald-900/45 to-emerald-800/15" />

                <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />

                    <div className="flex-1 flex">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center w-full">
                            <div className="max-w-xl space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-50 backdrop-blur-sm">
                                    <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                        <Leaf size={14} />
                                    </span>
                                    <span>AgriLink platform</span>
                                </div>

                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-outfit font-semibold leading-tight text-white">
                                    Smart Farming for Future
                                    <span className="block font-serif italic text-lime-100">
                                        Generations
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base text-slate-100/90 max-w-md">
                                    Send, receive, and track your harvest in one secure place built for speed, clarity, and everyday control for your farm.
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

                            <div className="mt-10 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-100/85">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        <span className="h-7 w-7 rounded-full bg-white/35 border border-white/50" />
                                        <span className="h-7 w-7 rounded-full bg-white/35 border border-white/50" />
                                        <span className="h-7 w-7 rounded-full bg-white/35 border border-white/50" />
                                    </div>
                                    <span>Trusted by farmers across the region</span>
                                </div>
                                <span className="h-1 w-1 rounded-full bg-white/50" />
                                <div className="flex items-center gap-1.5">
                                    <Star size={14} className="text-amber-300" />
                                    <span>4.9 rating</span>
                                </div>
                                <span className="h-1 w-1 rounded-full bg-white/50" />
                                <div className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    <span>10k+ farmers connected</span>
                                </div>
                                <div className="ml-auto text-[11px] sm:text-xs tracking-[0.2em] uppercase">
                                    <span className="opacity-80">Scroll</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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
