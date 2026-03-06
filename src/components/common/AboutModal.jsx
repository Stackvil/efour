import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Store, Users, Building2 } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
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
                                    <div className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center bg-white shadow-sm">
                                        <Info size={20} className="text-riverside-teal" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-black text-charcoal-grey">About Us</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8 overflow-y-auto bg-[#F4F7F8] flex-grow flex flex-col items-center">
                                {/* Story Heading */}
                                <div className="mb-6 max-w-lg text-center">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-sunset-orange uppercase mb-2 block">Our Story</span>
                                    <h3 className="text-3xl sm:text-4xl font-heading font-black text-charcoal-grey mb-4">
                                        Eat. Enjoy. <span className="text-riverside-teal">Entertain.</span>
                                    </h3>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                        Efour is a premier Food Court and Play Zone bringing families together through diverse cuisines and recreation under one roof.
                                    </p>
                                </div>

                                {/* Cards */}
                                <div className="grid sm:grid-cols-2 gap-4 w-full mb-6">
                                    {/* Vendors Card */}
                                    <div className="bg-[#12796D] text-left p-6 sm:p-8 rounded-[1.5rem] shadow-sm border border-[#0F655A] flex flex-col min-h-[160px]">
                                        <Store size={28} className="text-white mb-4" />
                                        <h4 className="text-2xl font-heading font-black text-white mb-3">For Vendors</h4>
                                        <p className="text-xs text-teal-50 font-medium leading-relaxed">
                                            Promote your culinary business directly to thousands. Benefit from an enhanced e-Experience with direct customer reviews.
                                        </p>
                                    </div>

                                    {/* Users Card */}
                                    <div className="bg-sunset-orange text-left p-6 sm:p-8 rounded-[1.5rem] shadow-sm border border-orange-600 flex flex-col min-h-[160px]">
                                        <Users size={28} className="text-white mb-4" />
                                        <h4 className="text-2xl font-heading font-black text-white mb-3">For Users</h4>
                                        <p className="text-xs text-orange-50 font-medium leading-relaxed">
                                            A wide range of services suited to your needs —from diverse cuisines to customized entertainment packages.
                                        </p>
                                    </div>
                                </div>

                                {/* Vision Section */}
                                <div className="w-full bg-white p-6 sm:p-8 rounded-[1.5rem] shadow-sm border border-gray-100 text-left">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                                            <Building2 size={16} className="text-riverside-teal" />
                                        </div>
                                        <h4 className="font-bold text-charcoal-grey">Founder's Vision</h4>
                                    </div>
                                    <p className="text-sm italic text-gray-500 font-medium leading-relaxed mb-8 px-2">
                                        "We designed an ample space for all cuisines and play zone activities to suit all ages and promote local talent."
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-gray-50 pt-4 px-2 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-charcoal-grey text-white flex items-center justify-center font-bold text-sm">
                                            JK
                                        </div>
                                        <div>
                                            <p className="font-bold text-charcoal-grey text-sm">Jayanarayana Kureti</p>
                                            <p className="text-xs text-gray-400 font-medium mt-0.5">Founder & CEO</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-5 bg-white border-t border-gray-100 flex justify-center">
                                <button
                                    onClick={onClose}
                                    className="bg-sunset-orange hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-xl transition-colors shadow-md shadow-orange-500/20 uppercase tracking-wider text-sm"
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

export default AboutModal;
