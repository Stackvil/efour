import React, { useState } from 'react'
import { Phone, MapPin, Instagram, Facebook, Youtube, Mail, ArrowUp, Shield, Activity, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = ({ onOpenTerms, onOpenAbout, onOpenPrivacy }) => {
    const [showDevOptions, setShowDevOptions] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const navLinkClasses = "text-[#AAB2C5] hover:text-[#FF7A18] transition-all text-[16px] uppercase tracking-[0.3em] font-bold hover:translate-x-2 inline-block cursor-pointer text-left";
    const sectionTitleClasses = "font-bold text-[16px] uppercase tracking-[0.4em] text-[#FF7A18] mb-12 opacity-80 flex items-center gap-4";

    return (
        <footer className="bg-[#070B14] pt-20 md:pt-40 pb-16 md:pb-20 border-t border-white/5 relative overflow-hidden selection:bg-[#FF7A18] selection:text-white">
            {/* Background Decor */}
            <div className="absolute inset-0 matrix-grid opacity-5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF7A18]/20 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-20 md:mb-40">
                    <div className="lg:col-span-2 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-8"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-[#FF7A18]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src="/E4LOGO.jpeg"
                                    alt="E4 Logo"
                                    className="w-24 h-24 rounded-2xl object-contain bg-black border border-white/10 shadow-2xl relative z-10 brightness-110"
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tighter uppercase italic transform -skew-x-12">EFOUR <span className="text-[#FF7A18]">ELURU</span></h3>
                                <p className="text-[10px] md:text-[12px] font-bold text-[#AAB2C5] tracking-[0.4em] md:tracking-[0.5em] uppercase opacity-40 italic">ELURU NODE ALPHA-01</p>
                            </div>
                        </motion.div>

                        <p className="text-[#AAB2C5] text-base md:text-lg font-black uppercase tracking-widest leading-relaxed max-w-lg italic opacity-60 border-l-2 border-[#FF7A18]/20 pl-4 md:pl-8">
                            Located at NR Peta, we are the top destination for premium food and entertainment in Eluru.
                        </p>

                        <div className="flex gap-8 pt-6">
                            {[
                                { Icon: Instagram, href: 'https://www.instagram.com/efoureluru?igsh=MXkxOTA5djhzM2dpeA==', color: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                                { Icon: Facebook, href: 'https://www.facebook.com/share/1DHuqH8gAA/?mibextid=wwXIfr', color: 'from-[#1877F2] to-[#0a52be]' },
                                { Icon: Youtube, href: '#', color: 'from-[#FF0000] to-[#cc0000]' }
                            ].map(({ Icon, href, color }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -8, rotate: 5 }}
                                    className="group relative"
                                >
                                    <div className={`absolute -inset-3 bg-gradient-to-tr ${color} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full`} />
                                    <div className="w-16 h-16 bg-white/[0.03] backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#FF7A18]/40 transition-all duration-500 relative z-10 shadow-2xl">
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                                        <Icon size={24} className="text-white group-hover:text-[#FF7A18] transition-colors duration-500" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className={sectionTitleClasses}>
                            <Globe size={16} /> Navigation
                        </h4>
                        <ul className="space-y-6 flex flex-col items-start">
                            {[
                                { name: 'Your Tickets', path: '/login' },
                                { name: 'Dine', path: '/dine' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className={navLinkClasses}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={sectionTitleClasses}>
                            <Shield size={16} /> Secure Links
                        </h4>
                        <ul className="space-y-6 flex flex-col items-start">
                            <li>
                                <button onClick={onOpenAbout} className={navLinkClasses}>
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button onClick={onOpenPrivacy} className={navLinkClasses}>
                                    Privacy Protocol
                                </button>
                            </li>
                            <li>
                                <button onClick={onOpenTerms} className={navLinkClasses}>
                                    Terms of Engagement
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 md:gap-12 pt-16 md:pt-20 border-t border-white/5 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#FF7A18]/20 via-transparent to-transparent" />

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 text-[#AAB2C5]">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-[#FF7A18]">
                                <MapPin size={18} />
                            </div>
                            <span className="text-[14px] font-bold uppercase tracking-[0.2em] italic opacity-80">
                                OPP TO RTC MAIN BUS STAND, NR PETA, ELURU, AP
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-[#AAB2C5]">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-[#FF7A18]">
                                <Phone size={18} />
                            </div>
                            <span className="text-[18px] font-bold tracking-widest italic text-[#F8FAFC]">
                                +91 70369 23456
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[12px] uppercase tracking-[0.3em] text-[#AAB2C5] font-bold italic opacity-60">
                            EFOUR ELURU @2026 RIGHTS RESERVED <span className="text-[#FF7A18]">Jayanarayana Kureti</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-[#AAB2C5] font-bold opacity-40">DEVELOPED BY</span>
                            <div className="relative">
                                <button
                                    onClick={() => setShowDevOptions(!showDevOptions)}
                                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] text-[#F8FAFC] hover:bg-white/10 transition-all flex items-center gap-3 group"
                                >
                                    STACKVIL TECHNOLOGIES
                                    <Activity size={10} className={`transition-transform duration-500 ${showDevOptions ? 'rotate-180' : ''}`} />
                                </button>

                                {showDevOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-full left-0 mb-4 w-full min-w-[160px] bg-[#0F172A]/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-50 p-2"
                                    >
                                        <a href="https://www.stackvil.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[9px] font-black text-[#AAB2C5] hover:text-[#FF7A18] hover:bg-white/5 rounded-xl uppercase tracking-widest transition-all italic">Website Portal</a>
                                        <a href="https://wa.me/918919079058" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[9px] font-black text-emerald-500 hover:bg-white/5 rounded-xl uppercase tracking-widest transition-all italic">WhatsApp Link</a>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-6 text-[14px] uppercase tracking-[0.4em] font-bold text-[#FF7A18] hover:text-white transition-all italic"
                    >
                        Return to Zenith <ArrowUp size={18} className="group-hover:-translate-y-2 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Large Cinematic Typography */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.015] select-none">
                <h2 className="text-[25vw] font-black leading-none translate-y-1/3 whitespace-nowrap italic transform -skew-x-12">
                    EFOUR ELURU
                </h2>
            </div>
        </footer>
    )
}

export default Footer
