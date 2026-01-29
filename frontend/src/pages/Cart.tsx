import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ clientSecret, paymentIntentId, onSuccess }: { clientSecret: string, paymentIntentId: string, onSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;
        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) return;
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message || "An unexpected error occurred.");
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else {
            // Create Order
            try {
                await api.post('/orders/create', {
                    paymentIntentId,
                    shippingAddress: {
                        street: '123 Test St', // Simplified for demo
                        city: 'Demo City',
                        state: 'DS',
                        zip_code: '12345',
                        country: 'Demo Country'
                    }
                });
                onSuccess();
            } catch (err) {
                setMessage('Payment succeeded but order creation failed.');
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement id="payment-element" />
            {message && <div className="text-red-500 mt-2 text-sm">{message}</div>}
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
            >
                {isLoading ? "Processing..." : "Pay Now"}
            </button>
        </form>
    )
}

const Cart = () => {
    const { cart, removeFromCart, cartCount, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [pricing, setPricing] = useState<any>(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => {
        const price = item.products?.sale_price || item.products?.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    const isMock = clientSecret.startsWith('mock_') || isTestMode;

    const initiateCheckout = async () => {
        try {
            const res = await api.post('/orders/create-payment-intent', {
                couponCode: couponCode || undefined,
                shippingAddress: {}
            });
            if (res.data.success) {
                setClientSecret(res.data.data.clientSecret);
                setPaymentIntentId(res.data.data.paymentIntentId);
                setPricing(res.data.data.pricing);
                setIsTestMode(res.data.data.isTestMode || false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        }
    };

    const handleOrderSuccess = async () => {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate('/orders');
    };

    const handleMockPayment = async () => {
        try {
            await api.post('/orders/create', {
               paymentIntentId,
               shippingAddress: {
                 street: '123 Test St', // Simplified for demo
                 city: 'Demo City',
                 state: 'DS',
                 zip_code: '12345',
                 country: 'Demo Country'
               }
            });
            handleOrderSuccess();
        } catch (err) {
            toast.error('Order creation failed.');
        }
    };

    if (cartCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
                <ShoppingBag size={64} className="mb-4 text-gray-600" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="mb-6">Looks like you haven't added anything yet.</p>
                <Link to="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item._id} className="bg-surface p-4 rounded-xl border border-gray-800 flex gap-4 items-center">
                            <div className="w-20 h-20 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.products?.images?.[0] || 'https://placehold.co/100?text=No+Image'} alt={item.products?.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">{item.products?.name || 'Unavailable Product'}</h3>
                                <p className="text-sm text-gray-400">{item.size} | {item.color}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="font-bold text-primary">₹{item.products?.sale_price || item.products?.price || 0}</span>
                                    <span className="text-gray-500">Qty: {item.quantity}</span>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-400 p-2">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-surface p-6 rounded-xl border border-gray-800 h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {pricing && (
                            <>
                                <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-₹{pricing.discount}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                                    <span>Total</span>
                                    <span>₹{pricing.total}</span>
                                </div>
                            </>
                        )}
                        {!pricing && (
                            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                                <span>Estimated Total</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {!clientSecret ? (
                        <>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white mb-2"
                                />
                            </div>
                            <button onClick={initiateCheckout} className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
                                Proceed to Checkout
                            </button>
                        </>
                    ) : isMock ? (
                        <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-center">
                             <p className="text-yellow-400 mb-4 text-sm font-bold flex items-center justify-center gap-2">
                                <AlertCircle size={16} /> Test Mode Active
                             </p>
                            <p className="text-gray-300 mb-4 text-sm">Stripe keys are not configured. Bypassing payment provider.</p>
                            <button 
                                onClick={handleMockPayment}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Confirm Order (Test Mode)
                            </button>
                        </div>
                    ) : (
                        <Elements options={{ clientSecret, appearance: { theme: 'night' } }} stripe={stripePromise}>
                            <CheckoutForm clientSecret={clientSecret} paymentIntentId={paymentIntentId} onSuccess={handleOrderSuccess} />
                        </Elements>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
import { ShoppingBag } from 'lucide-react';
