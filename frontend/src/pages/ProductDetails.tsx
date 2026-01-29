import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../context/FavoriteContext';
import { Star, ShoppingBag, Heart, Check, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    _id: string; // Handle both id formats if necessary, backend usually returns _id but mapped to id sometimes
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    sizes: { size: string; stock: number }[];
    colors: { name: string; hex: string }[];
    rating: number;
    review_count: number;
    category_id: { name: string; slug: string };
}

interface Review {
    _id: string;
    user_id: { name: string };
    rating: number;
    comment: string;
    created_at: string;
}

const ProductDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { toggleFavorite, favorites } = useFavorite();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [reviews, setReviews] = useState<Review[]>([]);

    // Review Form State
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    useEffect(() => {
        if (product) {
            fetchReviews();
            // Set defaults
            if (product.sizes?.length > 0) setSelectedSize(product.sizes[0].size);
            if (product.colors?.length > 0) setSelectedColor(product.colors[0].name);
        }
    }, [product]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${slug}`);
            if (res.data.success) {
                setProduct(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!product) return;
        try {
            const res = await api.get(`/reviews/${product._id || product.id}`);
            if (res.data.success) {
                setReviews(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        // Validation
        const sizeObj = product.sizes.find(s => s.size === selectedSize);
        if (sizeObj && sizeObj.stock <= 0) {
            toast.error('Selected size is out of stock');
            return;
        }

        await addToCart(product._id || product.id, 1, selectedSize, selectedColor);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        if (!isAuthenticated) return toast.error('Please login to write a review');

        setSubmittingReview(true);
        try {
            await api.post(`/reviews/${product._id || product.id}`, {
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success('Review submitted successfully');
            setReviewComment('');
            fetchReviews(); // Refresh reviews
            fetchProduct(); // Refresh product for new rating
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const isFavorite = product ? favorites.some(fav => fav.product_id === (product._id || product.id) || (fav.products && fav.products._id === (product._id || product.id))) : false;

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-400 mb-8">
                <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Home</span>
                <ChevronRight size={16} className="mx-2" />
                <span className="text-white">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                        {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                        )}
                    </div>
                    {/* Thumbnails could go here */}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={20} fill={star <= product.rating ? "currentColor" : "none"} className={star <= product.rating ? "" : "text-gray-600"} />
                            ))}
                        </div>
                        <span className="text-gray-400">({product.review_count} reviews)</span>
                    </div>

                    <div className="flex items-end gap-4 mb-8">
                        {product.sale_price ? (
                            <>
                                <span className="text-3xl font-bold text-primary">₹{product.sale_price}</span>
                                <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-white">₹{product.price}</span>
                        )}
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    {/* Selectors */}
                    <div className="space-y-6 mb-8">
                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Color: <span className="text-white">{selectedColor}</span></label>
                            <div className="flex gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color.name ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    >
                                        {selectedColor === color.name && <Check size={16} className={['White', '#ffffff', '#fff'].includes(color.hex.toLowerCase()) ? 'text-black' : 'text-white'} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Size: <span className="text-white">{selectedSize}</span></label>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((sizeObj) => (
                                    <button
                                        key={sizeObj.size}
                                        onClick={() => setSelectedSize(sizeObj.size)}
                                        disabled={sizeObj.stock <= 0}
                                        className={`px-4 py-2 rounded-lg border font-medium transition-all
                                            ${selectedSize === sizeObj.size
                                                ? 'bg-white text-black border-white'
                                                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}
                                            ${sizeObj.stock <= 0 ? 'opacity-50 cursor-not-allowed line-through' : ''}
                                        `}
                                    >
                                        {sizeObj.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <ShoppingBag size={24} />
                            Add to Cart
                        </button>
                        <button
                            onClick={() => toggleFavorite(product._id || product.id)}
                            className={`p-4 rounded-xl border transition-colors ${isFavorite ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-gray-700 text-gray-400 hover:text-white hover:border-white'}`}
                        >
                            <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 border-t border-gray-800 pt-12">
                <h2 className="text-2xl font-bold text-white mb-8">Customer Reviews</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Write Review */}
                    <div className="bg-surface rounded-xl p-6 border border-gray-800 h-fit">
                        <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
                        {isAuthenticated ? (
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="text-yellow-500 hover:scale-110 transition-transform"
                                            >
                                                <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} className={star <= reviewRating ? "" : "text-gray-600"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-400 mb-2">Your Review</label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-32 resize-none"
                                        placeholder="Tell us what you think about this product..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">Please login to write a review</p>
                                <button onClick={() => navigate('/login')} className="text-primary hover:underline">Login Now</button>
                            </div>
                        )}
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="bg-surface p-6 rounded-xl border border-gray-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="font-semibold text-white">{review.user_id?.name || 'Anonymous'}</div>
                                            <div className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-300">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-10 bg-surface rounded-xl border border-gray-800 border-dashed">
                                No reviews yet. Be the first to review!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
