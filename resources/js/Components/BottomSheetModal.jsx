import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheetModal({ isOpen, onClose, title, children }) {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
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
                        className="fixed inset-0 bg-black/50 z-50 md:flex md:items-center md:justify-center"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-0 left-0 right-0 md:relative md:w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-xl z-50 max-h-[90vh] flex flex-col"
                        >
                            {/* Drag Handle Indicator (Mobile) */}
                            <div className="md:hidden flex justify-center pt-3 pb-2">
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                            </div>
                            
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Body (Scrollable) */}
                            <div className="px-6 py-4 overflow-y-auto flex-1">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
