import { useState } from 'react';
import { 
  Wrench, 
  Shield, 
  Calendar, 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Package,
  Clock,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Smart Maintenance Tracking',
      description: 'Track all your equipment maintenance requests with intelligent auto-fill and workflow automation.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Calendar Scheduling',
      description: 'Schedule preventive maintenance with our intuitive calendar view. Never miss a routine checkup.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Management',
      description: 'Organize maintenance teams and assign technicians efficiently. Role-based access control.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics & Reports',
      description: 'Get insights with detailed reports on maintenance requests, team performance, and equipment status.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Equipment Database',
      description: 'Centralized database for all company assets with search, filter, and smart tracking capabilities.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Updates',
      description: 'Get instant notifications and real-time updates on maintenance requests and equipment status.',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const benefits = [
    { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'Reduce downtime by 40%' },
    { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'Improve equipment lifespan' },
    { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'Streamline maintenance workflows' },
    { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'Track maintenance history' },
    { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'Role-based access control' },
    { icon: <CheckCircle className="w-6 h-6 text-green-500" />, text: 'Comprehensive reporting' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GearGuard
              </span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            The Ultimate Maintenance Tracker
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Keep Your Equipment
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Running Smoothly
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Streamline maintenance workflows, track equipment status, and ensure optimal performance 
            with GearGuard's comprehensive maintenance management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 backdrop-blur-sm border border-blue-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">250+</p>
                    <p className="text-sm text-slate-600">Equipment Tracked</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">98%</p>
                    <p className="text-sm text-slate-600">Uptime Rate</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">40%</p>
                    <p className="text-sm text-slate-600">Cost Reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Modern Teams</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to manage maintenance efficiently and keep your operations running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                hoveredFeature === index
                  ? 'border-blue-500 shadow-2xl scale-105'
                  : 'border-slate-200 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 transform transition-transform duration-300 ${
                hoveredFeature === index ? 'rotate-6 scale-110' : ''
              }`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose GearGuard?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of companies that trust GearGuard to manage their maintenance operations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    {benefit.icon}
                    <span className="text-lg">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Real-time Tracking</h3>
                    <p className="text-blue-100">Monitor equipment status and maintenance requests in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Smart Alerts</h3>
                    <p className="text-blue-100">Get notified about overdue maintenance and critical issues.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
                    <p className="text-blue-100">Make data-driven decisions with comprehensive reports and insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Maintenance Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using GearGuard to streamline their maintenance workflows and reduce downtime.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            Get Started Now
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white">GearGuard</span>
            </div>
            <p className="text-sm">
              © 2024 GearGuard. All rights reserved. Built for AstraCore Adani Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

