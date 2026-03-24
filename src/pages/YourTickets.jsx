import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Clock, ArrowRight, ShieldCheck, AlertCircle, History, LayoutDashboard, QrCode, Receipt, Calendar, Lock, Cpu, Zap } from 'lucide-react';
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
                className="text-white/5"
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
                return { label: 'EXPIRING SOON', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(255,122,24,0.3)]' };
            case 'expired':
                return { label: 'EXPIRED', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: '' };
            default:
                return { label: 'ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]' };
        }
    };

    const config = getStatusConfig();
    const qrData = `${ticket.id || ticket._id}-${item.id}`;

    return (
        <div className="relative h-[480px] w-full perspective-2000 group">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: 'spring', damping: 25, stiffness: 100 }}
                className="relative w-full h-full preserve-3d cursor-pointer"
                onClick={() => status !== 'expired' && setIsFlipped(!isFlipped)}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden">
                    <div className={`h-full w-full rounded-[2.5rem] bg-[#0F172A]/40 backdrop-blur-3xl border border-white/10 p-8 pb-10 flex flex-col justify-between overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.6)] transition-all duration-700 hover:border-[#FF7A18]/40 group/card ${status === 'expiring' ? 'animate-pulse-subtle ring-2 ring-[#FF7A18]/20' : ''}`}>
                        {/* Background Ambient Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none rounded-full ${status === 'expired' ? 'bg-red-500' : (status === 'expiring' ? 'bg-[#FF7A18]' : 'bg-emerald-500')}`} />

                        {/* Status Header */}
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`px-5 py-2 rounded-full ${config.bg} border ${config.border} flex items-center gap-2.5 backdrop-blur-2xl ${config.glow}`}>
                                <div className={`w-2 h-2 rounded-full ${config.color.replace('text', 'bg')} ${status === 'expiring' ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`} />
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${config.color}`}>{config.label}</span>
                            </div>
                            <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10 opacity-60 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-500">
                                <QrCode className="text-white" size={20} />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF7A18]">
                                        <Cpu size={20} />
                                    </div>
                                    <span className="text-[#AAB2C5] text-[10px] font-black tracking-[0.4em] uppercase opacity-50">Ride</span>
                                </div>
                                <h3 className="text-[#F8FAFC] font-black text-3xl tracking-tighter uppercase italic transform -skew-x-12 leading-none mb-3">
                                    {item.name}
                                </h3>
                                <p className="text-[#AAB2C5] text-[10px] font-black tracking-[0.4em] uppercase opacity-70">EFOUR ELURU</p>
                            </div>

                            <div className="flex items-center gap-8 bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                                <div className="relative shrink-0">
                                    <CircularProgress pct={timeLeft.pct} color={status === 'expired' ? 'text-red-500' : (status === 'expiring' ? 'text-[#FF7A18]' : 'text-emerald-500')} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Clock className="text-white/30" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[#AAB2C5] text-[9px] font-black uppercase tracking-[0.2em] block opacity-50">Ends In</span>
                                    <span className={`text-2xl font-mono font-black tabular-nums transition-colors duration-500 ${config.color} ${status !== 'expired' ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]' : ''}`}>
                                        {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-4 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className="text-[#AAB2C5] text-[9px] font-black uppercase tracking-[0.2em] block opacity-50">Price</span>
                                    <span className="text-[#F8FAFC] font-black text-2xl tracking-tighter">₹{item.price * item.quantity}</span>
                                </div>
                                <div className="text-right space-y-1.5">
                                    <span className="text-[#AAB2C5] text-[9px] font-black uppercase tracking-[0.2em] block opacity-50">Date</span>
                                    <span className="text-[#F8FAFC] font-bold text-sm italic opacity-90">{safeDate(ticket.date || ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                </div>
                            </div>

                            <button
                                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 italic transform -skew-x-6 ${status === 'expired' ? 'bg-white/5 text-[#AAB2C5]/50 cursor-not-allowed border border-white/5' : 'bg-white/5 text-white border border-white/10 hover:border-[#FF7A18] hover:bg-[#FF7A18]/20 hover:text-[#FF7A18] hover:shadow-[0_0_30px_rgba(255,122,24,0.2)]'}`}
                            >
                                {status === 'expired' ? 'EXPIRED' : 'VIEW TICKET'}
                                {status !== 'expired' && <ArrowRight size={14} className="group-hover/card:translate-x-1 transition-transform" />}
                            </button>
                        </div>

                        {/* Expired Overlay */}
                        {status === 'expired' && (
                            <div className="absolute inset-0 bg-[#070B14]/95 backdrop-blur-2xl z-20 flex flex-col items-center justify-center p-8 text-center rounded-[3rem]">
                                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                    <Lock className="text-red-500" size={32} />
                                </div>
                                <h4 className="text-[#F8FAFC] font-black text-3xl uppercase italic tracking-tighter mb-3 transform -skew-x-12">EXPIRED</h4>
                                <p className="text-[#AAB2C5] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">This ticket has expired.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Side (QR) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full w-full rounded-[3rem] bg-[#070B14] p-8 flex flex-col items-center justify-between shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden">
                        {/* Background Light */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#5B8CFF] rounded-full blur-[100px]" />
                        </div>

                        <div className="w-full flex justify-between items-center relative z-10">
                            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl">
                                <span className="text-[#AAB2C5] text-[8px] font-black uppercase tracking-[0.4em]">EFOUR TICKET</span>
                            </div>
                            <img src="/E4LOGO.jpeg" className="w-10 h-10 rounded-xl border border-white/10 brightness-110 shadow-lg" alt="E4" />
                        </div>

                        <div className="flex-grow flex flex-col items-center justify-center space-y-8 relative z-10">
                            <div className="relative group/qr">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF7A18]/20 to-[#5B8CFF]/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-700" />
                                <div className="p-6 bg-white rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] border-4 border-white/10 relative z-10">
                                    <QRCode value={qrData} size={180} />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <span className="text-[#AAB2C5] text-[9px] font-black uppercase tracking-[0.4em] block opacity-50">Ticket ID</span>
                                <code className="bg-white/5 px-4 py-1.5 rounded-xl text-[#F8FAFC] font-mono text-xs border border-white/10 backdrop-blur-md">{(ticket.id || ticket._id || '').slice(0, 16).toUpperCase()}</code>
                            </div>
                        </div>

                        <div className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4 backdrop-blur-xl relative z-10">
                            <div className="flex items-center gap-4 text-[#AAB2C5]">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                    <ShieldCheck size={16} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Verified</span>
                            </div>
                            <div className="flex items-center gap-4 text-[#AAB2C5]">
                                <div className="w-8 h-8 rounded-lg bg-[#FF7A18]/10 flex items-center justify-center text-[#FF7A18] border border-[#FF7A18]/20">
                                    <Zap size={16} />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Valid Entry</span>
                            </div>
                        </div>

                        <button className="text-[#AAB2C5] text-[10px] font-black uppercase tracking-[0.3em] mt-6 hover:text-white transition-all transform hover:scale-110 italic active:scale-95">
                            REFRESH
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

const StatsCard = ({ icon: Icon, label, value, color, gradient }) => (
    <div className="glass-card border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6 transition-all duration-500 hover:scale-[1.05] hover:border-[#FF7A18]/30 group overflow-hidden relative">
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full bg-gradient-to-br ${gradient}`} />
        <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/20 transform group-hover:rotate-6 transition-transform duration-500`}>
            <Icon size={28} />
        </div>
        <div>
            <span className="text-[#AAB2C5] text-[10px] font-black uppercase tracking-[0.3em] block mb-2 opacity-50">{label}</span>
            <span className="text-[#F8FAFC] font-black text-4xl tabular-nums leading-none tracking-tighter drop-shadow-sm">{value}</span>
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
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const tickets = useMemo(() => {
        if (!rawTickets || rawTickets.length === 0) return [];
        return rawTickets.filter(Boolean).flatMap(ticket =>
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
            <div className="min-h-screen bg-[#070B14] pt-52 md:pt-64 pb-12 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
                <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, duration: 1 }}
                    className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-10 border border-white/10 backdrop-blur-3xl shadow-[0_30px_90px_rgba(0,0,0,0.4)]"
                >
                    <Ticket size={56} className="text-[#FF7A18] drop-shadow-[0_0_15px_rgba(255,122,24,0.5)]" />
                </motion.div>
                <h2 className="text-6xl md:text-8xl font-black text-[#F8FAFC] mb-6 uppercase italic tracking-tighter transform -skew-x-12 leading-none">NO TICKETS <br /> <span className="text-gradient-primary">FOUND</span></h2>
                <p className="text-[#AAB2C5] mb-12 max-w-sm font-black uppercase tracking-[0.2em] text-[11px] italic opacity-60 leading-relaxed">You don't have any active tickets at the moment. <br />Browse our rides to book your next adventure.</p>
                <Link to="/" className="btn-premium px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_60px_rgba(255,122,24,0.3)]">
                    BROWSE RIDES
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] pt-52 md:pt-64 pb-24 md:pb-40 selection:bg-[#FF7A18]/40 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-grid opacity-[0.03] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[180px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[180px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-16 mb-24">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 text-[#FF7A18]">
                            <div className="w-12 h-[1px] bg-[#FF7A18]/30" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">MY TICKETS</span>
                        </div>
                        <h1 className="text-5xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] transform -skew-x-6">
                            MY <br /> <span className="text-gradient-primary">TICKETS</span>
                        </h1>
                        <p className="text-[#AAB2C5] text-xs font-black uppercase tracking-[0.4em] max-w-xl italic opacity-60 leading-relaxed border-l-2 border-[#FF7A18]/20 pl-6">
                            View and use your booked tickets here. Each ticket is valid for 24 hours after purchase.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3 bg-white/5 p-2 md:p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        {['all', 'active', 'expiring', 'expired'].map(btn => (
                            <button
                                key={btn}
                                onClick={() => setFilter(btn)}
                                className={`px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative ${filter === btn ? 'text-white' : 'text-[#AAB2C5] hover:text-[#F8FAFC]'}`}
                            >
                                {filter === btn && (
                                    <motion.div
                                        layoutId="tab-bg-vault"
                                        className="absolute inset-0 bg-[#FF7A18] rounded-2xl shadow-[0_10px_30px_rgba(255,122,24,0.3)] border border-white/20"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 italic">{btn === 'all' ? 'ALL TICKETS' : btn.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Section
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    <StatsCard icon={Receipt} label="Issuance Total" value={stats.total} color="bg-slate-700" gradient="from-slate-700 to-slate-900" />
                    <StatsCard icon={ShieldCheck} label="Operational" value={stats.active} color="bg-emerald-500" gradient="from-emerald-500 to-teal-600" />
                    <StatsCard icon={AlertCircle} label="Critical Uplink" value={stats.expiring} color="bg-orange-500" gradient="from-orange-500 to-red-600" />
                    <StatsCard icon={History} label="Deactivated" value={stats.expired} color="bg-red-500" gradient="from-red-600 to-rose-700" />
                </div> */}

                {/* Tickets Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[480px] rounded-[3rem] bg-white/5 border border-white/10 animate-pulse relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-14"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredTickets.map((ticket, index) => (
                                <motion.div
                                    key={`${ticket.ticketId}-${ticket.id}`}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                                >
                                    <TicketCard ticket={ticket.originalTicket} item={ticket} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State for Filter */}
                {!loading && filteredTickets.length === 0 && (
                    <div className="py-40 flex flex-col items-center text-center max-w-md mx-auto">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-10 shadow-2xl border border-white/10 group animate-pulse-subtle">
                            <Clock className="text-white/20 group-hover:text-[#FF7A18] transition-colors" size={40} />
                        </div>
                        <p className="text-[#AAB2C5] font-black uppercase tracking-[0.4em] text-xs italic leading-relaxed">No tickets found for this category.</p>
                    </div>
                )}
            </div>

            {/* Global Perspective Fix for 3D */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-2000 { perspective: 2000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                @keyframes pulse-subtle {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.95; transform: scale(0.99); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}} />
        </div>
    );
};

export default YourTickets;

