import React from 'react';
import { MapPin, Phone, Mail, Clock, Bus, Info, Send, Shield, Globe, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import OptimizedImage from '../components/common/OptimizedImage';

const Contact = () => {
    const detailClasses = "glass-card p-10 rounded-[3rem] border border-white/10 h-full relative group hover:border-[#FF7A18]/30 transition-all duration-700 hover:shadow-[0_40px_100px_rgba(255,122,24,0.15)] overflow-hidden";
    const iconContainerClasses = "w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5B8CFF] group-hover:text-[#FF7A18] group-hover:scale-110 group-hover:bg-[#FF7A18]/10 transition-all duration-500 shadow-xl";

    return (
        <div className="bg-[#070B14] min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 relative overflow-hidden selection:bg-[#FF7A18] selection:text-white">
            {/* Immersive Background Elements */}
            <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-[#FF7A18]/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Contact Header: The Eluru Proclamation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="mb-32 text-center max-w-5xl mx-auto space-y-10"
                >
                    <h1 className="text-5xl md:text-9xl font-black mb-8 text-[#F8FAFC] italic tracking-tighter uppercase leading-[0.85] transform -skew-x-6">
                        CONTACT <br /><span className="text-gradient-primary">US</span>
                    </h1>

                    <div className="flex flex-col items-center gap-6">
                        <p className="max-w-2xl text-[#AAB2C5] text-xs font-black uppercase tracking-[0.4em] italic opacity-60 leading-relaxed">
                            Strategically positioned at the core of Eluru, Efour serves as the primary node for futuristic entertainment and luxury gastronomy.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                            <span className="text-[12px] font-bold text-[#AAB2C5] tracking-[0.3em] uppercase opacity-40">UPLINK STATUS: OPTIMAL</span>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12 mb-32">
                    {/* Primary Telemetry Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className={detailClasses}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF7A18]/10 to-transparent blur-3xl opacity-50" />

                            <h3 className="text-2xl font-black mb-16 flex items-center gap-5 text-[#F8FAFC] uppercase tracking-tighter italic transform -skew-x-12">
                                <Activity className="text-[#FF7A18] animate-pulse" size={28} />
                                Information
                            </h3>

                            <div className="space-y-16">
                                <div className="space-y-6 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className={iconContainerClasses}>
                                            <MapPin size={24} />
                                        </div>
                                        <p className="text-[14px] font-bold text-[#FF7A18] uppercase tracking-[0.4em] italic opacity-80">COORDINATES</p>
                                    </div>
                                    <p className="font-bold text-[#F8FAFC] text-lg leading-relaxed italic transform group-hover/item:translate-x-2 transition-transform duration-500">
                                        Opp: New RTC Main Bus Stand,<br />
                                        NR Peta, ELURU - 534 006
                                    </p>
                                </div>

                                <div className="space-y-6 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className={iconContainerClasses}>
                                            <Phone size={24} />
                                        </div>
                                        <p className="text-[14px] font-bold text-[#FF7A18] uppercase tracking-[0.4em] italic opacity-80">COMMS LINE</p>
                                    </div>
                                    <p className="font-black text-[#F8FAFC] text-3xl tracking-tighter italic transform group-hover/item:translate-x-2 transition-transform duration-500">
                                        +91 70369 23456
                                    </p>
                                </div>

                                <div className="space-y-6 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className={iconContainerClasses}>
                                            <Clock size={24} />
                                        </div>
                                        <p className="text-[14px] font-bold text-[#FF7A18] uppercase tracking-[0.4em] italic opacity-80">RUNTIME CYCLE</p>
                                    </div>
                                    <p className="font-bold text-[#F8FAFC] text-lg italic transform group-hover/item:translate-x-2 transition-transform duration-500">
                                        DAILY: 09:00 – 23:00 IST
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Immersive Map & Logistics */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 space-y-12"
                    >
                        <div className="glass-card rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl h-[520px] relative group/map">
                            <OptimizedImage
                                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                                className="w-full h-full object-cover opacity-20 grayscale group-hover/map:opacity-40 group-hover/map:grayscale-0 group-hover/map:scale-110 transition-all duration-[2000ms]"
                                alt="Eluru Map"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/40" />
                            <div className="absolute inset-0 matrix-grid opacity-20" />

                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-[#0F172A]/90 backdrop-blur-3xl p-10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col md:flex-row items-center gap-10 max-w-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A18]/5 blur-3xl rounded-full" />
                                    <div className="relative z-10 p-6 bg-white/[0.03] rounded-[2.5rem] border border-white/10 shadow-2xl transform hover:rotate-6 transition-transform duration-500">
                                        <img src="/E4LOGO.jpeg" alt="E4 Logo" className="h-24 w-auto object-contain brightness-125" />
                                    </div>
                                    <div className="relative z-10 text-center md:text-left space-y-6">
                                        <div>
                                            <h4 className="font-bold text-4xl text-[#F8FAFC] tracking-tighter uppercase italic transform -skew-x-12 mb-2">Efour Eluru</h4>
                                            <p className="text-[13px] text-[#AAB2C5] font-bold tracking-[0.4em] uppercase opacity-40 italic">CENTRAL OPERATIONS HUB Alpha-01</p>
                                        </div>
                                        <a
                                            href="https://www.google.com/maps/place/EFOUR/@16.7089355,81.0863275,17z/data=!3m1!4b1!4m6!3m5!1s0x3a36131a0e74054d:0x366c34d3c0b4589c!8m2!3d16.7089304!4d81.0889024!16s%2Fg%2F11wnjn71fc?entry=ttu&g_ep=EgoyMDI2MDIwMS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-premium px-12 py-5 rounded-2xl shadow-[0_20px_50px_rgba(255,122,24,0.3)]"
                                        >
                                            MAPS
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            {[
                                { icon: <Bus size={32} />, title: 'TRANSPORT LINK', desc: 'ELURU ADJACENT: RTC TERMINAL', glow: 'group-hover:text-[#5B8CFF]' }
                            ].map((item, i) => (
                                <div key={i} className="glass-card p-10 rounded-[3rem] border border-white/10 flex items-center gap-8 group hover:border-white/20 transition-all duration-500 w-full max-w-md">
                                    <div className={`w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${item.glow} group-hover:scale-110 shadow-2xl`}>
                                        {item.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-[#F8FAFC] text-2xl tracking-tighter italic uppercase">{item.title}</h4>
                                        <p className="text-[13px] font-bold text-[#AAB2C5] uppercase tracking-[0.3em] italic opacity-40">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-[3rem] md:rounded-[5rem] p-8 md:p-24 relative overflow-hidden border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.4)]"
                >
                    <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#FF7A18]/10 rounded-full blur-[150px] pointer-events-none opacity-40" />
                    <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#5B8CFF]/5 rounded-full blur-[150px] pointer-events-none opacity-20" />
                    <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />

                    <div className="relative z-10 grid xl:grid-cols-2 gap-32 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-[#FF7A18]">
                                    <Shield size={20} className="animate-pulse" />
                                    <span className="text-[14px] font-bold uppercase tracking-[0.6em] italic opacity-80">ENCRYPTED UPLINK</span>
                                </div>
                                <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] transform -skew-x-6 text-[#F8FAFC]">
                                    TRANSMIT <br /><span className="text-gradient-primary">QUERY</span>
                                </h2>
                            </div>

                            <p className="text-lg text-[#AAB2C5] font-black uppercase tracking-[0.3em] text-xs italic opacity-60 leading-relaxed border-l-2 border-[#FF7A18]/20 pl-8">
                                Dedicated support channels are monitored 24/7. Transmit your data packets for immediate tactical response.
                            </p>

                            <div className="pt-8">
                                <div className="flex items-center gap-10 text-2xl font-black text-[#F8FAFC] tracking-tighter italic uppercase group cursor-pointer">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-[#FF7A18] group-hover:scale-110 group-hover:bg-[#FF7A18]/10 transition-all duration-500 shadow-2xl">
                                        <Mail size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[14px] font-bold text-[#AAB2C5] tracking-[0.4em] uppercase opacity-40">DIRECT CHANNEL</p>
                                        <span className="group-hover:text-[#FF7A18] transition-colors">efoureluru@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="bg-[#0F172A]/60 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-10 relative">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF7A18]/40 to-transparent" />

                            <div className="space-y-1 w-full text-center mb-6">
                                <p className="text-[9px] font-black text-[#AAB2C5] tracking-[0.5em] uppercase opacity-40 italic">INPUT TERMINAL Alpha-01</p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: 'FULL NAME', type: 'text', placeholder: 'ENTER YOUR FULL NAME' },
                                    { label: 'EMAIL ADDRESS', type: 'email', placeholder: 'USERNAME@EMAIL.COM' }
                                ].map((field, i) => (
                                    <div key={i} className="space-y-3">
                                        <label className="text-[14px] font-bold text-[#FF7A18] uppercase tracking-[0.4em] italic ml-4 opacity-70">{field.label}</label>
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 text-[#F8FAFC] outline-none focus:border-[#FF7A18]/40 focus:bg-white/[0.08] transition-all placeholder:text-[#AAB2C5]/20 text-[15px] font-bold tracking-[0.2em] italic"
                                        />
                                    </div>
                                ))}
                                <div className="space-y-3">
                                    <label className="text-[14px] font-bold text-[#FF7A18] uppercase tracking-[0.4em] italic ml-4 opacity-70">YOUR MESSAGE</label>
                                    <textarea
                                        placeholder="TYPE YOUR MESSAGE HERE..."
                                        rows="4"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-8 py-6 text-[#F8FAFC] outline-none focus:border-[#FF7A18]/40 focus:bg-white/[0.08] transition-all placeholder:text-[#AAB2C5]/20 text-[15px] font-bold tracking-[0.2em] italic resize-none"
                                    />
                                </div>
                            </div>

                            <a
                                href="https://wa.me/917036923456"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-premium w-full py-6 rounded-3xl font-bold uppercase tracking-[0.4em] text-[14px] flex items-center justify-center gap-6 group/btn shadow-[0_20px_60px_rgba(255,122,24,0.3)]"
                            >
                                SEND MESSAGE <Send size={22} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform" />
                            </a>
                        </form>
                    </div>
                </motion.section>
            </div >

            {/* Global Perspective Fix for 3D */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .matrix-grid {
                    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}} />
        </div >
    );
};

export default Contact;
