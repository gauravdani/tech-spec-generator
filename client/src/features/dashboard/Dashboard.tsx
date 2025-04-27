import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { specService } from '../../services/spec';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { data: specs, isLoading } = useQuery({
    queryKey: ['specs'],
    queryFn: specService.getAll
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Specifications</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Create New Spec
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {specs?.map((spec, index) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {spec.formState.businessType} Tracking Spec
                </h3>
                <p className="text-gray-600 mb-4">
                  Platform: {spec.formState.platformType}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(spec.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 