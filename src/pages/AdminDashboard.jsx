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
                fetch(`${apiUrl}/orders/e4/all`, { headers })
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
        <div className="flex min-h-screen bg-[#070B14] font-sans text-[#F8FAFC] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#FF7A18]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#5B8CFF]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* --- SIDEBAR --- */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-[#0F172A]/40 backdrop-blur-2xl border-r border-white/10 transform transition-all duration-500 ease-in-out md:translate-x-0 md:sticky md:top-24 md:h-[calc(100vh-8rem)] rounded-r-[3rem] shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-5 p-8 h-28 border-b border-white/5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group overflow-hidden">
                        <img src="/E4LOGO.jpeg" alt="Logo" className="w-full h-full object-contain brightness-110 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#FF7A18] uppercase tracking-[0.4em] italic leading-none mb-1">Eluru Admin</p>
                        <p className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-widest">v2.026.04</p>
                    </div>
                </div>

                <nav className="p-6 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
                    <p className="px-4 py-3 text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-[0.3em] mb-4 italic">Core Terminals</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group ${activeTab === tab.id
                                ? 'bg-white/10 text-white border border-white/20 shadow-xl'
                                : 'text-[#AAB2C5] hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? 'text-[#FF7A18]' : 'text-[#AAB2C5] group-hover:text-white transition-colors'} />
                            {tab.label}
                            {activeTab === tab.id && <motion.div layoutId="active-nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF7A18] shadow-[0_0_8px_#FF7A18]" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-6 right-6 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        className="flex items-center justify-center gap-3 w-full py-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.3em] italic"
                    >
                        <Power size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* TOP BAR */}
                <header className="h-24 px-8 flex items-center justify-between z-20 sticky top-0 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/5 mx-6 mt-6 rounded-3xl">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-3 text-[#AAB2C5] hover:bg-white/5 rounded-2xl transition-all">
                        <Menu size={24} />
                    </button>

                    <div className="hidden md:flex items-center bg-white/5 rounded-2xl px-6 py-3.5 w-[500px] border border-white/10 focus-within:border-[#FF7A18]/50 focus-within:bg-white/10 transition-all shadow-inner group">
                        <Search size={18} className="text-[#AAB2C5] group-focus-within:text-[#FF7A18] transition-colors" />
                        <input
                            type="text"
                            placeholder="Universal Terminal Search..."
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest ml-4 w-full placeholder-[#AAB2C5]/30 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6 relative">
                        <button
                            type="button"
                            onClick={() => setHeaderDropdown(prev => prev === 'notifications' ? null : 'notifications')}
                            className="relative p-3.5 text-[#AAB2C5] hover:bg-white/5 hover:text-white rounded-2xl transition-all border border-white/5"
                        >
                            <Bell size={20} />
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#FF7A18] rounded-full border border-[#070B14] shadow-[0_0_8px_#FF7A18]" />
                        </button>
                        {headerDropdown === 'notifications' && (
                            <div className="glass-card absolute right-0 top-full mt-4 w-80 rounded-[2rem] border border-white/10 shadow-3xl py-4 z-50 overflow-hidden">
                                <p className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#AAB2C5]/40 italic">Universal Notifications Null</p>
                            </div>
                        )}

                        <div className="relative flex items-center gap-4 pl-6 border-l border-white/10">
                            <button
                                type="button"
                                onClick={() => setHeaderDropdown(prev => prev === 'user' ? null : 'user')}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF7A18]/20 to-[#5B8CFF]/10 text-white flex items-center justify-center font-black text-xs border border-white/10 group-hover:border-[#FF7A18]/50 transition-all italic">AD</div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F8FAFC] italic">Eluru Overseer</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[#AAB2C5]/50">Primary Access Restricted</p>
                                </div>
                                <ChevronDown size={16} className={`text-[#AAB2C5] hidden md:block transition-transform duration-500 ${headerDropdown === 'user' ? 'rotate-180 text-white' : ''}`} />
                            </button>
                            {headerDropdown === 'user' && (
                                <div className="glass-card absolute right-0 top-full mt-4 w-56 rounded-[1.5rem] border border-white/10 shadow-3xl py-2 z-50">
                                    <button
                                        type="button"
                                        onClick={() => { setHeaderDropdown(null); localStorage.clear(); window.location.href = '/'; }}
                                        className="flex items-center gap-3 w-full px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-white/5 transition-all italic"
                                    >
                                        <Power size={18} /> Exit Matrix
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
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-[#FF7A18]">
                                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl animate-pulse-subtle">
                                            {React.createElement(tabs.find(t => t.id === activeTab)?.icon || LayoutDashboard, { size: 24 })}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">System Terminal</span>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none transform -skew-x-6">
                                        {activeTab}
                                    </h2>
                                    <p className="text-[#AAB2C5] text-xs font-black uppercase tracking-widest max-w-lg italic opacity-70">
                                        Universal administrative access to {activeTab} protocol data. Real-time encryption active.
                                    </p>

                                    {(activeTab === 'rides' || activeTab === 'dine') && (
                                        <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-xl w-fit mt-8">
                                            {['all', 'on', 'off'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStatusFilter(s)}
                                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${statusFilter === s ? 'text-white' : 'text-[#AAB2C5] hover:text-[#F8FAFC]'}`}
                                                >
                                                    {statusFilter === s && (
                                                        <motion.div
                                                            layoutId="status-bg"
                                                            className="absolute inset-0 bg-white/10 border border-white/10 rounded-2xl shadow-xl"
                                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    <span className="relative z-10">{s === 'all' ? 'All' : s === 'on' ? 'Open' : 'Closed'}</span>
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
                                        className="btn-premium px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl flex items-center gap-4 group/add italic"
                                    >
                                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                                        {activeTab === 'rides' ? 'Add Ride' : 'Add Dine'}
                                    </button>
                                )}
                            </div>

                            {/* ANALYTICS VIEW */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-8">
                                    {/* Stat Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} color="text-[#FF7A18]" bg="bg-[#FF7A18]/10" />
                                        <StatCard title="Universal Bookings" value={bookings.length} icon={Ticket} color="text-[#5B8CFF]" bg="bg-[#5B8CFF]/10" />
                                        <StatCard title="Live Flow" value={orders.length} icon={ShoppingCart} color="text-emerald-500" bg="bg-emerald-500/10" />
                                        <StatCard title="Active Rides" value={activeRidesCount} icon={Gamepad2} color="text-purple-500" bg="bg-purple-500/10" />
                                    </div>

                                    {/* Recent Activity Table using a DataGrid style */}
                                    <div className="glass-card rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden mt-12">
                                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                            <h3 className="font-black text-2xl text-[#F8FAFC] uppercase tracking-tighter italic">Transaction Log</h3>
                                            <button type="button" onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-[#FF7A18] uppercase tracking-[0.3em] hover:text-white transition-colors italic group flex items-center gap-2">
                                                Full Matrix <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-white/2">
                                                    <tr>
                                                        <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Id Ride</th>
                                                        <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Customer Core</th>
                                                        <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Class Type</th>
                                                        <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Value</th>
                                                        <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">State</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {(() => {
                                                        const txList = [...orders, ...bookings]
                                                            .filter(item => item && (item._id || item.id))
                                                            .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
                                                        const totalTxPages = Math.ceil(txList.length / 5);
                                                        const txDisplay = txList.slice((recentTxPage - 1) * 5, recentTxPage * 5);

                                                        return (
                                                            <>
                                                                {txDisplay.map((item, idx) => (
                                                                    <tr key={item._id || item.id || idx} className="hover:bg-white/5 transition-all group">
                                                                        <td className="px-10 py-8 text-[12px] font-black text-[#AAB2C5] font-mono italic">
                                                                            <span className="text-[#FF7A18]">#</span>{(item._id || item.id || '').toString().slice(-6).toUpperCase()}
                                                                        </td>
                                                                        <td className="px-10 py-8">
                                                                            <span className="text-sm font-black text-[#F8FAFC] uppercase tracking-tighter italic block">{item.userDetails?.name || item.name || item.userId || 'Guest'}</span>
                                                                            <span className="text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-widest block mt-1">Encrypted Identity</span>
                                                                        </td>
                                                                        <td className="px-10 py-8">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 ${item.items ? 'bg-[#5B8CFF]/10 text-[#5B8CFF]' : 'bg-[#FF7A18]/10 text-[#FF7A18]'}`}>
                                                                                    {item.items ? <ShoppingCart size={14} /> : <Calendar size={14} />}
                                                                                </div>
                                                                                <span className="text-[10px] font-black text-[#AAB2C5] uppercase tracking-widest italic">{item.items && item.items.length ? 'Live Flow' : 'Vault Reserve'}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-10 py-8 text-sm font-black text-white italic tracking-tighter">₹{item.amount ?? item.totalAmount ?? item.totalPrice ?? 0}</td>
                                                                        <td className="px-10 py-8">
                                                                            <StatusBadge status={item.status || item.orderStatus || 'confirmed'} />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {txList.length > 5 && (
                                                                    <tr>
                                                                        <td colSpan="5" className="px-10 py-8 border-t border-white/5">
                                                                            <div className="flex items-center justify-between">
                                                                                <button disabled={recentTxPage === 1} onClick={() => setRecentTxPage(prev => prev - 1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-20 italic">Decouple</button>
                                                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#AAB2C5]/30 italic">Eluru Index {recentTxPage} / {totalTxPages}</span>
                                                                                <button disabled={recentTxPage === totalTxPages || totalTxPages === 0} onClick={() => setRecentTxPage(prev => prev + 1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-20 italic">Recouple</button>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                    {filteredProducts.filter(p => p.category === (activeTab === 'rides' ? 'play' : 'food')).map(item => (
                                        <div key={item.id} className="group glass-card rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-[#FF7A18]/50 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                                            <div className="relative h-64 overflow-hidden">
                                                <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-60" />
                                                <div className="absolute inset-0 bg-[#070B14]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <button onClick={() => {
                                                        setEditingItem(item);
                                                        setFormData({
                                                            ...item,
                                                            start_time: item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : '',
                                                            end_time: item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : ''
                                                        });
                                                        setIsModalOpen(true);
                                                    }} className="w-12 h-12 bg-white/10 rounded-2xl text-white backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-[#FF7A18] hover:border-transparent transition-all"><Edit2 size={20} /></button>
                                                    <button onClick={() => handleDelete(item.id, 'product')} className="w-12 h-12 bg-white/10 rounded-2xl text-red-400 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-transparent transition-all"><Trash2 size={20} /></button>
                                                </div>
                                                <div className="absolute top-4 right-4 bg-[#FF7A18] px-4 py-1.5 rounded-full text-[10px] font-black text-white shadow-2xl tracking-widest uppercase italic border border-white/20">
                                                    ₹{item.price}
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-4">
                                                <h3 className="font-black text-[#F8FAFC] text-2xl uppercase italic tracking-tighter transform -skew-x-6">{item.name}</h3>
                                                <p className="text-[#AAB2C5]/60 text-[10px] font-black uppercase tracking-widest line-clamp-2 leading-relaxed italic">{item.description}</p>

                                                {(activeTab === 'rides' || activeTab === 'dine') && (
                                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                        <div className="flex flex-col gap-2">
                                                            <div
                                                                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] italic border ${(item.status === 'on' || (item.open !== false && !item.status))
                                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                                    }`}
                                                            >
                                                                {(item.status === 'on' || (item.open !== false && !item.status)) ? 'Ride: Active' : 'Ride: Locked'}
                                                            </div>
                                                            {activeTab === 'dine' && (
                                                                <div className="flex items-center gap-2 text-[8px] font-black text-[#5B8CFF] uppercase tracking-widest italic opacity-60">
                                                                    <Utensils size={10} /> UNIT: {item.stall}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(item)}
                                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 ${(item.status === 'on' || (item.open !== false && !item.status))
                                                                ? 'bg-[#FF7A18] shadow-[0_0_15px_#FF7A18]'
                                                                : 'bg-white/10 border border-white/10'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-2xl transition-transform duration-500 ${(item.status === 'on' || (item.open !== false && !item.status))
                                                                    ? 'translate-x-6'
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
                                            <thead className="bg-white/2 border-b border-white/5">
                                                <tr>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Id Ride</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Customer Core</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Payload Details</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Timestamp</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Value</th>
                                                    <th className="px-10 py-6 text-left text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">State</th>
                                                    <th className="px-10 py-6 text-right text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Operations</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
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
                                                                <tr key={item._id || item.id || idx} className="hover:bg-white/5 transition-all group">
                                                                    <td className="px-10 py-8 text-[12px] font-black text-[#AAB2C5] font-mono italic">
                                                                        <span className="text-[#FF7A18]">#</span>{String(item._id || item.id || '').slice(-6).toUpperCase()}
                                                                    </td>
                                                                    <td className="px-10 py-8">
                                                                        <div className="text-sm font-black text-[#F8FAFC] uppercase tracking-tighter italic">{item.userDetails?.name || item.name || 'Guest'}</div>
                                                                        <div className="text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-widest mt-1">{item.userDetails?.phone || item.phone}</div>
                                                                    </td>
                                                                    <td className="px-10 py-8 text-[10px] font-black text-[#AAB2C5] uppercase tracking-widest italic max-w-xs truncate">
                                                                        {isBookingsTab
                                                                            ? (item.facility || 'Ride Reserve')
                                                                            : (item.items?.map(i => `${i.name} [${i.quantity}]`).join(', '))}
                                                                    </td>
                                                                    <td className="px-10 py-8 text-[10px] font-black text-[#AAB2C5] uppercase tracking-widest italic">
                                                                        {new Date(item.date || item.createdAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-10 py-8 text-sm font-black text-white italic tracking-tighter">
                                                                        ₹{item.totalPrice || item.totalAmount}
                                                                    </td>
                                                                    <td className="px-10 py-8">
                                                                        <StatusBadge status={item.status || item.orderStatus || 'confirmed'} />
                                                                    </td>
                                                                    <td className="px-10 py-8 text-right">
                                                                        <button
                                                                            onClick={() => handleDelete(item._id || item.id, isBookingsTab ? 'booking' : 'order')}
                                                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#AAB2C5] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {list.length > 10 && (
                                                                <tr>
                                                                    <td colSpan="7" className="px-10 py-8 border-t border-white/5">
                                                                        <div className="flex items-center justify-between">
                                                                            <button disabled={currentPage === 1} onClick={() => setPage(prev => prev - 1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-20 italic">Decouple</button>
                                                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#AAB2C5]/30 italic">Eluru Index {currentPage} / {totalPages}</span>
                                                                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setPage(prev => prev + 1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-20 italic">Recouple</button>
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070B14]/80 backdrop-blur-2xl p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 40, opacity: 0 }}
                            className="glass-card rounded-[3rem] shadow-3xl w-full max-w-2xl overflow-hidden border border-white/10"
                        >
                            <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF7A18] italic block mb-2">Protocol Override</span>
                                    <h3 className="text-3xl font-black italic tracking-tighter uppercase transform -skew-x-6">
                                        {editingItem ? 'Edit Metadata' : 'Add New Ride'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#AAB2C5] hover:text-white hover:bg-white/10 transition-all border border-white/10"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Ride Name</label>
                                    <input required type="text" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-white shadow-inner"
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter Designation" />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Value Core [₹]</label>
                                        <input required type="number" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-sm uppercase tracking-widest text-white shadow-inner"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Ride Class</label>
                                        <select disabled className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 outline-none font-black text-[10px] uppercase tracking-[0.2em] text-[#AAB2C5]/50 cursor-not-allowed italic" value={formData.category}>
                                            <option value="play">Thrill Ride</option>
                                            <option value="food">Food Item</option>
                                            <option value="event">Portal Event</option>
                                        </select>
                                    </div>
                                </div>
                                {formData.category === 'food' && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Station ID</label>
                                        <input required type="text" className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#5B8CFF]/50 outline-none transition-all font-black text-[10px] uppercase tracking-widest text-white shadow-inner"
                                            value={formData.stall} onChange={e => setFormData({ ...formData, stall: e.target.value })} placeholder="e.g. ST-01 ELURU" />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-8 p-6 bg-white/2 rounded-3xl border border-white/5 shadow-inner">
                                        <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
                                            {formData.image ? <img src={formData.image} className="w-full h-full object-cover brightness-110" /> : <div className="w-full h-full flex items-center justify-center text-[#AAB2C5]/20 text-[10px] font-black italic">NO DATA</div>}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Visual Protocol URL</label>
                                            <input
                                                type="text"
                                                placeholder="https://cloud.eluru/img.png"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full bg-white/5 px-5 py-3 text-[10px] font-black rounded-xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all text-white placeholder-[#AAB2C5]/20"
                                            />
                                            <p className="text-[8px] font-black text-[#FF7A18] uppercase tracking-widest italic opacity-50">Local uploads offline. Sync via cloud interface.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.3em] italic">Operation Brief</label>
                                    <textarea className="w-full bg-white/5 px-6 py-5 rounded-2xl border border-white/10 focus:border-[#FF7A18]/50 outline-none transition-all font-black text-xs uppercase tracking-widest text-white shadow-inner leading-relaxed resize-none italic"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="4" placeholder="Input operation parameters..."></textarea>
                                </div>
                                <button type="submit" className="btn-premium w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-3xl italic mt-6 group flex items-center justify-center gap-4">
                                    {editingItem ? 'Update Parameters' : 'Deploy Ride'}
                                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
    <div className="glass-card p-10 rounded-[3rem] border border-white/5 shadow-3xl relative overflow-hidden group hover:border-[#FF7A18]/30 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                <Icon size={28} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-[#AAB2C5]/30 uppercase tracking-[0.4em] italic mb-1">Status</span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Live Flow</span>
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-5xl font-black italic tracking-tighter text-white mb-2 transform -skew-x-6">{value}</h3>
            <p className="text-[10px] font-black text-[#AAB2C5]/40 uppercase tracking-[0.5em] italic leading-none">{title}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        placed: 'bg-[#5B8CFF]/10 text-[#5B8CFF] border-[#5B8CFF]/20',
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] italic border ${styles[status] || 'bg-white/5 text-[#AAB2C5] border-white/10'}`}>
            {status}
        </span>
    );
};

export default AdminDashboard;
