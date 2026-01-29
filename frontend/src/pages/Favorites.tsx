import React, { useEffect } from 'react';
import { useFavorite } from '../context/FavoriteContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { favorites, fetchFavorites, toggleFavorite } = useFavorite();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleAddToCart = async (product: any) => {
        // Logic from Home page to add default variant
        if (product.sizes && product.sizes.length > 0 && product.sizes[0].stock > 0) {
            const defaultSize = product.sizes[0].size;
            const defaultColor = product.colors?.[0]?.name || 'Blue';
            await addToCart(product._id, 1, defaultSize, defaultColor);
        } else {
            // Fallback or specific error handling
            console.log("Out of stock or invalid structure");
        }
    };

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <Heart size={64} className="mb-4 text-gray-600" />
                <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                <p className="mb-6">Start browsing to add items to your wishlist.</p>
                <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((item) => (
                    <div key={item._id} className="bg-surface rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-colors group">
                        <div className="relative aspect-square bg-gray-900">
                            <img
                                src={item.products?.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
                                alt={item.products?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                onClick={() => toggleFavorite(item.product_id)}
                                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-red-500 hover:bg-black/70 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <Link to={`/product/${item.products?.slug}`} className="block">
                                <h3 className="font-semibold text-white mb-1 truncate">{item.products?.name || 'Unavailable'}</h3>
                            </Link>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-primary">₹{item.products?.sale_price || item.products?.price}</span>
                                <button
                                    onClick={() => handleAddToCart(item.products)}
                                    className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    title="Add to Cart"
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
