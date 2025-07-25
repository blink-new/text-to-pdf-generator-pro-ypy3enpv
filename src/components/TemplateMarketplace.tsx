import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, Eye, Heart, Zap, Crown, Sparkles, TrendingUp } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  type: 'Blog' | 'Social Media' | 'Meme' | 'Digital Product' | 'PDF' | 'Email';
  description: string;
  thumbnail: string;
  rating: number;
  downloads: number;
  price: number;
  isPremium: boolean;
  tags: string[];
  author: string;
  viralScore: number;
  conversionRate: number;
}

const TemplateMarketplace: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Mock templates data
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Viral Quote Card',
        category: 'Social Media',
        type: 'Social Media',
        description: 'Eye-catching quote cards that go viral on Instagram and LinkedIn',
        thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
        rating: 4.9,
        downloads: 15420,
        price: 0,
        isPremium: false,
        tags: ['quotes', 'viral', 'instagram', 'motivation'],
        author: 'ViralDesigns',
        viralScore: 9.8,
        conversionRate: 12.4
      },
      {
        id: '2',
        name: 'Professional Blog Template',
        category: 'Content',
        type: 'Blog',
        description: 'Clean, SEO-optimized blog template for business content',
        thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop',
        rating: 4.8,
        downloads: 8930,
        price: 29,
        isPremium: true,
        tags: ['blog', 'seo', 'business', 'professional'],
        author: 'ContentPro',
        viralScore: 8.5,
        conversionRate: 18.7
      },
      {
        id: '3',
        name: 'Meme Generator Pack',
        category: 'Entertainment',
        type: 'Meme',
        description: '50+ trending meme templates with viral potential',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        rating: 4.7,
        downloads: 23450,
        price: 19,
        isPremium: true,
        tags: ['memes', 'viral', 'funny', 'trending'],
        author: 'MemeKing',
        viralScore: 9.9,
        conversionRate: 8.2
      },
      {
        id: '4',
        name: 'Digital Course Blueprint',
        category: 'Education',
        type: 'Digital Product',
        description: 'Complete template for creating and selling online courses',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
        rating: 4.9,
        downloads: 5670,
        price: 49,
        isPremium: true,
        tags: ['course', 'education', 'sales', 'blueprint'],
        author: 'EduMaster',
        viralScore: 8.9,
        conversionRate: 24.1
      },
      {
        id: '5',
        name: 'Email Newsletter Design',
        category: 'Marketing',
        type: 'Email',
        description: 'High-converting email newsletter templates',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
        rating: 4.6,
        downloads: 12340,
        price: 15,
        isPremium: true,
        tags: ['email', 'newsletter', 'marketing', 'conversion'],
        author: 'EmailPro',
        viralScore: 7.8,
        conversionRate: 15.6
      },
      {
        id: '6',
        name: 'Infographic Template',
        category: 'Visual',
        type: 'Social Media',
        description: 'Data visualization templates for social media',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
        rating: 4.8,
        downloads: 9870,
        price: 0,
        isPremium: false,
        tags: ['infographic', 'data', 'visual', 'social'],
        author: 'DataViz',
        viralScore: 8.7,
        conversionRate: 11.3
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const categories = ['All', 'Social Media', 'Content', 'Entertainment', 'Education', 'Marketing', 'Visual'];
  const types = ['All', 'Blog', 'Social Media', 'Meme', 'Digital Product', 'PDF', 'Email'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesType = selectedType === 'All' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'viral':
        return b.viralScore - a.viralScore;
      case 'conversion':
        return b.conversionRate - a.conversionRate;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleUseTemplate = (template: Template) => {
    // In a real app, this would integrate with the generators
    alert(`Using template: ${template.name}`);
  };

  const handlePreview = (template: Template) => {
    // In a real app, this would show a preview modal
    alert(`Previewing template: ${template.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Template Marketplace
          </h1>
          <p className="text-gray-600">Discover high-converting templates created by top creators</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates, tags, or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="viral">Viral Score</option>
              <option value="conversion">Conversion Rate</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Featured Templates */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.slice(0, 3).map(template => (
              <div key={template.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  {template.isPremium && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    {template.viralScore}/10
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{template.conversionRate}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </span>
                      {template.price > 0 && (
                        <span className="text-sm text-gray-500">one-time</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Templates */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Templates</h2>
            <div className="text-sm text-gray-600">
              {sortedTemplates.length} templates found
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-40 object-cover"
                  />
                  {template.isPremium && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {template.viralScore}/10
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 truncate">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{template.downloads > 1000 ? `${Math.floor(template.downloads/1000)}k` : template.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      {template.price === 0 ? 'Free' : `$${template.price}`}
                    </span>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Spotlight */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Become a Template Creator</h2>
          </div>
          <p className="text-indigo-100 mb-6">
            Share your high-converting templates with thousands of creators and earn passive income.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">$2,500</div>
              <div className="text-indigo-200">Average monthly earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50k+</div>
              <div className="text-indigo-200">Template downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">70%</div>
              <div className="text-indigo-200">Revenue share</div>
            </div>
          </div>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Start Selling Templates
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateMarketplace;