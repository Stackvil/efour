import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, BookHeart, Scale, Link as LinkIcon, AlertCircle, Globe, Power, Gavel, Building2, Mail, Phone, Zap } from 'lucide-react';

const Terms = () => {
    const navigate = useNavigate();
    const onClose = () => navigate(-1);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#070B14] flex flex-col justify-center items-center p-4 sm:p-8 pt-32 pb-20 relative overflow-hidden">
            <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card rounded-[3rem] shadow-3xl w-full max-w-3xl overflow-hidden flex flex-col border border-white/10 relative z-10"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/2 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#5B8CFF]/10 flex items-center justify-center border border-[#5B8CFF]/20 shadow-[0_0_20px_rgba(91,140,255,0.1)]">
                            <BookHeart size={28} className="text-[#5B8CFF]" />
                        </div>
                        <div>
                            <span className="text-[13px] font-bold text-[#5B8CFF] uppercase tracking-[0.4em] mb-1 block italic opacity-60">User Agreement</span>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase transform -skew-x-6 text-white">Terms of Use</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center text-[#AAB2C5] hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/10"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10 overflow-y-auto bg-transparent flex-grow custom-scrollbar max-h-[70vh]">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] mb-10 shadow-inner">
                        <p className="text-[#AAB2C5] text-base font-bold italic uppercase tracking-wider leading-relaxed">
                            Engagement with <span className="text-white">EFOUR-ELURU.COM</span> constitutes formal acceptance of this Eluru Protocol. Acceptance is non-optional for system interaction.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 mb-8">
                        <div className="glass-card p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-[#5B8CFF]/30 transition-all group bg-white/2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Scale size={18} className="text-[#5B8CFF]" />
                                </div>
                                <h3 className="font-bold text-white uppercase tracking-widest italic text-[14px]">Obligations</h3>
                            </div>
                            <p className="text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest italic leading-relaxed opacity-60">
                                Usage must align with Tier-1 legal frameworks. You are the sole architect of your account security. Provision of false telemetry is strictly prohibited.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-[#FF7A18]/30 transition-all group bg-white/2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <LinkIcon size={18} className="text-[#FF7A18]" />
                                </div>
                                <h3 className="font-bold text-white uppercase tracking-widest italic text-[14px]">Data Rights</h3>
                            </div>
                            <p className="text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest italic leading-relaxed opacity-60">
                                Interface assets are for isolated personal viewing. External extraction, mining, or harvesting of protocol data is a security violation.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/2 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full blur-2xl" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <AlertCircle size={18} className="text-red-500" />
                            </div>
                            <h3 className="font-bold text-white uppercase tracking-widest italic text-[14px]">Liability & Finality</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 mb-8">
                            <p className="text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest italic opacity-60">
                                <span className="text-white italic">Indemnity:</span> You release Efour from all liability arising from interface engagement errors.
                            </p>
                            <p className="text-[13px] text-[#AAB2C5] font-bold uppercase tracking-widest italic opacity-60">
                                <span className="text-white italic">Protocol Risk:</span> Service availability is provided "as-is". No guarantees for 100% Eluru uptime.
                            </p>
                        </div>

                        <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20 shadow-inner">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertCircle size={14} className="text-red-500" />
                                <h4 className="font-bold text-[12px] text-red-500 uppercase tracking-widest italic">Terminal Transaction Policy</h4>
                            </div>
                            <p className="text-[13px] text-red-400/60 font-bold uppercase tracking-widest italic">
                                All resource transfers are terminal. No refunds, returns, or reversal of credits once a booking or culinary request is initiated.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { icon: Globe, title: "Domain", desc: "India Core Legal Jurisdiction", color: "#5B8CFF" },
                            { icon: Power, title: "Status", desc: "Right to Terminate Connection", color: "#FF7A18" },
                            { icon: Gavel, title: "Justice", desc: "Court Resolution: Vijayawada", color: "#AAB2C5" }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl hover:bg-white/5 transition-all bg-white/2">
                                <item.icon size={20} className="mb-4" style={{ color: item.color }} />
                                <h4 className="text-[12px] font-bold text-white uppercase tracking-[0.3em] mb-2 italic">{item.title}</h4>
                                <p className="text-[12px] text-[#AAB2C5]/50 font-bold uppercase tracking-widest leading-relaxed italic">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-10 py-8 bg-white/2 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-6 rounded-3xl font-bold uppercase tracking-[0.4em] text-[14px] transition-all flex items-center justify-center gap-4 italic"
                    >
                        ACCEPT PROTOCOL <Zap size={18} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Terms;
