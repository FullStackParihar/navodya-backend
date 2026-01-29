import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X, Heart } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-surface border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            BoltStore
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            {isAuthenticated && (
                                <Link to="/orders" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Orders</Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-primary hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">Admin Dashboard</Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated && (
                            <Link to="/favorites" className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Favorites">
                                <Heart className="w-6 h-6" />
                            </Link>
                        )}
                        <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400">Hi, {user?.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="text-gray-300 hover:text-white">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-surface border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/cart" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Cart ({cartCount})</Link>
                        {isAuthenticated && <Link to="/favorites" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Favorites</Link>}
                        {isAuthenticated ? (
                            <>
                                <Link to="/orders" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">My Orders</Link>
                                {user?.role === 'admin' && <Link to="/admin" className="text-primary block px-3 py-2 rounded-md text-base font-medium">Admin</Link>}
                                <button onClick={handleLogout} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="text-primary hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
