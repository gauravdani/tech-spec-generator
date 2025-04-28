import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_CONFIG } from '../config';
import { logger } from '../utils/logger';

interface SavedSpec {
  _id: string;
  businessType: string;
  platformType: string;
  createdAt: string;
  specification: string;
}

export const SavedSpecs: React.FC = () => {
  const [specs, setSpecs] = useState<SavedSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        logger.info('SavedSpecs', 'Fetching saved specs');
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPECS}`);
        const data = await response.json();
        setSpecs(data);
        logger.info('SavedSpecs', 'Successfully fetched specs', { count: data.length });
      } catch (error) {
        logger.error('SavedSpecs', 'Error fetching specs', error);
        setError('Failed to fetch saved specifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecs();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12 p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Saved Specifications</h2>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-32"
        >
          <div className="text-white">Loading...</div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 text-red-100 p-4 rounded mb-6"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs?.map((spec) => (
            <motion.div
              key={spec._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                {spec.businessType} Specification
              </h3>
              <p className="text-gray-200 mb-4">
                Platform: {spec.platformType}
              </p>
              <p className="text-sm text-gray-300">
                Created: {new Date(spec.createdAt).toLocaleDateString()}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                onClick={() => {/* Handle view spec */}}
              >
                View Spec
              </motion.button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}; 