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
        <header className="absolute top-0 left-0 w-full z-50 py-2 md:py-4 px-3 md:px-6">
            <div className="container mx-auto px-4 py-2 md:py-3 bg-[#080C14]/80 backdrop-blur-md border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center group/header hover:border-white/20 transition-all duration-700">
                <Link to="/" className="flex items-center group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#FF7A18]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img
                            src="/E4LOGO.jpeg"
                            alt="E4 Logo"
                            className="h-10 md:h-28 w-auto object-contain brightness-110 relative z-10 transition-transform duration-500 group-hover:scale-105"
                            loading="eager"
                            fetchpriority="high"
                            width="200"
                            height="100"
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-1 items-center bg-white/[0.03] p-1.5 rounded-full border border-white/5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-8 py-3 rounded-full text-[12px] font-bold uppercase tracking-[0.4em] transition-all duration-500 italic transform -skew-x-12 ${location.pathname === link.path ? 'text-white' : 'text-[#AAB2C5] hover:text-white'}`}
                        >
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-[#FF7A18]/10 border border-[#FF7A18]/20 rounded-full z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleCart}
                        className="relative w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F8FAFC] hover:bg-white/10 hover:border-[#FF7A18]/30 transition-all shadow-2xl group/cart"
                    >
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FF7A18] text-white text-[9px] w-6 h-6 rounded-full flex items-center justify-center font-black border-4 border-[#070B14] shadow-xl animate-pulse">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    <Link to="/login" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F8FAFC] hover:bg-white/10 hover:border-[#5B8CFF]/30 transition-all shadow-2xl group/user">
                        <User size={20} className="group-hover:scale-110 transition-transform" />
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className="px-8 py-4 rounded-2xl bg-[#FF7A18]/10 text-[#FF7A18] border border-[#FF7A18]/20 font-black text-[10px] uppercase tracking-[0.3em] italic hover:bg-[#FF7A18] hover:text-white transition-all shadow-xl">
                            ADMIN DASHBOARD
                        </Link>
                    )}

                    {!isMainPage && (
                        <Link
                            to="/#rides"
                            onClick={handleBookRide}
                            className="px-8 py-4 rounded-2xl bg-[#FF7A18] text-white font-black text-[10px] uppercase tracking-[0.3em] italic hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,122,24,0.3)] flex items-center gap-2"
                        >
                            BOOK A RIDE <Zap size={14} className="fill-current" />
                        </Link>
                    )}

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="w-14 h-14 rounded-2xl bg-white/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-2xl flex items-center justify-center"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>

                <div className="flex md:hidden items-center gap-4 ml-2">
                    <button
                        onClick={toggleCart}
                        className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F8FAFC]"
                    >
                        <ShoppingCart size={18} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-[#FF7A18] text-white text-[7px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#070B14]">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    {!isMainPage && (
                        <Link
                            to="/#rides"
                            onClick={handleBookRide}
                            className="text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-[#FF7A18] text-white shadow-lg active:scale-95 transition-all"
                        >
                            BOOK A RIDE
                        </Link>
                    )}

                    <Link
                        to="/login"
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all duration-300 whitespace-nowrap bg-[#FF7A18]/10 text-[#FF7A18] border border-[#FF7A18]/20`}
                    >
                        {user ? 'YOUR TICKETS' : 'LOGIN'}
                    </Link>
                </div>
            </div>

            {/* Remove Mobile Menu - navigation links are now in the header chips and BottomNav */}

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
        <div className="flex flex-col min-h-screen bg-[#070B14] selection:bg-[#FF7A18] selection:text-white font-sans">
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
