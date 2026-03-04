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
        { title: 'Eat', icon: <Utensils className="text-white" size={32} />, color: 'bg-sunset-orange', desc: 'A Gastronomic journey through the best stalls in Eluru.' },
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
            <section className="py-16 container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl mb-4 font-heading">The <span className="text-sunset-orange">4 E's</span> Philosophy</h2>
                    <div className="w-20 h-1 bg-riverside-teal mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {philosophy.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-white p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className={`${item.color} w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-gray-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                {React.cloneElement(item.icon, { size: 32, strokeWidth: 2.5 })}
                            </div>

                            <h3 className="text-2xl font-black mb-4 text-charcoal-grey tracking-tight group-hover:text-sunset-orange transition-colors duration-300">
                                {item.title}
                            </h3>

                            <p className="text-gray-500 font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.desc}
                            </p>

                            <div className="mt-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <div className={`w-12 h-1 rounded-full ${item.color.replace('bg-', 'bg-')}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Riverside Section - Parallax style background */}

        </div>
    );
};

export default Home;
