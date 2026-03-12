import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Utensils, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import useStore from '../store/useStore';
import RideCard from '../components/RideCard';

import OptimizedImage from '../components/common/OptimizedImage';


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

    // Handlers mapped to RideCard component to manage individual quantity states

    // Handlers moved to RideCard component to manage individual quantity states
    const philosophy = [
        { title: 'Eat', icon: <Utensils className="text-white" size={32} />, color: 'bg-sunset-orange', desc: 'Coming Soon - A premium gastronomic journey through the finest vendors in Eluru.' },
        { title: 'Enjoy', icon: <Zap className="text-white" size={32} />, color: 'bg-riverside-teal', desc: 'Relax and unwind in a vibrant, open-air atmosphere.' },
        { title: 'Entertain', icon: <Play className="text-white" size={32} />, color: 'bg-charcoal-grey', desc: 'Thriller zones for kids and high-energy gaming for the youth at Eluru.' },
        { title: 'Eluru', icon: <MapPin className="text-white" size={32} />, color: 'bg-blue-600', desc: 'Located in the heart of the city, bringing joy to every family.' },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative h-[35vh] min-h-[300px] flex flex-col justify-end pb-10 pt-20 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <OptimizedImage
                        src="/bumping cars double/Bumper_Cars_9944_14762891777.jpg"
                        alt="Background"
                        className="w-full h-full object-cover object-center"
                        priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white/85" />
                </div>

                <div className="relative z-10 container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-2xl md:text-4xl font-heading font-black text-white mb-1 leading-tight drop-shadow-xl">
                            Start Booking <span className="text-sunset-orange">Your Fun</span>
                        </h1>
                        <p className="text-slate-100 text-xs md:text-sm font-medium max-w-lg mx-auto leading-relaxed opacity-95">
                            Select rides below and add to cart.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Rides Section */}
            <section className="relative py-8 md:py-12 overflow-hidden bg-gray-900">
                {/* Background Image for Rides Section */}
                <div className="absolute inset-0 z-0">
                    <OptimizedImage
                        src="/trampoline/trampoline.webp"
                        alt="Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-white">
                                All <span className="text-sunset-orange">Rides</span>
                            </h2>
                            <p className="text-sm text-gray-300 max-w-lg">
                                Explore all our attractions and book your tickets instantly.
                            </p>
                        </div>

                        <div className="w-full lg:max-w-md">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search rides (e.g., Train Ride, Bungee Jump)"
                                    className="w-full rounded-full border border-gray-700 bg-gray-800/80 text-white placeholder-gray-400 px-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sunset-orange/50 focus:border-sunset-orange/50 backdrop-blur-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.45 }}
                    >
                        {isLoading && rides.length === 0 ? (
                            <div className="flex justify-center py-20">
                                <div className="w-10 h-10 border-4 border-sunset-orange border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : visibleRides.length === 0 ? (
                            <div className="rounded-3xl border border-gray-700 bg-gray-800/50 p-6 text-center text-sm text-gray-400 backdrop-blur-md">
                                No rides found matching your search.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                {visibleRides.map((ride, index) => (
                                    <motion.div
                                        key={ride.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: Math.min(index, 10) * 0.03 }}
                                        className="h-full"
                                    >
                                        <RideCard ride={ride} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section - The 4 E's */}
            <section className="relative py-16 md:py-24 overflow-hidden bg-[#fafafa]">
                {/* Advanced Mesh Gradient Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sunset-orange/5 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-riverside-teal/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-lg shadow-gray-100 border border-gray-100 mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunset-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sunset-orange"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">The Core Experience</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-heading font-black text-charcoal-grey leading-tight tracking-tighter mb-6">
                            The <span className="relative inline-block">
                                <span className="relative z-10 text-sunset-orange italic">4 E's</span>
                                <svg className="absolute -bottom-1 left-0 w-full h-3 text-riverside-teal/20" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="8" />
                                </svg>
                            </span> Philosophy
                        </h2>

                        <p className="text-base md:text-lg text-gray-400 font-medium max-w-xl mx-auto leading-relaxed italic">
                            Redefining entertainment through a perfect harmony of culture, thrill, and hospitality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                        {philosophy.map((item, i) => {
                            const colors = {
                                'Eat': { primary: '#FF4D17', secondary: '#FF8A00', shadow: 'rgba(255, 77, 23, 0.4)' },
                                'Enjoy': { primary: '#00C9B7', secondary: '#00EDD4', shadow: 'rgba(0, 201, 183, 0.4)' },
                                'Entertain': { primary: '#1A1A1A', secondary: '#444444', shadow: 'rgba(0, 0, 0, 0.3)' },
                                'Eluru': { primary: '#2A5CFF', secondary: '#0083FE', shadow: 'rgba(42, 92, 255, 0.4)' }
                            }[item.title];

                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative group h-full"
                                >
                                    {/* Advanced Glass Card */}
                                    <div className="relative h-full bg-white p-8 md:p-10 rounded-[3.5rem] border-2 border-gray-50 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.08)] group-hover:shadow-[0_45px_90px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-4 transition-all duration-700 flex flex-col items-center text-center overflow-hidden z-10">

                                        {/* Vibrant Corner Accent */}
                                        <div className="absolute top-0 right-0 w-24 h-24 rotate-45 translate-x-12 -translate-y-12 transition-all duration-700 group-hover:scale-150"
                                            style={{ background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`, opacity: 0.1 }} />

                                        {/* Floating background decorative number */}
                                        <div className="absolute top-6 right-8 text-7xl font-black text-gray-100/40 select-none group-hover:text-sunset-orange/10 transition-colors duration-500 italic">
                                            0{i + 1}
                                        </div>

                                        {/* Icon Container - Bold & Bright */}
                                        <div className="relative mb-10">
                                            <motion.div
                                                whileHover={{ scale: 1.15, rotate: 10 }}
                                                className="w-20 h-20 md:w-24 md:h-24 rounded-[1.8rem] flex items-center justify-center relative shadow-2xl transition-all duration-500"
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                                    boxShadow: `0 15px 30px -10px ${colors.shadow}`
                                                }}
                                            >
                                                <div className="relative z-10 text-white drop-shadow-lg">
                                                    {React.cloneElement(item.icon, { size: 36, strokeWidth: 2.5 })}
                                                </div>

                                                {/* Infinite Pulse Glow */}
                                                <div className="absolute inset-0 rounded-[1.8rem] animate-ping opacity-20 pointer-events-none"
                                                    style={{ backgroundColor: colors.primary }} />
                                            </motion.div>
                                        </div>

                                        {/* High-Contrast Typography */}
                                        <h3 className="text-3xl font-heading font-black mb-4 text-charcoal-grey tracking-tighter group-hover:scale-105 transition-transform duration-500">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-500 font-bold leading-relaxed text-sm mb-10 opacity-80 group-hover:opacity-100 group-hover:text-gray-900 transition-all duration-500">
                                            {item.desc}
                                        </p>

                                        {/* Action Button - Vibrant */}
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-gray-50 group-hover:bg-charcoal-grey transition-all duration-500 shadow-sm hover:shadow-lg">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors duration-500">
                                                    Explore More
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom Progress Bar */}
                                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-50">
                                            <div className="h-full w-0 group-hover:w-full transition-all duration-1000 ease-in-out"
                                                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Riverside Section - Parallax style background */}

        </div>
    );
};

export default Home;
