
import React from 'react';
import Navbar from '../components/Navbar';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import { motion } from 'framer-motion';

const PRODUCTS = [
    {
        id: 1,
        title: "Organic Yellow Maize",
        category: "Grains",
        farmer: "Samuel Kipkorir",
        location: "Nakuru, Kenya",
        price: 450.00,
        unit: "Ton",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
        verified: true,
        rating: 5
    },
    {
        id: 2,
        title: "Premium White Potatoes",
        category: "Vegetables",
        farmer: "Maria G. Mendoza",
        location: "Ica, Peru",
        price: 32.50,
        unit: "50kg Bag",
        image: "https://images.unsplash.com/photo-1518977676651-71f646571817?auto=format&fit=crop&w=800&q=80",
        verified: true,
        rating: 4.8
    },
    {
        id: 3,
        title: "Bulk Brown Lentils",
        category: "Legumes",
        farmer: "David Miller",
        location: "Saskatchewan, Canada",
        price: 890.00,
        unit: "Ton",
        image: "https://images.unsplash.com/photo-1515543904379-3d757afe72e?auto=format&fit=crop&w=800&q=80",
        verified: true,
        rating: 4.9
    },
    {
        id: 4,
        title: "Cavendish Bananas",
        category: "Fruits",
        farmer: "Anita Ocampo",
        location: "Davao, Philippines",
        price: 14.20,
        unit: "Box (13kg)",
        image: "https://images.unsplash.com/photo-1571771896612-e8c4c9ee3a55?auto=format&fit=crop&w=800&q=80",
        verified: false,
        rating: 4.5
    },
    {
        id: 5,
        title: "Fresh Green Okra",
        category: "Vegetables",
        farmer: "Ebrahim S.",
        location: "Giza, Egypt",
        price: 1.80,
        unit: "Kg",
        image: "https://images.unsplash.com/photo-1466196230303-34a17b018b33?auto=format&fit=crop&w=800&q=80", // Generic green veg
        verified: true,
        rating: 4.7
    },
    {
        id: 6,
        title: "Red Vine Tomatoes",
        category: "Vegetables",
        farmer: "Luca Romano",
        location: "Sicily, Italy",
        price: 22.00,
        unit: "Crate",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
        verified: false,
        rating: 4.2
    }
];

const Home = () => {
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

                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {PRODUCTS.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
