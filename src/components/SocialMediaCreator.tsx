import React, { useState } from 'react';
import { Share2, Instagram, Twitter, Linkedin, Facebook, Hash, Image, Wand2, Search, Eye, Download, TrendingUp, Users, Heart, MessageCircle } from 'lucide-react';

interface SocialMediaCreatorProps {
  aiModel: string;
}

const SocialMediaCreator: React.FC<SocialMediaCreatorProps> = ({ aiModel }) => {
  const [postData, setPostData] = useState({
    platform: 'instagram',
    postType: 'image',
    caption: '',
    hashtags: '',
    callToAction: '',
    targetAudience: '',
    mood: 'engaging',
    topic: ''
  });

  const [generatedContent, setGeneratedContent] = useState({
    caption: '',
    hashtags: [],
    images: [],
    variations: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500', specs: '1080x1080' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'from-blue-400 to-blue-600', specs: '1200x675' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-800', specs: '1200x627' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-700', specs: '1200x630' }
  ];

  const postTypes = [
    { id: 'image', name: 'Image Post', desc: 'Single image with caption' },
    { id: 'carousel', name: 'Carousel', desc: 'Multiple images/slides' },
    { id: 'story', name: 'Story', desc: 'Vertical format for stories' },
    { id: 'reel', name: 'Reel/Video', desc: 'Short video content' }
  ];

  const moodOptions = [
    { value: 'engaging', label: 'Engaging', desc: 'Hook audience attention' },
    { value: 'inspirational', label: 'Inspirational', desc: 'Motivate and uplift' },
    { value: 'educational', label: 'Educational', desc: 'Teach and inform' },
    { value: 'humorous', label: 'Humorous', desc: 'Entertain and amuse' },
    { value: 'promotional', label: 'Promotional', desc: 'Drive sales/action' }
  ];

  const aiSuggestions = {
    topics: [
      "Monday motivation for entrepreneurs",
      "Behind the scenes of content creation",
      "5 productivity hacks that actually work",
      "Why authenticity beats perfection",
      "The future of remote work"
    ],
    audiences: [
      "Entrepreneurs and business owners",
      "Content creators and influencers",
      "Remote workers and freelancers",
      "Marketing professionals",
      "Small business owners"
    ],
    hashtags: [
      "#entrepreneur #businesstips #motivation",
      "#contentcreator #socialmedia #marketing",
      "#remotework #productivity #workfromhome",
      "#smallbusiness #startup #success",
      "#digitalmarketing #branding #growth"
    ]
  };

  const handleAutoFill = () => {
    const randomTopic = aiSuggestions.topics[Math.floor(Math.random() * aiSuggestions.topics.length)];
    const randomAudience = aiSuggestions.audiences[Math.floor(Math.random() * aiSuggestions.audiences.length)];
    const randomHashtags = aiSuggestions.hashtags[Math.floor(Math.random() * aiSuggestions.hashtags.length)];
    
    setPostData({
      ...postData,
      topic: randomTopic,
      targetAudience: randomAudience,
      hashtags: randomHashtags,
      caption: `🚀 ${randomTopic}\n\nPerfect for ${randomAudience.toLowerCase()}! What do you think?`,
      callToAction: "Double tap if you agree! 👇"
    });
  };

  const handleWebSearch = async () => {
    setIsGenerating(true);
    // Simulate web search for trending topics
    setTimeout(() => {
      const trendingTopics = [
        "AI tools are revolutionizing small businesses",
        "Remote work productivity is at an all-time high",
        "Social media algorithms favor authentic content",
        "Personal branding is the new business card",
        "Video content gets 5x more engagement"
      ];
      
      const randomTrend = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
      setPostData({
        ...postData,
        topic: randomTrend,
        caption: `🔥 TRENDING: ${randomTrend}\n\nHere's what you need to know...`
      });
      setIsGenerating(false);
    }, 2000);
  };

  const generateSocialContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const platform = platforms.find(p => p.id === postData.platform);
      
      const sampleCaptions = [
        `🚀 ${postData.topic}\n\n✨ Here's why this matters for ${postData.targetAudience.toLowerCase()}:\n\n• Point 1: Game-changing insight\n• Point 2: Practical application\n• Point 3: Future implications\n\n${postData.callToAction || "What's your take? Drop a comment! 👇"}\n\n${postData.hashtags}`,
        
        `💡 Quick question: ${postData.topic}?\n\nI've been thinking about this a lot lately, especially for ${postData.targetAudience.toLowerCase()}.\n\nHere's my honest take... 🧵\n\n${postData.callToAction || "Let me know your thoughts! 💭"}\n\n${postData.hashtags}`,
        
        `🎯 ${postData.topic}\n\nIf you're ${postData.targetAudience.toLowerCase()}, this is for you!\n\nSwipe to see the complete breakdown ➡️\n\n${postData.callToAction || "Save this post for later! 📌"}\n\n${postData.hashtags}`
      ];

      const sampleImages = [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1080&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1080&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&h=1080&fit=crop'
      ];

      setGeneratedContent({
        caption: sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)],
        hashtags: postData.hashtags.split(' ').filter(h => h.startsWith('#')),
        images: sampleImages,
        variations: sampleCaptions
      });

      setIsGenerating(false);
      setActiveTab('preview');
    }, 3000);
  };

  const selectedPlatform = platforms.find(p => p.id === postData.platform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media Creator</h1>
            <p className="text-gray-600">Create viral social media posts with auto-generated visuals</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20">
        {[
          { id: 'create', label: 'Create Post', icon: Share2 },
          { id: 'preview', label: 'Preview & Edit', icon: Eye },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-pink-600'
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAutoFill}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Auto-Fill All Fields</span>
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
                  onClick={generateSocialContent}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isGenerating ? 'Creating...' : 'Generate Post'}</span>
                </button>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setPostData({...postData, platform: platform.id})}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          postData.platform === platform.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                        <p className="text-xs text-gray-500">{platform.specs}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Post Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Post Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {postTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setPostData({...postData, postType: type.id})}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        postData.postType === type.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Subject</label>
                    <input
                      type="text"
                      value={postData.topic}
                      onChange={(e) => setPostData({...postData, topic: e.target.value})}
                      placeholder="What's your post about?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={postData.targetAudience}
                      onChange={(e) => setPostData({...postData, targetAudience: e.target.value})}
                      placeholder="Who are you targeting?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mood/Tone</label>
                    <select
                      value={postData.mood}
                      onChange={(e) => setPostData({...postData, mood: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80"
                    >
                      {moodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                    <textarea
                      value={postData.caption}
                      onChange={(e) => setPostData({...postData, caption: e.target.value})}
                      placeholder="Write your caption here..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                    <input
                      type="text"
                      value={postData.hashtags}
                      onChange={(e) => setPostData({...postData, hashtags: e.target.value})}
                      placeholder="#hashtag1 #hashtag2 #hashtag3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
                    <input
                      type="text"
                      value={postData.callToAction}
                      onChange={(e) => setPostData({...postData, callToAction: e.target.value})}
                      placeholder="What should users do?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              {generatedContent.caption ? (
                <div className="space-y-6">
                  {/* Platform Preview */}
                  <div className="flex items-center space-x-3 mb-4">
                    {selectedPlatform && (
                      <>
                        <div className={`w-8 h-8 bg-gradient-to-r ${selectedPlatform.color} rounded-lg flex items-center justify-center`}>
                          <selectedPlatform.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedPlatform.name} Post Preview</h3>
                          <p className="text-sm text-gray-500">Optimized for {selectedPlatform.specs}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Generated Images */}
                  {generatedContent.images.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Auto-Generated Images</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {generatedContent.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Generated image ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                              <button className="text-white text-sm font-medium">Select This Image</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Preview */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Your Brand</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    
                    {generatedContent.images[0] && (
                      <img
                        src={generatedContent.images[0]}
                        alt="Post preview"
                        className="w-full aspect-square object-cover rounded-lg mb-3"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <Heart className="w-5 h-5" />
                        <MessageCircle className="w-5 h-5" />
                        <Share2 className="w-5 h-5" />
                      </div>
                      
                      <p className="text-sm">
                        <span className="font-medium">yourbrand</span> {generatedContent.caption}
                      </p>
                    </div>
                  </div>

                  {/* Caption Variations */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Caption Variations</h4>
                    <div className="space-y-3">
                      {generatedContent.variations.map((variation, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{variation}</p>
                          <button className="text-xs text-pink-600 hover:text-pink-700 mt-2">Use This Version</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Generated Yet</h3>
                  <p className="text-gray-600">Fill out the form and click "Generate Post" to see your content here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Post Performance Prediction</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">8.5/10</p>
                  <p className="text-sm text-gray-600">Viral Potential</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">2.3K</p>
                  <p className="text-sm text-gray-600">Est. Reach</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">4.2%</p>
                  <p className="text-sm text-gray-600">Est. Engagement</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Optimization Suggestions</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">Add more relevant hashtags to increase discoverability</p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">Post between 6-9 PM for maximum engagement</p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">Your call-to-action is strong and likely to drive engagement</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6 sticky top-24">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-pink-500" />
              <h3 className="font-semibold text-gray-900">Trending Now</h3>
            </div>

            {/* Trending Topics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Hot Topics</h4>
              <div className="space-y-2">
                {aiSuggestions.topics.slice(0, 3).map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setPostData({...postData, topic})}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    🔥 {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Hashtag Suggestions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Trending Hashtags</h4>
              <div className="space-y-2">
                {aiSuggestions.hashtags.slice(0, 3).map((hashtags, index) => (
                  <button
                    key={index}
                    onClick={() => setPostData({...postData, hashtags})}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {hashtags}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Platform Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Time to Post:</span>
                  <span className="font-medium">6-9 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Engagement:</span>
                  <span className="font-medium text-green-600">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trending Format:</span>
                  <span className="font-medium text-purple-600">Carousel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCreator;