import React, { useState, useEffect, useRef } from 'react';
import { eventsByBusinessType, businessTypes, trackingTools, platformTypes, deviceTypes } from './data/events';
import { API_CONFIG } from './config';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    businessType: 'eCommerce',
    platformTypes: ['Web'],
    deviceTypes: ['Desktop'],
    trackingTool: 'GA4'
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specContent, setSpecContent] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const outputRef = useRef<HTMLDivElement>(null);

  // Clear selected events when business type changes
  useEffect(() => {
    setSelectedEvents([]);
  }, [formData.businessType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSpecContent('');

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_SPEC}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessType: formData.businessType,
          trackingTool: formData.trackingTool,
          platformTypes: formData.platformTypes,
          deviceTypes: formData.deviceTypes,
          selectedEvents,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.html) {
                setSpecContent(prev => prev + data.html);
              } else if (data.text) {
                setSpecContent(prev => prev + data.text);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (outputRef.current) {
      const textToCopy = outputRef.current.innerText;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopySuccess('Copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          setCopySuccess('Failed to copy');
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          TrackForge AI
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Specification</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                {/* Business Type */}
                <div>
                  <label className="block text-gray-700 mb-2">Business Type</label>
                  <select
                    className="w-full p-2 border rounded text-gray-800 bg-white"
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  >
                    {businessTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Tracking Tool */}
                <div>
                  <label className="block text-gray-700 mb-2">Tracking Tool</label>
                  <select
                    className="w-full p-2 border rounded text-gray-800 bg-white"
                    value={formData.trackingTool}
                    onChange={(e) => setFormData({...formData, trackingTool: e.target.value})}
                  >
                    {trackingTools.map(tool => (
                      <option key={tool.value} value={tool.value}>{tool.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Platform Types */}
                <div>
                  <label className="block text-gray-700 mb-2">Platform Types (Multiple)</label>
                  <select
                    multiple
                    className="w-full p-2 border rounded text-gray-800 bg-white h-32"
                    value={formData.platformTypes}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions).map(option => option.value);
                      setFormData({...formData, platformTypes: options});
                    }}
                  >
                    {platformTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple platforms</p>
                </div>
                
                {/* Device Types */}
                <div>
                  <label className="block text-gray-700 mb-2">Device Types (Multiple)</label>
                  <select
                    multiple
                    className="w-full p-2 border rounded text-gray-800 bg-white h-32"
                    value={formData.deviceTypes}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions).map(option => option.value);
                      setFormData({...formData, deviceTypes: options});
                    }}
                  >
                    {deviceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple devices</p>
                </div>
              </div>

              {/* Events Section */}
              <div className="mt-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select Events to Track</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {eventsByBusinessType[formData.businessType]?.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      <h4 className="text-gray-700 font-medium mb-2">{category.name}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {category.events.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={event.id}
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => {
                                setSelectedEvents(prev => 
                                  prev.includes(event.id) 
                                    ? prev.filter(id => id !== event.id)
                                    : [...prev, event.id]
                                );
                              }}
                              className="mt-1 h-4 w-4 text-blue-600 rounded"
                            />
                            <label htmlFor={event.id} className="flex-1 cursor-pointer">
                              <span className="block text-gray-700 font-medium">
                                {event.name}
                              </span>
                              <span className="block text-xs text-gray-500">
                                {event.description}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded font-semibold ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isLoading ? 'Generating...' : 'Generate Specification'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                {error}
              </div>
            )}
          </div>
          
          {/* Right Column - Output */}
          <div className="lg:col-span-9 flex flex-col h-[calc(100vh-8rem)]">
            {/* Top Row - 80% height */}
            <div className="flex-[0.8] content-container mb-4 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated Specification</h2>
                {specContent && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    {copySuccess || 'Copy to Clipboard'}
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0">
                  {error ? (
                    <div className="error-message">
                      <p>{error}</p>
                    </div>
                  ) : (
                    <div className="p-4 h-full">
                      <div 
                        ref={outputRef}
                        className="markdown-content"
                        dangerouslySetInnerHTML={{ __html: specContent }}
                      />
                    </div>
                  )}
                  {isLoading && !specContent && (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bottom Row - 20% height */}
            <div className="flex-[0.2] content-container overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0 p-4">
                  <p className="text-gray-700">
                    This section can contain additional details, notes, or related information about your generated specification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 