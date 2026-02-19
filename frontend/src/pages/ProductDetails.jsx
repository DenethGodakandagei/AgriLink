import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowLeft, ShoppingCart, Share2, Heart, Star, MapPin, User, Tag, ShieldCheck, Loader2, Plus, Minus } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useCart } from '../context/useCart';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState('');
    const [ratingInput, setRatingInput] = useState(5);
    const [commentInput, setCommentInput] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id}`);
                setProduct(response.data);
            } catch {
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);

        const fetchReviews = async () => {
            setReviewsLoading(true);
            setReviewsError('');
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id}/feedback`);
                setReviews(response.data.feedback || []);
                setAverageRating(response.data.average_rating || 0);
                setTotalReviews(response.data.total_reviews || 0);
            } catch {
                setReviewsError('Failed to load reviews.');
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setSubmittingReview(true);
        setReviewsError('');

        try {
            const response = await axios.post(
                `http://localhost:8000/api/products/${id}/feedback`,
                {
                    rating: ratingInput,
                    comment: commentInput,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const saved = response.data.feedback;

            setAverageRating(response.data.average_rating || 0);
            setTotalReviews(response.data.total_reviews || 0);

            setReviews((prev) => {
                const index = prev.findIndex((item) => item.id === saved.id);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = saved;
                    return updated;
                }
                return [saved, ...prev];
            });

            setCommentInput('');
        } catch (err) {
            setReviewsError(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

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

    let images = [];
    if (typeof product.images === 'string') {
        try {
            images = JSON.parse(product.images);
        } catch {
            images = [product.images];
        }
    } else if (Array.isArray(product.images)) {
        images = product.images;
    }

    if (!images || images.length === 0) {
        images = ['https://placehold.co/600x400?text=No+Image'];
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
                            <Motion.div
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
                            </Motion.div>

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

                                <Motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-display"
                                >
                                    {product.name}
                                </Motion.h1>

                                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 border-b border-gray-100 pb-6">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-gray-900">
                                            {averageRating ? averageRating.toFixed(1) : 'New'}
                                        </span>
                                        <span className="text-gray-400">
                                            {totalReviews > 0 ? `(${totalReviews} reviews)` : '(No reviews yet)'}
                                        </span>
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

                <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                                <p className="text-sm text-gray-500">
                                    Real feedback from buyers to build trust.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-gray-900">
                                        {averageRating ? averageRating.toFixed(1) : 'New'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {totalReviews > 0 ? `${totalReviews} review${totalReviews === 1 ? '' : 's'}` : 'No reviews yet'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {reviewsLoading && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                                <Loader2 size={16} className="animate-spin text-emerald-500" />
                                <span>Loading reviews...</span>
                            </div>
                        )}

                        {!reviewsLoading && reviewsError && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                {reviewsError}
                            </div>
                        )}

                        {!reviewsLoading && !reviewsError && reviews.length === 0 && (
                            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                                <p className="text-gray-700 font-medium mb-1">No reviews yet</p>
                                <p className="text-sm text-gray-500">
                                    Be the first to share your experience with this product.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                                            {review.user?.name ? review.user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {review.user?.name || 'Buyer'}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {review.created_at
                                                            ? new Date(review.created_at).toLocaleDateString()
                                                            : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            size={14}
                                                            className={
                                                                index < review.rating
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-200'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Leave a Review</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Share your experience to help the community make confident decisions.
                            </p>

                            {!currentUser && (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">
                                        Please sign in to leave a review.
                                    </p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full mt-2 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        Sign in to review
                                    </button>
                                </div>
                            )}

                            {currentUser && (
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Your rating</p>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                const value = index + 1;
                                                const active = value <= ratingInput;
                                                return (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => setRatingInput(value)}
                                                        className="p-1"
                                                    >
                                                        <Star
                                                            size={20}
                                                            className={
                                                                active
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-200'
                                                            }
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Your review
                                        </label>
                                        <textarea
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                            rows={4}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
                                            placeholder="How was the quality, freshness, and delivery experience?"
                                            required
                                        />
                                    </div>

                                    {reviewsError && (
                                        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                            {reviewsError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submittingReview && (
                                            <Loader2 size={16} className="animate-spin" />
                                        )}
                                        {submittingReview ? 'Submitting review...' : 'Submit review'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetails;
