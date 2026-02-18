import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowLeft, ShoppingCart, Share2, Heart, Star, MapPin, User, Tag, ShieldCheck, Loader2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id}`);
                console.log("Fetched Product Data:", response.data);
                setProduct(response.data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Product not found.</h2>
                <p className="text-gray-500 mb-6">{error || "The product you're looking for might have been removed."}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    // Process images safely
    let images = [];
    if (typeof product.images === 'string') {
        try {
            images = JSON.parse(product.images);
        } catch (e) {
            images = [product.images]; // Fallback if regular string
        }
    } else if (Array.isArray(product.images)) {
        images = product.images;
    }

    // Ensure we have at least one image or placeholder
    if (!images || images.length === 0) {
        images = ["https://placehold.co/600x400?text=No+Image"];
    }

    return (
        <div className="min-h-screen bg-gray-50 font-outfit">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-6 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to products</span>
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
                        {/* Image Gallery */}
                        <div className="p-6 lg:p-8 bg-gray-50/50">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100 bg-white"
                            >
                                <img
                                    src={images[activeImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </motion.div>

                            {images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === index ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-6 lg:p-8 lg:pr-12 flex flex-col h-full">
                            <div className="mb-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <Tag size={12} />
                                        {product.category || 'General'}
                                    </span>
                                    {product.quantity > 0 ? (
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Stock</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                                    )}
                                </div>

                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-display"
                                >
                                    {product.name}
                                </motion.h1>

                                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 border-b border-gray-100 pb-6">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-gray-900">4.8</span>
                                        <span className="text-gray-400">(124 reviews)</span>
                                    </div>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{product.location || product.user?.address || 'Location not specified'}</span>
                                    </div>
                                </div>

                                <div className="flex items-end gap-3 mb-8">
                                    <div className="text-4xl font-bold text-emerald-600">${(Number(product.price) || 0).toFixed(2)}</div>
                                    <span className="text-gray-400 font-medium mb-1.5 text-lg">/ {product.unit || 'Unit'}</span>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl border-2 border-white shadow-sm">
                                            {product.user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 flex items-center gap-2">
                                                {product.user?.name || 'Seller'}
                                                <span className="text-xs bg-blue-100 text-blue-700 p-0.5 px-1.5 rounded-md flex items-center gap-0.5">
                                                    <ShieldCheck size={10} />
                                                    Verified
                                                </span>
                                            </p>
                                            <p className="text-xs text-emerald-600 font-medium">Member since {new Date(product.user?.created_at || Date.now()).getFullYear()}</p>
                                        </div>
                                        <button className="ml-auto text-sm text-gray-500 font-medium hover:text-emerald-600 transition-colors">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-1 text-gray-500 hover:bg-white hover:shadow-sm rounded transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="font-bold text-gray-900 w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                        className="p-1 text-gray-500 hover:bg-white hover:shadow-sm rounded transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => addToCart(product, quantity)}
                                    disabled={product.quantity < 1}
                                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart size={20} />
                                    {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;
