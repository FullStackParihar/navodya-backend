import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

// Wishlist Context
const WishlistContext = createContext();

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
};

// Action types
const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
const CLEAR_WISHLIST = 'CLEAR_WISHLIST';
const SET_WISHLIST = 'SET_WISHLIST';

// Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case SET_WISHLIST:
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
      };

    case ADD_TO_WISHLIST: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return state; // Item already in wishlist
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.totalItems + 1,
      };
    }
    
    case REMOVE_FROM_WISHLIST: {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: Math.max(0, state.totalItems - 1),
      };
    }
    
    case CLEAR_WISHLIST:
      return initialState;
      
    default:
      return state;
  }
};

// Provider
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage or backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchBackendWishlist = async () => {
      try {
        const result = await api.get('/favorites');
        if (result.success) {
          const mapped = result.data.favorites.map(item => ({
            id: item.product_id.slug,
            dbId: item.product_id._id,
            name: item.product_id.name,
            description: item.product_id.description,
            price: item.product_id.sale_price || item.product_id.price,
            originalPrice: item.product_id.sale_price ? item.product_id.price : null,
            image: item.product_id.images[0],
            badge: (item.product_id.tags && item.product_id.tags.includes('new')) ? 'New' : '',
            reviews: item.product_id.review_count || 0,
            rating: item.product_id.rating || 0
          }));
          dispatch({ type: SET_WISHLIST, payload: mapped });
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    if (token) {
      fetchBackendWishlist();
    } else {
      const savedWishlist = localStorage.getItem('navodayaWishlist');
      if (savedWishlist) {
        try {
          const { items } = JSON.parse(savedWishlist);
          dispatch({ type: SET_WISHLIST, payload: items || [] });
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes (only for guest users or as fallback)
  useEffect(() => {
    localStorage.setItem('navodayaWishlist', JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
    }));
  }, [state]);

  // Actions
  const addToWishlist = async (product) => {
    console.log('Adding to wishlist:', product);
    const token = localStorage.getItem('token');
    
    // Optimistic update
    dispatch({ type: ADD_TO_WISHLIST, payload: product });

    if (token) {
      if (product.dbId) {
        try {
          const response = await api.post(`/favorites/toggle/${product.dbId}`);
          console.log('Added to backend favorites:', response);
        } catch (err) {
          console.error('Error adding to favorites backend:', err);
          // Optionally rollback state here if strictly consistent
        }
      } else {
        console.warn('Product missing dbId, cannot sync with backend:', product);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    console.log('Removing from wishlist:', productId);
    const token = localStorage.getItem('token');
    const item = state.items.find(i => i.id === productId);
    
    // Optimistic update
    dispatch({ type: REMOVE_FROM_WISHLIST, payload: productId });

    if (token && item && item.dbId) {
      try {
        await api.delete(`/favorites/${item.dbId}`);
        console.log('Removed from backend favorites');
      } catch (err) {
        console.error('Error removing from favorites backend:', err);
      }
    }
  };

  const clearWishlist = () => {
    // Backend might not have a clear favorites endpoint yet
    dispatch({ type: CLEAR_WISHLIST });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
