import React, { useState } from 'react';
import ContextInput from './ContextInput';

interface GeneratedSpecProps {
  specification: string;
  onContextSend: (context: string) => void;
  isLoading?: boolean;
}

export const GeneratedSpec: React.FC<GeneratedSpecProps> = ({
  specification,
  onContextSend,
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(specification);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200
              bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 
              dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 transition-colors
              duration-200 ease-in-out"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div 
          className="prose dark:prose-invert max-w-none mt-2"
          dangerouslySetInnerHTML={{ __html: specification }}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Additional Context
          </h3>
          <ContextInput
            onSend={onContextSend}
            isLoading={isLoading}
            placeholder="Add more requirements or ask for clarification..."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratedSpec; 