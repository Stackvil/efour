import React, { useState } from 'react'
import { Phone, MapPin, Instagram, Facebook, Twitter, Mail, ArrowUp } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
    const [showDevOptions, setShowDevOptions] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="bg-bg-deep pt-32 pb-16 border-t border-white/5 relative">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 mb-10">
                            <img
                                src="/E4LOGO.jpeg"
                                alt="E4 Logo"
                                className="w-24 h-24 rounded-2xl object-contain bg-black shadow-2xl shadow-primary/20"
                            />
                        </div>
                        <p className="text-text-secondary text-xl font-light max-w-lg mb-12 leading-relaxed">
                            Located OPP TO RTC Main bustand NR Peta, Eluru. We are the premier destination for families and youth who seek the best in food and entertainment.
                        </p>
                        <div className="flex gap-6">
                            {[
                                { Icon: Instagram, href: 'https://www.instagram.com/efoureluru?igsh=MXkxOTA5djhzM2dpeA==' },
                                { Icon: Facebook, href: 'https://www.facebook.com/share/1DHuqH8gAA/?mibextid=wwXIfr' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Mail, href: 'mailto:efoureluru@gmail.com' }
                            ].map(({ Icon, href }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, color: '#10b981' }}
                                    className="w-14 h-14 premium-glass rounded-full flex items-center justify-center transition-colors"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.4em] text-primary mb-10">Navigation</h4>
                        <ul className="space-y-6">
                            {['Home', 'Philosophy', 'Cuisine', 'Recreation'].map((link) => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase()}`} className="text-text-secondary hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.4em] text-primary mb-10">Connect</h4>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <MapPin className="text-primary flex-shrink-0" size={20} />
                                <span className="text-text-secondary text-sm leading-relaxed">
                                    OPP TO RTC Main bustand NR Peta, Eluru, Andhra Pradesh.
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="text-primary flex-shrink-0" size={20} />
                                <span className="text-text-secondary text-sm font-bold tracking-widest">
                                    +91 70369 23456
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
                    <div className="flex flex-col items-center md:items-start gap-1.5">
                        <p className="text-[10px] uppercase tracking-widest text-text-dim">
                            © 2024 KURETI JAYANARAYANA. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-[9px] uppercase tracking-widest text-text-dim/60 font-medium">
                                DEVELOPED BY
                            </span>
                            <div className="relative">
                                <button
                                    onClick={() => setShowDevOptions(!showDevOptions)}
                                    className="text-white/70 hover:text-white text-[9px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hover:bg-white/10 hover:shadow-lg transition-all flex items-center gap-1.5 group outline-none"
                                >
                                    STACKVIL TECHNOLOGIES PVT LIMITED
                                    <span className={`text-[8px] transition-transform ${showDevOptions ? 'rotate-180' : ''}`}>▼</span>
                                </button>

                                {showDevOptions && (
                                    <div className="absolute bottom-full left-0 mb-2 w-full min-w-[120px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-md">
                                        <a href="https://www.stackvil.com/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                                            Website
                                        </a>
                                        <a href="https://wa.me/918919079058" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-xs font-bold text-green-400 hover:text-green-300 hover:bg-white/10 transition-colors border-t border-white/5">
                                            WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-primary hover:gap-6 transition-all"
                    >
                        Back to top <ArrowUp size={16} />
                    </button>
                </div>
            </div>

            {/* Large Decorative Text */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02]">
                <h2 className="text-[25vw] font-black leading-none translate-y-1/2 whitespace-nowrap">
                    ELURU ELITE
                </h2>
            </div>
        </footer>
    )
}

export default Footer
