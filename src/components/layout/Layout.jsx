import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, MapPin, Clock, Info, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from '../Cart';
import useStore from '../../store/useStore';
import TermsModal from '../common/TermsModal';
import AboutModal from '../common/AboutModal';
import PrivacyModal from '../common/PrivacyModal';
import PolicyConsent from '../common/PolicyConsent';

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
        <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 py-3 px-6 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-b-[2rem] mx-2 mt-2">
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
                                className="h-20 md:h-28 w-auto object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>
                </Link>

                {/* Desktop Nav - Premium Pill Navigation */}
                <nav className="hidden md:flex gap-1.5 items-center bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === link.path
                                ? 'text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white rounded-full z-0 shadow-lg shadow-white/20"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {link.name}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    {/* Profile Information */}
                    <Link to="/login" className="flex items-center gap-2 group px-2 py-2 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/20 shadow-sm bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border-2 border-white/10 shadow-inner group-hover:border-riverside-teal/50 transition-colors">
                            <User size={18} className="text-gray-300 group-hover:text-riverside-teal transition-colors" />
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
                        className="relative group p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:shadow-xl hover:border-riverside-teal/50 hover:bg-white/10 transition-all duration-300"
                        aria-label="Open cart"
                    >
                        <ShoppingCart size={20} className="text-gray-300 group-hover:text-riverside-teal transition-colors" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-riverside-teal text-white text-[9px] min-w-[22px] h-[22px] rounded-full flex items-center justify-center font-black border-2 border-[#050505] shadow-lg animate-bounce">
                                {cart.length}
                            </span>
                        )}
                    </button>

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-sunset-orange/30 text-sunset-orange hover:bg-sunset-orange hover:text-white transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
                        >
                            <LayoutDashboard size={16} />
                            ADMIN
                        </Link>
                    )}

                    {user && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm font-black text-[10px] uppercase tracking-widest"
                            title="Logout"
                        >
                            <LogOut size={16} />
                            LOGOUT
                        </button>
                    )}
                </div>

                {/* Mobile Toggle - Enhanced */}
                <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white shadow-sm hover:bg-white/10 transition-colors" onClick={() => setIsOpen(!isOpen)}>
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
                                    className={`px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-[0.2em] transition-all flex items-center justify-between ${location.pathname === link.path ? 'bg-charcoal-grey text-white' : 'text-gray-400 hover:text-charcoal-grey'}`}
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
                    <div className="p-1.5 rounded-lg bg-riverside-teal/10 group-hover:bg-riverside-teal/20 transition-colors">
                        <MapPin size={14} className="text-riverside-teal" />
                    </div>
                    <span className="font-medium">Location: <span className="font-black">Opp: New RTC Main Bus Stand, NR Peta, ELURU - 534 006</span></span>
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
import { Facebook, Instagram, Youtube, Send, Phone, MapPin as PinIcon, Mail, Globe } from 'lucide-react';

const Layout = ({ children }) => {
    const user = useStore(state => state.user);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [showDevOptions, setShowDevOptions] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-creamy-white selection:bg-riverside-teal selection:text-white">
            <Header />
            <main className="flex-grow pb-24 md:pb-12">
                {children}
            </main>

            <footer className="relative bg-[#080808] pt-16 pb-16 px-6 overflow-hidden mt-12">
                {/* Elite Background Architecture */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <motion.div
                        animate={{ opacity: [0.1, 0.15, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute -top-24 left-1/4 w-[600px] h-[600px] bg-riverside-teal/10 blur-[150px] rounded-full"
                    />
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-8">
                        {/* Brand Column */}
                        <div className="md:col-span-5">
                            <div className="flex items-center gap-5 mb-8">
                                <img
                                    src="/E4LOGO.jpeg"
                                    alt="E4 Logo"
                                    className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl"
                                />
                                <span className="text-[11px] font-black text-riverside-teal uppercase tracking-[0.4em] mt-1.5 brightness-125">Elevating Eluru</span>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium mb-10">
                                Eluru's premier lifestyle destination. Where world-class dining meets exhilarating adventure.
                            </p>

                            <div className="flex gap-4">
                                {[
                                    { Icon: Instagram, href: 'https://www.instagram.com/efoureluru?igsh=MXkxOTA5djhzM2dpeA==', color: 'hover:text-pink-500' },
                                    { Icon: Facebook, href: 'https://www.facebook.com/share/1DHuqH8gAA/?mibextid=wwXIfr', color: 'hover:text-blue-500' },
                                    { Icon: Youtube, href: '#', color: 'hover:text-red-500' }
                                ].map(({ Icon, href, color }, i) => (
                                    <a
                                        key={i}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 ${color} hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer`}
                                    >
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div className="md:col-span-3">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">EXPLORE</h3>
                            <ul className="space-y-5">
                                {[
                                    { name: 'Ride Attractions', path: '/' },
                                    { name: 'Dine', path: '/dine' },
                                    { name: 'Contact', path: '/contact' },
                                    { name: 'Partner With Us', path: '/contact' }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-white font-bold text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="md:col-span-4">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">CONTACT</h3>
                            <div className="space-y-4">
                                <a href="tel:07036923456" className="flex items-center gap-5 p-5 bg-white/[0.03] rounded-[1.5rem] border border-white/5 hover:border-sunset-orange/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-sunset-orange/10 flex items-center justify-center text-sunset-orange group-hover:bg-sunset-orange group-hover:text-white transition-all">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-[8px] uppercase font-black tracking-widest leading-none mb-1.5">Call Booking</span>
                                        <span className="block text-white font-black text-xl tracking-tight">070369 23456</span>
                                    </div>
                                </a>

                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-5 bg-white/[0.03] rounded-[1.5rem] border border-white/5 hover:border-riverside-teal/30 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-riverside-teal/10 flex items-center justify-center text-riverside-teal group-hover:bg-riverside-teal group-hover:text-white transition-all">
                                        <PinIcon size={22} />
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-[8px] uppercase font-black tracking-widest leading-none mb-1.5">Our Location</span>
                                        <span className="block text-white font-bold leading-snug text-[13px]">Opp: New RTC Main Bus Stand,<br />NR Peta, ELURU - 534 006</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar Architecture */}
                    <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div className="space-y-6">
                            <p className="text-gray-500 text-[11px] font-bold tracking-tight">
                                © {new Date().getFullYear()} <motion.span
                                    animate={{
                                        textShadow: ["0 0 0px rgba(255,100,0,0)", "0 0 10px rgba(255,100,0,0.5)", "0 0 0px rgba(255,100,0,0)"]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="bg-gradient-to-r from-sunset-orange via-orange-400 to-yellow-500 bg-clip-text text-transparent font-black uppercase tracking-widest text-sm inline-block"
                                >
                                    KURETI JAYANARAYANA
                                </motion.span> . ALL RIGHTS RESERVED.
                            </p>

                            <div className="flex items-center gap-3 group relative">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Developed By</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDevOptions(!showDevOptions)}
                                        className="text-white text-[11px] font-black tracking-[0.2em] uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 hover:border-riverside-teal/30 transition-all shadow-lg flex items-center gap-2 group/btn"
                                    >
                                        STACKVIL TECHNOLOGIES
                                        <motion.span
                                            animate={{ rotate: showDevOptions ? 180 : 0 }}
                                            className="text-riverside-teal brightness-125"
                                        >
                                            ▼
                                        </motion.span>
                                    </button>

                                    <AnimatePresence>
                                        {showDevOptions && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full left-0 mb-3 w-full min-w-[160px] bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                                            >
                                                <a
                                                    href="https://www.stackvil.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all border-b border-white/5"
                                                >
                                                    <Globe size={14} className="text-riverside-teal" />
                                                    Official Website
                                                </a>
                                                <a
                                                    href="https://wa.me/918919079058"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-400 hover:bg-white/5 transition-all"
                                                >
                                                    <Phone size={14} className="text-green-500" />
                                                    WhatsApp Support
                                                </a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-end gap-10 lg:gap-20">
                            <div className="flex gap-8 text-[12px] font-black uppercase tracking-widest text-gray-600">
                                <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors">Privacy</button>
                                <button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-colors">Terms</button>
                                <Link to="/admin" className="hover:text-white transition-colors uppercase">Admin</Link>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button onClick={() => setIsTermsOpen(true)} className="text-left font-bold text-sm text-gray-500 hover:text-sunset-orange transition-colors">Terms & Conditions</button>
                                <button onClick={() => setIsAboutOpen(true)} className="text-left font-bold text-sm text-gray-500 hover:text-sunset-orange transition-colors">About Us</button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <Cart />
            <Toast />
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
            <PolicyConsent
                onOpenTerms={() => setIsTermsOpen(true)}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
            />
            <div className="hidden md:block">
                <FooterInfoBar />
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;
