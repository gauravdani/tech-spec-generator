import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { eventsByBusinessType, businessTypes, trackingTools, platformTypes, deviceTypes } from './data/events';
import { API_CONFIG } from './config';
import Landing from './components/Landing';
import { Navigation } from './components/common/Navigation';
import ContextInput from './components/ContextInput';
import Feedback from './components/Feedback';
import html2pdf from 'html2pdf.js';
import { initGA4, trackPageView, trackButtonClick, trackFormSubmission, trackSpecGeneration } from './utils/analytics';
import './App.css';

// Page tracking component
const PageTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return <>{children}</>;
};

const MainApp: React.FC = () => {
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
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const [isContextLoading, setIsContextLoading] = useState(false);

  // Clear selected events when business type changes
  useEffect(() => {
    setSelectedEvents([]);
  }, [formData.businessType]);

  // Initialize GA4
  useEffect(() => {
    initGA4();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSpecContent('');
    setTokenCount(0);

    // Track form submission
    trackFormSubmission('specification_form');
    trackSpecGeneration(formData.businessType, formData.trackingTool);

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
                // Update token count if provided
                if (data.tokenCount) {
                  setTokenCount(data.tokenCount);
                }
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
          trackButtonClick('copy_to_clipboard', 'content_action');
          setTimeout(() => setCopySuccess(''), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          setCopySuccess('Failed to copy');
        });
    }
  };

  const downloadPDF = () => {
    if (outputRef.current) {
      setPdfLoading(true);
      trackButtonClick('download_pdf', 'content_action');
      const element = outputRef.current;
      const opt = {
        margin: 1,
        filename: 'tracking-specification.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as 'portrait' | 'landscape' }
      };

      html2pdf().set(opt).from(element).save()
        .then(() => {
          setPdfLoading(false);
        })
        .catch(err => {
          console.error('Failed to generate PDF:', err);
          setPdfLoading(false);
        });
    }
  };

  const handleContextSend = async (context: string) => {
    setIsContextLoading(true);
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
          additionalContext: context
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
                // Update token count if provided
                if (data.tokenCount) {
                  setTokenCount(data.tokenCount);
                }
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
      setIsContextLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          TrackForge AI
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"> Specification Generator</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Form */}
          <div className="lg:col-span-4 bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Generate Specification</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {/* Business Type */}
                <div>
                  <label className="block text-gray-300 mb-3">Business Type</label>
                  <select
                    className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
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
                  <label className="block text-gray-300 mb-3">Tracking Tool</label>
                  <select
                    className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
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
                  <label className="block text-gray-300 mb-3">Platform Types (Multiple)</label>
                  <select
                    multiple
                    className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white h-36"
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
                  <p className="text-sm text-gray-400 mt-2">Hold Ctrl/Cmd to select multiple</p>
                </div>
                
                {/* Device Types */}
                <div>
                  <label className="block text-gray-300 mb-3">Device Types (Multiple)</label>
                  <select
                    multiple
                    className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white h-36"
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
                  <p className="text-sm text-gray-400 mt-2">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>

              {/* Events Section */}
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Select Events to Track</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {eventsByBusinessType[formData.businessType]?.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                    >
                      <h4 className="text-gray-200 font-medium mb-3">{category.name}</h4>
                      <div className="grid grid-cols-1 gap-3">
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
                              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700"
                            />
                            <label htmlFor={event.id} className="flex-1 cursor-pointer">
                              <span className="block text-gray-200 font-medium">
                                {event.name}
                              </span>
                              <span className="block text-xs text-gray-400 mt-1">
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
                onClick={() => trackButtonClick('generate_specification', 'form_action')}
                className={`w-full py-3 px-4 rounded font-semibold ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white transition-all transform hover:scale-105`}
              >
                {isLoading ? 'Generating...' : 'Generate Specification'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-900/50 text-red-200 rounded border border-red-800">
                {error}
              </div>
            )}
          </div>
          
          {/* Right Column - Output */}
          <div className="lg:col-span-8 flex flex-col h-[calc(100vh-10rem)]">
            {/* Top Row - 80% height */}
            <div className="flex-[0.8] bg-white rounded-lg shadow-lg p-8 mb-6 border border-gray-200 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Technical Implementation Guide</h2>
                {specContent && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-3 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center"
                    >
                      {copySuccess ? (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {copySuccess}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy to Clipboard
                        </span>
                      )}
                    </button>
                    <button
                      onClick={downloadPDF}
                      disabled={pdfLoading}
                      className="flex-1 py-3 px-4 rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all transform hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pdfLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating PDF...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Save as PDF
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0">
                  {error ? (
                    <div className="error-message text-red-600">
                      <p>{error}</p>
                    </div>
                  ) : (
                    <div className="p-6 h-full">
                      <div 
                        ref={outputRef}
                        className="markdown-content prose max-w-none prose-headings:text-gray-900 prose-h1:text-gray-900 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-h4:text-gray-900 prose-h5:text-gray-900 prose-h6:text-gray-900 prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-900 prose-code:text-blue-600 prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-blockquote:text-gray-700 prose-blockquote:border-gray-300"
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
            <div className="flex-[0.2] bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700 overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold text-white mb-4">Additional Context</h2>
              <div className="flex-1 relative">
                <ContextInput
                  onSend={handleContextSend}
                  isLoading={isContextLoading}
                  placeholder="Add more requirements or ask for clarification..."
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        {specContent && (
          <div className="disclaimer mt-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-6 border border-gray-700 text-gray-300 text-sm group relative flex items-center justify-between animate-fade-in">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Note: The output is being rationed at 1000 tokens, since this is a personal project.</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-xs text-gray-300 rounded shadow-lg border border-gray-700 w-64">
                Token limits help manage API costs and response times. For unlimited tokens, consider deploying your own instance.
              </div>
            </div>
            <div className="flex items-center ml-4">
              <div className="mr-3 text-sm">
                <span className="text-blue-400 font-semibold">{tokenCount}</span>
                <span className="text-gray-400">/1000 tokens</span>
              </div>
              <div className="w-24 h-2 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    tokenCount > 800 ? 'bg-red-500' : tokenCount > 500 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((tokenCount / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <PageTracker>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<MainApp />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
      </PageTracker>
    </Router>
  );
}

// Add keyframes for fade-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default App; 