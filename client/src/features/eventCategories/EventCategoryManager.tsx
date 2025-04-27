import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { eventCategories } from '../../data/events';

export const EventCategoryManager: React.FC = () => {
  const selectedBusinessType = useSelector((state: RootState) => state.form.businessType);
  const selectedEvents = useSelector((state: RootState) => state.form.selectedEvents);

  const categories = eventCategories[selectedBusinessType];

  return (
    <div className="space-y-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-start space-x-3"
              >
                <input
                  type="checkbox"
                  id={event.id}
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => {/* dispatch toggle event action */}}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor={event.id} className="flex-1">
                  <span className="block font-medium text-gray-900">
                    {event.name}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {event.description}
                  </span>
                </label>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 