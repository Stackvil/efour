import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ArrowRight, Zap } from 'lucide-react';

const PolicyConsent = ({ onOpenTerms, onOpenPrivacy }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem('efour-policy-v2-accepted');
        if (!hasAccepted) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('efour-policy-v2-accepted', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 100 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 100 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="fixed bottom-12 left-4 right-4 md:left-auto md:right-10 md:w-[420px] z-[80]"
                >
                    <div className="relative group">
                        {/* More Intense Premium Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-eluru-teal via-eluru-teal/50 to-sunset-orange blur-xl opacity-40 group-hover:opacity-100 transition duration-1000 rounded-[2.5rem]"></div>

                        <div className="relative bg-[#080808]/95 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-eluru-teal/20 to-eluru-teal/5 flex items-center justify-center border border-eluru-teal/30 shadow-inner">
                                            <ShieldCheck className="text-eluru-teal" size={28} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-eluru-teal uppercase tracking-[0.4em] mb-1">
                                                Cookies & Privacy
                                            </h4>
                                            <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight">
                                                Policy Protocol
                                            </h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                        title="Dismiss for now"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <p className="text-gray-400 text-[13px] font-bold leading-relaxed mb-10">
                                    We use <span className="text-white underline decoration-eluru-teal/50 decoration-2 underline-offset-4">Cookies</span> to enhance your experience. By exploring <span className="text-white">efour-eluru.com</span>, you consent to our
                                    <button onClick={onOpenPrivacy} className="mx-1 text-eluru-teal hover:text-white transition-colors border-b-2 border-eluru-teal/20 hover:border-eluru-teal">Privacy Policy</button>
                                    and
                                    <button onClick={onOpenTerms} className="mx-1 text-eluru-teal hover:text-white transition-colors border-b-2 border-eluru-teal/20 hover:border-eluru-teal">User Agreement</button>.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleAccept}
                                        className="relative overflow-hidden group/btn w-full bg-white text-black py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all hover:bg-eluru-teal hover:text-white active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3"
                                    >
                                        <div className="relative z-10 flex items-center gap-3">
                                            Accept & Explore
                                            <Zap size={16} className="fill-current" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-eluru-teal to-sunset-orange opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                                    </button>

                                    <div className="flex justify-center">
                                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em]">
                                            Secure Connection <span className="text-green-500 ml-1">●</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PolicyConsent;
