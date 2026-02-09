import React, { createContext, useContext, useReducer, useEffect } from 'react';

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

// Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
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
        totalItems: state.totalItems - 1,
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

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('navodayaWishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'RESTORE_WISHLIST', payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('navodayaWishlist', JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
    }));
  }, [state]);

  // Actions
  const addToWishlist = (product) => {
    dispatch({ type: ADD_TO_WISHLIST, payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: REMOVE_FROM_WISHLIST, payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: CLEAR_WISHLIST });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
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
