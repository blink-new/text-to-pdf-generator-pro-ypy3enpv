import React, { useState } from 'react';
import { Image, Upload, Wand2, Search, Eye, Download, Laugh, TrendingUp, Zap, RefreshCw, Copy, Share2 } from 'lucide-react';

interface MemeGeneratorProps {
  aiModel: string;
}

const MemeGenerator: React.FC<MemeGeneratorProps> = ({ aiModel }) => {
  const [memeData, setMemeData] = useState({
    template: 'drake',
    topText: '',
    bottomText: '',
    topic: '',
    style: 'funny',
    customImage: null as File | null
  });

  const [generatedMemes, setGeneratedMemes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const memeTemplates = [
    { id: 'drake', name: 'Drake Pointing', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', category: 'reaction' },
    { id: 'distracted', name: 'Distracted Boyfriend', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop', category: 'reaction' },
    { id: 'woman-cat', name: 'Woman Yelling at Cat', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', category: 'reaction' },
    { id: 'success-kid', name: 'Success Kid', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', category: 'success' },
    { id: 'expanding-brain', name: 'Expanding Brain', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', category: 'evolution' },
    { id: 'change-my-mind', name: 'Change My Mind', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=400&fit=crop', category: 'opinion' },
    { id: 'this-is-fine', name: 'This is Fine', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop', category: 'situation' },
    { id: 'two-buttons', name: 'Two Buttons', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop', category: 'choice' },
    { id: 'galaxy-brain', name: 'Galaxy Brain', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop', category: 'intelligence' },
    { id: 'stonks', name: 'Stonks', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop', category: 'business' },
    { id: 'panik-kalm', name: 'Panik/Kalm', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop', category: 'emotion' },
    { id: 'always-has-been', name: 'Always Has Been', image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop', category: 'revelation' },
    { id: 'wojak', name: 'Wojak', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop', category: 'emotion' },
    { id: 'chad', name: 'Chad', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', category: 'confidence' },
    { id: 'pepe', name: 'Pepe', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', category: 'reaction' },
    { id: 'doge', name: 'Doge', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop', category: 'wholesome' },
    { id: 'surprised-pikachu', name: 'Surprised Pikachu', image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop', category: 'surprise' },
    { id: 'roll-safe', name: 'Roll Safe', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', category: 'smart' },
    { id: 'uno-reverse', name: 'Uno Reverse', image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop', category: 'reversal' },
    { id: 'trade-offer', name: 'Trade Offer', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=400&fit=crop', category: 'business' }
  ];

  const styleOptions = [
    { value: 'funny', label: 'Funny', desc: 'Classic humor and jokes' },
    { value: 'relatable', label: 'Relatable', desc: 'Everyday situations' },
    { value: 'sarcastic', label: 'Sarcastic', desc: 'Witty and ironic' },
    { value: 'wholesome', label: 'Wholesome', desc: 'Positive and uplifting' },
    { value: 'dark', label: 'Dark Humor', desc: 'Edgy and provocative' }
  ];

  const categories = ['all', 'reaction', 'success', 'evolution', 'opinion', 'situation', 'choice', 'intelligence', 'business', 'emotion', 'revelation', 'confidence', 'wholesome', 'surprise', 'smart', 'reversal'];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const aiSuggestions = {
    topics: [
      "Remote work struggles",
      "Social media addiction",
      "AI taking over jobs",
      "Cryptocurrency volatility",
      "Monday morning motivation",
      "Weekend vs weekday energy",
      "Coffee dependency",
      "Procrastination problems",
      "Online shopping addiction",
      "Zoom meeting awkwardness"
    ],
    captions: {
      drake: [
        { top: "Doing work properly", bottom: "Procrastinating until deadline" },
        { top: "Healthy lifestyle", bottom: "Ordering takeout at 2 AM" },
        { top: "Saving money", bottom: "Buying things on sale" }
      ],
      distracted: [
        { top: "Me", bottom: "New shiny project", extra: "Current responsibilities" },
        { top: "My brain", bottom: "Random 3 AM thoughts", extra: "Sleep" }
      ],
      "woman-cat": [
        { top: "Me explaining why I need another subscription", bottom: "My bank account" },
        { top: "Me justifying my coffee addiction", bottom: "My wallet" }
      ]
    }
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? memeTemplates 
    : memeTemplates.filter(template => template.category === selectedCategory);

  const handleAutoFill = () => {
    const randomTopic = aiSuggestions.topics[Math.floor(Math.random() * aiSuggestions.topics.length)];
    const templateCaptions = aiSuggestions.captions[memeData.template as keyof typeof aiSuggestions.captions];
    
    if (templateCaptions) {
      const randomCaption = templateCaptions[Math.floor(Math.random() * templateCaptions.length)];
      setMemeData({
        ...memeData,
        topic: randomTopic,
        topText: randomCaption.top,
        bottomText: randomCaption.bottom
      });
    } else {
      setMemeData({
        ...memeData,
        topic: randomTopic,
        topText: `When ${randomTopic.toLowerCase()}`,
        bottomText: "It be like that sometimes"
      });
    }
  };

  const handleWebSearch = async () => {
    setIsGenerating(true);
    // Simulate web search for trending meme topics
    setTimeout(() => {
      const trendingTopics = [
        "AI chatbots giving weird responses",
        "Working from home vs office life",
        "Crypto market volatility",
        "Social media algorithm changes",
        "New iPhone features nobody asked for"
      ];
      
      const randomTrend = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
      setMemeData({
        ...memeData,
        topic: randomTrend,
        topText: `Everyone talking about ${randomTrend.toLowerCase()}`,
        bottomText: "Me who just learned about it"
      });
      setIsGenerating(false);
    }, 2000);
  };

  const generateMeme = async () => {
    setIsGenerating(true);
    
    // Simulate AI meme generation with image creation
    setTimeout(() => {
      const selectedTemplate = memeTemplates.find(t => t.id === memeData.template);
      
      // Generate multiple variations of the meme
      const generatedMemeVariations = [
        selectedTemplate?.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=500&fit=crop'
      ];

      setGeneratedMemes(generatedMemeVariations);
      setIsGenerating(false);
      setActiveTab('preview');
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMemeData({...memeData, customImage: file});
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Laugh className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Viral Meme Generator</h1>
            <p className="text-gray-600">Create viral memes with 20+ templates and custom uploads</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20">
        {[
          { id: 'create', label: 'Create Meme', icon: Image },
          { id: 'preview', label: 'Preview & Edit', icon: Eye },
          { id: 'viral', label: 'Viral Analysis', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'create' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={handleAutoFill}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Auto-Fill Captions</span>
                  </button>
                  <button
                    onClick={handleWebSearch}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isGenerating ? 'Finding Trends...' : 'Find Trending Topics'}</span>
                  </button>
                  <button
                    onClick={generateMeme}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isGenerating ? 'Creating...' : 'Generate Meme'}</span>
                  </button>
                </div>

                {/* Custom Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload Custom Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload your own image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Theme</label>
                    <input
                      type="text"
                      value={memeData.topic}
                      onChange={(e) => setMemeData({...memeData, topic: e.target.value})}
                      placeholder="What's your meme about?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                    <select
                      value={memeData.style}
                      onChange={(e) => setMemeData({...memeData, style: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
                    >
                      {styleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Top Text</label>
                    <input
                      type="text"
                      value={memeData.topText}
                      onChange={(e) => setMemeData({...memeData, topText: e.target.value})}
                      placeholder="Enter top text..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bottom Text</label>
                    <input
                      type="text"
                      value={memeData.bottomText}
                      onChange={(e) => setMemeData({...memeData, bottomText: e.target.value})}
                      placeholder="Enter bottom text..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
                    />
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setMemeData({...memeData, template: template.id})}
                      className={`relative group rounded-lg overflow-hidden transition-all duration-200 ${
                        memeData.template === template.id
                          ? 'ring-4 ring-green-500 scale-105'
                          : 'hover:scale-105 hover:shadow-lg'
                      }`}
                    >
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <p className="text-white text-xs font-medium text-center px-2">{template.name}</p>
                      </div>
                      {memeData.template === template.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              {generatedMemes.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Generated Memes</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedMemes.map((meme, index) => (
                      <div key={index} className="relative group">
                        <div className="bg-white rounded-lg p-4 shadow-lg">
                          <img
                            src={meme}
                            alt={`Generated meme ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg mb-4"
                          />
                          
                          {/* Meme Text Overlay */}
                          <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                            {memeData.topText && (
                              <div className="text-center">
                                <p className="text-white font-bold text-lg drop-shadow-lg stroke-black stroke-2 uppercase">
                                  {memeData.topText}
                                </p>
                              </div>
                            )}
                            {memeData.bottomText && (
                              <div className="text-center">
                                <p className="text-white font-bold text-lg drop-shadow-lg stroke-black stroke-2 uppercase">
                                  {memeData.bottomText}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                              <Download className="w-4 h-4" />
                              <span className="text-sm">Download</span>
                            </button>
                            <button className="flex items-center justify-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meme Variations */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Caption Variations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { top: "When you say you'll start working out", bottom: "But Netflix releases a new series" },
                        { top: "Me: I'll go to bed early tonight", bottom: "Also me at 3 AM: Just one more video" },
                        { top: "Trying to save money", bottom: "Steam sale appears" }
                      ].map((variation, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">Top: {variation.top}</p>
                          <p className="text-sm font-medium text-gray-900 mb-2">Bottom: {variation.bottom}</p>
                          <button className="text-xs text-green-600 hover:text-green-700">Use This Version</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Laugh className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Memes Generated Yet</h3>
                  <p className="text-gray-600">Select a template, add your text, and click "Generate Meme" to see your creations here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'viral' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Viral Potential Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">9.2/10</p>
                  <p className="text-sm text-gray-600">Viral Score</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <Laugh className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">8.7/10</p>
                  <p className="text-sm text-gray-600">Humor Level</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">15K</p>
                  <p className="text-sm text-gray-600">Est. Shares</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Optimization Tips</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">Perfect template choice for your topic - Drake memes are trending!</p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">Your text length is optimal for readability and impact</p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">Consider adding trending hashtags when sharing on social media</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-2">🚀 Viral Prediction</h4>
                <p className="text-sm opacity-90">
                  This meme has high viral potential! The combination of popular template, relatable content, 
                  and perfect timing gives it a 92% chance of getting significant engagement.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6 sticky top-24">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Trending Memes</h3>
            </div>

            {/* Trending Topics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Hot Topics</h4>
              <div className="space-y-2">
                {aiSuggestions.topics.slice(0, 4).map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setMemeData({...memeData, topic})}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    🔥 {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Suggestions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {memeTemplates.slice(0, 4).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setMemeData({...memeData, template: template.id})}
                    className="relative group rounded-lg overflow-hidden hover:scale-105 transition-transform"
                  >
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <p className="text-white text-xs font-medium text-center px-1">{template.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meme Stats */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Meme Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Time to Post:</span>
                  <span className="font-medium">7-10 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trending Format:</span>
                  <span className="font-medium text-green-600">Drake</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Viral Chance:</span>
                  <span className="font-medium text-purple-600">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;