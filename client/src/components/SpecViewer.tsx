import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';

interface SpecViewerProps {
  specId: string;
  onClose: () => void;
}

export const SpecViewer: React.FC<SpecViewerProps> = ({ specId, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpec, setEditedSpec] = useState<string>('');

  const { data: spec, isLoading } = useQuery({
    queryKey: ['spec', specId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/api/specs/${specId}`);
      if (!response.ok) throw new Error('Failed to fetch spec');
      return response.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedSpec: string) => {
      const response = await fetch(`http://localhost:3001/api/specs/${specId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specification: updatedSpec })
      });
      if (!response.ok) throw new Error('Failed to update spec');
      return response.json();
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto m-4"
      >
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {spec?.businessType} Specification
          </h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <textarea
                  value={editedSpec || spec?.specification}
                  onChange={(e) => setEditedSpec(e.target.value)}
                  className="w-full h-[60vh] p-4 border rounded"
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      updateMutation.mutate(editedSpec);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: spec?.specification || '' }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}; 