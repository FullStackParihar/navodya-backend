import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

// Cart Context
const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Action types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';
const SET_CART = 'SET_CART';

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case SET_CART: {
      const items = action.payload;
      const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
      const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      return {
        ...state,
        items,
        totalItems,
        totalAmount,
      };
    }

    case ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + (action.payload.quantity || 1),
          totalAmount: state.totalAmount + (action.payload.price * (action.payload.quantity || 1)),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
          totalItems: state.totalItems + (action.payload.quantity || 1),
          totalAmount: state.totalAmount + (action.payload.price * (action.payload.quantity || 1)),
        };
      }
    }
    
    case REMOVE_FROM_CART: {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity),
      };
    }
    
    case UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (!item) return state;
      
      const quantityDiff = quantity - item.quantity;
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (quantityDiff * item.price),
      };
    }
    
    case CLEAR_CART:
      return initialState;
      
    default:
      return state;
  }
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage or backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchBackendCart = async () => {
      try {
        const result = await api.get('/cart');
        if (result.success) {
          const mappedItems = result.data.items.map(item => ({
            id: item.product_id.slug,
            dbId: item.product_id._id,
            cartItemId: item._id,
            name: item.product_id.name,
            price: item.product_id.sale_price || item.product_id.price,
            originalPrice: item.product_id.sale_price ? item.product_id.price : null,
            image: item.product_id.images[0],
            quantity: item.quantity,
            selectedSize: item.size,
            selectedColor: item.color
          }));
          dispatch({ type: SET_CART, payload: mappedItems });
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };

    if (token) {
      fetchBackendCart();
    } else {
      const savedCart = localStorage.getItem('navodayaCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: SET_CART, payload: parsedCart.items || [] });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('navodayaCart', JSON.stringify({
      items: state.items,
      totalItems: state.totalItems,
      totalAmount: state.totalAmount,
    }));
  }, [state]);

  // Actions
  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (token && product.dbId) {
      try {
        await api.post('/cart/add', {
          productId: product.dbId,
          quantity: product.quantity || 1,
          size: product.selectedSize || 'Free Size',
          color: product.selectedColor || 'N/A'
        });
      } catch (err) {
        console.error('Error adding to backend cart:', err);
      }
    }
    dispatch({ type: ADD_TO_CART, payload: product });
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    const item = state.items.find(i => i.id === productId);
    if (token && item && (item.cartItemId || item.dbId)) {
      try {
        await api.delete(`/cart/remove/${item.cartItemId || item.dbId}`);
      } catch (err) {
        console.error('Error removing from backend cart:', err);
      }
    }
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const token = localStorage.getItem('token');
    const item = state.items.find(i => i.id === productId);
    if (token && item && (item.cartItemId || item.dbId)) {
      try {
        await api.patch(`/cart/update/${item.cartItemId || item.dbId}`, { quantity });
      } catch (err) {
        console.error('Error updating backend cart:', err);
      }
    }
    dispatch({ type: UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/cart/clear');
      } catch (err) {
        console.error('Error clearing backend cart:', err);
      }
    }
    dispatch({ type: CLEAR_CART });
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
