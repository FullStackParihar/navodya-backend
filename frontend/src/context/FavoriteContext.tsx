import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface FavoriteItem {
    _id: string;
    product_id: string;
    products: {
        _id: string;
        name: string;
        price: number;
        sale_price?: number;
        images: string[];
        slug: string;
    };
    created_at: string;
}

interface FavoriteContextType {
    favorites: FavoriteItem[];
    fetchFavorites: () => Promise<void>;
    toggleFavorite: (productId: string) => Promise<void>;
    checkFavoriteStatus: (productId: string) => Promise<boolean>;
}

const FavoriteContext = createContext<FavoriteContextType>({
    favorites: [],
    fetchFavorites: async () => { },
    toggleFavorite: async () => { },
    checkFavoriteStatus: async () => false,
});

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const { isAuthenticated } = useAuth();

    const fetchFavorites = async () => {
        if (!isAuthenticated) {
            setFavorites([]);
            return;
        }
        try {
            const res = await api.get('/favorites');
            if (res.data.success) {
                setFavorites(res.data.data.favorites);
            }
        } catch (error) {
            console.error('Failed to fetch favorites');
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [isAuthenticated]);

    const toggleFavorite = async (productId: string) => {
        if (!isAuthenticated) {
            toast.error('Please login to manage favorites');
            return;
        }
        try {
            const res = await api.post(`/favorites/toggle/${productId}`);
            if (res.data.success) {
                const isNowFavorite = res.data.data.isFavorite;
                toast.success(isNowFavorite ? 'Added to favorites' : 'Removed from favorites');
                await fetchFavorites();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update favorite');
        }
    };

    const checkFavoriteStatus = async (productId: string) => {
        if (!isAuthenticated) return false;
        try {
            const res = await api.get(`/favorites/check/${productId}`);
            return res.data.data.isFavorite;
        } catch (error) {
            return false;
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, fetchFavorites, toggleFavorite, checkFavoriteStatus }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorite = () => useContext(FavoriteContext);
