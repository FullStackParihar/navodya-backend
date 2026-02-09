import React, { createContext, useContext, useReducer, useEffect } from 'react';

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

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price,
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price,
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('navodayaCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'RESTORE_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
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
  const addToCart = (product) => {
    dispatch({ type: ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: UPDATE_QUANTITY, payload: { id: productId, quantity } });
    }
  };

  const clearCart = () => {
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
