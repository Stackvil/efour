import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Info, Store, Users, Building2, ArrowUpRight } from 'lucide-react';

const About = () => {
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
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Info size={24} className="text-[#12796D]" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">About Us</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center text-[#AAB2C5] hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/10"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10 overflow-y-auto bg-transparent flex-grow flex flex-col items-center custom-scrollbar max-h-[70vh]">
                    <div className="mb-12 max-w-2xl text-center relative">
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#FF7A18]/5 blur-3xl rounded-full" />
                        <span className="text-[14px] font-bold tracking-[0.3em] text-[#FF7A18] uppercase mb-4 block">OUR STORY</span>
                        <h3 className="text-5xl sm:text-6xl font-black text-white mb-8 leading-none tracking-tight italic transform -skew-x-6">
                            Eat. Enjoy. <span className="text-[#12796D]">Entertain.</span>
                        </h3>
                        <p className="text-xl text-[#AAB2C5] leading-relaxed font-bold uppercase tracking-wide opacity-60">
                            Efour is a premier Food Court and Play Zone bringing families together through diverse cuisines and recreation under one roof.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 w-full mb-10">
                        <div className="bg-[#0D7066] p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                            <Store size={40} className="text-white mb-8" />
                            <h4 className="text-4xl font-black text-white mb-4 italic uppercase">For Vendors</h4>
                            <p className="text-white/80 leading-relaxed font-bold text-lg uppercase tracking-tight">
                                Promote your culinary business directly to thousands. Benefit from an enhanced e-Experience with direct customer reviews.
                            </p>
                        </div>

                        <div className="bg-[#FF5722] p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                            <Users size={40} className="text-white mb-8" />
                            <h4 className="text-4xl font-black text-white mb-4 italic uppercase">For Users</h4>
                            <p className="text-white/80 leading-relaxed font-bold text-lg uppercase tracking-tight">
                                A wide range of services suited to your needs —from diverse cuisines to customized entertainment packages.
                            </p>
                        </div>
                    </div>

                    <div className="w-full bg-[#F8FAFC]/5 p-8 sm:p-10 rounded-[2.5rem] shadow-xl relative border border-white/10">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#FF7A18]/10 flex items-center justify-center border border-[#FF7A18]/20">
                                <Building2 size={28} className="text-[#FF7A18]" />
                            </div>
                            <h4 className="text-2xl font-black text-white uppercase italic">Founder's Vision</h4>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl mb-10 border border-white/5 shadow-inner">
                            <p className="text-xl sm:text-2xl italic text-[#AAB2C5] font-medium leading-relaxed uppercase tracking-widest opacity-80">
                                "We designed an ample space for all cuisines and play zone activities to suit all ages and promote local talent."
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 pt-10 border-t border-white/5">
                            <div className="relative shrink-0">
                                <img
                                    src="/jaynarayana.jpeg"
                                    alt="Jayanarayana Kureti"
                                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2.5rem] object-cover object-top border-4 border-white/10 shadow-2xl relative z-10 brightness-90"
                                />
                            </div>
                            <div className="text-center sm:text-left pt-4">
                                <h3 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2 tracking-tighter uppercase italic">Jayanarayana Kureti</h3>
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <div className="w-8 h-1 bg-[#FF7A18] rounded-full" />
                                    <span className="text-lg font-bold text-[#AAB2C5] uppercase tracking-[0.2em] italic">Founder & CEO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-10 py-8 bg-white/2 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-6 rounded-3xl font-bold uppercase tracking-[0.4em] text-[14px] transition-all flex items-center justify-center gap-4 italic"
                    >
                        RETURN TO HUB <ArrowUpRight size={18} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
