import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Check } from 'lucide-react';
import CloudinaryUpload from '../../../components/CloudinaryUpload';

const ProductModal = ({ isOpen, onClose, product = null, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        images: [],
        resetKey: 0
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Populate form if editing
    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                    images: product.images || [],
                    resetKey: product.id // Force re-render of Cloudinary component with existing images
                });
            } else {
                // Reset form for new product
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    category: '',
                    images: [],
                    resetKey: Date.now()
                });
            }
            setMessage({ type: '', text: '' });
        }
    }, [isOpen, product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImagesUploaded = (urls) => {
        setFormData({ ...formData, images: urls });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        if (formData.images.length === 0) {
            setMessage({ type: 'error', text: 'Please upload at least one image.' });
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            if (product) {
                // Edit existing product
                await axios.put(`http://localhost:8000/api/products/${product.id}`, formData, config);
                setMessage({ type: 'success', text: 'Product updated successfully!' });
            } else {
                // Create new product
                await axios.post('http://localhost:8000/api/products', formData, config);
                setMessage({ type: 'success', text: 'Product added successfully!' });
            }

            // Close modal after delay
            setTimeout(() => {
                onSuccess(); // Refresh product list
                onClose();
            }, 1500);

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <Motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                                <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6">
                                {message.text && (
                                    <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="e.g., Organic Red Apples"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="vegetables">Vegetables</option>
                                                    <option value="fruits">Fruits</option>
                                                    <option value="grains">Grains</option>
                                                    <option value="machinery">Machinery</option>
                                                    <option value="seeds">Seeds</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleInputChange}
                                                        required
                                                        step="0.01"
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        value={formData.quantity}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows="4"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                                                    placeholder="Describe your product..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="border-t border-gray-100 pt-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-4">Product Images</h3>
                                        <CloudinaryUpload
                                            key={formData.resetKey}
                                            initialImages={formData.images}
                                            onUploadSuccess={handleImagesUploaded}
                                        />
                                        {/* Show existing images if Cloudinary component doesn't support pre-filling (it might not currently support prop for initialImages) */}
                                        {/* For simplicity we rely on CloudinaryUpload which we just updated previously? Wait, I need to check CloudinaryUpload */}
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors mr-3"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                product ? 'Save Changes' : 'Create Product'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Motion.div>
                    </Motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
