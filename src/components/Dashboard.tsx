import React from 'react';
import { FileText, Image, Share2, Sparkles, ShoppingBag, TrendingUp, Zap, Users, BarChart3, Clock, Star, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const generators = [
    {
      id: 'pdf',
      name: 'PDF Generator',
      description: 'Create professional PDFs with unlimited text and AI assistance',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      features: ['Unlimited Text', 'AI Assistant', 'Live Preview', 'Custom Branding'],
      stats: '1M+ PDFs Created'
    },
    {
      id: 'blog',
      name: 'Blog Generator',
      description: 'Generate engaging blog posts with auto images and SEO optimization',
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      features: ['Auto Images', 'SEO Optimized', 'AI Research', 'Multiple Formats'],
      stats: '500K+ Blogs Written'
    },
    {
      id: 'social',
      name: 'Social Media Creator',
      description: 'Create viral social media posts with auto-generated visuals',
      icon: Share2,
      color: 'from-pink-500 to-pink-600',
      features: ['Auto Images', 'Platform Optimization', 'Hashtag Generation', 'Trend Analysis'],
      stats: '2M+ Posts Created'
    },
    {
      id: 'meme',
      name: 'Meme Generator',
      description: 'Create viral memes with 20+ templates and custom uploads',
      icon: Image,
      color: 'from-green-500 to-green-600',
      features: ['20+ Templates', 'Custom Upload', 'AI Captions', 'Viral Optimization'],
      stats: '10M+ Memes Made'
    },
    {
      id: 'products',
      name: 'Digital Products Creator',
      description: 'Create 50+ types of digital products with AI assistance',
      icon: ShoppingBag,
      color: 'from-orange-500 to-orange-600',
      features: ['50+ Product Types', 'Auto Images', 'Market Research', 'Sales Copy'],
      stats: '100K+ Products Launched'
    }
  ];

  const quickStats = [
    { label: 'Total Creations', value: '13.6M+', icon: Zap, color: 'text-blue-600' },
    { label: 'Active Users', value: '250K+', icon: Users, color: 'text-green-600' },
    { label: 'Success Rate', value: '98.5%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Avg. Time Saved', value: '4.2hrs', icon: Clock, color: 'text-orange-600' }
  ];

  const aiSuggestions = [
    "Create a viral quote card about productivity",
    "Generate a blog post about AI trends in 2024",
    "Design a social media post for Black Friday",
    "Make a meme about remote work struggles",
    "Create an ebook template for digital marketing"
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI-Powered Content Creation Suite
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create viral and professional content in seconds with our AI-powered generators. 
          From PDFs to memes, we've got everything you need to dominate digital marketing.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Suggestions Panel */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-200/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Content Suggestions</h3>
          <span className="text-sm text-gray-500">• Updated every hour</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {aiSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-left p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-all duration-200 border border-white/30 hover:shadow-md group"
            >
              <p className="text-sm text-gray-700 group-hover:text-gray-900">{suggestion}</p>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
            </button>
          ))}
        </div>
      </div>

      {/* Generators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {generators.map((generator) => {
          const Icon = generator.icon;
          return (
            <div
              key={generator.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => onNavigate(generator.id)}
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${generator.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{generator.name}</h3>
                  <p className="text-sm text-gray-500">{generator.stats}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{generator.description}</p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {generator.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-500 hover:to-purple-500 text-gray-700 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg">
                <span>Start Creating</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Features Highlight */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Why Choose Our AI Content Suite?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-white/80 text-sm">Create professional content in seconds, not hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Data-Driven</h3>
              <p className="text-white/80 text-sm">AI analyzes trends to optimize your content for virality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Professional Quality</h3>
              <p className="text-white/80 text-sm">Studio-grade results with zero design experience needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;