import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose }) => {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden pointer-events-auto flex flex-col max-h-full"
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100">
                                        <ShieldCheck size={20} className="text-riverside-teal" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-black text-charcoal-grey">Privacy Policy</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8 overflow-y-auto bg-[#F4F7F8] flex-grow">
                                <p className="text-gray-500 mb-6 text-sm font-medium">
                                    <span className="font-bold text-gray-700">Efour</span> protects any information you give when visiting the Website. Effective from May 1st, 2019.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    {/* Collected Info */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                                <UserCheck size={16} className="text-riverside-teal" />
                                            </div>
                                            <h3 className="font-bold text-charcoal-grey">Collected Info</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <CheckCircle2 size={14} className="text-riverside-teal" />
                                                Name & Mobile
                                            </li>
                                            <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <CheckCircle2 size={14} className="text-riverside-teal" />
                                                Email & Address
                                            </li>
                                            <li className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <CheckCircle2 size={14} className="text-riverside-teal" />
                                                Survey Data
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Security */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                                <ShieldCheck size={16} className="text-riverside-teal" />
                                            </div>
                                            <h3 className="font-bold text-charcoal-grey">Security</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                            We use suitable physical and electronic procedures to safeguard your info. We won't sell your data unless required by law.
                                        </p>
                                    </div>
                                </div>

                                {/* Usage */}
                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                            <Lock size={16} className="text-riverside-teal" />
                                        </div>
                                        <h3 className="font-bold text-charcoal-grey">Usage</h3>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-sunset-orange text-[10px] font-bold">1</span>
                                            <span className="text-xs text-gray-500 font-medium">Internal record keeping</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-sunset-orange text-[10px] font-bold">2</span>
                                            <span className="text-xs text-gray-500 font-medium">Improving services</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-sunset-orange text-[10px] font-bold">3</span>
                                            <span className="text-xs text-gray-500 font-medium">Promotional emails</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-sunset-orange text-[10px] font-bold">4</span>
                                            <span className="text-xs text-gray-500 font-medium">Market research</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-5 bg-white border-t border-gray-100 flex justify-center">
                                <button
                                    onClick={onClose}
                                    className="bg-sunset-orange hover:bg-orange-600 text-white font-bold py-3 px-12 rounded-xl transition-colors shadow-md shadow-orange-500/20 uppercase tracking-wider text-sm"
                                >
                                    Accept
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PrivacyModal;
