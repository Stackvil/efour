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
        showToast(`${item.name} synchronized to terminal!`);
    };

    if (isLoading.menu && menuData.length === 0) {
        return (
            <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-[#FF7A18] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,122,24,0.3)]" />
                <p className="text-[#AAB2C5] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Synchronizing Culinary Database...</p>
            </div>
        );
    }

    const showComingSoon = !isLoading.menu && menuData.length === 0;

    if (showComingSoon) {
        return (
            <div className="bg-[#070B14] min-h-screen pt-32 pb-24 overflow-hidden relative selection:bg-[#FF7A18]/30">
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
                                The Table Eluru : Eluru Core
                            </h4>

                            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] transform -skew-x-6 mb-12 text-[#F8FAFC]">
                                Coming <br />
                                <span className="text-gradient-primary">Soon</span>
                            </h1>

                            <p className="text-[#AAB2C5] text-lg md:text-xl font-medium max-w-2xl mx-auto italic leading-relaxed mb-20 px-4 opacity-60">
                                We are currently engineering a world-class gastronomic journey.
                                Eluru's definitive premium open-air multi-ride experience is arriving soon to redefine your cultural standards.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32">
                                <div className="group flex items-center gap-6 bg-white/5 backdrop-blur-3xl px-10 py-6 rounded-[2.5rem] shadow-3xl border border-white/5 hover:border-[#FF7A18]/20 transition-all duration-700">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#FF7A18] group-hover:bg-[#FF7A18] group-hover:text-white transition-all duration-500 shadow-inner">
                                        <Clock size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#AAB2C5]/40 mb-1">Target Sequence</p>
                                        <p className="text-md font-black uppercase text-[#F8FAFC] italic tracking-widest">Opening Soon</p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>

                        {/* Features Matrix Architecture */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                            {[
                                {
                                    title: "Culinary Selection",
                                    desc: "Hand-picked stalls serving the finest global cuisines from high-street to refined fine dining.",
                                    icon: "01"
                                },
                                {
                                    title: "Architectural Vibe",
                                    desc: "Boutique, modern spaces integrated with nature for the definitive luxury social ambiance.",
                                    icon: "02"
                                },
                                {
                                    title: "Digital Integration",
                                    desc: "Seamless Eluru ordering from any stall, allowing you to synchronize your favorites instantly.",
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
        <div className="bg-[#070B14] min-h-screen pt-32 pb-32 selection:bg-[#FF7A18]/30 overflow-hidden relative">
            {/* Background Decorative Architecture */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#FF7A18]/5 to-transparent z-0 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* --- Header Section Architecture --- */}
                <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-[#FF7A18] font-black uppercase tracking-[0.5em] text-[10px] italic">Culinary Stalls</span>
                                <div className="w-8 h-px bg-white/10" />
                            </div>
                            <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter text-[#F8FAFC] leading-[0.85] transform -skew-x-6 mb-8 uppercase">
                                The <span className="text-gradient-primary">Table</span> <br />
                                Eluru
                            </h1>
                            <p className="text-[#AAB2C5] text-lg font-medium italic opacity-60 max-w-md border-l-2 border-white/10 pl-8">
                                Explore a curated Eluru of global flavors from our premium architectural food stalls.
                            </p>
                        </motion.div>
                    </div>

                    <div className="w-full md:max-w-md">
                        <div className="relative group">
                            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FF7A18] transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search System (e.g., Pizza, Burger)"
                                className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] pl-16 pr-6 py-6 text-sm font-black uppercase tracking-widest text-[#F8FAFC] placeholder-white/10 shadow-inner focus:ring-4 focus:ring-[#FF7A18]/5 focus:border-[#FF7A18]/30 backdrop-blur-3xl outline-none transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Stall Filter Navigation --- */}
                <div className="flex gap-4 overflow-x-auto pb-10 mb-16 no-scrollbar snap-x">
                    {stalls.map(stall => (
                        <button
                            key={stall}
                            onClick={() => setActiveStall(stall)}
                            className={`px-10 py-4 rounded-2xl whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.3em] border transition-all duration-500 italic snap-start transform -skew-x-6 ${activeStall === stall
                                ? 'bg-white text-[#070B14] border-white shadow-[0_15px_35px_rgba(255,255,255,0.2)] scale-105'
                                : 'bg-white/5 border-white/10 text-[#AAB2C5]/60 hover:border-[#FF7A18]/30 hover:text-white backdrop-blur-3xl'
                                }`}
                        >
                            {stall}
                        </button>
                    ))}
                </div>

                {/* --- Menu Matrix Architecture --- */}
                <div className="matrix-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx, 12) * 0.05 }}
                                className="glass-card group rounded-[3.5rem] overflow-hidden flex flex-col h-full border border-white/10 hover:border-[#FF7A18]/40 hover:shadow-[0_45px_100px_rgba(255,122,24,0.15)] transition-all duration-700"
                            >
                                {/* Media Architecture */}
                                <div className="relative h-72 overflow-hidden">
                                    <OptimizedImage
                                        src={item.image}
                                        alt={item.name}
                                        priority={idx < 8}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-105"
                                    />

                                    {/* Price Elevation */}
                                    <div className="absolute top-6 right-6 bg-white/5 backdrop-blur-3xl px-5 py-2.5 rounded-2xl shadow-3xl border border-white/10 group-hover:border-white/20 transition-all">
                                        <span className="text-gradient-price font-black text-lg tracking-tight italic font-heading">₹{item.price}</span>
                                    </div>

                                    {/* Stall Identity */}
                                    <div className="absolute top-6 left-6 bg-white/5 backdrop-blur-3xl px-4 py-2 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[#FF7A18] animate-pulse shadow-[0_0_8px_#FF7A18]" />
                                        <span className="text-white text-[11px] font-bold uppercase tracking-widest italic">{item.stall}</span>
                                    </div>

                                    {/* Depth Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                                </div>

                                {/* Content Architecture */}
                                <div className="p-6 md:p-10 flex flex-col flex-grow">
                                    <div className="mb-4 md:mb-6 flex items-center justify-between">
                                        <h3 className="text-xl md:text-2xl font-black text-[#F8FAFC] tracking-tighter uppercase group-hover:text-[#FF7A18] transition-colors leading-none transform -skew-x-6 duration-700">
                                            {item.name}
                                        </h3>
                                        <Star size={18} className="text-[#FF7A18] fill-[#FF7A18] opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <p className="text-[#AAB2C5] text-xs md:text-sm font-medium leading-relaxed mb-6 md:mb-10 flex-grow line-clamp-2 italic border-l border-white/10 pl-4 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
                                        {item.description || item.desc || 'Premium culinary creation engineered for the definitive dining experience.'}
                                    </p>

                                    {/* Action Integration */}
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-white/5 hover:bg-white text-white hover:text-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[1.8rem] font-bold text-[11px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-3 md:gap-4 group/btn border border-white/5 hover:border-white shadow-3xl transform active:scale-95"
                                    >
                                        <div className="p-1.5 md:p-2 bg-white/10 rounded-xl shadow-inner group-hover/btn:bg-black group-hover/btn:text-white transition-colors duration-500">
                                            <ShoppingCart size={14} />
                                        </div>
                                        SYNC ORDER
                                    </button>
                                </div>

                                {/* Aesthetic Side Ornament */}
                                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-[#FF7A18] transition-all duration-1000 ease-in-out" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
                        <h3 className="text-2xl md:text-3xl font-black text-[#F8FAFC] mb-4 uppercase tracking-tight italic">Zero Stalls Detected</h3>
                        <p className="text-[12px] md:text-base font-medium italic opacity-50">System scan returned no culinary data matching your search.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dine;


