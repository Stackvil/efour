import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Shield } from 'lucide-react';
import useStore from '../../store/useStore';

const Toast = () => {
    const { toast, hideToast } = useStore();

    return (
        <AnimatePresence>
            {toast.isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9, rotate: 2 }}
                    className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-5 glass-card bg-[#080C14]/90 text-white px-10 py-6 rounded-3xl shadow-3xl border border-white/10 min-w-[320px]"
                >
                    <div className={`p-3 rounded-2xl ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'}`}>
                        {toast.type === 'success' ? (
                            <CheckCircle size={22} />
                        ) : (
                            <AlertCircle size={22} />
                        )}
                    </div>

                    <div className="flex-1">
                        <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-[#AAB2C5]/40 italic mb-1">Eluru Notification</span>
                        <span className="font-black text-sm uppercase tracking-tight italic transform -skew-x-6 block">{toast.message}</span>
                    </div>

                    <button onClick={hideToast} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-[#AAB2C5] hover:text-white hover:bg-white/10 transition-all border border-white/5">
                        <X size={16} />
                    </button>

                    {/* Progress Bar Decoration */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 4 }}
                        className={`absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-30 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
