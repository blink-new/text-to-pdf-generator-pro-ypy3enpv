import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Zap, Copy, Download, TrendingUp, DollarSign, Users, Target, Sparkles, Search, Wand2, CheckCircle } from 'lucide-react';
import { openRouterService } from '../services/openRouterService';
import jsPDF from 'jspdf';

interface DigitalProductsCreatorProps {
  aiModel: string;
}

const DigitalProductsCreator: React.FC<DigitalProductsCreatorProps> = ({ aiModel }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [productType, setProductType] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [salesCopy, setSalesCopy] = useState('');
  const [pricing, setPricing] = useState('');
  const [marketAnalysis, setMarketAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Word count tracking
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);
  const [salesCopyWordCount, setSalesCopyWordCount] = useState(0);
  const maxWords = 5000;

  const productTypes = [
    'E-book', 'Online Course', 'Digital Template', 'Software Tool', 'Mobile App',
    'WordPress Plugin', 'Notion Template', 'Spreadsheet Template', 'Presentation Template',
    'Design Assets', 'Stock Photos', 'Video Course', 'Audio Course', 'Podcast Series',
    'Newsletter Template', 'Email Sequence', 'Social Media Templates', 'Logo Pack',
    'Icon Set', 'Font Collection', 'Lightroom Presets', 'Photoshop Actions',
    'Figma Templates', 'Canva Templates', 'Resume Templates', 'Invoice Templates',
    'Business Plan Template', 'Marketing Plan Template', 'Budget Tracker',
    'Habit Tracker', 'Meal Planner', 'Workout Plan', 'Meditation Guide',
    'Language Learning Course', 'Coding Bootcamp', 'Photography Course',
    'Writing Course', 'Marketing Course', 'SEO Guide', 'Social Media Guide',
    'Cryptocurrency Guide', 'Investment Guide', 'Real Estate Guide',
    'Freelancing Guide', 'Dropshipping Guide', 'Amazon FBA Guide',
    'YouTube Course', 'TikTok Growth Guide', 'Instagram Growth Guide',
    'LinkedIn Strategy', 'Personal Branding Kit', 'Brand Identity Package'
  ];

  const trendingProducts = [
    'AI Prompt Collections', 'Notion Productivity Systems', 'Social Media Templates',
    'Email Marketing Sequences', 'Digital Planners', 'Online Course Blueprints'
  ];

  const popularAudiences = [
    'Entrepreneurs', 'Small Business Owners', 'Content Creators', 'Freelancers',
    'Students', 'Professionals', 'Marketers', 'Designers', 'Developers'
  ];

  // Word count tracking
  useEffect(() => {
    setDescriptionWordCount(description.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [description]);

  useEffect(() => {
    setSalesCopyWordCount(salesCopy.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [salesCopy]);

  const generateContent = useCallback(async (field: string, prompt: string) => {
    setLoading(true);
    try {
      const content = await openRouterService.generateContent(prompt, aiModel);
      
      switch (field) {
        case 'description':
          setDescription(content);
          break;
        case 'audience':
          setTargetAudience(content);
          break;
        case 'features':
          setFeatures(content);
          break;
        case 'salesCopy':
          setSalesCopy(content);
          break;
        case 'pricing':
          setPricing(content);
          break;
        case 'analysis':
          setMarketAnalysis(content);
          break;
      }
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback content
      const fallbackContent = `Generated content for ${field} would appear here. AI generation temporarily unavailable.`;
      switch (field) {
        case 'description':
          setDescription(fallbackContent);
          break;
        case 'audience':
          setTargetAudience(fallbackContent);
          break;
        case 'features':
          setFeatures(fallbackContent);
          break;
        case 'salesCopy':
          setSalesCopy(fallbackContent);
          break;
        case 'pricing':
          setPricing(fallbackContent);
          break;
        case 'analysis':
          setMarketAnalysis(fallbackContent);
          break;
      }
    } finally {
      setLoading(false);
    }
  }, [aiModel]);

  const autoFillAllFields = async () => {
    if (!productName || !productType) {
      alert('Please enter product name and select product type first');
      return;
    }

    setLoading(true);
    try {
      // Generate all content in parallel
      const prompts = {
        description: `Write a comprehensive product description for "${productName}", a ${productType}. Include key benefits, features, and value proposition. Make it engaging and professional.`,
        audience: `Identify and describe the target audience for "${productName}", a ${productType}. Include demographics, pain points, and why they need this product.`,
        features: `List 8-10 key features and benefits of "${productName}", a ${productType}. Focus on what makes it unique and valuable.`,
        salesCopy: `Write compelling sales copy for "${productName}", a ${productType}. Include headlines, benefits, social proof elements, and a strong call-to-action.`,
        pricing: `Suggest pricing strategy for "${productName}", a ${productType}. Include different pricing tiers, justification, and competitive analysis.`,
        analysis: `Provide market analysis for "${productName}", a ${productType}. Include market size, competition, success factors, and revenue potential.`
      };

      const results = await Promise.all([
        openRouterService.generateContent(prompts.description, aiModel),
        openRouterService.generateContent(prompts.audience, aiModel),
        openRouterService.generateContent(prompts.features, aiModel),
        openRouterService.generateContent(prompts.salesCopy, aiModel),
        openRouterService.generateContent(prompts.pricing, aiModel),
        openRouterService.generateContent(prompts.analysis, aiModel)
      ]);

      setDescription(results[0]);
      setTargetAudience(results[1]);
      setFeatures(results[2]);
      setSalesCopy(results[3]);
      setPricing(results[4]);
      setMarketAnalysis(results[5]);
    } catch (error) {
      console.error('Error auto-filling fields:', error);
      alert('Failed to auto-fill all fields. Please try individual fields.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(field);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 30;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${productName} - Product Plan`, margin, yPosition);
    yPosition += 20;

    // Product Type
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Product Type: ${productType}`, margin, yPosition);
    yPosition += 15;

    // Description
    if (description) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Product Description:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(description, maxWidth);
      pdf.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5 + 10;
    }

    // Target Audience
    if (targetAudience) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Target Audience:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const audienceLines = pdf.splitTextToSize(targetAudience, maxWidth);
      pdf.text(audienceLines, margin, yPosition);
      yPosition += audienceLines.length * 5 + 10;
    }

    // Features
    if (features) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Features:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const featureLines = pdf.splitTextToSize(features, maxWidth);
      pdf.text(featureLines, margin, yPosition);
      yPosition += featureLines.length * 5 + 10;
    }

    // Add new page if needed
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }

    // Sales Copy
    if (salesCopy) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sales Copy:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const salesLines = pdf.splitTextToSize(salesCopy, maxWidth);
      pdf.text(salesLines, margin, yPosition);
      yPosition += salesLines.length * 5 + 10;
    }

    // Pricing
    if (pricing) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pricing Strategy:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const pricingLines = pdf.splitTextToSize(pricing, maxWidth);
      pdf.text(pricingLines, margin, yPosition);
      yPosition += pricingLines.length * 5 + 10;
    }

    // Market Analysis
    if (marketAnalysis) {
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 30;
      }
      pdf.setFont('helvetica', 'bold');
      pdf.text('Market Analysis:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const analysisLines = pdf.splitTextToSize(marketAnalysis, maxWidth);
      pdf.text(analysisLines, margin, yPosition);
    }

    pdf.save(`${productName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_product_plan.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Digital Products Creator
          </h1>
          <p className="text-gray-600">Create profitable digital products with AI-powered market analysis</p>
        </div>

        {/* Product Setup */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Ultimate Social Media Template Pack"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select product type...</option>
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={autoFillAllFields}
            disabled={loading || !productName || !productType}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>{loading ? 'Generating...' : 'Auto-Fill All Fields with AI'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 overflow-x-auto">
              {[
                { id: 'description', name: 'Description', icon: ShoppingBag },
                { id: 'audience', name: 'Audience', icon: Users },
                { id: 'salesCopy', name: 'Sales Copy', icon: Target },
                { id: 'analysis', name: 'Analysis', icon: TrendingUp }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        descriptionWordCount > maxWords ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {descriptionWordCount}/{maxWords} words
                      </span>
                      <button
                        onClick={() => copyToClipboard(description, 'description')}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        {copySuccess === 'description' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your digital product in detail..."
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => generateContent('description', `Write a comprehensive product description for "${productName}", a ${productType}. Include key benefits, features, and value proposition.`)}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Generate with AI</span>
                  </button>
                </div>
              )}

              {activeTab === 'audience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Target Audience</h3>
                    <button
                      onClick={() => copyToClipboard(targetAudience, 'audience')}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {copySuccess === 'audience' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Define your target audience..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                    <textarea
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      placeholder="List key features and benefits..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => generateContent('audience', `Identify target audience for "${productName}", a ${productType}. Include demographics and pain points.`)}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Users className="w-4 h-4" />
                      <span>Generate Audience</span>
                    </button>
                    <button
                      onClick={() => generateContent('features', `List key features for "${productName}", a ${productType}. Focus on unique value propositions.`)}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Features</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'salesCopy' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Sales Copy</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm px-2 py-1 rounded ${
                        salesCopyWordCount > maxWords ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {salesCopyWordCount}/{maxWords} words
                      </span>
                      <button
                        onClick={() => copyToClipboard(salesCopy, 'salesCopy')}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        {copySuccess === 'salesCopy' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={salesCopy}
                    onChange={(e) => setSalesCopy(e.target.value)}
                    placeholder="Write compelling sales copy..."
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pricing Strategy</h4>
                    <textarea
                      value={pricing}
                      onChange={(e) => setPricing(e.target.value)}
                      placeholder="Define pricing strategy..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => generateContent('salesCopy', `Write compelling sales copy for "${productName}", a ${productType}. Include headlines, benefits, and call-to-action.`)}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <Target className="w-4 h-4" />
                      <span>Generate Sales Copy</span>
                    </button>
                    <button
                      onClick={() => generateContent('pricing', `Suggest pricing strategy for "${productName}", a ${productType}. Include tiers and justification.`)}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Generate Pricing</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Market Analysis</h3>
                    <button
                      onClick={() => copyToClipboard(marketAnalysis, 'analysis')}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {copySuccess === 'analysis' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <textarea
                    value={marketAnalysis}
                    onChange={(e) => setMarketAnalysis(e.target.value)}
                    placeholder="Market analysis and competitive research..."
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => generateContent('analysis', `Provide market analysis for "${productName}", a ${productType}. Include market size, competition, and success factors.`)}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Generate Analysis</span>
                  </button>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="mt-6">
              <button
                onClick={exportToPDF}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export to PDF</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Products */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Trending Products
              </h3>
              <div className="space-y-2">
                {trendingProducts.map((product, index) => (
                  <button
                    key={index}
                    onClick={() => setProductType(product)}
                    className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {product}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Audiences */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Popular Audiences
              </h3>
              <div className="space-y-2">
                {popularAudiences.map((audience, index) => (
                  <button
                    key={index}
                    onClick={() => setTargetAudience(audience)}
                    className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {audience}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => generateContent('description', 'Generate a viral product description that converts')}
                  className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  🔥 Make it Viral
                </button>
                <button
                  onClick={() => generateContent('salesCopy', 'Write professional sales copy with high conversion rate')}
                  className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  💼 Professional Copy
                </button>
                <button
                  onClick={() => generateContent('analysis', 'Analyze market potential and revenue opportunities')}
                  className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  📊 Market Research
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalProductsCreator;