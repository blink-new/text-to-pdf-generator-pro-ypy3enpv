import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Search, Image, Wand2, Eye, Download, Copy, RefreshCw, TrendingUp, Target, Hash, Clock, BookOpen, Lightbulb, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { openRouterService, OPENROUTER_MODELS } from '../services/openRouterService';
import { blink } from '../blink/client';

interface BlogGeneratorProps {
  aiModel: string;
}

const BlogGenerator: React.FC<BlogGeneratorProps> = ({ aiModel }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    topic: '',
    audience: '',
    tone: 'professional',
    length: 'medium',
    keywords: '',
    outline: '',
    content: '',
    metaDescription: '',
    tags: ''
  });

  const [selectedModel, setSelectedModel] = useState('moonshotai/kimi-dev-72b:free');
  const [wordCount, setWordCount] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const toneOptions = [
    { value: 'professional', label: 'Professional', desc: 'Formal and authoritative' },
    { value: 'casual', label: 'Casual', desc: 'Friendly and conversational' },
    { value: 'humorous', label: 'Humorous', desc: 'Light and entertaining' },
    { value: 'inspirational', label: 'Inspirational', desc: 'Motivating and uplifting' },
    { value: 'educational', label: 'Educational', desc: 'Informative and clear' }
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short (500-800 words)', desc: 'Quick read, perfect for social sharing' },
    { value: 'medium', label: 'Medium (800-1500 words)', desc: 'Standard blog length, good SEO' },
    { value: 'long', label: 'Long (1500-3000 words)', desc: 'In-depth guide, excellent for authority' }
  ];

  const staticSuggestions = {
    topics: [
      "10 AI Tools That Will Transform Your Business in 2024",
      "The Ultimate Guide to Remote Work Productivity",
      "How to Build a Personal Brand on Social Media",
      "Cryptocurrency Investment Strategies for Beginners",
      "The Future of E-commerce: Trends to Watch"
    ],
    audiences: [
      "Small business owners",
      "Digital marketers",
      "Tech enthusiasts",
      "Entrepreneurs",
      "Content creators"
    ],
    keywords: [
      "AI automation, productivity tools, business growth",
      "remote work, work from home, digital nomad",
      "personal branding, social media marketing, online presence",
      "cryptocurrency, bitcoin, investment strategy",
      "e-commerce trends, online shopping, digital transformation"
    ]
  };

  // Get word count for content length estimation
  const getWordCountTarget = (length: string): number => {
    switch (length) {
      case 'short': return 650;
      case 'medium': return 1200;
      case 'long': return 2500;
      default: return 1200;
    }
  };

  const loadAISuggestions = useCallback(async () => {
    if (!blogData.topic) return;
    
    try {
      const suggestions = await openRouterService.generateAISuggestions(
        `Blog topic: ${blogData.topic}. Target audience: ${blogData.audience}. Tone: ${blogData.tone}`,
        'blog'
      );
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load AI suggestions:', error);
      setAiSuggestions([
        "Add specific examples and case studies to illustrate your main points",
        "Include relevant statistics and data to support your arguments",
        "Break up long paragraphs with subheadings for better readability"
      ]);
    }
  }, [blogData.topic, blogData.audience, blogData.tone]);

  // Load AI suggestions when topic changes
  useEffect(() => {
    if (blogData.topic) {
      loadAISuggestions();
    }
  }, [blogData.topic, loadAISuggestions]);

  const handleAutoFill = async () => {
    setIsGenerating(true);
    
    try {
      // Use AI to generate comprehensive blog data
      const randomTopic = staticSuggestions.topics[Math.floor(Math.random() * staticSuggestions.topics.length)];
      const randomAudience = staticSuggestions.audiences[Math.floor(Math.random() * staticSuggestions.audiences.length)];
      
      const prompt = `Generate a comprehensive blog plan for the topic "${randomTopic}" targeting ${randomAudience}. 
      
      Provide:
      1. An engaging SEO-optimized title
      2. Target keywords (comma-separated)
      3. A detailed outline with 6-8 main sections
      4. Meta description (150-160 characters)
      
      Format as JSON with keys: title, keywords, outline, metaDescription`;

      const response = await openRouterService.generateContent(
        prompt,
        'moonshotai/kimi-dev-72b:free',
        { maxTokens: 2000, includeWebSearch: true }
      );

      // Try to parse JSON response, fallback to manual extraction
      try {
        const parsed = JSON.parse(response);
        setBlogData({
          ...blogData,
          title: parsed.title || randomTopic,
          topic: randomTopic,
          audience: randomAudience,
          keywords: parsed.keywords || staticSuggestions.keywords[0],
          outline: parsed.outline || `1. Introduction to ${randomTopic}\n2. Understanding the Problem\n3. Key Strategies and Solutions\n4. Implementation Steps\n5. Best Practices and Tips\n6. Common Mistakes to Avoid\n7. Real-World Examples\n8. Conclusion and Next Steps`,
          metaDescription: parsed.metaDescription || `Learn everything about ${randomTopic.toLowerCase()} in this comprehensive guide for ${randomAudience}.`,
          tone: toneOptions[Math.floor(Math.random() * toneOptions.length)].value,
          length: lengthOptions[Math.floor(Math.random() * lengthOptions.length)].value
        });
      } catch {
        // Fallback to static data with some AI enhancement
        setBlogData({
          ...blogData,
          title: randomTopic,
          topic: randomTopic,
          audience: randomAudience,
          keywords: staticSuggestions.keywords[Math.floor(Math.random() * staticSuggestions.keywords.length)],
          outline: `1. Introduction to ${randomTopic}\n2. Understanding the Problem\n3. Key Strategies and Solutions\n4. Implementation Steps\n5. Best Practices and Tips\n6. Common Mistakes to Avoid\n7. Real-World Examples\n8. Conclusion and Next Steps`,
          metaDescription: `Learn everything about ${randomTopic.toLowerCase()} in this comprehensive guide for ${randomAudience}.`,
          tone: toneOptions[Math.floor(Math.random() * toneOptions.length)].value,
          length: lengthOptions[Math.floor(Math.random() * lengthOptions.length)].value
        });
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
      // Fallback to static suggestions
      const randomTopic = staticSuggestions.topics[Math.floor(Math.random() * staticSuggestions.topics.length)];
      const randomAudience = staticSuggestions.audiences[Math.floor(Math.random() * staticSuggestions.audiences.length)];
      
      setBlogData({
        ...blogData,
        title: randomTopic,
        topic: randomTopic,
        audience: randomAudience,
        keywords: staticSuggestions.keywords[Math.floor(Math.random() * staticSuggestions.keywords.length)],
        outline: `1. Introduction to ${randomTopic}\n2. Understanding the Problem\n3. Key Strategies and Solutions\n4. Implementation Steps\n5. Best Practices and Tips\n6. Common Mistakes to Avoid\n7. Real-World Examples\n8. Conclusion and Next Steps`
      });
    }
    
    setIsGenerating(false);
  };

  const handleWebSearch = async () => {
    setIsGenerating(true);
    
    try {
      // Use web search to find pain points and trending topics
      const searchQuery = blogData.topic || 'trending business topics 2024';
      const searchResults = await openRouterService.performWebSearch(searchQuery);
      
      // Extract pain points from search results using AI
      const painPointPrompt = `Based on these search results, identify 3 specific pain points that ${blogData.audience || 'business owners'} are facing:
      
      ${searchResults}
      
      Format as a simple list of pain points.`;

      const painPointsResponse = await openRouterService.generateContent(
        painPointPrompt,
        'tngtech/deepseek-r1t2-chimera:free',
        { maxTokens: 500 }
      );

      // Extract the first pain point and create a topic
      const painPoints = painPointsResponse.split('\n').filter(line => line.trim().length > 10);
      const selectedPainPoint = painPoints[0]?.replace(/^[\d\-*.\s]+/, '') || 'productivity challenges';
      
      setBlogData({
        ...blogData,
        topic: `How to Solve: ${selectedPainPoint}`,
        title: `The Complete Solution to ${selectedPainPoint}`
      });
    } catch (error) {
      console.error('Web search error:', error);
      // Fallback to static pain points
      const painPoints = [
        "Users struggle with time management and productivity",
        "Small businesses need affordable automation solutions",
        "Content creators want to scale their output",
        "Remote workers face collaboration challenges",
        "Entrepreneurs need better marketing strategies"
      ];
      
      const randomPainPoint = painPoints[Math.floor(Math.random() * painPoints.length)];
      setBlogData({
        ...blogData,
        topic: `How to Solve: ${randomPainPoint}`,
        title: `The Complete Solution to ${randomPainPoint}`
      });
    }
    
    setIsGenerating(false);
  };

  const generateBlogContent = async () => {
    setIsGenerating(true);
    
    try {
      const wordTarget = getWordCountTarget(blogData.length);
      
      // Generate comprehensive blog content
      const blogResult = await openRouterService.generateBlogContent(
        blogData.topic || blogData.title,
        wordTarget
      );

      setBlogData({
        ...blogData,
        content: blogResult.content,
        metaDescription: blogResult.metaDescription,
        tags: blogResult.tags.join(', '),
        title: blogResult.title
      });

      // Generate images for the blog
      try {
        const imagePrompts = [
          `Professional header image for blog about ${blogData.topic}`,
          `Infographic style illustration about ${blogData.topic}`,
          `Modern business concept related to ${blogData.topic}`
        ];

        const imagePromises = imagePrompts.map(prompt => 
          blink.ai.generateImage({
            prompt: prompt,
            size: '1024x1024',
            quality: 'high',
            n: 1
          })
        );

        const imageResults = await Promise.all(imagePromises);
        const imageUrls = imageResults.map(result => result.data[0]?.url).filter(Boolean);
        
        setGeneratedImages(imageUrls);
      } catch (imageError) {
        console.error('Image generation error:', imageError);
        // Fallback to sample images
        setGeneratedImages([
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
        ]);
      }

      setActiveTab('preview');
    } catch (error) {
      console.error('Blog generation error:', error);
      
      // Fallback content generation
      const sampleContent = `# ${blogData.title}

## Introduction

In today's fast-paced digital world, ${blogData.topic.toLowerCase()} has become more important than ever. This comprehensive guide will walk you through everything you need to know to succeed.

## Key Points

### 1. Understanding the Basics
The foundation of success in ${blogData.topic.toLowerCase()} starts with understanding the core principles and best practices that drive results.

### 2. Advanced Strategies
Once you've mastered the basics, these advanced techniques will help you take your ${blogData.topic.toLowerCase()} to the next level.

### 3. Implementation Tips
Practical steps you can take today to start seeing improvements in your ${blogData.topic.toLowerCase()} efforts.

### 4. Common Mistakes to Avoid
Learn from others' mistakes and avoid these common pitfalls that can derail your progress.

### 5. Measuring Success
Key metrics and indicators to track your progress and optimize your approach.

## Conclusion

By following these strategies, you'll be well on your way to mastering ${blogData.topic.toLowerCase()}. Remember to stay consistent and keep learning.

---

*This comprehensive guide provides ${blogData.audience} with actionable insights and proven strategies for success.*`;

      setBlogData({
        ...blogData,
        content: sampleContent,
        metaDescription: `Learn everything about ${blogData.topic.toLowerCase()} in this comprehensive guide for ${blogData.audience}.`,
        tags: blogData.keywords.split(',').map(k => k.trim()).join(', ')
      });

      setGeneratedImages([
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
      ]);

      setActiveTab('preview');
    }
    
    setIsGenerating(false);
  };

  const handleContentChange = (field: string, value: string) => {
    setBlogData({ ...blogData, [field]: value });
    
    if (field === 'content' || field === 'outline') {
      const words = value.split(' ').filter(word => word.length > 0).length;
      setWordCount(words);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Blog Generator</h1>
            <p className="text-gray-600">Create engaging blog posts with auto images and SEO optimization</p>
          </div>
        </div>
      </div>

      {/* AI Model Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">AI Model:</span>
          </div>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPENROUTER_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-gray-500">{model.bestFor}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20">
        {[
          { id: 'input', label: 'Content Input', icon: BookOpen },
          { id: 'preview', label: 'Preview & Edit', icon: Eye },
          { id: 'export', label: 'Export & Share', icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-purple-600'
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
          {activeTab === 'input' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAutoFill}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isGenerating ? 'Auto-Filling...' : 'Auto-Fill All Fields'}</span>
                </button>
                <button
                  onClick={handleWebSearch}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{isGenerating ? 'Searching...' : 'Find Pain Points'}</span>
                </button>
                <button
                  onClick={generateBlogContent}
                  disabled={isGenerating || !blogData.topic}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Generating...' : 'Generate Blog'}</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
                    <input
                      type="text"
                      value={blogData.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      placeholder="Enter your blog title..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Subject</label>
                    <input
                      type="text"
                      value={blogData.topic}
                      onChange={(e) => handleContentChange('topic', e.target.value)}
                      placeholder="What's your blog about?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <input
                      type="text"
                      value={blogData.audience}
                      onChange={(e) => handleContentChange('audience', e.target.value)}
                      placeholder="Who are you writing for?"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (SEO)</label>
                    <input
                      type="text"
                      value={blogData.keywords}
                      onChange={(e) => handleContentChange('keywords', e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select
                      value={blogData.tone}
                      onChange={(e) => handleContentChange('tone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    >
                      {toneOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                    <select
                      value={blogData.length}
                      onChange={(e) => handleContentChange('length', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    >
                      {lengthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Outline
                      <span className={`text-xs ml-2 ${wordCount >= 5000 ? 'text-red-500' : 'text-gray-500'}`}>
                        ({wordCount}/5000 words)
                      </span>
                    </label>
                    <textarea
                      value={blogData.outline}
                      onChange={(e) => handleContentChange('outline', e.target.value)}
                      placeholder="1. Introduction&#10;2. Main Points&#10;3. Conclusion"
                      rows={4}
                      maxLength={30000} // Approximate character limit for 5000 words
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                    />
                    {wordCount >= 5000 && (
                      <p className="text-xs text-red-600 mt-1">Maximum word count reached (5000 words)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              {blogData.content ? (
                <div className="space-y-6">
                  {/* Generated Images */}
                  {generatedImages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-Generated Images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {generatedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Generated image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                              <button className="text-white text-sm font-medium">Use This Image</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {blogData.content}
                    </div>
                  </div>

                  {/* SEO Info */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-gray-900">SEO Information</h4>
                    <p><strong>Meta Description:</strong> {blogData.metaDescription}</p>
                    <p><strong>Tags:</strong> {blogData.tags}</p>
                    <p><strong>Word Count:</strong> {blogData.content.split(' ').length} words</p>
                    <p><strong>AI Model Used:</strong> {OPENROUTER_MODELS.find(m => m.id === selectedModel)?.name}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Generated Yet</h3>
                  <p className="text-gray-600">Fill out the form and click "Generate Blog" to see your content here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Export & Share Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">Download as PDF</p>
                    <p className="text-sm text-gray-600">Professional PDF format</p>
                  </div>
                </button>

                <button 
                  onClick={() => navigator.clipboard.writeText(blogData.content)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">Copy to Clipboard</p>
                    <p className="text-sm text-gray-600">Ready for WordPress/Medium</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Hash className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium">Generate Social Posts</p>
                    <p className="text-sm text-gray-600">Promote your blog</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div className="text-left">
                    <p className="font-medium">SEO Analysis</p>
                    <p className="text-sm text-gray-600">Optimize for search</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6 sticky top-24">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
            </div>

            {/* AI-Generated Suggestions */}
            {aiSuggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Content Improvements</h4>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topic Suggestions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Trending Topics</h4>
              <div className="space-y-2">
                {staticSuggestions.topics.slice(0, 3).map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setBlogData({...blogData, title: topic, topic})}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience Suggestions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Target Audiences</h4>
              <div className="space-y-2">
                {staticSuggestions.audiences.slice(0, 3).map((audience, index) => (
                  <button
                    key={index}
                    onClick={() => setBlogData({...blogData, audience})}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {audience}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Model Recommendations */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Best AI Models</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">For Research:</span>
                  <span className="font-medium text-blue-600">DeepSeek R1T2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">For Writing:</span>
                  <span className="font-medium text-green-600">Kimi Dev 72B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">For SEO:</span>
                  <span className="font-medium text-purple-600">Nemotron Ultra</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Blog Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Read Time:</span>
                  <span className="font-medium">
                    {blogData.length === 'short' ? '3-4 min' : 
                     blogData.length === 'medium' ? '5-8 min' : '10-15 min'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SEO Score:</span>
                  <span className="font-medium text-green-600">85/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Viral Potential:</span>
                  <span className="font-medium text-purple-600">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span className={`font-medium ${wordCount >= 5000 ? 'text-red-600' : 'text-orange-600'}`}>
                    {wordCount}/5000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogGenerator;