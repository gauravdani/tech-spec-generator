import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalState } from '../../hooks/useGlobalState';

export const ErrorToast: React.FC = () => {
  const { error, clearError } = useGlobalState();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <p>{error}</p>
            <button
              onClick={clearError}
              className="ml-4 text-white hover:text-red-100"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 