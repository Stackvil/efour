import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Clock, Bell, Sparkles, Search, ShoppingBag, Plus, Star, Zap, ShoppingCart } from 'lucide-react';
import useStore from '../store/useStore';
import OptimizedImage from '../components/common/OptimizedImage';

const Dine = () => {
    const { menuData, fetchMenu, isLoading, addToCart, showToast } = useStore();
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

    const handleAddToCart = (item) => {
        addToCart(item);
        showToast(`${item.name} added to cart!`);
    };

    if (isLoading.menu && menuData.length === 0) {
        return (
            <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-[#FF7A18] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,122,24,0.3)]" />
                <p className="text-[#AAB2C5] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Loading food...</p>
            </div>
        );
    }

    const showComingSoon = !isLoading.menu && menuData.length === 0;

    if (showComingSoon) {
        return (
            <div className="min-h-screen bg-[#070B14] pt-40 md:pt-48 px-6 md:px-12 pb-24 md:pb-32 relative overflow-hidden selection:bg-[#FF7A18]/30">
                {/* Advanced Light Architecture */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF7A18]/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5B8CFF]/5 blur-[150px] rounded-full translate-y-1/4 -translate-x-1/4" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="flex justify-center mb-12">
                                <div className="relative group">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-15px] border border-white/5 rounded-full"
                                    />
                                    <div className="w-28 h-28 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl flex items-center justify-center relative z-10 border border-white/10 group-hover:border-[#FF7A18]/30 transition-all duration-700">
                                        <Utensils className="text-[#FF7A18] drop-shadow-[0_0_10px_rgba(255,122,24,0.3)]" size={44} />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1], y: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-3 -right-3 w-10 h-10 bg-[#FF7A18] rounded-2xl flex items-center justify-center text-white shadow-2xl z-20 border border-white/20"
                                    >
                                        <Sparkles size={18} className="animate-pulse" />
                                    </motion.div>
                                </div>
                            </div>

                            <h4 className="text-[10px] font-black text-[#FF7A18] uppercase tracking-[0.6em] mb-6 italic">
                                Efour Food Court
                            </h4>

                            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] transform -skew-x-6 mb-12 text-[#F8FAFC]">
                                Coming <br />
                                <span className="text-gradient-primary">Soon</span>
                            </h1>

                            <p className="text-[#AAB2C5] text-lg md:text-xl font-medium max-w-2xl mx-auto italic leading-relaxed mb-20 px-4 opacity-60">
                                We are making a great food experience for you.
                                The best place for food and fun in Eluru is opening soon.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32">
                                <div className="group flex items-center gap-6 bg-white/5 backdrop-blur-3xl px-10 py-6 rounded-[2.5rem] shadow-3xl border border-white/5 hover:border-[#FF7A18]/20 transition-all duration-700">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#FF7A18] group-hover:bg-[#FF7A18] group-hover:text-white transition-all duration-500 shadow-inner">
                                        <Clock size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#AAB2C5]/40 mb-1">Status</p>
                                        <p className="text-md font-black uppercase text-[#F8FAFC] italic tracking-widest">Opening Soon</p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>

                        {/* Features Matrix Architecture */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                            {[
                                {
                                    title: "Great Food",
                                    desc: "Choose from a wide variety of the best foods from our selected stalls.",
                                    icon: "01"
                                },
                                {
                                    title: "Great Place",
                                    desc: "Enjoy your food in a beautiful, modern outdoor space designed for comfort.",
                                    icon: "02"
                                },
                                {
                                    title: "Easy Ordering",
                                    desc: "Order fast from any stall using our simple system. No more long waits.",
                                    icon: "03"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + (i * 0.1), duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="group bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl hover:border-white/20 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 text-8xl font-black italic text-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-4 -translate-y-4">
                                        {feature.icon}
                                    </div>
                                    <h4 className="font-black text-[#F8FAFC] uppercase tracking-[0.4em] mb-6 text-[10px] relative z-10 italic">{feature.title}</h4>
                                    <div className="w-12 h-1 bg-[#FF7A18] mb-8 transform origin-left group-hover:scale-x-150 transition-transform duration-700 shadow-[0_0_10px_#FF7A18]" />
                                    <p className="text-[#AAB2C5] text-xs md:text-sm font-medium italic leading-relaxed relative z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#070B14] min-h-screen pt-44 md:pt-48 pb-32 selection:bg-[#FF7A18]/30 overflow-hidden relative">
            {/* Background Decorative Architecture */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF7A18]/5 to-transparent z-0 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* --- Header Section Architecture --- */}
                <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b border-white/5 pb-10 md:pb-16 text-center md:text-left">
                    <div className="max-w-2xl mx-auto md:mx-0">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-6">
                                <span className="text-[#FF7A18] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[9px] md:text-[10px] italic">Food Stalls</span>
                                <div className="hidden md:block w-8 h-px bg-white/10" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-8xl font-black italic tracking-tighter text-[#F8FAFC] leading-[0.9] md:leading-[0.85] transform -skew-x-6 mb-6 md:mb-8 uppercase">
                                The <span className="text-gradient-primary">Table</span> <br className="hidden md:block" />
                                <span className="md:hidden"> </span>Eluru
                            </h1>
                            <p className="text-[#AAB2C5] text-base md:text-lg font-medium italic opacity-60 max-w-md border-l-2 border-white/10 pl-6 md:pl-8 mx-auto md:mx-0">
                                Explore a collection of global flavors from our food stalls.
                            </p>
                        </motion.div>
                    </div>

                    <div className="w-full md:max-w-md">
                        <div className="relative group">
                            <Search size={18} md:size={22} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FF7A18] transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search (e.g., Pizza, Burger)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-[1.8rem] pl-14 md:pl-16 pr-5 md:pr-6 py-4 md:py-6 text-[12px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-widest text-[#F8FAFC] placeholder-white/10 shadow-inner focus:ring-4 focus:ring-[#FF7A18]/5 focus:border-[#FF7A18]/30 backdrop-blur-3xl outline-none transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Stall Filter Navigation --- */}
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 md:pb-10 mb-10 md:mb-16 no-scrollbar snap-x">
                    {stalls.map(stall => (
                        <button
                            key={stall}
                            onClick={() => setActiveStall(stall)}
                            className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl whitespace-nowrap text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] md:tracking-[0.3em] border transition-all duration-500 italic snap-start transform -skew-x-4 md:-skew-x-6 ${activeStall === stall
                                ? 'bg-white text-[#070B14] border-white shadow-[0_15px_35px_rgba(255,255,255,0.2)] scale-105'
                                : 'bg-white/5 border-white/10 text-[#AAB2C5]/60 hover:border-[#FF7A18]/30 hover:text-white backdrop-blur-3xl'
                                }`}
                        >
                            {stall}
                        </button>
                    ))}
                </div>

                <div className="matrix-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx, 12) * 0.05 }}
                                className="group relative bg-[#0F172A]/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-[#FF7A18]/50 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[#FF7A18]/10 hover:-translate-y-3"
                            >
                                {/* Media Architecture - Cinematic Focus */}
                                <div className="relative h-56 overflow-hidden">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        priority={idx < 8}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out brightness-90 group-hover:brightness-110"
                                    />

                                    {/* Advanced Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90" />
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F172A] to-transparent" />
                                    
                                    {/* Action Reveal - Slide Up HUD */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full bg-white/10 hover:bg-[#FF7A18] rounded-2xl text-white py-4 backdrop-blur-xl border border-white/20 flex items-center justify-center gap-3 transition-all group/btn shadow-2xl active:scale-95"
                                        >
                                            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Add to Cart</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Content Architecture - Minimalist & Bold */}
                                <div className="p-8 pt-2">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-[#FF7A18] transition-colors duration-500 transform -skew-x-2 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18]/30 group-hover:bg-[#FF7A18] group-hover:animate-pulse shadow-[0_0_10px_rgba(255,122,24,0)] group-hover:shadow-[0_0_15px_#FF7A18] transition-all duration-700 mt-2 shrink-0" />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-[#FF7A18]/50 transition-all duration-700" />
                                        <p className="text-[9px] font-black text-[#AAB2C5]/30 group-hover:text-[#AAB2C5]/60 uppercase tracking-[0.4em] italic transition-colors duration-700">
                                            {item.stall || 'Efour Area'}
                                        </p>
                                    </div>
                                </div>

                                {/* Aesthetic Side Ornament */}
                                <div className="absolute top-0 right-0 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-[#FF7A18] to-transparent transition-all duration-1000 ease-in-out" />
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* --- Minimalist Coming Soon Text --- */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="col-span-full py-16 text-center border-t border-white/5 mt-12 bg-gradient-to-r from-transparent via-white/5 to-transparent backdrop-blur-3xl rounded-[3rem]"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] animate-pulse shadow-[0_0_10px_#FF7A18]" />
                                <h3 className="text-[12px] font-black text-[#FF7A18] uppercase tracking-[0.5em] italic">More flavors coming soon</h3>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] animate-pulse shadow-[0_0_10px_#FF7A18]" />
                            </div>
                            <p className="text-[#AAB2C5] text-lg font-black italic uppercase tracking-tighter opacity-20 max-w-sm">
                                Pizza • Desserts • Beverages • Grill • More
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* --- Empty State Architecture --- */}
                {filteredMenu.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-24 md:py-48 text-center"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-white/20 shadow-4xl backdrop-blur-3xl">
                            <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-[#F8FAFC] mb-4 uppercase tracking-tight italic">No food found</h3>
                        <p className="text-[12px] md:text-base font-medium italic opacity-50">We couldn't find any food items matching your search.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dine;


