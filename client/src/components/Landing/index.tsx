import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Analytics Specs",
      description: "Generate comprehensive tracking specifications in seconds, not hours.",
      icon: "🤖",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Industry Best Practices",
      description: "Built-in compliance with GDPR, CCPA, and other privacy regulations.",
      icon: "🛡️",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Multi-Platform Support",
      description: "Works seamlessly across web, mobile, and other platforms.",
      icon: "🌐",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Real-time Collaboration",
      description: "Share and collaborate with your team in real-time.",
      icon: "👥",
      color: "from-red-500 to-red-600"
    }
  ];

  const testimonials = [
    {
      quote: "TrackForge AI has revolutionized how we handle analytics implementation. What used to take days now takes minutes.",
      author: "Sarah Chen",
      role: "Senior Analytics Consultant",
      company: "DataFlow Analytics"
    },
    {
      quote: "The AI-generated specs are incredibly detailed and accurate. It's like having a senior analytics engineer on demand.",
      author: "Michael Rodriguez",
      role: "Product Manager",
      company: "TechCorp"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your Analytics
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"> Implementation</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate engineering-grade tracking specifications with AI. Save time, reduce errors, and ensure compliance.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/app"
                className="inline-block px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/demo"
                className="inline-block px-8 py-4 text-lg font-medium text-blue-100 border-2 border-blue-100 rounded-lg hover:bg-blue-800 hover:bg-opacity-50 transition-all"
              >
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything you need to track with confidence
            </h2>
            <p className="text-xl text-gray-300">
              Powerful features designed for analytics professionals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-700 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} text-white p-3 rounded-lg inline-block`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Analytics Professionals
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800 p-8 rounded-xl shadow-xl"
              >
                <p className="text-gray-300 text-lg mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-400">{testimonial.role}</p>
                    <p className="text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your analytics implementation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of analytics professionals who trust TrackForge AI
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing; 