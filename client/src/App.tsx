import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { eventsByBusinessType, businessTypes, trackingTools, platformTypes, deviceTypes } from './data/events';
import { API_CONFIG } from './config';
import Landing from './components/Landing';
import SpecForm from './components/SpecForm';
import LogViewer from './components/LogViewer';
import { Navigation } from './components/common/Navigation';
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
  const outputRef = useRef<HTMLDivElement>(null);

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
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-6">
          TrackForge AI
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"> Specification Generator</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Generate Specification</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                {/* Business Type */}
                <div>
                  <label className="block text-gray-300 mb-2">Business Type</label>
                  <select
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
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
                  <label className="block text-gray-300 mb-2">Tracking Tool</label>
                  <select
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
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
                  <label className="block text-gray-300 mb-2">Platform Types (Multiple)</label>
                  <select
                    multiple
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white h-32"
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
                  <p className="text-sm text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
                
                {/* Device Types */}
                <div>
                  <label className="block text-gray-300 mb-2">Device Types (Multiple)</label>
                  <select
                    multiple
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white h-32"
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
                  <p className="text-sm text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>

              {/* Events Section */}
              <div className="mt-4 mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Select Events to Track</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {eventsByBusinessType[formData.businessType]?.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-700 p-3 rounded-lg border border-gray-600"
                    >
                      <h4 className="text-gray-200 font-medium mb-2">{category.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700"
                            />
                            <label htmlFor={event.id} className="flex-1 cursor-pointer">
                              <span className="block text-gray-200 font-medium">
                                {event.name}
                              </span>
                              <span className="block text-xs text-gray-400">
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
                className={`w-full py-2 px-4 rounded font-semibold ${
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
              <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-800">
                {error}
              </div>
            )}
          </div>
          
          {/* Right Column - Output */}
          <div className="lg:col-span-9 flex flex-col h-[calc(100vh-8rem)]">
            {/* Top Row - 80% height */}
            <div className="flex-[0.8] bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-200 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Technical Implementation Guide</h2>
                {specContent && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        copyToClipboard();
                        trackButtonClick('copy_to_clipboard', 'content_action');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      {copySuccess || 'Copy to Clipboard'}
                    </button>
                    <button
                      onClick={() => {
                        downloadPDF();
                        trackButtonClick('download_pdf', 'content_action');
                      }}
                      disabled={pdfLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {pdfLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Download PDF
                        </>
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
                    <div className="p-4 h-full">
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
            <div className="flex-[0.2] bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0 p-4">
                  <p className="text-gray-300">
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
};

function App() {
  return (
    <Router>
      <PageTracker>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* App Routes */}
            <Route
              path="/app"
              element={
                <>
                  <Navigation />
                  <MainApp />
                </>
              }
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </PageTracker>
    </Router>
  );
}

export default App; 