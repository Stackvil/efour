import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { supabase } from '../supabaseClient';
import {
    LayoutDashboard, ShoppingCart, Calendar, Users, Package, Power,
    Plus, Trash2, Edit2, X, Check, Utensils, Gamepad2, Download,
    Monitor, Smartphone, Ticket, Menu, Search, Filter, ChevronDown,
    Bell, Settings, MoreVertical, ArrowUpRight, ArrowDownRight, IndianRupee, MapPin
} from 'lucide-react';
import { BASE_URL } from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [headerDropdown, setHeaderDropdown] = useState(null); // 'notifications' | 'user' | null
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'on', 'off'
    const [orders, setOrders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', description: '', image: '', stall: '', type: '', status: 'on'
    });

    // Pagination States
    const [recentTxPage, setRecentTxPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);
    const [liveOrdersPage, setLiveOrdersPage] = useState(1);

    const token = localStorage.getItem('token');

    // --- Data Fetching ---
    const fetchData = async () => {
        try {
            const currentToken = localStorage.getItem('token');
            const headers = { 'x-auth-token': currentToken, 'Authorization': `Bearer ${currentToken}` };
            // In dev: use Vite proxy (`/api` -> backend) to avoid CORS.
            // In prod: use configured backend URL (or fallback to the deployed backend).
            const apiUrl = `${BASE_URL}/api`;

            // Parallel Fetch – E4 orders via /orders/e4/all (Admin only)
            // Use ?all=true for rides and dine to ensure inactive items are visible.
            const [ridesRes, dineRes, bookingsRes, ordersRes] = await Promise.all([
                fetch(`${apiUrl}/e4/rides?all=true`, { headers }),
                fetch(`${apiUrl}/e4/dine?all=true`, { headers }),
                fetch(`${apiUrl}/bookings`, { headers }),
                fetch(`${apiUrl}/orders/e4/all`, { headers }),
                // fetch(`${apiUrl}/events?location=E4`, { headers })
            ]);

            // Process Rides
            let rideProducts = [];
            if (ridesRes.ok) {
                const data = await ridesRes.json();
                rideProducts = Array.isArray(data) ? data.filter(Boolean).map(item => ({
                    ...item,
                    id: item._id || item.id,
                    image: item.image ? decodeURIComponent(item.image) : '',
                    description: item.desc || item.description
                })) : [];
            }

            // Process Dine Items
            let dineProducts = [];
            if (dineRes.ok) {
                const data = await dineRes.json();
                dineProducts = Array.isArray(data)
                    ? data.filter(Boolean).map(item => ({
                        ...item,
                        id: item._id || item.id,
                        image: item.image ? decodeURIComponent(item.image) : '',
                        category: item.category || 'food',
                        description: item.desc || item.description
                    }))
                    : [];
            }

            // Process Events (Commented out)
            // let eventsProducts = [];
            // if (eventsRes && eventsRes.ok) {
            //     const data = await eventsRes.json();
            //     eventsProducts = Array.isArray(data)
            //         ? data.map(item => ({
            //             ...item,
            //             id: item._id || item.id,
            //             category: 'event',
            //             description: `Capacity: ${item.capacity || 'N/A'} - ${item.type || 'N/A'}`
            //         }))
            //         : [];
            // }

            setProducts((rideProducts || []).concat(dineProducts || []).filter(Boolean));

            let finalBookings = [];
            if (bookingsRes.ok) {
                try {
                    const raw = await bookingsRes.json();
                    finalBookings = Array.isArray(raw) ? raw : (raw?.bookings || raw?.data || raw?.result || Object.values(raw).find(v => Array.isArray(v)) || []);
                } catch (_) { }
            }
            setBookings((finalBookings || []).filter(Boolean));

            let ordersData = [];
            if (ordersRes.ok) {
                try {
                    const raw = await ordersRes.json();
                    ordersData = Array.isArray(raw) ? raw : (raw?.orders || raw?.data || raw?.result || Object.values(raw).find(v => Array.isArray(v)) || []);
                } catch (_) { }
            }
            setOrders((ordersData || []).filter(Boolean));

        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Search Filtering ---
    const filteredOrders = (orders || []).filter(o =>
        o && (
            (o.userDetails?.name || o.name || o.userId || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o._id || o.id || '').toString().includes(searchQuery)
        )
    );
    const filteredBookings = (bookings || []).filter(b =>
        b && (
            (b.userDetails?.name || b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b._id || b.id || '').toString().includes(searchQuery)
        )
    );
    const filteredProducts = (products || []).filter(p => {
        if (!p) return false;
        const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const itemStatus = (p.status || (p.open === false ? 'off' : 'on')).toLowerCase();
        const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });


    // --- CRUD Operations ---
    const handleDelete = async (id, type) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            if (type === 'product') {
                const apiUrl = `${BASE_URL}/api`;
                const currentToken = localStorage.getItem('token');
                if (!currentToken) {
                    alert('Admin token missing. Please login again.');
                    window.location.href = '/login';
                    return;
                }

                const item = products.find(p => p.id === id || p._id === id);
                const category = (item?.category || '').toLowerCase();
                const isRide = category === 'play';
                const isEvent = category === 'event';
                const endpoint = isRide ? `${apiUrl}/e4/rides/${id}` : isEvent ? `${apiUrl}/events/${id}` : `${apiUrl}/e4/dine/${id}`;

                const res = await fetch(endpoint, { method: 'DELETE', headers: { 'x-auth-token': currentToken, 'Authorization': `Bearer ${currentToken}` } });
                if (res.status === 401) {
                    alert('Session expired or invalid token. Please log in again.');
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }
                if (res.ok) {
                    setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
                } else {
                    console.error('Delete failed:', await res.text());
                    alert('Failed to delete item.');
                }
            } else if (type === 'booking') {
                const apiUrl = `${BASE_URL}/api`;
                const res = await fetch(`${apiUrl}/bookings/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
                if (res.ok) setBookings(prev => prev.filter(b => b._id !== id));
            }
        } catch (err) { console.error(err); alert('Failed to delete'); }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = `${BASE_URL}/api`;
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                alert('Admin token missing. Please login again.');
                window.location.href = '/login';
                return;
            }

            const isRide = (formData.category || '').toLowerCase() === 'play';
            const isEvent = (formData.category || '').toLowerCase() === 'event';
            const editId = editingItem?._id || editingItem?.id;

            if (isRide) {
                const payload = {
                    id: editId,
                    name: formData.name,
                    price: typeof formData.price === 'string' ? Number(formData.price) : formData.price,
                    image: formData.image,
                    images: formData.image ? [formData.image] : [],
                    desc: formData.description || '',
                    status: (editingItem?.status || 'on'),
                    category: formData.category || 'play',
                    ageGroup: formData.ageGroup || editingItem?.ageGroup || 'All',
                    type: formData.type || 'thrill',
                };

                const res = await fetch(editId ? `${apiUrl}/e4/rides/${editId}` : `${apiUrl}/e4/rides`, {
                    method: editId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': currentToken,
                        'Authorization': `Bearer ${currentToken}`
                    },
                    body: JSON.stringify(payload),
                });

                if (res.status === 401) {
                    alert('Session expired or invalid token. Please log in again.');
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }
                if (!res.ok) {
                    const text = await res.text();
                    console.error('Ride save failed:', text);
                    try {
                        const errData = JSON.parse(text);
                        if (isRide && errData.message && errData.message.includes('column') && errData.message.includes('does not exist')) {
                            alert(`CRITICAL BACKEND ERROR:\nThe backend code running on Vercel is trying to update a column named "id" which doesn't exist in Supabase (it uses "_id").\n\nPlease ask your backend developer to edit the Node.js API code, changing ".eq('id', req.params.id)" to ".eq('_id', req.params.id)" inside the PUT route.`);
                        } else {
                            alert(`Failed to save. (${res.status}): ${errData.message || 'Unknown error'}`);
                        }
                    } catch (e) {
                        alert(`Network error. Status: ${res.status}. Please check backend logs.`);
                    }
                    return;
                }
            } else if (isEvent) {
                const payload = {
                    id: editId,
                    name: formData.name,
                    price: typeof formData.price === 'string' ? Number(formData.price) : formData.price,
                    image: formData.image,
                    capacity: formData.capacity || '10-20 People',
                    start_time: formData.start_time ? new Date(formData.start_time).toISOString() : new Date().toISOString(),
                    end_time: formData.end_time ? new Date(formData.end_time).toISOString() : new Date(Date.now() + 86400000).toISOString(),
                    location: 'E3',
                    status: formData.status || 'active',
                };

                const res = await fetch(editId ? `${apiUrl}/events/${editId}` : `${apiUrl}/events`, {
                    method: editId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': currentToken,
                        'Authorization': `Bearer ${currentToken}`
                    },
                    body: JSON.stringify(payload),
                });

                if (res.status === 401) {
                    alert('Session expired or invalid token.');
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }
                if (!res.ok) {
                    console.error('Event save failed:', await res.text());
                    alert('Failed to save event. Check API + token.');
                    return;
                }
            } else {
                // Dine item (best-effort wiring; backend expects /api/e4/dine)
                const payload = {
                    id: editId,
                    name: formData.name,
                    price: typeof formData.price === 'string' ? Number(formData.price) : formData.price,
                    image: formData.image,
                    category: formData.category || 'food',
                    stall: formData.stall || '',
                    open: typeof formData.open === 'boolean' ? formData.open : true,
                };

                const res = await fetch(editId ? `${apiUrl}/e4/dine/${editId}` : `${apiUrl}/e4/dine`, {
                    method: editId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': currentToken,
                        'Authorization': `Bearer ${currentToken}`
                    },
                    body: JSON.stringify(payload),
                });

                if (res.status === 401) {
                    alert('Session expired or invalid token. Please log in again.');
                    localStorage.clear();
                    window.location.href = '/login';
                    return;
                }
                if (!res.ok) {
                    console.error('Dine save failed:', await res.text());
                    alert('Failed to save dine item. Check API + token.');
                    return;
                }
            }

            await fetchData();
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ name: '', category: '', price: '', description: '', image: '', stall: '', type: '' });
        } catch (err) { alert(err.message); }
    };

    // Image Upload (Disabled per user request to forget about Supabase)
    // const handleImageUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //     if (file.size > 5 * 1024 * 1024) return alert("Max 5MB");
    //     try {
    //         const fileExt = file.name.split('.').pop();
    //         const filePath = `${Math.random()}.${fileExt}`;
    //         const { error } = await supabase.storage.from('ride-images').upload(filePath, file);
    //         if (error) throw error;
    //         const { data } = supabase.storage.from('ride-images').getPublicUrl(filePath);
    //         setFormData(prev => ({ ...prev, image: data.publicUrl }));
    //     } catch (error) { console.error(error); alert('Upload failed'); }
    // };


    // --- Helpers (match backend API: orders use amount, bookings use totalPrice) ---
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amount ?? curr.totalAmount ?? 0), 0) + bookings.reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0);
    const activeRidesCount = products.filter(p => p.category === 'play' && (p.status || 'on').toLowerCase() === 'on').length;
    const tabs = [
        { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
        { id: 'orders', label: 'Live Orders', icon: ShoppingCart },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'rides', label: 'Rides', icon: Gamepad2 },
        { id: 'dine', label: 'Dining', icon: Utensils },
    ];

    const handleToggleStatus = async (item) => {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
            alert('Please log in again (admin token missing).');
            window.location.href = '/login';
            return;
        }
        try {
            const apiUrl = `${BASE_URL}/api`;
            const id = (item._id || item.id || '').toString();
            if (!id) return;

            const isRide = (item.category || '').toLowerCase() === 'play';
            const currentStatus = (item.status || (item.open === false ? 'off' : 'on')).toLowerCase();
            const newStatus = currentStatus === 'on' ? 'off' : 'on';

            let payload;
            let endpoint;

            if (isRide) {
                payload = {
                    name: item.name || '',
                    price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
                    image: item.image || '',
                    desc: (item.description || item.desc || '').toString(),
                    status: newStatus,
                    category: 'play',
                    ageGroup: (item.ageGroup || 'All').toString(),
                };
                endpoint = `${apiUrl}/e4/rides/${id}`;
            } else {
                payload = {
                    name: item.name || '',
                    price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
                    image: item.image || '',
                    category: item.category || 'food',
                    stall: item.stall || '',
                    status: newStatus,
                    open: newStatus === 'on',
                };
                endpoint = `${apiUrl}/e4/dine/${id}`;
            }

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': currentToken,
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                alert('Session expired or invalid token. Please log out and log in again.');
                localStorage.clear();
                window.location.href = '/login';
                return;
            }

            const text = await res.text();
            if (!res.ok) {
                console.error('Status update failed', res.status, text);
                try {
                    const errData = JSON.parse(text);
                    if (errData.message && errData.message.includes('column') && errData.message.includes('does not exist')) {
                        alert(`CRITICAL BACKEND ERROR:\nThe backend code seems to have an issue with the database columns.\n\nPlease ask your backend developer to verify the PUT route for ${isRide ? 'rides' : 'dine'}.`);
                    } else {
                        alert(`Could not update status (${res.status}). Server message: ${errData.message || 'Unknown error'}`);
                    }
                } catch (e) {
                    alert(`Network error. Status: ${res.status}. Please check backend logs.`);
                }
                return;
            }

            setProducts(prev =>
                prev.map(p => {
                    if (!p) return p;
                    const pId = (p._id || p.id || '').toString();
                    return (pId === id)
                        ? { ...p, status: newStatus, open: newStatus === 'on' }
                        : p;
                })
            );
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Network error. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] font-sans text-slate-800 relative">

            {/* --- SIDEBAR --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-24 md:h-[calc(100vh-6rem)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-3 p-6 h-24 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                        <img src="/E4LOGO.jpeg" alt="Logo" className="w-full h-full object-contain rounded-xl bg-black" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Portal</p>
                    </div>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                    <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${activeTab === tab.id
                                ? 'bg-riverside-teal text-white shadow-lg shadow-emerald-200'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-charcoal-grey'
                                }`}
                        >
                            <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-charcoal-grey'} />
                            {tab.label}
                            {activeTab === tab.id && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-white">
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                    >
                        <Power size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* TOP BAR */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center bg-gray-100/50 rounded-xl px-4 py-2.5 w-96 border border-gray-200 focus-within:border-riverside-teal focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders, bookings, items..."
                            className="bg-transparent border-none outline-none text-sm ml-3 w-full placeholder-gray-400 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            type="button"
                            onClick={() => setHeaderDropdown(prev => prev === 'notifications' ? null : 'notifications')}
                            className="relative p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                        {headerDropdown === 'notifications' && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
                                <p className="px-4 py-3 text-sm text-gray-500 font-medium">No new notifications</p>
                            </div>
                        )}

                        <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
                            <button
                                type="button"
                                onClick={() => setHeaderDropdown(prev => prev === 'user' ? null : 'user')}
                                className="flex items-center gap-3"
                            >
                                <div className="w-9 h-9 rounded-full bg-charcoal-grey text-white flex items-center justify-center font-bold text-sm">A</div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-bold text-charcoal-grey">Admin User</p>
                                    <p className="text-xs text-gray-400">Super Admin</p>
                                </div>
                                <ChevronDown size={16} className={`text-gray-400 hidden md:block transition-transform ${headerDropdown === 'user' ? 'rotate-180' : ''}`} />
                            </button>
                            {headerDropdown === 'user' && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                                    <button
                                        type="button"
                                        onClick={() => { setHeaderDropdown(null); localStorage.clear(); window.location.href = '/'; }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Power size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {headerDropdown && (
                        <div
                            className="fixed inset-0 z-[45]"
                            aria-hidden="true"
                            onClick={() => setHeaderDropdown(null)}
                        />
                    )}
                </header>

                {/* DASHBOARD CONTENT */}
                <div className="flex-1 p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-7xl mx-auto"
                        >
                            {/* Header Section */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-heading font-bold text-charcoal-grey">
                                            {tabs.find(t => t.id === activeTab)?.label}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Overview of your {activeTab} performance
                                        </p>
                                    </div>
                                    {(activeTab === 'rides' || activeTab === 'dine') && (
                                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 ml-0 sm:ml-4">
                                            {['all', 'on', 'off'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStatusFilter(s)}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s
                                                        ? 'bg-white text-charcoal-grey shadow-sm'
                                                        : 'text-gray-400 hover:text-gray-600'
                                                        }`}
                                                >
                                                    {s === 'all' ? 'All' : s === 'on' ? 'Open' : 'Closed'}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {(activeTab === 'rides' || activeTab === 'dine') && (
                                    <button
                                        onClick={() => {
                                            setEditingItem(null);
                                            setFormData({
                                                name: '', category: activeTab === 'rides' ? 'play' : 'food',
                                                price: '', description: '', image: '', stall: '', type: '', status: 'on', capacity: '', start_time: '', end_time: ''
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        className="bg-charcoal-grey text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200"
                                    >
                                        <Plus size={18} /> Add New Item
                                    </button>
                                )}
                            </div>

                            {/* ANALYTICS VIEW */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-8">
                                    {/* Stat Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} color="text-emerald-500" bg="bg-emerald-50" />
                                        <StatCard title="Total Bookings" value={bookings.length} icon={Ticket} color="text-blue-500" bg="bg-blue-50" />
                                        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="text-orange-500" bg="bg-orange-50" />
                                        <StatCard title="Active Rides" value={activeRidesCount} icon={Gamepad2} color="text-purple-500" bg="bg-purple-50" />
                                    </div>

                                    {/* Recent Activity Table using a DataGrid style */}
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-charcoal-grey">Recent Transactions</h3>
                                            <button type="button" onClick={() => setActiveTab('orders')} className="text-sm font-bold text-riverside-teal hover:text-emerald-700">View All</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50/50">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {(() => {
                                                        const txList = [...orders, ...bookings]
                                                            .filter(item => item && (item._id || item.id))
                                                            .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
                                                        const totalTxPages = Math.ceil(txList.length / 5);
                                                        const txDisplay = txList.slice((recentTxPage - 1) * 5, recentTxPage * 5);

                                                        return (
                                                            <>
                                                                {txDisplay.map((item, idx) => (
                                                                    <tr key={item._id || item.id || idx} className="hover:bg-gray-50 transition-colors group">
                                                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 font-mono">#{(item._id || item.id || '').toString().slice(-6).toUpperCase()}</td>
                                                                        <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                                                            {item.userDetails?.name || item.name || item.userId || 'Guest'}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                                            {item.items && item.items.length ? 'Order' : 'Booking'}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{item.amount ?? item.totalAmount ?? item.totalPrice ?? 0}</td>
                                                                        <td className="px-6 py-4">
                                                                            <StatusBadge status={item.status || item.orderStatus || 'confirmed'} />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {txList.length > 5 && (
                                                                    <tr>
                                                                        <td colSpan="5" className="px-6 py-4 text-center border-t border-gray-100">
                                                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                                                <button disabled={recentTxPage === 1} onClick={() => setRecentTxPage(prev => prev - 1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50">Previous</button>
                                                                                <span>Page {recentTxPage} of {totalTxPages}</span>
                                                                                <button disabled={recentTxPage === totalTxPages || totalTxPages === 0} onClick={() => setRecentTxPage(prev => prev + 1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50">Next</button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RIDES & DINE GRID */}
                            {(activeTab === 'rides' || activeTab === 'dine') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.filter(p => p.category === (activeTab === 'rides' ? 'play' : 'food')).map(item => (
                                        <div key={item.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                                            <div className="relative h-48 overflow-hidden">
                                                <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                    <button onClick={() => {
                                                        setEditingItem(item);
                                                        setFormData({
                                                            ...item,
                                                            start_time: item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : '',
                                                            end_time: item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : ''
                                                        });
                                                        setIsModalOpen(true);
                                                    }} className="p-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleDelete(item.id, 'product')} className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={18} /></button>
                                                </div>
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-charcoal-grey shadow-sm">
                                                    ₹{item.price}
                                                </div>
                                            </div>
                                            <div className="p-5 space-y-3">
                                                <h3 className="font-bold text-charcoal-grey text-lg">{item.name}</h3>
                                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>

                                                {(activeTab === 'rides' || activeTab === 'dine') && (
                                                    <div className="flex items-center justify-between pt-2">
                                                        <div className="flex flex-col gap-1">
                                                            <span
                                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${(item.status === 'on' || (item.open !== false && !item.status))
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                    }`}
                                                            >
                                                                {(item.status === 'on' || (item.open !== false && !item.status)) ? 'Open' : 'Closed'}
                                                            </span>
                                                            {activeTab === 'dine' && (
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-riverside-teal bg-teal-50 px-2 py-0.5 rounded-md w-fit">
                                                                    <Utensils size={10} /> {item.stall}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(item)}
                                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(item.status === 'on' || (item.open !== false && !item.status))
                                                                ? 'bg-green-500'
                                                                : 'bg-gray-300'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${(item.status === 'on' || (item.open !== false && !item.status))
                                                                    ? 'translate-x-5'
                                                                    : 'translate-x-1'
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TABLES (BOOKINGS & ORDERS) */}
                            {(activeTab === 'bookings' || activeTab === 'orders') && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full whitespace-nowrap">
                                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(() => {
                                                    const isBookingsTab = activeTab === 'bookings';
                                                    const list = isBookingsTab ? filteredBookings : filteredOrders;
                                                    const currentPage = isBookingsTab ? bookingsPage : liveOrdersPage;
                                                    const setPage = isBookingsTab ? setBookingsPage : setLiveOrdersPage;
                                                    const totalPages = Math.ceil(list.length / 10);
                                                    const displayList = list.slice((currentPage - 1) * 10, currentPage * 10);

                                                    return (
                                                        <>
                                                            {displayList.filter(Boolean).map((item, idx) => (
                                                                <tr key={item._id || item.id || idx} className="hover:bg-gray-50 transition-colors">
                                                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 font-mono">
                                                                        #{String(item._id || item.id || '').slice(-6).toUpperCase()}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="text-sm font-bold text-gray-900">{item.userDetails?.name || item.name || 'Guest'}</div>
                                                                        <div className="text-xs text-gray-400">{item.userDetails?.phone || item.phone}</div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                                        {isBookingsTab
                                                                            ? (item.facility || 'Ride Booking')
                                                                            : (item.items?.map(i => `${i.name} (${i.quantity})`).join(', '))}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                                        {new Date(item.date || item.createdAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                                        ₹{item.totalPrice || item.totalAmount}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <StatusBadge status={item.status || item.orderStatus || 'confirmed'} />
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <button
                                                                            onClick={() => handleDelete(item._id || item.id, isBookingsTab ? 'booking' : 'order')}
                                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {list.length > 10 && (
                                                                <tr>
                                                                    <td colSpan="7" className="px-6 py-4 text-center border-t border-gray-100">
                                                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                                                            <button disabled={currentPage === 1} onClick={() => setPage(prev => prev - 1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50">Previous</button>
                                                                            <span>Page {currentPage} of {totalPages}</span>
                                                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setPage(prev => prev + 1)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg disabled:opacity-50">Next</button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </tbody>
                                        </table>
                                        {(activeTab === 'bookings' ? filteredBookings : filteredOrders).length === 0 && (
                                            <div className="p-12 text-center text-gray-400">
                                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                                <p className="font-medium">No results found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-heading font-bold text-charcoal-grey">
                                    {editingItem ? 'Edit Item' : 'Add New Item'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-charcoal-grey"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Item Name" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</label>
                                        <input required type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                        <select disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-500" value={formData.category}>
                                            <option value="play">Ride</option>
                                            <option value="food">Food</option>
                                            <option value="event">Event</option>
                                        </select>
                                    </div>
                                </div>
                                {formData.category === 'food' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stall Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium"
                                            value={formData.stall} onChange={e => setFormData({ ...formData, stall: e.target.value })} placeholder="e.g. Burger King" />
                                    </div>
                                )}
                                {formData.category === 'event' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium"
                                                value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} placeholder="e.g. 50-100 People" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Time</label>
                                                <input required type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium text-sm"
                                                    value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Time</label>
                                                <input required type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium text-sm"
                                                    value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                            {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <input
                                                type="text"
                                                placeholder="Paste Image URL here (https://...)"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-riverside-teal outline-none"
                                            />
                                            <p className="text-[10px] text-gray-400">Supabase uploads are disabled. Please provide a direct image URL.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-riverside-teal focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium resize-none"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" placeholder="Item description..."></textarea>
                                </div>
                                <button type="submit" className="w-full py-3.5 bg-charcoal-grey text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 mt-2">
                                    {editingItem ? 'Update Item' : 'Create Item'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

// --- Subcomponents ---

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
            </div>
        </div>
        <div>
            <h3 className="text-2xl font-heading font-bold text-charcoal-grey mb-1">{value}</h3>
            <p className="text-sm font-medium text-gray-400">{title}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: 'bg-green-100 text-green-700',
        placed: 'bg-blue-100 text-blue-700',
        pending: 'bg-yellow-100 text-yellow-700',
        cancelled: 'bg-red-100 text-red-700'
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

export default AdminDashboard;
