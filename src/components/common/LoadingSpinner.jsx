import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
            <div className="relative w-24 h-24">
                {/* Outer Cinematic Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-white/5 border-t-[#FF7A18] rounded-full shadow-[0_0_15px_rgba(255,122,24,0.3)]"
                />

                {/* Inner Pulsing Core */}
                <motion.div
                    animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-4 bg-gradient-to-br from-[#FF7A18] to-[#FF4D00] rounded-full blur-md"
                />

                {/* Center Symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-8 bg-white/20 rounded-full transform rotate-45" />
                    <div className="w-1 h-8 bg-white/20 rounded-full transform -rotate-45" />
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-[#AAB2C5] italic"
            >
                Synchronizing Eluru...
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
