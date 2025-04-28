import React, { useState, useRef, useEffect } from 'react';
import { SpecFormData } from '../../types/formData';
import { generateSpecification, generatePrompt } from '../../services/api';
import { useClaudeStream } from '../../hooks/useClaudeStream';
import logger from '../../utils/logger';

const SpecForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [specification, setSpecification] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState('');
  const updateCount = useRef(0);
  const { content, error: streamError, startStream } = useClaudeStream();
  
  // Sample form data for testing
  const sampleFormData: SpecFormData = {
    businessType: 'eCommerce',
    platformTypes: ['Web'],
    deviceTypes: ['Desktop'],
    trackingTool: 'GA4',
    selectedEvents: ['page_view', 'add_to_cart', 'checkout']
  };

  const handleSubmit = async (formData: SpecFormData) => {
    logger.info('FORM', 'Starting form submission', formData);
    setLoading(true);
    setSpecification('');
    setError(null);
    updateCount.current = 0;
    
    // Generate the prompt and set it in state
    const prompt = generatePrompt(formData);
    logger.info('PROMPT', 'Generated prompt', prompt);
    setDebugPrompt(prompt);

    console.log('\n========== Claude Prompt ==========');
    console.log(prompt);
    console.log('===================================\n');

    try {
      await startStream(formData);
      logger.info('SUCCESS', 'Generation complete');
      setLoading(false);
    } catch (error) {
      logger.error('ERROR', 'Error during generation', error);
      let errorMsg = '';
      if (error instanceof Error) {
        errorMsg = error.stack || error.message;
      } else {
        errorMsg = String(error);
      }
      setError(error instanceof Error ? error.message : 'An error occurred');
      setLoading(false);
    }
  };

  // Log when content updates
  useEffect(() => {
    if (content) {
      updateCount.current += 1;
      logger.debug('CONTENT', `Content update #${updateCount.current}`, {
        length: content.length,
        preview: content.substring(0, 100) + '...'
      });
    }
  }, [content]);

  // Log when stream error occurs
  useEffect(() => {
    if (streamError) {
      logger.error('STREAM_ERROR', 'Stream error occurred', streamError);
    }
  }, [streamError]);

  return (
    <div className="flex flex-col h-full">
      <div className="debug-panel p-2 bg-gray-100 mb-4">
        <p>Updates: {updateCount.current}</p>
        <p>Content length: {specification.length}</p>
        <p>Loading: {loading.toString()}</p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="debugPrompt" className="block font-bold mb-1">Prompt sent to Claude (debug):</label>
        <textarea
          id="debugPrompt"
          className="w-full p-2 border rounded bg-gray-100 text-xs"
          rows={10}
          value={debugPrompt}
          readOnly
        />
      </div>
      
      <div className="flex-grow relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="loading">
              Generating... ({updateCount.current} updates)
            </div>
          </div>
        )}
        
        {streamError && (
          <div className="error absolute top-0 left-0 right-0">
            Error: {streamError}
          </div>
        )}
        
        <div 
          className="h-full overflow-auto p-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      
      <button onClick={() => handleSubmit(sampleFormData)}>Submit</button>
    </div>
  );
};

export default SpecForm; 