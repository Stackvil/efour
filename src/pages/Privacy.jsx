import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ShieldCheck, UserCheck, History, UserCog, Cookie, Share2, ThumbsUp, Building2, Mail, Phone, Zap } from 'lucide-react';

const Privacy = () => {
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
                            <ShieldCheck size={32} className="text-[#6C5CE7] group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div>
                            <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-[0.6em] mb-2 block italic opacity-60 leading-none">YOUR PROTECTION</span>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase transform -skew-x-12 text-white leading-none">PRIVACY POLICY</h2>
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
                            <span className="text-white">EFOUR ELURU</span> protects all your information and data shared with us via this website. Policy started on <span className="text-[#6C5CE7]">MARCH 01, 2026.</span>
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-10 mb-12">
                        <div className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 shadow-4xl hover:border-[#6C5CE7]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-6 mb-8 text-[#6C5CE7]">
                                <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/5 flex items-center justify-center border border-[#6C5CE7]/10 shadow-inner">
                                    <UserCheck size={24} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.4em] italic text-[14px]">YOUR DATA</h3>
                            </div>
                            <ul className="space-y-5">
                                {['NAME & PERSONAL INFO', 'YOUR LOCATION', 'ACCOUNT DETAILS'].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-[13px] text-slate-500 font-bold uppercase tracking-[0.2em] italic opacity-80 group-hover:text-white transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-[#6C5CE7] shadow-[0_0_10px_#6C5CE7]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 shadow-4xl hover:border-[#FF7A00]/30 transition-all duration-700 group">
                            <div className="flex items-center gap-6 mb-8 text-[#FF7A00]">
                                <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/5 flex items-center justify-center border border-[#FF7A00]/10 shadow-inner">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="font-black text-white uppercase tracking-[0.4em] italic text-[14px]">PROTECTION</h3>
                            </div>
                            <p className="text-[13px] text-slate-500 font-bold uppercase tracking-[0.15em] italic leading-relaxed opacity-80 group-hover:text-white transition-colors">
                                We use high-level security to protect your account. We never share your personal information with others.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 mb-12 shadow-4xl group hover:border-[#6C5CE7]/20 transition-all duration-700">
                        <div className="flex items-center gap-6 mb-10 text-[#6C5CE7]">
                            <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/5 flex items-center justify-center border border-[#6C5CE7]/10 shadow-inner">
                                <History size={24} />
                            </div>
                            <h3 className="font-black text-white uppercase tracking-[0.4em] italic text-[14px]">HOW WE USE DATA</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                            {[
                                { id: '01', text: 'UPDATE INFO' },
                                { id: '02', text: 'IMPROVE HUB' },
                                { id: '03', text: 'SEND UPDATES' },
                                { id: '04', text: 'HUB ANALYSIS' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-3 group/item">
                                    <span className="text-[#6C5CE7] font-black italic text-[16px] tracking-tighter opacity-40 group-hover/item:opacity-100 transition-opacity">{item.id}</span>
                                    <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.2em] italic opacity-70 group-hover/item:text-white transition-colors">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8 mb-12">
                        {[
                            { icon: UserCog, title: "YOUR RIGHTS", desc: "Edit or delete your personal information.", color: "#6C5CE7" },
                            { icon: Cookie, title: "WEBSITE DATA", desc: "Used to make the website work faster.", color: "#FF7A00" },
                            { icon: Share2, title: "NO SHARING", desc: "We only share data when it is necessary.", color: "#slate-600" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/5 shadow-4xl hover:bg-white/[0.03] transition-all duration-700 group">
                                <item.icon size={28} className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: item.color }} />
                                <h4 className="text-[13px] font-black text-white uppercase tracking-[0.4em] mb-4 italic leading-none">{item.title}</h4>
                                <p className="text-[12px] text-slate-800 font-bold uppercase tracking-[0.1em] leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-10 bg-white/[0.02] rounded-[3.5rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-10 shadow-4xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#6C5CE7]/10 to-transparent rounded-bl-full blur-[80px] opacity-40" />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-inner text-[#6C5CE7]">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.6em] mb-2 italic opacity-40 leading-none">IDENTITY</h4>
                                <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic transform -skew-x-12 leading-none">EFOUR ELURU HQ</h3>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 w-full sm:w-auto relative z-10">
                            <div className="flex items-center gap-4 text-[12px] font-black text-white italic bg-black/40 px-8 py-4 rounded-2xl border border-white/5 backdrop-blur-4xl shadow- inner group/mail">
                                <Mail size={16} className="text-[#6C5CE7] group-hover:rotate-12 transition-transform" />
                                CEO@EFOUR-ELURU.COM
                            </div>
                            <div className="flex items-center gap-4 text-[12px] font-black text-white italic bg-black/40 px-8 py-4 rounded-2xl border border-white/5 backdrop-blur-4xl shadow- inner group/phone">
                                <Phone size={16} className="text-[#FF7A00] group-hover:rotate-12 transition-transform" />
                                +91 70369 23456
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
                        I UNDERSTAND <Zap size={20} className="group-hover:scale-125 transition-transform" />
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

export default Privacy;
