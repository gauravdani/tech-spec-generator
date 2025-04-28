import React, { useState, useEffect } from 'react';
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
  const [result, setResult] = useState<string | null>(null);

  // Clear selected events when business type changes
  useEffect(() => {
    setSelectedEvents([]);
  }, [formData.businessType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.businessType || !formData.platformTypes.length || !formData.deviceTypes.length || !formData.trackingTool || !selectedEvents.length) {
      setError('Please fill in all required fields and select at least one event');
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult('');

    try {
      console.log('🌐 CLIENT: Making request to server...');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_SPEC}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedEvents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate specification');
      }

      console.log('🌐 CLIENT: Got response, starting to read stream...');
      
      // Create a new TextDecoder for decoding the stream
      const decoder = new TextDecoder();
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('🌐 CLIENT: Stream complete');
          break;
        }

        // Decode the chunk and split into lines
        const chunk = decoder.decode(value);
        console.log('🌐 CLIENT: Received chunk:', chunk);
        
        const lines = chunk.split('\n');
        console.log('🌐 CLIENT: Number of lines:', lines.length);

        // Process each line
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              console.log('🌐 CLIENT: Parsing JSON:', jsonStr);
              const data = JSON.parse(jsonStr);
              console.log('🌐 CLIENT: Parsed data:', data);
              
              if (data.text) {
                console.log('🌐 CLIENT: Updating result with text:', data.text);
                setResult(prev => {
                  const newResult = (prev || '') + data.text;
                  console.log('🌐 CLIENT: New result length:', newResult.length);
                  return newResult;
                });
              }
            } catch (err) {
              console.error('🌐 CLIENT: Error parsing SSE data:', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('🌐 CLIENT: Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating the specification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          TrackForge AI
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Specification</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            <div className="mt-8 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Events to Track</h3>
              <div className="space-y-4">
                {eventsByBusinessType[formData.businessType]?.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="text-gray-700 font-medium mb-3">{category.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start space-x-3"
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
                            <span className="block text-sm text-gray-500">
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
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Result Section */}
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Generated Specification</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 