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
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[2rem] bg-[#6C5CE7]/10 flex items-center justify-center border border-[#6C5CE7]/20 shadow-4xl group">
                            <BookHeart size={32} className="text-[#6C5CE7] group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                            <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-[0.6em] mb-2 block italic opacity-60 leading-none">OUR RULES</span>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase transform -skew-x-12 text-white leading-none">TERMS OF USE</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-16 h-16 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 rounded-[2rem] transition-all border border-white/10 active:scale-90"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-12 lg:p-16 overflow-y-auto bg-transparent flex-grow custom-scrollbar max-h-[65vh]">
                    <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] mb-12 shadow-inner group hover:border-[#6C5CE7]/20 transition-all duration-700">
                        <p className="text-slate-600 text-lg font-bold italic uppercase tracking-[0.1em] leading-relaxed border-l-2 border-[#6C5CE7]/30 pl-10">
                            By using <span className="text-white">EFOUR-ELURU.COM</span>, you agree to follow the <span className="text-[#6C5CE7]">EFOUR RULES.</span> You must follow these guidelines to use our website.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-10 mb-12">
                        <div className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 shadow-4xl hover:border-[#6C5CE7]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-6 mb-8 text-[#6C5CE7]">
                                <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/5 flex items-center justify-center border border-[#6C5CE7]/10 shadow-inner">
                                    <Scale size={24} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.4em] italic text-[14px]">YOUR PART</h3>
                            </div>
                            <p className="text-[13px] text-slate-500 font-bold uppercase tracking-[0.15em] italic leading-relaxed opacity-80 group-hover:text-white transition-colors">
                                You must follow the law when using our website. You are responsible for your account's safety. Providing false information is not allowed.
                            </p>
                        </div>

                        <div className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 shadow-4xl hover:border-[#FF7A00]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-6 mb-8 text-[#FF7A00]">
                                <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/5 flex items-center justify-center border border-[#FF7A00]/10 shadow-inner">
                                    <LinkIcon size={24} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.4em] italic text-[14px]">CONTENT</h3>
                            </div>
                            <p className="text-[13px] text-slate-500 font-bold uppercase tracking-[0.15em] italic leading-relaxed opacity-80 group-hover:text-white transition-colors">
                                All photos and videos on this website are for your personal use only. Copying or stealing our data is strictly forbidden.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] p-10 rounded-[4rem] border border-white/5 mb-12 shadow-4xl group hover:border-red-500/20 transition-all duration-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full translate-x-32 -translate-y-32" />
                        <div className="flex items-center gap-6 mb-10 text-red-500">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/5 flex items-center justify-center border border-red-500/10 shadow-inner group-hover:scale-110 transition-transform">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="font-black text-white uppercase tracking-[0.4em] italic text-[14px]">LIMITS & REFUNDS</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-10 mb-10 relative z-10">
                            <p className="text-[14px] text-slate-500 font-bold uppercase tracking-[0.1em] italic opacity-80 group-hover:text-white transition-colors leading-relaxed">
                                <span className="text-red-500 italic block mb-2 opacity-100">NO LIABILITY</span>
                                You agree that Efour is not responsible for any website errors or technical problems.
                            </p>
                            <p className="text-[14px] text-slate-500 font-bold uppercase tracking-[0.1em] italic opacity-80 group-hover:text-white transition-colors leading-relaxed">
                                <span className="text-[#6C5CE7] italic block mb-2 opacity-100">SERVICE</span>
                                The website is provided as-is. We do not guarantee it will always be online or error-free.
                            </p>
                        </div>

                        <div className="bg-red-500/5 p-10 rounded-[3rem] border border-red-500/10 shadow-inner group-hover:bg-red-500/10 transition-colors duration-700">
                            <div className="flex items-center gap-4 mb-6">
                                <AlertCircle size={18} className="text-red-500" />
                                <h4 className="font-black text-[13px] text-red-500 uppercase tracking-[0.4em] italic leading-none">REFUND POLICY</h4>
                            </div>
                            <p className="text-[14px] text-red-500/60 font-black uppercase tracking-[0.2em] italic leading-relaxed">
                                ALL PAYMENTS ARE FINAL. NO REFUNDS WILL BE GIVEN ONCE A BOOKING OR FOOD ORDER IS PLACED.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            { icon: Globe, title: "LOCATION", desc: "Subject to Indian Laws", color: "#6C5CE7" },
                            { icon: Power, title: "YOUR ACCOUNT", desc: "We can close accounts if rules are broken", color: "#FF7A00" },
                            { icon: Gavel, title: "SUPPORT", desc: "Help office: Vijayawada", color: "#slate-600" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/5 shadow-4xl hover:bg-white/[0.03] transition-all duration-700 group">
                                <item.icon size={28} className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: item.color }} />
                                <h4 className="text-[13px] font-black text-white uppercase tracking-[0.4em] mb-4 italic leading-none">{item.title}</h4>
                                <p className="text-[12px] text-slate-800 font-bold uppercase tracking-[0.1em] leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-12 py-10 bg-white/[0.03] border-t border-white/5 relative z-10">
                    <button
                        onClick={onClose}
                        className="btn-premium w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.6em] text-[12px] shadow-4xl hover:-translate-y-2 transition-all duration-700 italic flex items-center justify-center gap-6"
                    >
                        I AGREE <Zap size={20} className="group-hover:scale-125 transition-transform" />
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
            `}} />
        </div>
    );
};

export default Terms;
