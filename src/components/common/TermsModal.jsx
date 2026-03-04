import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookHeart, Scale, Link as LinkIcon, AlertCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
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
                                        <BookHeart size={20} className="text-riverside-teal" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-black text-charcoal-grey">Terms of Use</h2>
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
                                    Usage of <span className="font-bold text-gray-700">efour.in</span> is subject to these Terms. Acceptance is implied by using the site.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    {/* Obligations */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                                <Scale size={16} className="text-riverside-teal" />
                                            </div>
                                            <h3 className="font-bold text-charcoal-grey">Obligations</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                            Use for lawful purposes only. You must provide accurate info and keep your login credentials secure.
                                        </p>
                                    </div>

                                    {/* Content */}
                                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                                <LinkIcon size={16} className="text-riverside-teal" />
                                            </div>
                                            <h3 className="font-bold text-charcoal-grey">Content</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                            Materials are for PERSONAL USE ONLY. No data mining or scraping. We aren't responsible for external links.
                                        </p>
                                    </div>
                                </div>

                                {/* Liability & Terms */}
                                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                            <AlertCircle size={16} className="text-riverside-teal" />
                                        </div>
                                        <h3 className="font-bold text-charcoal-grey">Liability & Terms</h3>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                <span className="font-bold text-gray-700">Indemnity:</span> You hold us harmless from claims arising from your site usage.
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                <span className="font-bold text-gray-700">Risk:</span> Service use is at your own risk. We offer no guarantees of error-free service.
                                            </p>
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

export default TermsModal;
