import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface SavedSpec {
  _id: string;
  businessType: string;
  platformType: string;
  createdAt: string;
  specification: string;
}

export const SavedSpecs: React.FC = () => {
  const { data: specs, isLoading, error } = useQuery<SavedSpec[]>({
    queryKey: ['specs'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/specs');
      if (!response.ok) throw new Error('Failed to fetch specs');
      return response.json();
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-6">Saved Specifications</h2>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <div className="loader">Loading...</div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 text-red-700 p-4 rounded"
        >
          Failed to load saved specifications
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
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-2">
                {spec.businessType} Specification
              </h3>
              <p className="text-gray-600 mb-4">
                Platform: {spec.platformType}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(spec.createdAt).toLocaleDateString()}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
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