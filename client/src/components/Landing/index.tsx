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

  const assistantBenefits = [
    {
      title: "Always Available",
      description: "Generate specifications 24/7 without waiting for a human expert to be available.",
      icon: "⏰"
    },
    {
      title: "Consistent Quality",
      description: "Get the same high-quality output every time, eliminating human error and inconsistency.",
      icon: "✨"
    },
    {
      title: "Instant Expertise",
      description: "Access deep analytics knowledge without years of training or hiring expensive consultants.",
      icon: "🧠"
    },
    {
      title: "Scalable Solution",
      description: "Handle multiple projects simultaneously without quality degradation or time constraints.",
      icon: "📈"
    },
    {
      title: "Cost Effective",
      description: "Save thousands on consulting fees and internal resources while getting better results.",
      icon: "💰"
    },
    {
      title: "Self-Improving",
      description: "Our AI assistant continuously learns from new data to provide increasingly better specifications.",
      icon: "🔄"
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
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Track Forge AI</span>
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transform Your Analytics
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"> Implementation</span>
            </h2>
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${feature.color} rounded-xl p-8 shadow-lg`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assistant Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Perfect Analytics Implementation Assistant
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track Forge AI is like having a dedicated analytics expert available 24/7, ready to help with your implementation needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assistantBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all"
              >
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by analytics professionals
            </h2>
            <p className="text-xl text-gray-300">
              See what our users have to say about Track Forge AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700"
              >
                <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="text-white font-bold">{testimonial.author}</p>
                  <p className="text-blue-400">{testimonial.role}, {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your analytics implementation?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of analytics professionals who trust Track Forge AI to streamline their tracking specifications
            </p>
            <Link
              to="/app"
              className="inline-block px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing; 