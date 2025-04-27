import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Track Smarter. Launch Faster.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Generate engineering-grade tracking specs with zero guesswork.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#generate"
              className="inline-block px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate TrackSpec
            </a>
            <a
              href="#learn-more"
              className="inline-block px-8 py-3 text-lg font-medium text-blue-100 border-2 border-blue-100 rounded-lg hover:bg-blue-800 hover:bg-opacity-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 