import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface Category {
    id: string;
    name: string;
    slug: string;
}

const Admin = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    // Product Form State
    const [productData, setProductData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        categoryId: '',
        images: ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b'],
        stock: '100'
    });

    // Category Form State
    const [categoryData, setCategoryData] = useState({
        name: '',
        slug: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            if (res.data.success) {
                setCategories(res.data.data);
                // Set default category if available and not set
                if (res.data.data.length > 0 && !productData.categoryId) {
                    setProductData(prev => ({ ...prev, categoryId: res.data.data[0].id }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...productData,
                price: Number(productData.price),
                sizes: [{ size: 'M', stock: Number(productData.stock) }],
                colors: [{ name: 'Blue', hex: '#0000FF' }]
            });
            toast.success('Product created successfully');
            setProductData({ ...productData, name: '', slug: '', price: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/categories', categoryData);
            toast.success('Category created successfully');
            setCategoryData({ ...categoryData, name: '', slug: '', description: '' });
            fetchCategories(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 text-white">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Create Product Section */}
                <div className="bg-surface p-8 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                            <input
                                type="text"
                                value={productData.name}
                                onChange={e => setProductData({ ...productData, name: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Slug</label>
                                <input
                                    type="text"
                                    value={productData.slug}
                                    onChange={e => setProductData({ ...productData, slug: e.target.value })}
                                    className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    value={productData.price}
                                    onChange={e => setProductData({ ...productData, price: e.target.value })}
                                    className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Category</label>
                            <select
                                value={productData.categoryId}
                                onChange={e => setProductData({ ...productData, categoryId: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                value={productData.description}
                                onChange={e => setProductData({ ...productData, description: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white h-24"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg">
                            Create Product
                        </button>
                    </form>
                </div>

                {/* Create Category Section */}
                <div className="bg-surface p-8 rounded-xl border border-gray-800 h-fit">
                    <h2 className="text-xl font-bold mb-6">Add New Category</h2>
                    <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Category Name</label>
                            <input
                                type="text"
                                value={categoryData.name}
                                onChange={e => setCategoryData({ ...categoryData, name: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Slug</label>
                            <input
                                type="text"
                                value={categoryData.slug}
                                onChange={e => setCategoryData({ ...categoryData, slug: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                value={categoryData.description}
                                onChange={e => setCategoryData({ ...categoryData, description: e.target.value })}
                                className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white h-24"
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">
                            Create Category
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Admin;
