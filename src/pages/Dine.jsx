import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ShoppingCart, Clock, Filter, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';
import OptimizedImage from '../components/common/OptimizedImage';

const Dine = () => {
    // Selectors for optimized re-renders
    const menuData = useStore(state => state.menuData);
    const fetchMenu = useStore(state => state.fetchMenu);
    const isLoading = useStore(state => state.isLoading.menu);
    const { addToCart, cart, toggleCart } = useStore(); // Still using destructured for actions for brevity, but could optimize further if needed

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    // Use static stalls list with only 'All Stalls' as per user request
    const stalls = [{ id: 'all', name: 'All Stalls', category: 'all' }];

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchMenu(true);
    }, [fetchMenu]);

    const filteredItems = menuData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.stall === activeCategory;
        const term = debouncedSearch.trim().toLowerCase();
        const matchesSearch = (item.name || '').toLowerCase().includes(term) ||
            (item.stall && item.stall.toLowerCase().includes(term));

        // Show item if status is 'on' OR if status is missing/null/undefined (default to 'on')
        // Also support 'open' property if backend uses that instead
        const isOpen = (item.status === 'on' || (item.open !== false && !item.status));

        return matchesCategory && matchesSearch && isOpen;
    });

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="bg-creamy-white min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header Area */}
                <div className="bg-white p-8 rounded-3xl shadow-sm mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-gray-100">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-charcoal-grey mb-2 uppercase">Culinary Court</h1>
                        <p className="text-gray-500">Discover Eluru's first open-air multi-vendor experience.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 flex-grow md:max-w-xl">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search stalls or dishes..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-sunset-orange transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-charcoal-grey text-white px-6 py-3 rounded-xl font-bold">
                            <Filter size={18} /> Filter
                        </button>
                    </div>
                </div>

                {/* Categories / Stalls */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-12 no-scrollbar">
                    {stalls.map(stall => (
                        <button
                            key={stall.id}
                            onClick={() => setActiveCategory(stall.category)}
                            className={`px-8 py-3 rounded-full whitespace-nowrap transition-all font-bold ${(activeCategory === stall.category)
                                ? 'bg-riverside-teal text-white shadow-lg'
                                : 'bg-white text-gray-400 border border-gray-100 hover:border-riverside-teal'
                                }`}
                        >
                            {stall.name}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence mode="popLayout">
                        {isLoading && menuData.length === 0 && <div className="col-span-full text-center py-20 flex justify-center">
                            <div className="w-10 h-10 border-4 border-riverside-teal border-t-transparent rounded-full animate-spin" />
                        </div>}
                        {!isLoading && filteredItems.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center col-span-full">
                                <h2 className="text-4xl font-heading font-bold text-gray-300 mb-4 uppercase tracking-widest">Coming Soon</h2>
                                <p className="text-gray-400 max-w-md">We are currently curating the best culinary experiences for you. Stay tuned!</p>
                            </div>
                        )}
                        {filteredItems.map(item => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col group hover:shadow-lg transition-all"
                            >
                                <div className="h-32 overflow-hidden relative">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full font-black text-riverside-teal shadow-md text-[10px]">
                                        ₹{item.price}
                                    </div>
                                </div>
                                <div className="p-3 flex-grow flex flex-col">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-sunset-orange text-[9px] font-bold uppercase tracking-widest">{item.stall}</span>
                                    </div>
                                    <h3 className="text-sm font-heading font-bold text-charcoal-grey mb-2 line-clamp-1">{item.name}</h3>
                                    <button
                                        onClick={() => addToCart({
                                            id: `food-${item._id}`,
                                            name: item.name,
                                            price: item.price,
                                            image: item.image,
                                            stall: item.stall
                                        })}
                                        className="w-full bg-charcoal-grey text-white py-2 rounded-lg text-[9px] font-bold hover:bg-black transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Plus size={12} /> Add
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating Cart Button (Mobile) */}
            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-24 right-6 z-40 lg:hidden"
                    >
                        <button
                            onClick={toggleCart}
                            className="bg-sunset-orange text-white p-6 rounded-full shadow-2xl relative"
                        >
                            <ShoppingBag size={32} />
                            <span className="absolute top-0 right-0 bg-white text-sunset-orange w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-sunset-orange">
                                {cartCount}
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dine;
