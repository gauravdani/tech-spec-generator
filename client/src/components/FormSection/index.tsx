import React from 'react';
import { motion } from 'framer-motion';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

export const FormSection: React.FC = () => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const { errors, validateForm } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formState)) {
      // Handle form submission
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form fields with animations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
            >
              {/* Business Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <select
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                    errors.businessType ? 'border-red-500' : ''
                  }`}
                  value={formState.businessType}
                  onChange={(e) => {/* dispatch action */}}
                >
                  {/* Options */}
                </select>
                {errors.businessType && (
                  <p className="mt-2 text-sm text-red-600">{errors.businessType}</p>
                )}
              </div>

              {/* Other form fields... */}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Specification
            </motion.button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}; 