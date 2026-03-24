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
        <div className="min-h-screen bg-[#02040a] flex flex-col justify-center items-center p-6 sm:p-12 pt-40 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#6C5CE7]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#FF7A00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute inset-0 noise-overlay opacity-[0.02]" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 60 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.02] backdrop-blur-4xl rounded-[4rem] shadow-4xl w-full max-w-4xl overflow-hidden flex flex-col border border-white/10 relative z-10"
            >
                {/* Header */}
                <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-white/[0.03] relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#6C5CE7]/10 flex items-center justify-center border border-[#6C5CE7]/20 shadow-inner">
                            <Info size={28} className="text-[#6C5CE7]" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter transform -skew-x-12 leading-none">OUR STORY</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-14 h-14 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all border border-white/10 active:scale-90"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-12 lg:p-16 overflow-y-auto bg-transparent flex-grow flex flex-col items-center custom-scrollbar max-h-[65vh]">
                    <div className="mb-20 max-w-3xl text-center relative">
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-[#6C5CE7]/10 blur-[100px] rounded-full pointer-events-none" />
                        <span className="text-[12px] font-black tracking-[0.6em] text-[#6C5CE7] uppercase mb-6 block italic">SINCE 2026</span>
                        <h3 className="text-6xl sm:text-8xl font-black text-white mb-10 leading-[0.85] tracking-tighter italic transform -skew-x-12">
                            EAT. PLAY. <br /> <span className="text-gradient-primary">ENJOY.</span>
                        </h3>
                        <p className="text-2xl text-slate-600 leading-relaxed font-bold uppercase tracking-[0.1em] opacity-80 max-w-2xl mx-auto border-l-2 border-[#6C5CE7]/30 pl-10 text-left italic">
                            Efour is the best place in Eluru for great food and fun rides for the whole family.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-10 w-full mb-16">
                        <div className="bg-[#6C5CE7]/5 p-12 rounded-[3rem] shadow-3xl border border-[#6C5CE7]/10 relative overflow-hidden group hover:bg-[#6C5CE7]/10 transition-colors duration-700">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/10 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                            <Store size={48} className="text-[#6C5CE7] mb-10 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="text-4xl font-black text-white mb-6 italic uppercase transform -skew-x-12 tracking-tighter">JOIN US</h4>
                            <p className="text-slate-500 leading-relaxed font-bold text-lg uppercase tracking-tight italic opacity-60">
                                Bring your food stall to Efour and reach more people with our help.
                            </p>
                        </div>

                        <div className="bg-[#FF7A00]/5 p-12 rounded-[3rem] shadow-3xl border border-[#FF7A00]/10 relative overflow-hidden group hover:bg-[#FF7A00]/10 transition-colors duration-700">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/10 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                            <Users size={48} className="text-[#FF7A00] mb-10 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="text-4xl font-black text-white mb-6 italic uppercase transform -skew-x-12 tracking-tighter">PEOPLE</h4>
                            <p className="text-slate-500 leading-relaxed font-bold text-lg uppercase tracking-tight italic opacity-60">
                                Enjoy the best food and fun activities in one single location.
                            </p>
                        </div>
                    </div>

                    <div className="w-full bg-white/[0.03] p-10 sm:p-16 rounded-[4rem] shadow-4xl relative border border-white/10 group hover:border-[#6C5CE7]/30 transition-all duration-1000">
                        <div className="absolute inset-0 noise-overlay opacity-[0.03] rounded-[4rem] pointer-events-none" />
                        <div className="flex items-center gap-8 mb-12">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-inner">
                                <Building2 size={32} className="text-[#6C5CE7]" />
                            </div>
                            <h4 className="text-3xl font-black text-white uppercase italic transform -skew-x-12 tracking-tighter">OUR MESSAGE</h4>
                        </div>

                        <div className="bg-[#02040a] p-12 rounded-[2.5rem] mb-16 border border-white/5 shadow- inner relative group-hover:translate-x-2 transition-transform duration-1000">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-20 bg-[#6C5CE7] rounded-full blur-[2px]" />
                            <p className="text-2xl sm:text-3xl italic text-slate-500 font-bold leading-relaxed uppercase tracking-[0.1em] opacity-80">
                                "We created a special place where good food and fun rides come together for everyone in Eluru to enjoy."
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-12 pt-12 border-t border-white/5">
                            <div className="relative shrink-0 group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-[#6C5CE7] to-[#FF7A00] rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000" />
                                <img
                                    src="/jaynarayana.jpeg"
                                    alt="Jayanarayana Kureti"
                                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-[3rem] object-cover object-top border-2 border-white/10 shadow-4xl relative z-10 brightness-75 hover:brightness-110 transition-all duration-1000 grayscale hover:grayscale-0"
                                />
                            </div>
                            <div className="text-center sm:text-left pt-6">
                                <h3 className="text-5xl sm:text-6xl font-black text-white leading-[0.85] mb-4 tracking-tighter uppercase italic transform -skew-x-12 group-hover:text-[#6C5CE7] transition-colors duration-700">JAYANARAYANA <br /> KURETI</h3>
                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                    <div className="w-10 h-[2px] bg-[#6C5CE7] rounded-full shadow-[0_0_10px_#6C5CE7]" />
                                    <span className="text-xl font-bold text-slate-800 uppercase tracking-[0.4em] italic opacity-60">FOUNDER & CEO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-12 py-10 bg-white/[0.03] border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-[12px] shadow-4xl hover:-translate-y-2 transition-all duration-700 italic flex items-center justify-center gap-6"
                    >
                        GO BACK <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-700" />
                    </button>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .backdrop-blur-4xl { backdrop-filter: blur(80px); }
                .shadow-4xl { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.9); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(108, 92, 231, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(108, 92, 231, 0.4); }
            `}} />
        </div>
    );
};

export default About;
