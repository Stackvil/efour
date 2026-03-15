import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, User, X, ShieldCheck, Zap, Cpu, Sparkles, Activity } from 'lucide-react';
import { BASE_URL } from '../utils/api';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const Success = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useStore();

    const status = searchParams.get('status');
    const isSuccess = status === 'success';

    const [orderDetails, setOrderDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${BASE_URL}/api/payment/status/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrderDetails(data.order || data);
                }
            } catch (err) {
                console.error('Failed to fetch order status', err);
            } finally {
                setLoading(false);
            }
        };

        if (isSuccess) {
            clearCart();
        }
        fetchOrder();
    }, [isSuccess, clearCart, orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 pt-24 space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#FF7A18]/20 rounded-full blur-2xl animate-pulse" />
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-[#FF7A18] relative z-10 shadow-[0_0_30px_rgba(255,122,24,0.4)]"></div>
                </div>
                <p className="text-[#AAB2C5] font-black uppercase tracking-[0.5em] text-[10px] animate-pulse italic">Synchronizing Protocol...</p>
            </div>
        );
    }

    if (!isSuccess && status) {
        return (
            <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-6 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 rounded-[4rem] border border-red-500/20 max-w-xl w-full text-center shadow-[0_50px_100px_rgba(239,68,68,0.1)] relative z-10"
                >
                    <div className="w-28 h-28 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <X size={56} />
                    </div>

                    <h1 className="text-5xl font-black text-[#F8FAFC] mb-6 tracking-tighter uppercase italic transform -skew-x-12 leading-none">
                        PAYMENT <br /><span className="text-red-500">FAILED</span>
                    </h1>
                    <p className="text-[#AAB2C5] mb-12 font-black uppercase tracking-[0.4em] text-[10px] italic opacity-60">The transaction protocol was interrupted. <br />Telemetry indicates a synchronization error.</p>

                    <div className="space-y-6">
                        <Link to="/" className="w-full btn-premium py-5 rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.2)] bg-gradient-to-r from-red-600 to-rose-700">
                            RETRY PROTOCOL <ArrowRight size={20} className="ml-3" />
                        </Link>
                        <Link to="/contact" className="block text-[10px] text-[#AAB2C5] font-black uppercase tracking-[0.5em] hover:text-[#F8FAFC] transition-colors italic">
                            CONNECT WITH SUPPORT
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-6 py-32 relative overflow-hidden selection:bg-[#FF7A18] selection:text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border border-white/10 max-w-2xl w-full text-center shadow-[0_60px_120px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden"
            >
                {/* Status Header */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF7A18]/40 to-transparent" />

                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-[#FF7A18]/20 rounded-full blur-3xl opacity-40 animate-pulse" />
                    <div className="w-28 h-28 bg-[#FF7A18]/10 text-[#FF7A18] rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-[#FF7A18]/20 shadow-[0_20px_60px_rgba(255,122,24,0.3)] transform -rotate-12 hover:rotate-0 transition-transform duration-700">
                        <ShieldCheck size={56} />
                    </div>
                </div>

                <div className="space-y-4 mb-16">
                    <div className="flex items-center justify-center gap-4 text-[#FF7A18]">
                        <div className="w-12 h-[1px] bg-[#FF7A18]/20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] italic opacity-80">VALIDATION SUCCESS</span>
                        <div className="w-12 h-[1px] bg-[#FF7A18]/20" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-[#F8FAFC] tracking-tighter uppercase leading-[0.85] transform -skew-x-6">
                        PROTOCOL <br /><span className="text-gradient-primary">CONFIRMED</span>
                    </h1>
                </div>

                <div className="flex justify-center mb-16 group">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF7A18]/10 to-[#5B8CFF]/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="p-4 md:p-6 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.5)] border-4 border-white/10 relative z-10 transform group-hover:scale-105 transition-transform duration-700">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderId || 'ETH-782'}`}
                                alt="Order QR Code"
                                className="rounded-xl w-32 md:w-48 h-32 md:h-48"
                            />
                        </div>
                    </div>
                </div>

                {/* Tickets Section: Digital Access Tokens */}
                <div className="space-y-8 mb-16 text-left">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5B8CFF]">
                            <Cpu size={18} />
                        </div>
                        <h2 className="text-[10px] font-black text-[#AAB2C5] uppercase tracking-[0.4em] italic opacity-60">Digital Access Tokens</h2>
                    </div>

                    <div className="space-y-5">
                        {(orderDetails?.items || []).map((item, idx) => (
                            <motion.div
                                key={item.id || item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-between gap-6 relative overflow-hidden group hover:border-[#FF7A18]/30 transition-all duration-500"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#FF7A18] opacity-30 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#FF7A18]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <OptimizedImage
                                            src={item.image ? decodeURIComponent(item.image) : ''}
                                            alt={item.name}
                                            priority={idx < 4}
                                            className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all relative z-10"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-[#F8FAFC] text-xl uppercase tracking-tighter italic transform -skew-x-12 leading-tight group-hover:text-[#FF7A18] transition-colors">{item.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-[#AAB2C5] font-black uppercase tracking-widest opacity-60">QTY: {item.quantity}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-[10px] text-[#FF7A18] font-black uppercase tracking-widest">₹{item.price * item.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                            <span className="text-[8px] uppercase font-black text-emerald-400 tracking-[0.3em] italic">VALIDATED</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex flex-col items-center border-l border-dashed border-white/10 pl-8 space-y-3">
                                    <div className="p-2 bg-white rounded-xl shadow-xl transform group-hover:rotate-6 transition-transform">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=ETH-${orderId || '782'}-${item.id || item._id}`}
                                            alt="QR"
                                            className="w-14 h-14 pointer-events-none"
                                        />
                                    </div>
                                    <span className="text-[8px] font-black text-[#AAB2C5] tracking-[0.4em] uppercase opacity-40">T-TOKEN</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                    <Link to="/login" className="flex-1 btn-premium py-6 rounded-3xl shadow-[0_20px_60px_rgba(255,122,24,0.35)] group/btn">
                        PROFILE ELURU <User size={20} className="ml-3 group-hover/btn:scale-110 transition-transform" />
                    </Link>
                    <Link to="/dine" className="flex-1 glass-card border border-[#5B8CFF]/20 hover:border-[#5B8CFF]/50 py-6 rounded-3xl flex items-center justify-center gap-3 text-[#5B8CFF] font-black uppercase tracking-[0.4em] text-[11px] italic transition-all duration-500 group/dine shadow-xl">
                        CULINARY DOCK <ArrowRight size={20} className="group-hover/dine:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Protocol Guidelines */}
                <div className="mt-20 p-10 bg-white/[0.02] rounded-[3rem] text-left border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B8CFF]/5 blur-3xl rounded-full" />
                    <div className="relative z-10 flex items-start gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#5B8CFF]/10 flex items-center justify-center text-[#5B8CFF] shrink-0 border border-[#5B8CFF]/20 shadow-2xl">
                            <Activity size={28} />
                        </div>
                        <div className="space-y-6">
                            <h3 className="font-black text-[#F8FAFC] tracking-[0.5em] uppercase text-[10px] italic opacity-40">PROTOCOL GUIDELINES Alpha-02</h3>
                            <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-[11px] text-[#AAB2C5] font-black uppercase tracking-[0.1em] italic opacity-60 leading-relaxed">
                                <li className="flex gap-4"><Zap size={14} className="text-[#FF7A18] shrink-0" /> PRESENT DIGITAL TOKENS AT DESIGNATED STALLS FOR IMMEDIATE SYNC.</li>
                                <li className="flex gap-4"><Zap size={14} className="text-[#FF7A18] shrink-0" /> REAL-TIME TELEMETRY UPDATES AVAILABLE IN COMMAND DASHBOARD.</li>
                                <li className="flex gap-4"><Zap size={14} className="text-[#FF7A18] shrink-0" /> ACCESS PRIVILEGES ARE BINDED TO THIS CRYPTOGRAPHIC SESSION.</li>
                                <li className="flex gap-4"><Zap size={14} className="text-[#FF7A18] shrink-0" /> ENJOY THE PREMIUM EFOUR EXPERIENCE. PROTOCOL COMPLETE.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Perspective Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .matrix-grid {
                    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}} />
        </div>
    );
};

export default Success;
