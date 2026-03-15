import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import useStore from '../store/useStore';
import RideCard from '../components/RideCard';
import OptimizedImage from '../components/common/OptimizedImage';
import Hero from '../components/Hero';
import About from '../components/About';

const Home = () => {
    // Selectors for optimized re-renders
    const rides = useStore(state => state.rides);
    const fetchRides = useStore(state => state.fetchRides);
    const isLoading = useStore(state => state.isLoading.rides);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input to prevent expensive re-filtering
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchRides(true);
    }, [fetchRides]);

    const visibleRides = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();
        return rides
            .filter(r => (r?.status ? r.status === 'on' : true))
            .filter(r => (term ? (r?.title || '').toLowerCase().includes(term) : true));
    }, [rides, search]);


    return (
        <div className="flex flex-col bg-[#070B14]">
            {/* --- HERO SECTION: CINEMATIC IMMERSION --- */}
            <Hero />

            {/* --- RIDES SECTION: THE MATRIX GRID --- */}
            <section id="rides" className="relative py-24 md:py-32 overflow-hidden selection:bg-[#FF7A18]/30">
                {/* Background Texture & Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#FF7A18]/5 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#5B8CFF]/5 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-20 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none transform -skew-x-6 text-[#F8FAFC]">
                                All <span className="text-gradient-primary">Rides</span>
                            </h2>
                            <p className="text-[#AAB2C5] text-sm font-medium italic max-w-lg opacity-60">
                                Choose your favorite rides and book your tickets easily.
                            </p>
                        </div>

                        <div className="w-full lg:max-w-md">
                            <div className="relative group">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FF7A18] transition-colors" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search System (e.g., Train, Bumper)"
                                    className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 text-[#F8FAFC] placeholder-white/20 px-14 py-5 text-sm font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-[#FF7A18]/5 focus:border-[#FF7A18]/30 backdrop-blur-xl transition-all duration-500 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {isLoading && rides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-6">
                                <div className="w-16 h-16 border-4 border-[#FF7A18] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,122,24,0.3)]" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#AAB2C5] animate-pulse">Initializing System...</p>
                            </div>
                        ) : visibleRides.length === 0 ? (
                            <div className="glass-card rounded-[3rem] border border-white/10 p-24 text-center">
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white/20">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-[#F8FAFC] uppercase tracking-tight mb-2 italic">No Rides Found</h3>
                                <p className="text-[#AAB2C5] text-sm font-medium italic opacity-50">System scan returned zero matching data.</p>
                            </div>
                        ) : (
                            <div className="matrix-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {visibleRides.map((ride, index) => (
                                    <motion.div
                                        key={ride.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(index, 12) * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <RideCard ride={ride} priority={index < 12} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* --- PHILOSOPHY SECTION: THE 4 E's --- */}
            <About />
        </div>
    );
};

export default Home;
