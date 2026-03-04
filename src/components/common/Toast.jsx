import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import useStore from '../../store/useStore';

const Toast = () => {
    const { toast, hideToast } = useStore();

    return (
        <AnimatePresence>
            {toast.isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-3 bg-charcoal-grey text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md"
                >
                    {toast.type === 'success' ? (
                        <CheckCircle className="text-green-400" size={20} />
                    ) : (
                        <AlertCircle className="text-red-400" size={20} />
                    )}
                    <span className="font-bold text-sm tracking-wide">{toast.message}</span>
                    <button onClick={hideToast} className="ml-2 hover:bg-white/20 p-1 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
