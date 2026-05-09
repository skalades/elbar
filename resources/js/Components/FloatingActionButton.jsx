import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionButton({ icon, onClick, badgeCount = 0, isVisible = true }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClick}
                    className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 hover:shadow-xl transition-colors z-40 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                    {icon}
                    {badgeCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                            {badgeCount > 99 ? '99+' : badgeCount}
                        </span>
                    )}
                </motion.button>
            )}
        </AnimatePresence>
    );
}
