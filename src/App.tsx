import React, { useState, useEffect } from 'react';
import { FileText, Image, Share2, Zap, ShoppingBag, Home, Sparkles, Search, Wand2, Download, Upload, Eye, Settings, Palette, BarChart3, Calendar, Store, Mic, Video } from 'lucide-react';
import PDFGenerator from './components/PDFGenerator';
import BlogGenerator from './components/BlogGenerator';
import SocialMediaCreator from './components/SocialMediaCreator';
import MemeGenerator from './components/MemeGenerator';
import DigitalProductsCreator from './components/DigitalProductsCreator';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContentCalendar from './components/ContentCalendar';
import TemplateMarketplace from './components/TemplateMarketplace';
import VoiceVideoCreator from './components/VoiceVideoCreator';
import { blink } from './blink/client';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiModel, setAiModel] = useState('kimi-dev-72b');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up authentication state listener
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      setLoading(state.isLoading);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Content Creator Pro...</h2>
          <p className="text-gray-600">Initializing AI-powered features</p>
        </div>
      </div>
    );
  }

  const aiModels = [
    { id: 'kimi-dev-72b', name: 'Kimi Dev 72B', provider: 'Moonshot AI' },
    { id: 'deepseek-r1t2-chimera', name: 'DeepSeek R1T2 Chimera', provider: 'TNG Tech' },
    { id: 'mistral-small-3.2-24b', name: 'Mistral Small 3.2 24B', provider: 'Mistral AI' },
    { id: 'gemma-3n-e4b-it', name: 'Gemma 3N E4B IT', provider: 'Google' },
    { id: 'qwen3-235b-a22b', name: 'Qwen3 235B A22B', provider: 'Qwen' },
    { id: 'mai-ds-r1', name: 'MAI DS R1', provider: 'Microsoft' },
    { id: 'llama-3.1-nemotron-ultra', name: 'Llama 3.1 Nemotron Ultra', provider: 'NVIDIA' },
    { id: 'kimi-vl-a3b-thinking', name: 'Kimi VL A3B Thinking', provider: 'Moonshot AI' },
    { id: 'deepcoder-14b-preview', name: 'DeepCoder 14B Preview', provider: 'Agentica' },
    { id: 'qwq-32b-arliai-rpr-v1', name: 'QwQ 32B ArliAI RPR V1', provider: 'ArliAI' }
  ];

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'pdf', name: 'PDF Generator', icon: FileText, color: 'text-indigo-600' },
    { id: 'blog', name: 'Blog Generator', icon: Sparkles, color: 'text-purple-600' },
    { id: 'social', name: 'Social Media', icon: Share2, color: 'text-pink-600' },
    { id: 'meme', name: 'Meme Generator', icon: Image, color: 'text-green-600' },
    { id: 'products', name: 'Digital Products', icon: ShoppingBag, color: 'text-orange-600' },
    { id: 'voice-video', name: 'Voice & Video', icon: Mic, color: 'text-red-600' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-cyan-600' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'text-emerald-600' },
    { id: 'templates', name: 'Templates', icon: Store, color: 'text-amber-600' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'pdf':
        return <PDFGenerator aiModel={aiModel} />;
      case 'blog':
        return <BlogGenerator aiModel={aiModel} />;
      case 'social':
        return <SocialMediaCreator aiModel={aiModel} />;
      case 'meme':
        return <MemeGenerator aiModel={aiModel} />;
      case 'products':
        return <DigitalProductsCreator aiModel={aiModel} />;
      case 'voice-video':
        return <VoiceVideoCreator />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'calendar':
        return <ContentCalendar />;
      case 'templates':
        return <TemplateMarketplace />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Content Creator Pro
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Creation Suite</p>
              </div>
            </div>

            {/* AI Model Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-indigo-600" />
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="bg-white/80 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {aiModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-white shadow-lg scale-105 border border-white/50'
                      : 'hover:bg-white/50 hover:scale-102'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === item.id ? item.color : 'text-gray-500'}`} />
                  <span className={`font-medium ${
                    activeTab === item.id ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Powered by AI • Create viral content in seconds • Professional results guaranteed
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>10 AI Models Available</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Search className="w-4 h-4" />
                <span>Web Search Enabled</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Image className="w-4 h-4" />
                <span>Auto Image Generation</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;