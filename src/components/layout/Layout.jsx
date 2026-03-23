import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Clock, Info, User, LogOut, LayoutDashboard, Globe, Zap, Shield, Activity, Fingerprint, Lock, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from '../Cart';
import useStore from '../../store/useStore';
import PolicyConsent from '../common/PolicyConsent';
import Footer from '../Footer';
import BumperCar from '../common/BumperCar';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const toggleCart = useStore(state => state.toggleCart);
    const cart = useStore(state => state.cart);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'DINE', path: '/dine' },
        ...(user ? [{ name: 'YOUR TICKETS', path: '/tickets' }] : []),
        { name: 'CONTACT', path: '/contact' },
    ];

    const isMainPage = ['/', '/login'].includes(location.pathname);

    // Function to handle navigating to rides section from other pages
    const handleBookRide = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            document.getElementById('rides')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="floating-navbar">
            <div className="container mx-auto max-w-7xl flex justify-between items-center group/header px-4 md:px-8">
                <Link to="/" className="flex items-center group shrink-0">
                    <img
                        src="/E4LOGO.jpeg"
                        alt="E4 Logo"
                        className="h-14 md:h-24 w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                        fetchpriority="high"
                    />
                </Link>

                {/* Desktop Nav Matrix */}
                <nav className="hidden lg:flex gap-1 items-center bg-white/[0.03] p-1 rounded-full border border-white/5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link-premium ${location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="nav-pill-dark"
                                    className="active-pill"
                                    transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 shadow-sm group/cart"
                    >
                        <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#07080C] shadow-md">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    <Link to="/login" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 shadow-sm group/user">
                        <User size={18} className="group-hover:scale-110 transition-transform" />
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="px-6 py-2.5 rounded-full border border-white/10 text-slate-400 font-bold text-[10px] uppercase tracking-wider hover:bg-white/5 hover:text-white transition-all">
                            ADMIN
                        </Link>
                    )}

                    {!isMainPage && (
                        <Link
                            to="/#rides"
                            onClick={handleBookRide}
                            className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
                        >
                            BOOK A RIDE <Zap size={10} className="fill-current" />
                        </Link>
                    )}

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>

                {/* Mobile Identity */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-sm"
                    >
                        <ShoppingCart size={18} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black border border-[#07080C]">
                                {cart.length}
                            </span>
                        )}
                    </button>
                    <Link
                        to="/login"
                        className={`font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-2xl border border-white/20 active:scale-95 transition-all flex items-center justify-center ${user ? 'bg-white/5 text-white w-10 h-10 px-0' : 'bg-white text-black text-[10px]'}`}
                    >
                        {user ? <User size={18} /> : 'LOGIN'}
                    </Link>
                </div>
            </div>
        </header>
    );
};

const FooterInfoBar = () => {
    return (
        <div className="hidden lg:block fixed bottom-0 left-0 w-full bg-[#070B14]/80 backdrop-blur-md border-t border-white/5 text-[#AAB2C5] py-4 px-10 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6 group transition-all hover:text-[#FF7A18]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] animate-pulse shadow-[0_0_10px_#FF7A18]" />
                    <span className="text-[13px] font-bold uppercase tracking-[0.5em] italic opacity-60">SYSTEM_OPERATIONAL_01</span>
                </div>
                <div className="flex items-center gap-12 text-[13px] font-bold uppercase tracking-[0.3em] italic opacity-40">
                    <span className="flex items-center gap-3 hover:opacity-100 transition-opacity"><Clock size={12} /> OPEN_UNTIL_23:00</span>
                    <span className="flex items-center gap-3 hover:opacity-100 transition-opacity"><MapPin size={12} /> NR_PETA_NODE</span>
                </div>
            </div>
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#000000] selection:bg-indigo-500/30 selection:text-white font-sans overflow-x-hidden antialiased scroll-smooth">
            {/* Global Dark Depth */}
            <div className="noise-overlay" />
            <div className="premium-blur-bg">
                <div className="ambient-light w-[40%] h-[40%] bg-indigo-500/5 top-[-10%] left-[-5%]" />
                <div className="ambient-light w-[30%] h-[30%] bg-orange-500/2 bottom-[-5%] right-[-5%]" />
            </div>
            <Header />
            <main className="flex-grow relative">
                {children}
            </main>

            <Footer />

            <Cart />
            <BumperCar />
            <Toast />
            <PolicyConsent />
            <div className="hidden xl:block">
                <FooterInfoBar />
            </div>
            <BottomNav />
        </div>
    );
};

import BottomNav from './BottomNav';
import Toast from '../common/Toast';

export default Layout;
