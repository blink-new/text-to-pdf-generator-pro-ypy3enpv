import React, { useState } from 'react';
import { FileText, Download, Eye, Wand2, Search, Type, Palette, Layout, Image, Zap, Copy, Share2, BookOpen, Star } from 'lucide-react';
import jsPDF from 'jspdf';

interface PDFGeneratorProps {
  aiModel: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ aiModel }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('professional');
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('helvetica');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [activeTab, setActiveTab] = useState('editor');
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { id: 'professional', name: 'Professional Report', category: 'business', desc: 'Clean business document' },
    { id: 'modern', name: 'Modern Article', category: 'content', desc: 'Contemporary design' },
    { id: 'academic', name: 'Academic Paper', category: 'education', desc: 'Research document' },
    { id: 'creative', name: 'Creative Brief', category: 'creative', desc: 'Artistic layout' },
    { id: 'invoice', name: 'Invoice Template', category: 'business', desc: 'Billing document' },
    { id: 'newsletter', name: 'Newsletter', category: 'marketing', desc: 'Email newsletter' },
    { id: 'ebook', name: 'E-book Chapter', category: 'content', desc: 'Book formatting' },
    { id: 'proposal', name: 'Project Proposal', category: 'business', desc: 'Client proposal' }
  ];

  const aiSuggestions = {
    topics: [
      "The Future of Artificial Intelligence in Business",
      "Complete Guide to Digital Marketing in 2024",
      "Remote Work Best Practices and Productivity Tips",
      "Sustainable Business Practices for Modern Companies",
      "Personal Branding Strategies for Entrepreneurs"
    ],
    content: [
      "Write a comprehensive introduction about the importance of this topic in today's business landscape...",
      "Create an executive summary highlighting the key findings and recommendations...",
      "Develop a detailed analysis of current market trends and future predictions...",
      "Generate a step-by-step implementation guide with practical examples...",
      "Compose a conclusion that summarizes the main points and calls for action..."
    ]
  };

  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;
  const estimatedPages = Math.ceil(wordCount / 250);

  const handleAutoFill = () => {
    const randomTopic = aiSuggestions.topics[Math.floor(Math.random() * aiSuggestions.topics.length)];
    const randomContent = aiSuggestions.content[Math.floor(Math.random() * aiSuggestions.content.length)];
    
    setTitle(randomTopic);
    setText(`# ${randomTopic}\n\n## Introduction\n\n${randomContent}\n\n## Key Points\n\n• Point 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n• Point 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n• Point 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco.\n\n## Detailed Analysis\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n## Conclusion\n\nIn conclusion, ${randomTopic.toLowerCase()} represents a significant opportunity for businesses to innovate and grow. By implementing the strategies outlined in this document, organizations can achieve sustainable success.\n\n---\n\n*This document was generated using AI-powered content creation tools.*`);
  };

  const handleWebSearch = async () => {
    setIsGenerating(true);
    // Simulate web search for content ideas
    setTimeout(() => {
      const searchResults = [
        "Latest industry trends show significant growth in AI adoption",
        "Market research indicates 75% increase in remote work productivity",
        "New regulations require updated compliance documentation",
        "Consumer behavior shifts demand innovative marketing approaches",
        "Technology advances enable new business opportunities"
      ];
      
      const randomResult = searchResults[Math.floor(Math.random() * searchResults.length)];
      setTitle(`Research Report: ${randomResult}`);
      setText(`# Research Findings\n\n## Executive Summary\n\n${randomResult}. This comprehensive report analyzes the implications and provides actionable recommendations.\n\n## Key Findings\n\n1. **Market Analysis**: Current trends show significant opportunities for growth\n2. **Competitive Landscape**: Analysis of key players and market positioning\n3. **Future Outlook**: Predictions and strategic recommendations\n\n## Detailed Analysis\n\nBased on extensive research and data analysis, we have identified several key trends that will shape the industry in the coming years. These findings provide valuable insights for strategic planning and decision-making.\n\n## Recommendations\n\n• Implement immediate action items to capitalize on current opportunities\n• Develop long-term strategies to maintain competitive advantage\n• Monitor key metrics and adjust approach based on market feedback\n\n## Conclusion\n\nThe research clearly indicates that organizations must adapt quickly to changing market conditions to remain competitive and achieve sustainable growth.`);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAIContent = async (type: string) => {
    setIsGenerating(true);
    // Simulate AI content generation
    setTimeout(() => {
      const contentTypes = {
        expand: `${text}\n\n## Additional Insights\n\nBuilding upon the previous points, it's important to consider the broader implications and long-term effects. Research shows that implementing these strategies can lead to significant improvements in efficiency and outcomes.\n\n### Implementation Strategy\n\n1. **Phase 1**: Initial assessment and planning\n2. **Phase 2**: Pilot program implementation\n3. **Phase 3**: Full-scale deployment and optimization\n\n### Success Metrics\n\n• Increased productivity by 40%\n• Reduced operational costs by 25%\n• Improved customer satisfaction scores\n• Enhanced team collaboration and communication`,
        
        summarize: `# Executive Summary: ${title}\n\n## Key Points\n\n${text.split('\n').filter(line => line.includes('•') || line.includes('-')).slice(0, 5).join('\n')}\n\n## Main Conclusions\n\nThis document presents a comprehensive analysis of the topic, highlighting critical insights and actionable recommendations for implementation.\n\n## Next Steps\n\n1. Review and approve recommendations\n2. Develop implementation timeline\n3. Assign responsibilities and resources\n4. Monitor progress and adjust as needed`,
        
        professional: text.replace(/\b(I|me|my|we|us|our)\b/gi, (match) => {
          const replacements = {
            'I': 'The organization',
            'me': 'the organization',
            'my': 'the organization\'s',
            'we': 'the organization',
            'us': 'the organization',
            'our': 'the organization\'s'
          };
          return replacements[match.toLowerCase() as keyof typeof replacements] || match;
        }) + '\n\n## Professional Assessment\n\nThis analysis has been conducted using industry best practices and established methodologies to ensure accuracy and reliability of the findings.',
        
        viral: `🚀 ${title}\n\n${text.replace(/\./g, '! 🔥')}\n\n## Why This Matters 💡\n\nThis isn't just another report - it's a game-changer that could revolutionize how you think about this topic!\n\n### Key Takeaways ✨\n\n• Mind-blowing insights that will surprise you\n• Actionable strategies you can implement TODAY\n• Proven results from industry leaders\n• Secret techniques the experts don't want you to know\n\n**Ready to transform your approach? Let's dive in! 🎯**`
      };
      
      setText(contentTypes[type as keyof typeof contentTypes] || text);
      setIsGenerating(false);
    }, 2000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Set colors based on template
    const colors = {
      professional: { primary: '#2563EB', secondary: '#64748B' },
      modern: { primary: '#7C3AED', secondary: '#6B7280' },
      academic: { primary: '#059669', secondary: '#4B5563' },
      creative: { primary: '#DC2626', secondary: '#6B7280' },
      invoice: { primary: '#0891B2', secondary: '#64748B' },
      newsletter: { primary: '#EA580C', secondary: '#6B7280' },
      ebook: { primary: '#7C2D12', secondary: '#57534E' },
      proposal: { primary: '#1D4ED8', secondary: '#64748B' }
    };
    
    const templateColors = colors[template as keyof typeof colors] || colors.professional;
    
    // Header
    doc.setFillColor(templateColors.primary);
    doc.rect(0, 0, pageWidth, 30, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(title || 'Untitled Document', maxWidth - 20);
    doc.text(titleLines, margin, 20);
    
    // Content
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(fontSize);
    doc.setFont(fontFamily, 'normal');
    
    const lines = text.split('\n');
    let yPosition = 50;
    
    lines.forEach((line) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 30;
      }
      
      if (line.startsWith('# ')) {
        // Main heading
        doc.setFontSize(fontSize + 4);
        doc.setFont(fontFamily, 'bold');
        doc.setTextColor(templateColors.primary);
        const headingText = line.replace('# ', '');
        doc.text(headingText, margin, yPosition);
        yPosition += 15;
      } else if (line.startsWith('## ')) {
        // Sub heading
        doc.setFontSize(fontSize + 2);
        doc.setFont(fontFamily, 'bold');
        doc.setTextColor(templateColors.secondary);
        const subHeadingText = line.replace('## ', '');
        doc.text(subHeadingText, margin, yPosition);
        yPosition += 12;
      } else if (line.startsWith('• ') || line.startsWith('- ')) {
        // Bullet points
        doc.setFontSize(fontSize);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(60, 60, 60);
        const bulletText = line.replace(/^[•-] /, '');
        const wrappedText = doc.splitTextToSize(`• ${bulletText}`, maxWidth);
        doc.text(wrappedText, margin, yPosition);
        yPosition += wrappedText.length * 6;
      } else if (line.trim() !== '') {
        // Regular paragraph
        doc.setFontSize(fontSize);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(60, 60, 60);
        const wrappedText = doc.splitTextToSize(line, maxWidth);
        doc.text(wrappedText, margin, yPosition);
        yPosition += wrappedText.length * 6;
      }
      
      yPosition += 4; // Line spacing
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      doc.text('Generated with AI Content Creator', margin, pageHeight - 10);
    }
    
    // Save the PDF
    const fileName = title ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf` : 'document.pdf';
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI PDF Generator</h1>
            <p className="text-gray-600">Create professional PDFs with unlimited text and AI assistance</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/20">
        {[
          { id: 'editor', label: 'Text Editor', icon: Type },
          { id: 'design', label: 'Design & Style', icon: Palette },
          { id: 'preview', label: 'Preview & Export', icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-indigo-600'
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
          {activeTab === 'editor' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAutoFill}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Auto-Fill Content</span>
                </button>
                <button
                  onClick={handleWebSearch}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{isGenerating ? 'Researching...' : 'Web Research'}</span>
                </button>
                <button
                  onClick={() => generateAIContent('expand')}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isGenerating ? 'Expanding...' : 'Expand Content'}</span>
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your document title..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
                />
              </div>

              {/* Text Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Content (Unlimited Text)</label>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                    <span>~{estimatedPages} pages</span>
                  </div>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing your content here... You can use Markdown formatting:&#10;&#10;# Main Heading&#10;## Sub Heading&#10;• Bullet point&#10;- Another bullet point&#10;&#10;**Bold text** and *italic text* are supported."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 font-mono text-sm"
                />
              </div>

              {/* AI Enhancement Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => generateAIContent('summarize')}
                  disabled={isGenerating || !text}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Summarize</span>
                </button>
                <button
                  onClick={() => generateAIContent('professional')}
                  disabled={isGenerating || !text}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  <Star className="w-4 h-4" />
                  <span>Make Professional</span>
                </button>
                <button
                  onClick={() => generateAIContent('viral')}
                  disabled={isGenerating || !text}
                  className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Make Viral</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Design & Styling Options</h3>
              
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Template</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {templates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setTemplate(tmpl.id)}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        template === tmpl.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-sm">{tmpl.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{tmpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
                  >
                    <option value="helvetica">Helvetica</option>
                    <option value="times">Times New Roman</option>
                    <option value="courier">Courier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">{fontSize}pt</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-12 border border-gray-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview Sample */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-3">Style Preview</h4>
                <div className="bg-white rounded-lg p-4 border">
                  <div 
                    className="text-lg font-bold mb-2"
                    style={{ color: primaryColor, fontSize: `${fontSize + 4}px`, fontFamily }}
                  >
                    Sample Heading
                  </div>
                  <div 
                    className="text-gray-700"
                    style={{ fontSize: `${fontSize}px`, fontFamily }}
                  >
                    This is how your content will appear in the PDF. The selected template and styling options will be applied to create a professional-looking document.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {wordCount} words • ~{estimatedPages} pages
                  </span>
                </div>
              </div>

              {/* Document Preview */}
              <div className="bg-white rounded-lg border shadow-lg p-8 max-h-96 overflow-y-auto">
                {title && (
                  <h1 
                    className="font-bold mb-6 pb-4 border-b"
                    style={{ color: primaryColor, fontSize: `${fontSize + 6}px`, fontFamily }}
                  >
                    {title}
                  </h1>
                )}
                
                <div 
                  className="prose max-w-none"
                  style={{ fontSize: `${fontSize}px`, fontFamily }}
                >
                  {text ? (
                    <div className="whitespace-pre-wrap">
                      {text.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return (
                            <h1 key={index} className="text-2xl font-bold mt-6 mb-4" style={{ color: primaryColor }}>
                              {line.replace('# ', '')}
                            </h1>
                          );
                        } else if (line.startsWith('## ')) {
                          return (
                            <h2 key={index} className="text-xl font-semibold mt-4 mb-3" style={{ color: primaryColor }}>
                              {line.replace('## ', '')}
                            </h2>
                          );
                        } else if (line.startsWith('• ') || line.startsWith('- ')) {
                          return (
                            <div key={index} className="ml-4 mb-2">
                              • {line.replace(/^[•-] /, '')}
                            </div>
                          );
                        } else if (line.trim()) {
                          return (
                            <p key={index} className="mb-4 leading-relaxed">
                              {line}
                            </p>
                          );
                        }
                        return <br key={index} />;
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No content to preview. Add some text in the editor tab.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Options */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generatePDF}
                  disabled={!text && !title}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  disabled={!text}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </button>
                <button
                  disabled={!text}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Document</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6 sticky top-24">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
            </div>

            {/* Content Ideas */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Content Ideas</h4>
              <div className="space-y-2">
                {aiSuggestions.topics.slice(0, 3).map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setTitle(topic)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    💡 {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Writing Prompts */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Writing Prompts</h4>
              <div className="space-y-2">
                {aiSuggestions.content.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setText(text + '\n\n' + prompt)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✍️ {prompt.substring(0, 50)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Document Stats */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Document Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Words:</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Characters:</span>
                  <span className="font-medium">{charCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Pages:</span>
                  <span className="font-medium">{estimatedPages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Read Time:</span>
                  <span className="font-medium">{Math.ceil(wordCount / 200)} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;