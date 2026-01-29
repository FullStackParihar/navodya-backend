import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartItem {
    _id: string;
    products: {
        _id: string;
        name: string;
        price: number;
        sale_price?: number;
        images: string[];
    };
    quantity: number;
    size: string;
    color: string;
}

interface CartContextType {
    cart: CartItem[];
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number, size: string, color: string) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
}

const CartContext = createContext<CartContextType>({
    cart: [],
    fetchCart: async () => { },
    addToCart: async () => { },
    removeFromCart: async () => { },
    clearCart: async () => { },
    cartCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { isAuthenticated } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get('/cart');
            if (res.data.success) {
                setCart(res.data.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch cart');
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const addToCart = async (productId: string, quantity: number, size: string, color: string) => {
        try {
            await api.post('/cart/add', { productId, quantity, size, color });
            toast.success('Added to cart');
            await fetchCart();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await api.delete(`/cart/remove/${itemId}`);
            toast.success('Removed from cart');
            await fetchCart();
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const clearCart = async () => {
        setCart([]);
        await api.post('/cart/clear');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
