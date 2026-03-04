import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, MapPin, Clock, Info, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from '../Cart';
import useStore from '../../store/useStore';
import TermsModal from '../common/TermsModal';
import AboutModal from '../common/AboutModal';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Optimized selectors
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
        { name: 'Home', path: '/' },
        { name: 'Dine', path: '/dine' },
        ...(user ? [{ name: 'Your Tickets', path: '/tickets' }] : []),
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 py-3 px-6 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-b-[2rem] mx-2 mt-2">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-5 group">
                    <motion.div
                        key="logo-container"
                        className="flex items-center gap-4"
                        whileHover={{ scale: 1.02 }}
                        data-version="logo-premium-v2"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-riverside-teal/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src="/E4LOGO.jpeg"
                                alt="E4 Logo"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-contain bg-black shadow-2xl border-4 border-white relative z-10 transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </Link>

                {/* Desktop Nav - Premium Pill Navigation */}
                <nav className="hidden md:flex gap-1.5 items-center bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === link.path
                                ? 'text-white shadow-lg'
                                : 'text-gray-500 hover:text-charcoal-grey'
                                }`}
                        >
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-charcoal-grey rounded-full z-0 shadow-lg shadow-charcoal-grey/20"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    {/* Profile Information */}
                    <Link to="/login" className="flex items-center gap-2 group px-2 py-2 rounded-2xl hover:bg-gray-100/50 transition-all border border-transparent hover:border-gray-100 shadow-sm bg-white/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-white shadow-inner group-hover:border-riverside-teal/30 transition-colors">
                            <User size={18} className="text-gray-400 group-hover:text-riverside-teal transition-colors" />
                        </div>
                    </Link>

                    {/* Conditional Book a Ride Button - Only visible when not on Home */}
                    {location.pathname !== '/' && (
                        <Link
                            to="/"
                            className="relative group overflow-hidden bg-sunset-orange px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(255,100,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,100,0,0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            BOOK A RIDE
                        </Link>
                    )}

                    {/* Advanced Cart Toggle */}
                    <button
                        type="button"
                        onClick={toggleCart}
                        className="relative group p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-riverside-teal/20 transition-all duration-300"
                        aria-label="Open cart"
                    >
                        <ShoppingCart size={20} className="text-charcoal-grey group-hover:text-riverside-teal transition-colors" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-riverside-teal text-white text-[9px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-black border-2 border-white shadow-lg animate-bounce">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-sunset-orange/20 text-sunset-orange hover:bg-sunset-orange hover:text-white transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
                        >
                            <LayoutDashboard size={16} />
                            ADMIN
                        </Link>
                    )}

                    {user && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-red-100 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
                            title="Logout"
                        >
                            <LogOut size={16} />
                            LOGOUT
                        </button>
                    )}
                </div>

                {/* Mobile Toggle - Enhanced */}
                <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 text-charcoal-grey shadow-sm" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu - Premium Overly */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl absolute top-full left-0 w-full shadow-2xl rounded-b-[2.5rem] border-b border-gray-100"
                    >
                        <div className="flex flex-col p-8 gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.2em] transition-all ${location.pathname === link.path ? 'bg-charcoal-grey text-white' : 'text-gray-400 hover:text-charcoal-grey'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-100 my-4" />

                            {/* Profile / Account link in mobile */}
                            <Link to="/login" onClick={() => setIsOpen(false)} className="px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.2em] text-charcoal-grey flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                {user ? (user.name || 'PROFILE') : 'LOGIN'}
                            </Link>

                            {/* Conditional Book a Ride in mobile menu */}
                            {location.pathname !== '/' && (
                                <Link
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.1em] text-sunset-orange flex items-center gap-4 border border-sunset-orange/10 mt-2"
                                >
                                    BOOK A RIDE
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.1em] text-riverside-teal flex items-center gap-4 border border-riverside-teal/10 mt-2"
                                >
                                    <LayoutDashboard size={20} />
                                    ADMIN DASHBOARD
                                </Link>
                            )}

                            {user && (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.1em] text-red-400 flex items-center gap-4 border border-red-50/50 mt-2"
                                >
                                    <LogOut size={20} />
                                    LOGOUT
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    toggleCart();
                                }}
                                className="mt-6 w-full bg-charcoal-grey text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-4"
                            >
                                <ShoppingCart size={20} />
                                CART ({cart.length})
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

const FooterInfoBar = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 text-charcoal-grey py-2.5 px-6 z-40 text-xs md:text-sm shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="container mx-auto flex justify-center md:justify-between items-center flex-wrap gap-x-8 gap-y-2">
                <div className="flex items-center gap-2 group cursor-help">
                    <div className="p-1.5 rounded-lg bg-sunset-orange/10 group-hover:bg-sunset-orange/20 transition-colors">
                        <Info size={14} className="text-sunset-orange" />
                    </div>
                    <span className="font-medium">Parking: <span className="font-black">₹30</span></span>
                </div>
                <div className="flex items-center gap-2 group cursor-help">
                    <div className="p-1.5 rounded-lg bg-riverside-teal/10 group-hover:bg-riverside-teal/20 transition-colors">
                        <MapPin size={14} className="text-riverside-teal" />
                    </div>
                    <span className="font-medium">Location: <span className="font-black">OPP TO RTC Main bustand NR Peta</span></span>
                </div>
                <div className="flex items-center gap-2 group cursor-help">
                    <div className="p-1.5 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                        <Clock size={14} className="text-green-500" />
                    </div>
                    <span className="font-medium">Status: <span className="font-black uppercase text-green-600">Open Now</span> <span className="text-gray-400 font-normal">until 11 PM</span></span>
                </div>
            </div>
        </div>
    );
};

import BottomNav from './BottomNav';
import Toast from '../common/Toast';
import { Facebook, Instagram, Twitter, Send, Phone, MapPin as PinIcon } from 'lucide-react';

const Layout = ({ children }) => {
    const user = useStore(state => state.user);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-creamy-white selection:bg-riverside-teal selection:text-white">
            <Header />
            <main className="flex-grow pb-24 md:pb-12">
                {children}
            </main>

            <footer className="relative bg-charcoal-grey pt-8 pb-12 px-6 overflow-hidden mt-6">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-riverside-teal/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sunset-orange/5 blur-[100px] rounded-full" />

                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
                        {/* Brand Column */}
                        <div className="md:col-span-5">
                            <Link to="/" className="inline-block group mb-6">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src="/E4LOGO.jpeg"
                                            alt="E4 Logo"
                                            className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-contain shadow-2xl border-2 border-white/10 relative z-10 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[11px] font-black text-riverside-teal uppercase tracking-[0.4em] mt-1.5 brightness-125">Elevating Eluru</span>
                                    </div>
                                </div>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium">
                                Eluru's premier lifestyle destination. Where world-class dining meets exhilarating adventure.
                            </p>

                            <div className="mt-6 flex gap-3">
                                {[
                                    { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://www.facebook.com/share/1DHuqH8gAA/?mibextid=wwXIfr' },
                                    { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://www.instagram.com/efoureluru?igsh=MXkxOTA5djhzM2dpeA==' },
                                    { icon: <Twitter size={18} />, label: 'Twitter', href: '#' }
                                ].map((social, i) => (
                                    <motion.a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -3, scale: 1.1 }}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-charcoal-grey transition-all shadow-lg"
                                        aria-label={social.label}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="md:col-span-3">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-6 pb-2 border-b border-white/5 inline-block">Explore</h3>
                            <ul className="space-y-4">
                                {[
                                    { name: 'Ride Attractions', path: '/' },
                                    { name: 'Dine', path: '/dine' },
                                    { name: 'Contact', path: '/contact' },
                                    { name: 'Partner With Us', path: '/contact' }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-white font-bold text-sm transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-riverside-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="md:col-span-4">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-6 pb-2 border-b border-white/5 inline-block">Contact</h3>
                            <div className="space-y-4">
                                <a href="tel:07036923456" className="flex items-center gap-4 group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-sunset-orange/30 transition-all hover:bg-white/10">
                                    <div className="w-10 h-10 rounded-xl bg-sunset-orange flex items-center justify-center text-white shadow-lg shadow-sunset-orange/20">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-[9px] uppercase font-black tracking-widest leading-none mb-1">Call Booking</span>
                                        <span className="block text-white font-black text-lg">070369 23456</span>
                                    </div>
                                </a>

                                <a
                                    href="https://www.google.com/maps/place/EFOUR/@16.7089304,81.0889024,17z/data=!3m1!4b1!4m6!3m5!1s0x3a36131a0e74054d:0x366c34d3c0b4589c!8m2!3d16.7089304!4d81.0889024!16s%2Fg%2F11wnjn71fc?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-riverside-teal/30 transition-all hover:bg-white/10"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-riverside-teal flex items-center justify-center text-white shadow-lg shadow-riverside-teal/20">
                                        <PinIcon size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-[9px] uppercase font-black tracking-widest leading-none mb-1">Our Location</span>
                                        <span className="block text-white font-black text-base">Eluru, AP</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom Bar */}
                    <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col items-center md:items-start gap-1">
                            <p className="text-gray-500 text-[11px] font-bold">
                                © {new Date().getFullYear()} <span className="text-white uppercase tracking-wider">KURETI JAYANARAYANA</span>. ALL RIGHTS RESERVED.
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-0.5">
                                <span className="text-gray-500/70 text-[9px] font-bold tracking-[0.2em] uppercase">
                                    DEVELOPED BY
                                </span>
                                <div className="relative group/dev cursor-pointer">
                                    <div className="text-gray-300 hover:text-white text-[9px] font-black tracking-[0.2em] uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1 group/btn transition-all">
                                        STACKVIL TECHNOLOGIES
                                        <span className="text-[10px] transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true">↗</span>
                                    </div>
                                    <div className="absolute bottom-full left-0 w-32 pb-2 opacity-0 pointer-events-none group-hover/dev:opacity-100 group-hover/dev:pointer-events-auto transition-all duration-300 z-50">
                                        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                                            <a href="https://www.stackvil.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-charcoal-grey transition-colors">
                                                Website
                                            </a>
                                            <div className="h-px bg-gray-100"></div>
                                            <a href="https://wa.me/918919079058" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors">
                                                WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Admin</a>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setIsTermsOpen(true)}
                                className="text-left font-semibold text-sm text-gray-500 hover:text-sunset-orange transition-colors w-fit"
                            >
                                Terms & Conditions
                            </button>
                            <button
                                onClick={() => setIsAboutOpen(true)}
                                className="text-left font-semibold text-sm text-gray-500 hover:text-sunset-orange transition-colors w-fit"
                            >
                                About Us
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            <Cart />
            <Toast />
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <div className="hidden md:block">
                <FooterInfoBar />
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;
