import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Clock, CheckCircle } from 'lucide-react';

interface Order {
    _id: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        image: string;
    }[];
    pricing: {
        total: number;
    };
    status: string;
    created_at: string;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center text-white py-20">Loading orders...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-surface rounded-xl border border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-mono text-white">#{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-primary font-bold">₹{order.pricing.total}</p>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'DELIVERED' ? 'bg-green-900 text-green-300' :
                                        order.status === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                                            'bg-blue-900 text-blue-300'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                                    <div className="w-16 h-16 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                        <Package size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
