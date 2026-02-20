
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Leaf, Users, Star, ArrowRight, Plus, Minus } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [activeFeature, setActiveFeature] = useState(1);

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



    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative min-h-screen w-full overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="Bright green crop fields under sky"
                    className="absolute inset-0 h-full w-full object-cover b"
                />
                <div className="absolute inset-0 bg-black/5" />

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
                <section className="py-16 sm:py-20 px-6 sm:px-10">
                    <div className="max-w-8xl mx-auto">


                        <h2 className="text-3xl sm:text-5xl lg:text-5xl font leading-[1.1] tracking-tight text-emerald-950">
                            Our platform is built to support farmers and buyers
                            <span className="text-gray-400"> by delivering </span>
                            <span className="inline-block align-middle mx-1">
                                <img
                                    src="https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=300"
                                    alt="Technology"
                                    className="h-10 w-20 sm:h-12 sm:w-24 object-cover rounded-full border border-emerald-100"
                                />
                            </span>
                            <span className="text-gray-400"> practical tools that connect both sides and improve productivity.</span>
                        </h2>
                    </div>
                </section>

                <section className="grid ml-4 grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-start max-w-8xl mx-auto px-4 sm:px-6 mb-24">
                    <div className="space-y-8">
                        <div>

                            <h3 className="text-4xl sm:text-4xl  text-emerald-950 mb-2">
                                Smart Farming Solutions
                            </h3>
                            <p className="text-3xl sm:text-3xl font-light  text-emerald-800">
                                That Deliver Real Results
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    id: 0,
                                    title: 'Proven Farm Productivity',
                                    icon: <Leaf className="w-5 h-5 text-emerald-600" />,
                                    desc: 'Reach more buyers, cut middlemen, and keep harvests moving with our direct-to-market tools.'
                                },
                                {
                                    id: 1,
                                    title: 'Intelligent Crop Optimization',
                                    icon: <Users className="w-5 h-5 text-emerald-600" />,
                                    desc: 'Our AI-powered system analyzes market trends and weather patterns to recommend the most effective actions automatically.'
                                },
                                {
                                    id: 2,
                                    title: 'Seamless System Integration',
                                    icon: <Star className="w-5 h-5 text-emerald-600" />,
                                    desc: 'Connect your existing farm management software directly to our marketplace for real-time inventory updates.'
                                }
                            ].map((feature) => (
                                <div
                                    key={feature.id}
                                    onClick={() => setActiveFeature(feature.id)}
                                    className={`cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden ${activeFeature === feature.id
                                        ? 'bg-white shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-100'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {activeFeature === feature.id && (
                                                <div className="bg-emerald-100 p-2 rounded-full">
                                                    {feature.icon}
                                                </div>
                                            )}
                                            <span className={`font-semibold ${activeFeature === feature.id ? 'text-emerald-950' : 'text-gray-600'}`}>
                                                {feature.title}
                                            </span>
                                        </div>
                                        <button className="text-emerald-600">
                                            {activeFeature === feature.id ? <Minus size={20} /> : <Plus size={20} />}
                                        </button>
                                    </div>

                                    <Motion.div
                                        initial={false}
                                        animate={{ height: activeFeature === feature.id ? 'auto' : 0, opacity: activeFeature === feature.id ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 pl-[4.5rem]">
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </Motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-full min-h-[500px] w-full rounded-[2.5rem] overflow-hidden group">
                        <img
                            src="https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Smart Farming"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <p className="text-lg font-medium max-w-sm backdrop-blur-md bg-white/10 p-4 rounded-2xl border border-white/20">
                                "Our intelligent agriculture solutions help farmers grow more with less by optimizing resources."
                            </p>
                        </div>
                    </div>
                </section>



                <section className="py-20 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-semibold tracking-widest uppercase text-emerald-900">Featured Produce</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-semibold text-emerald-950">
                                Fresh from the Harvest
                            </h2>
                        </div>
                        <a href="/products" className="group inline-flex items-center gap-2 font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                            View all products
                            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <Motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {loading && products.length === 0 ? (
                            <div className="col-span-full flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No featured products available at the moment.
                            </p>
                        ) : (
                            products.slice(0, 3).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </Motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
