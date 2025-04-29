import React, { useState } from 'react';
import { motion } from 'framer-motion';

const pricingTiers = [
  {
    name: 'Starter',
    price: '49',
    features: [
      'Up to 50 specifications per month',
      'Basic analytics templates',
      'Email support',
      'Single user'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Professional',
    price: '99',
    features: [
      'Up to 200 specifications per month',
      'Advanced analytics templates',
      'Priority email support',
      'Up to 5 team members',
      'API access'
    ],
    color: 'from-purple-500 to-purple-600',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '299',
    features: [
      'Unlimited specifications',
      'Custom templates',
      '24/7 priority support',
      'Unlimited team members',
      'API access',
      'Custom integrations'
    ],
    color: 'from-gray-700 to-gray-800'
  }
];

const SubscriptionForm: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('Professional');
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    name: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement subscription logic
    console.log('Subscription form submitted:', { selectedTier, formData });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300">
            Select the perfect plan for your analytics needs
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`relative bg-gradient-to-br ${tier.color} p-8 rounded-xl shadow-xl ${
                tier.popular ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-tl-lg rounded-bl-lg text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-white mb-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <ul className="text-gray-200 space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedTier(tier.name)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    selectedTier === tier.name
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {selectedTier === tier.name ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscription Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Complete Your Subscription</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Start Your Free Trial
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionForm; 