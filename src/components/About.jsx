import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Star, Wind, ShieldCheck, Map, ArrowRight, Zap, Target, Globe } from 'lucide-react'
import OptimizedImage from './common/OptimizedImage'

const About = () => {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])

    return (
        <section id="philosophy" ref={containerRef} className="py-20 md:py-40 container mx-auto px-6 overflow-hidden bg-[#070B14] relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#FF7A18]/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="grid grid-cols-12 gap-8 md:gap-12 xl:gap-24">
                {/* Typographic Column */}
                <div className="col-span-12 lg:col-span-12 xl:col-span-5 flex flex-col items-center xl:items-start justify-center text-center xl:text-left mb-16 xl:mb-0 relative z-10 w-full overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center xl:items-start"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-[#FF7A18]/10 flex items-center justify-center text-[#FF7A18] border border-[#FF7A18]/20">
                                <Globe size={16} />
                            </div>
                            <span className="text-[#FF7A18] font-bold tracking-[0.4em] md:tracking-[0.6em] uppercase text-[10px] md:text-[12px] italic">
                                THE EFOUR PHILOSOPHY
                            </span>
                        </div>

                        <h2 className="text-4xl xs:text-5xl md:text-8xl font-black mb-10 md:mb-12 leading-[0.9] md:leading-[0.85] tracking-tighter uppercase italic transform -skew-x-12 text-[#F8FAFC]">
                            BEYOND THE <br />
                            <span className="text-gradient-primary">HORIZON.</span>
                        </h2>

                        <p className="text-[#AAB2C5] text-[13px] md:text-xl font-bold uppercase tracking-wide md:tracking-widest leading-relaxed mb-10 md:mb-16 max-w-[min(100%,450px)] md:max-w-md italic opacity-60 border-l-2 border-[#FF7A18]/20 pl-4 md:pl-8">
                            Located at NR Peta, Efour brings together great food and fun for everyone in Eluru.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10 w-full">
                            {[
                                { title: 'FOOD', icon: <Zap size={20} />, desc: 'Great food from the best stalls.', color: 'text-[#FF7A18]' },
                                { title: 'FUN ACTIVITIES', icon: <Target size={20} />, desc: 'Exciting games for everyone.', color: 'text-[#FF3D3D]' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col md:flex-row items-center md:items-start xl:items-center gap-4 md:gap-8 group">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl group-hover:border-[#FF7A18]/40 transition-all duration-500 shadow-2xl relative overflow-hidden shrink-0`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className={`${item.color} relative z-10 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] md:text-[12px] font-bold tracking-[0.4em] text-[#F8FAFC] uppercase italic opacity-40 mb-1 group-hover:opacity-100 transition-opacity">{item.title}</h4>
                                        <p className="text-sm md:text-base font-medium text-[#AAB2C5] uppercase tracking-widest italic leading-snug">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Visual Column */}
                <div className="col-span-12 lg:col-span-12 xl:col-span-7 flex items-center justify-center relative">
                    <div className="relative w-full max-w-3xl">
                        {/* Matrix Grid Decoration */}
                        <div className="absolute -inset-12 matrix-grid opacity-10 pointer-events-none" />

                        <motion.div
                            style={{ y: y1 }}
                            className="aspect-video md:aspect-[3/4] rounded-3xl md:rounded-[4rem] overflow-hidden bg-[#0F172A] border border-white/10 p-2 md:p-3 relative z-20 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] to-transparent z-10 opacity-40" />
                            <OptimizedImage
                                src="/horizon picture.png"
                                alt="Beyond the Horizon"
                                className="w-full h-full rounded-2xl md:rounded-[3.5rem] object-cover transition-all duration-1000"
                            />
                            {/* Visual HUD */}
                            <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 z-20 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#FF7A18] animate-pulse" />
                                    <span className="text-[10px] md:text-[12px] font-bold text-[#F8FAFC] tracking-[0.4em] uppercase italic bg-black/40 backdrop-blur-md px-3 md:px-4 py-1 rounded-full border border-white/10">SYSTEM READY</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: y2 }}
                            className="absolute -bottom-24 -right-8 w-2/3 aspect-square rounded-[5rem] overflow-hidden bg-[#0F172A] border border-white/10 p-3 z-10 hidden xl:block shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                        >
                            <OptimizedImage
                                src="/horizon picture.png"
                                alt="Efour Vibe"
                                className="w-full h-full rounded-[4.5rem] object-cover opacity-60 hover:opacity-100 transition-all duration-1000"
                            />
                        </motion.div>

                        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none hidden md:block">
                            <h3 className="text-[15vw] font-black text-white/[0.02] whitespace-nowrap leading-none rotate-90 uppercase italic tracking-tighter">
                                SCENE_01
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
