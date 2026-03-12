import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Clock, Bell, Sparkles, Search, ShoppingBag, Plus, Star } from 'lucide-react';
import useStore from '../store/useStore';
import OptimizedImage from '../components/common/OptimizedImage';

const Dine = () => {
    const { menuData, fetchMenu, isLoading, addToCart } = useStore();
    const [search, setSearch] = useState('');
    const [activeStall, setActiveStall] = useState('All');

    useEffect(() => {
        fetchMenu(true);
    }, [fetchMenu]);

    const stalls = useMemo(() => {
        const uniqueStalls = ['All', ...new Set(menuData.map(item => item.stall).filter(Boolean))];
        return uniqueStalls;
    }, [menuData]);

    const filteredMenu = useMemo(() => {
        return menuData.filter(item => {
            const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.stall?.toLowerCase().includes(search.toLowerCase());
            const matchesStall = activeStall === 'All' || item.stall === activeStall;
            return matchesSearch && matchesStall && (item.open !== false && item.status !== 'off');
        });
    }, [menuData, search, activeStall]);

    if (isLoading.menu && menuData.length === 0) {
        return (
            <div className="min-h-screen bg-creamy-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-sunset-orange border-t-transparent rounded-full animate-spin" />
                <p className="text-charcoal-grey font-black uppercase tracking-widest text-xs animate-pulse">Fetching Culinary Delights...</p>
            </div>
        );
    }

    // Determine if we should show "Coming Soon"
    // We show it ONLY if we aren't loading AND there's no data
    const showComingSoon = !isLoading.menu && menuData.length === 0;

    if (showComingSoon) {
        return (
            <div className="bg-creamy-white min-h-screen pt-32 pb-24 overflow-hidden relative">
                {/* Abstract Background Decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sunset-orange/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-riverside-teal/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="flex justify-center mb-10">
                                <div className="relative">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-10px] border border-dashed border-sunset-orange/30 rounded-full"
                                    />
                                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 border border-gray-50 scale-110">
                                        <Utensils className="text-sunset-orange" size={40} />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-riverside-teal rounded-full flex items-center justify-center text-white shadow-lg z-20"
                                    >
                                        <Sparkles size={16} />
                                    </motion.div>
                                </div>
                            </div>

                            <h4 className="text-[10px] font-black text-riverside-teal uppercase tracking-[0.6em] mb-4">
                                Culinary Experience
                            </h4>

                            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] transform -skew-x-6 mb-10 text-charcoal-grey">
                                Coming <br />
                                <span className="bg-gradient-to-r from-sunset-orange to-orange-600 bg-clip-text text-transparent">Soon</span>
                            </h1>

                            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto italic leading-relaxed mb-16 px-4">
                                We are currently designing a world-class gastronomic journey.
                                Eluru's first premium open-air multi-vendor experience is arriving soon to redefine your dining standards.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
                                <div className="group flex items-center gap-4 bg-white px-8 py-5 rounded-[2rem] shadow-xl shadow-black/5 border border-gray-100 hover:border-sunset-orange/30 transition-all duration-500">
                                    <div className="w-10 h-10 bg-sunset-orange/10 rounded-xl flex items-center justify-center text-sunset-orange group-hover:scale-110 transition-transform">
                                        <Clock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Launch</p>
                                        <p className="text-sm font-black uppercase text-charcoal-grey">Opening Soon</p>
                                    </div>
                                </div>

                                <button className="bg-charcoal-grey text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-sunset-orange hover:translate-y-[-4px] active:translate-y-0 transition-all duration-500 shadow-2xl shadow-charcoal-grey/20 flex items-center gap-4 group">
                                    <Bell size={18} className="group-hover:animate-shake" />
                                    Notify Me
                                </button>
                            </div>
                        </motion.div>

                        {/* Features Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                            {[
                                {
                                    title: "Gourmet Selection",
                                    desc: "Hand-picked vendors serving the finest global cuisines from street food to fine dining.",
                                    icon: "01"
                                },
                                {
                                    title: "Open-Air Design",
                                    desc: "Boutique, modern spaces integrated with nature for the perfect social ambiance.",
                                    icon: "02"
                                },
                                {
                                    title: "Smart Ordering",
                                    desc: "Seamless digital ordering from any stall, allowing you to mix and match your favorites.",
                                    icon: "03"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.8 }}
                                    className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 text-6xl font-black italic text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 -translate-y-4">
                                        {feature.icon}
                                    </div>
                                    <h4 className="font-black text-charcoal-grey uppercase tracking-[0.2em] mb-4 text-sm relative z-10">{feature.title}</h4>
                                    <div className="w-10 h-1 bg-sunset-orange mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
                                    <p className="text-gray-500 text-xs font-semibold italic leading-relaxed relative z-10">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes shake {
                        0%, 100% { transform: rotate(0deg); }
                        25% { transform: rotate(10deg); }
                        75% { transform: rotate(-10deg); }
                    }
                    .group-hover\\:animate-shake {
                        animation: shake 0.5s ease-in-out infinite;
                    }
                `}} />
            </div>
        );
    }

    // Data exists, show Menu
    return (
        <div className="bg-[#FAFAFA] min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="text-sunset-orange font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Eat & Enjoy</span>
                            <h1 className="text-4xl md:text-5xl font-heading font-black text-charcoal-grey tracking-tight mb-4">
                                The <span className="text-riverside-teal italic">Table</span> Eluru
                            </h1>
                            <p className="text-gray-500 font-medium italic">
                                Explore a world of flavors from our premium food stalls.
                            </p>
                        </motion.div>
                    </div>

                    <div className="w-full md:max-w-md">
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sunset-orange transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search food, cuisines, stalls..."
                                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-sunset-orange/20 focus:border-sunset-orange outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Stall Filter */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-10 no-scrollbar">
                    {stalls.map(stall => (
                        <button
                            key={stall}
                            onClick={() => setActiveStall(stall)}
                            className={`px-8 py-3 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest border transition-all ${activeStall === stall
                                ? 'bg-charcoal-grey border-charcoal-grey text-white shadow-lg shadow-black/10'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-sunset-orange/30 hover:text-charcoal-grey'
                                }`}
                        >
                            {stall}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl">
                                        <span className="text-charcoal-grey font-black text-sm tracking-tight">₹{item.price}</span>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-riverside-teal px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
                                        <span className="text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Star size={10} fill="currentColor" /> {item.stall}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-heading font-black text-charcoal-grey mb-3 group-hover:text-sunset-orange transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-400 text-xs font-bold leading-relaxed mb-8 flex-grow line-clamp-2">
                                        {item.description || item.desc || 'Premium culinary creation from our master chefs.'}
                                    </p>

                                    <button
                                        onClick={() => addToCart(item)}
                                        className="w-full bg-[#F5F5F7] hover:bg-charcoal-grey text-charcoal-grey hover:text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                                    >
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover/btn:bg-white/10 transition-colors">
                                            <Plus size={14} />
                                        </div>
                                        ADD TO CART
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredMenu.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-xl font-black text-charcoal-grey mb-2 uppercase tracking-tight">No Items Found</h3>
                        <p className="text-gray-400 font-medium italic">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dine;

