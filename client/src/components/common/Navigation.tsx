import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/solid';

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HomeIcon className="h-7 w-7 text-blue-400" />
              <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 