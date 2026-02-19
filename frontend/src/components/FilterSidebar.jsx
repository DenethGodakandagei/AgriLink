
import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Star,
    X,
    Filter
} from 'lucide-react';

const FilterSidebar = () => {
    const [categories, setCategories] = useState({
        'Grains & Cereals': true,
        'Vegetables': false,
        'Fruits': false,
        'Legumes': false,
    });

    return (
        <div className={`bg-white w-64 lg:w-72 border-r border-gray-100 p-6 h-[calc(100vh-80px)] overflow-y-auto sticky top-20 hidden lg:block`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 font-outfit">Filters</h2>
                <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">Reset All</button>
            </div>

            {/* Category */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between group cursor-pointer">
                    Category
                    <ChevronUp size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </h3>
                <div className="space-y-3">
                    {Object.entries(categories).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => setCategories({ ...categories, [key]: !value })}
                                    className="peer h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all checked:bg-emerald-500 checked:border-transparent"
                                />
                                <div className="absolute inset-0 bg-white border-2 border-gray-200 rounded peer-checked:border-emerald-500 peer-checked:bg-emerald-500 pointer-events-none transition-colors"></div>
                                <svg className="absolute w-3 h-3 text-white fill-current left-1 top-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20">
                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{key}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Region */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between group cursor-pointer">
                    Region
                    <ChevronUp size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </h3>
                <div className="relative">
                    <select className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg bg-gray-50 text-gray-600 appearance-none cursor-pointer hover:bg-white hover:border-emerald-200 transition-colors">
                        <option>All Regions</option>
                        <option>North Rift</option>
                        <option>Central</option>
                        <option>Coast</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Price */}
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between group cursor-pointer">
                    Price per Unit ($)
                    <ChevronUp size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Min"
                            className="block w-full pl-3 pr-3 py-2 text-sm border-gray-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Max"
                            className="block w-full pl-3 pr-3 py-2 text-sm border-gray-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Rating */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between group cursor-pointer">
                    Farmer Rating
                    <ChevronUp size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </h3>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                        <label key={stars} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="rating" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" defaultChecked={stars === 4} />
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < stars ? "currentColor" : "none"} className={i >= stars ? "text-gray-300" : ""} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">& Up</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
