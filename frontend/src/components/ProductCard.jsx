
import React from 'react';
import {
    Heart,
    MapPin,
    ShieldCheck,
    User,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
        >
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    {product.verified && (
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-emerald-700 flex items-center gap-1 shadow-sm border border-emerald-100">
                            <ShieldCheck size={12} className="fill-emerald-500 text-white" />
                            VERIFIED FARMER
                        </span>
                    )}
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200">
                    <Heart size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-outfit font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {product.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wide 
            ${product.category === 'Vegetables' ? 'bg-green-100 text-green-700' :
                            product.category === 'Fruits' ? 'bg-orange-100 text-orange-700' :
                                product.category === 'Legumes' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-yellow-100 text-yellow-700'}`}>
                        {product.category}
                    </span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <User size={14} className="mr-2 text-gray-400" />
                        <span className="font-medium text-gray-700">Farmer:</span>
                        <span className="ml-1 text-gray-600 line-clamp-1">{product.farmer}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        <span className="line-clamp-1">{product.location}</span>
                    </div>
                </div>

                <div className="flex items-end justify-between border-t border-gray-50 pt-4 mt-auto">
                    <div>
                        <span className="text-xs text-gray-400 uppercase font-semibold">Price per {product.unit}</span>
                        <div className="text-emerald-600 font-bold text-xl font-outfit">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-200 flex items-center gap-1 group-hover:gap-2 duration-300">
                        View Details
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto duration-200" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
