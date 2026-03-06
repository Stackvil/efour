import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, ArrowRight, ShieldCheck, AlertCircle, History, LayoutDashboard, QrCode, Receipt, Calendar } from 'lucide-react';
import useStore from '../store/useStore';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { fetchWithAuth } from '../utils/api';

// Constants for expiry logic
const EXPIRY_HOURS = 24; // 24 hours
const WARNING_HOURS = 4; // Warning starts 4h before expiry

const CircularProgress = ({ pct, color }) => {
    const r = 18;
    const circ = 2 * Math.PI * r;
    const strokePct = ((100 - pct) * circ) / 100;

    return (
        <svg width="44" height="44" className="rotate-[-90deg]">
            <circle
                r={r}
                cx="22"
                cy="22"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circ}
                strokeDashoffset="0"
                className="text-gray-100"
            />
            <circle
                r={r}
                cx="22"
                cy="22"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circ}
                strokeDashoffset={strokePct}
                strokeLinecap="round"
                className={`${color} transition-all duration-1000 ease-linear`}
            />
        </svg>
    );
};

const safeDate = (dateVal) => {
    if (!dateVal) return new Date();
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? new Date() : d;
};

const TicketCard = memo(({ ticket, item }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, pct: 100 });
    const [status, setStatus] = useState('active'); // active, expiring, expired

    useEffect(() => {
        const calculateTime = () => {
            const purchaseDate = safeDate(ticket.date || ticket.createdAt);
            const expiryDate = new Date(purchaseDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const now = new Date();
            const diff = expiryDate - now;

            if (diff <= 0) {
                setTimeLeft({ h: 0, m: 0, s: 0, pct: 0 });
                setStatus('expired');
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            const pct = (diff / (EXPIRY_HOURS * 60 * 60 * 1000)) * 100;

            setTimeLeft({ h, m, s, pct });
            setStatus(h < WARNING_HOURS ? 'expiring' : 'active');
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [ticket.date, ticket.createdAt]);

    const getStatusConfig = () => {
        switch (status) {
            case 'expiring':
                return { label: 'Expiring Soon', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
            case 'expired':
                return { label: 'Expired', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
            default:
                return { label: 'Active Pass', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
        }
    };

    const config = getStatusConfig();
    const qrData = `${ticket.id || ticket._id}-${item.id}`;

    return (
        <div className="relative h-[420px] w-full perspective-1000 group">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, type: 'spring', damping: 20 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                onClick={() => status !== 'expired' && setIsFlipped(!isFlipped)}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                    <div className={`h-full w-full rounded-[2.5rem] bg-white border border-gray-200 p-7 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-500 ${status === 'expiring' ? 'animate-pulse-subtle ring-2 ring-orange-500' : ''}`}>
                        {/* Status Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className={`px-4 py-1.5 rounded-full ${config.bg} ${config.border} flex items-center gap-2`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text', 'bg')} ${status === 'expiring' ? 'animate-pulse' : ''}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
                            </div>
                            <div className="opacity-40 hover:opacity-100 transition-opacity">
                                <QrCode className="text-charcoal-grey" size={24} />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-6">
                            <div className="relative">
                                <h3 className="text-charcoal-grey font-black text-2xl tracking-tighter uppercase italic transform -skew-x-12 leading-none mb-2">
                                    {item.name}
                                </h3>
                                <p className="text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase">Efour Digital Pass</p>
                            </div>

                            <div className="flex items-end gap-6">
                                <div className="relative">
                                    <CircularProgress pct={timeLeft.pct} color={status === 'expired' ? 'text-red-500' : (status === 'expiring' ? 'text-orange-500' : 'text-emerald-500')} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Clock className="text-gray-200" size={14} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest block">Time Remaining</span>
                                    <span className={`text-xl font-mono font-black tabular-nums transition-colors duration-500 ${config.color}`}>
                                        {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="mt-auto pt-8 border-t border-gray-100 space-y-5">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest block">Pass Cost</span>
                                    <span className="text-charcoal-grey font-black text-2xl tracking-tight">₹{item.price * item.quantity}</span>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest block">Valid Date</span>
                                    <span className="text-gray-600 font-bold text-sm">{safeDate(ticket.date || ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${status === 'expired' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-charcoal-grey text-white hover:bg-sunset-orange hover:text-white shadow-xl shadow-black/10'}`}
                            >
                                {status === 'expired' ? 'Pass Expired' : 'View Verification QR'}
                            </button>
                        </div>

                        {/* Expired Overlay */}
                        {status === 'expired' && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center rounded-[2.5rem]">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                                    <History className="text-red-500" size={32} />
                                </div>
                                <h4 className="text-charcoal-grey font-black text-2xl uppercase italic tracking-tighter mb-2">Expired</h4>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed">This digital pass has reached its 24-hour limit and is no longer valid for entry.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Side (QR) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full w-full rounded-[2.5rem] bg-white p-7 flex flex-col items-center justify-between shadow-2xl border border-white/20">
                        <div className="w-full flex justify-between items-center mb-4">
                            <div className="bg-slate-100 px-3 py-1 rounded-full">
                                <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Verification</span>
                            </div>
                            <img src="/E4LOGO.jpeg" className="w-8 h-8 rounded-lg" alt="E4" />
                        </div>

                        <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                            <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-inner">
                                <QRCode value={qrData} size={160} />
                            </div>
                            <div className="text-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Pass ID</span>
                                <code className="bg-slate-50 px-3 py-1 rounded text-slate-600 font-mono text-xs">{(ticket.id || ticket._id || '').slice(0, 8)}...</code>
                            </div>
                        </div>

                        <div className="w-full bg-slate-50 p-5 rounded-3xl space-y-3">
                            <div className="flex items-center gap-3 text-slate-600">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wide">Present at entry gate</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <AlertCircle size={16} className="text-orange-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wide">Single use verification</span>
                            </div>
                        </div>

                        <button className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:text-slate-900 transition-colors">
                            Tap to return
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

const StatsCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-3xl flex items-center gap-5 transition-transform hover:scale-105 duration-300">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-md`}>
            <Icon size={24} />
        </div>
        <div>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1">{label}</span>
            <span className="text-charcoal-grey font-black text-2xl tabular-nums">{value}</span>
        </div>
    </div>
);

const YourTickets = () => {
    const { user } = useStore();
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [rawTickets, setRawTickets] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await fetchWithAuth('/api/payment/my-orders');
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) {
                            setRawTickets(data);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch (err) {
                console.warn('Failed to fetch from /api/payment/my-orders', err);
            }
            // If failed or no token, simply finish loading
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const tickets = useMemo(() => {
        if (!rawTickets || rawTickets.length === 0) return [];
        return rawTickets.flatMap(ticket =>
            (ticket.items || []).map(item => ({
                ...item,
                ticketId: ticket.id || ticket._id,
                purchaseDate: ticket.date || ticket.createdAt,
                originalTicket: ticket
            }))
        );
    }, [rawTickets]);

    const filteredTickets = useMemo(() => {
        const now = new Date();
        return tickets.filter(t => {
            const pDate = t.purchaseDate ? new Date(t.purchaseDate) : now;
            const validPDate = isNaN(pDate.getTime()) ? now : pDate;
            const expiry = new Date(validPDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const remaining = (expiry - now) / (1000 * 60 * 60);

            if (filter === 'active') return remaining > WARNING_HOURS;
            if (filter === 'expiring') return remaining <= WARNING_HOURS && remaining > 0;
            if (filter === 'expired') return remaining <= 0;
            return true;
        });
    }, [tickets, filter]);

    const stats = useMemo(() => {
        const now = new Date();
        const initial = { total: tickets.length, active: 0, expiring: 0, expired: 0 };
        return tickets.reduce((acc, t) => {
            const pDate = t.purchaseDate ? new Date(t.purchaseDate) : now;
            const validPDate = isNaN(pDate.getTime()) ? now : pDate;
            const expiry = new Date(validPDate.getTime() + EXPIRY_HOURS * 60 * 60 * 1000);
            const remaining = (expiry - now) / (1000 * 60 * 60);

            if (remaining <= 0) acc.expired++;
            else if (remaining <= WARNING_HOURS) acc.expiring++;
            else acc.active++;
            return acc;
        }, initial);
    }, [tickets]);

    if (!user || (!loading && tickets.length === 0)) {
        return (
            <div className="min-h-screen bg-creamy-white pt-32 pb-12 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm border border-gray-100">
                    <Ticket size={48} className="text-gray-300" />
                </div>
                <h2 className="text-4xl font-black text-charcoal-grey mb-4 uppercase italic tracking-tighter transform -skew-x-12">No Passes Found</h2>
                <p className="text-gray-500 mb-10 max-w-sm font-medium leading-relaxed italic">Your digital vault is empty. Experience the thrill of Efour and your passes will appear here.</p>
                <Link to="/" className="bg-sunset-orange text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                    Discover Attractions
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-creamy-white text-charcoal-grey pt-32 pb-24 selection:bg-sunset-orange/30">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sunset-orange">
                            <LayoutDashboard size={20} />
                            <span className="text-xs font-black uppercase tracking-[0.4em]">Digital Vault</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none transform -skew-x-6">
                            Your <span className="text-sunset-orange">Passes</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium max-w-md italic">
                            Manage your premium access tokens. Tickets are valid for 24 hours from the moment of purchase.
                        </p>
                    </div>

                    <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        {['all', 'active', 'expiring', 'expired'].map(btn => (
                            <button
                                key={btn}
                                onClick={() => setFilter(btn)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black font-heading uppercase tracking-widest transition-all relative ${filter === btn ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {filter === btn && (
                                    <motion.div
                                        layoutId="tab-bg"
                                        className="absolute inset-0 bg-charcoal-grey rounded-xl"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{btn}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatsCard icon={Receipt} label="Total Issued" value={stats.total} color="bg-slate-700" />
                    <StatsCard icon={ShieldCheck} label="Operational" value={stats.active} color="bg-emerald-500" />
                    <StatsCard icon={AlertCircle} label="Critical Time" value={stats.expiring} color="bg-orange-500" />
                    <StatsCard icon={History} label="Deactivated" value={stats.expired} color="bg-red-500" />
                </div>

                {/* Tickets Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[420px] rounded-[2.5rem] bg-white animate-pulse border border-gray-100 shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTickets.map((ticket, index) => (
                                <motion.div
                                    key={`${ticket.ticketId}-${ticket.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <TicketCard ticket={ticket.originalTicket} item={ticket} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State for Filter */}
                {!loading && filteredTickets.length === 0 && (
                    <div className="py-32 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                            <Clock className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">No passes match the current filter</p>
                    </div>
                )}
            </div>

            {/* Global Perspective Fix for 3D */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.95; transform: scale(0.995); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}} />
        </div>
    );
};

export default YourTickets;
