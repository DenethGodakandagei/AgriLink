
import React from 'react';
import Navbar from '../components/Navbar';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
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
                // Initial load or refresh
                setProducts(response.data.data || response.data);
            } else {
                // Load more
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
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-gray-50 text-gray-900 placeholder-gray-400"
                                placeholder="Search for crops, farmers, or locations"
                            />
                        </div>
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200 hidden sm:block">
                            Search
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-colors sm:hidden">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar />
                    </div>

                    {/* Main Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-gray-600 font-medium">
                                Showing <span className="text-gray-900 font-bold">124</span> results for "All Crops"
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                                <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    Newest Listings
                                    <ArrowDownWideNarrow size={16} />
                                </button>
                            </div>
                        </div>

                        <Motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {loading && products.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500 py-10">Loading products...</p>
                            ) : products.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500 py-10">No products found.</p>
                            ) : (
                                <>
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </>
                            )}
                        </Motion.div>

                        {nextPageUrl && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => fetchProducts(nextPageUrl)}
                                    disabled={loading}
                                    className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Load More Products'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
