import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import { Star, Filter, ShoppingBag, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    sale_price?: number;
    images: string[];
    description: string;
    sizes: { size: string; stock: number }[];
    colors: { name: string; hex: string }[];
    category_id: { name: string; slug: string };
    rating: number;
}

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleFavorite, favorites } = useFavorite();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            if (res.data.success) {
                setProducts(res.data.data.products);
            }
        } catch (error) {
            console.error('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product: Product) => {
        if (product.sizes.length > 0 && product.sizes[0].stock > 0) {
            // Use first available size and color
            const defaultSize = product.sizes[0].size;
            const defaultColor = product.colors?.[0]?.name || 'Blue';
            await addToCart(product.id, 1, defaultSize, defaultColor);
        } else {
            toast.error('Out of stock');
        }
    };

    const isFavorite = (productId: string) => {
        return favorites.some(fav => fav.product_id === productId || (fav.products && fav.products._id === productId));
    };

    if (loading) return <div className="flex justify-center p-20 text-white">Loading products...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Featured Collection</h1>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <Filter size={20} /> Filter
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-surface rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-all group">
                        <div className="relative aspect-square bg-gray-900 overflow-hidden">
                            <Link to={`/product/${product.slug}`}>
                                {product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                )}
                            </Link>
                            {product.sale_price && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">Sale</span>
                            )}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleFavorite(product.id);
                                }}
                                className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isFavorite(product.id) ? 'bg-red-500/20 text-red-500' : 'bg-black/30 text-white hover:bg-black/50'}`}
                            >
                                <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-primary font-medium mb-1 uppercase tracking-wide">{product.category_id?.name || 'Category'}</p>
                                    <Link to={`/product/${product.slug}`}>
                                        <h3 className="text-lg font-semibold text-white leading-tight mb-1 truncate hover:text-primary transition-colors">{product.name}</h3>
                                    </Link>
                                </div>
                                <div className="flex items-center bg-gray-800 px-1.5 py-0.5 rounded text-xs text-yellow-400">
                                    <Star size={12} fill="currentColor" /> <span className="ml-1">{product.rating || '4.5'}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{product.description}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    {product.sale_price ? (
                                        <>
                                            <span className="text-lg font-bold text-white">₹{product.sale_price}</span>
                                            <span className="text-sm text-gray-500 line-through ml-2">₹{product.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-white">₹{product.price}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-primary hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                                    title="Add to Cart"
                                >
                                    <ShoppingBag size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
