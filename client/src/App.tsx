import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsByBusinessType } from './data/events';
import './App.css';

interface FormData {
  businessType: string;
  platformType: string;
  deviceType: string;
  trackingTool: string;
  selectedEvents: string[];
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    businessType: 'eCommerce',
    platformType: 'Web',
    deviceType: 'Desktop',
    trackingTool: 'GA4',
    selectedEvents: []
  });

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update events when business type changes
  useEffect(() => {
    setSelectedEvents([]);
  }, [formData.businessType]);

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvents.length === 0) {
      setError('Please select at least one event');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-spec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedEvents
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate specification');
      }

      const data = await response.json();
      setResult(data.specification);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          TrackForge AI
        </h1>
        <p className="text-xl text-center mb-12">
          Generate engineering-grade tracking specs with zero guesswork.
        </p>
        <div className="max-w-4xl mx-auto">
          <motion.form 
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Business Type</label>
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white"
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                >
                  <option value="eCommerce">eCommerce</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Gaming">Gaming</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Platform</label>
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white"
                  value={formData.platformType}
                  onChange={(e) => setFormData({...formData, platformType: e.target.value})}
                >
                  <option value="Web">Web</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Device Type</label>
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white"
                  value={formData.deviceType}
                  onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
                >
                  <option value="Desktop">Desktop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tracking Tool</label>
                <select
                  className="w-full p-2 border rounded text-gray-800 bg-white"
                  value={formData.trackingTool}
                  onChange={(e) => setFormData({...formData, trackingTool: e.target.value})}
                >
                  <option value="GA4">Google Analytics 4</option>
                  <option value="Segment">Segment</option>
                  <option value="Mixpanel">Mixpanel</option>
                </select>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Events to Track</h3>
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {eventsByBusinessType[formData.businessType]?.map((category) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="text-gray-700 font-medium mb-3">{category.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.events.map((event) => (
                            <motion.div
                              key={event.id}
                              whileHover={{ scale: 1.02 }}
                              className="flex items-start space-x-3"
                            >
                              <input
                                type="checkbox"
                                id={event.id}
                                checked={selectedEvents.includes(event.id)}
                                onChange={() => handleEventToggle(event.id)}
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
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || selectedEvents.length === 0}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold ${
                  isSubmitting || selectedEvents.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                whileHover={isSubmitting || selectedEvents.length === 0 ? {} : { scale: 1.02 }}
                whileTap={isSubmitting || selectedEvents.length === 0 ? {} : { scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </div>
                ) : (
                  'Generate Specification'
                )}
              </motion.button>
            </div>
          </motion.form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-lg shadow-xl p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Specification</h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App; 