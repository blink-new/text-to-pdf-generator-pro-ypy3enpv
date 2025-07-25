import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit3, Trash2, Clock, Users, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduledContent {
  id: string;
  title: string;
  type: 'Blog' | 'Social Media' | 'Meme' | 'Digital Product' | 'PDF';
  platform: string[];
  scheduledDate: string;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Failed';
  engagement: number;
  viralScore: number;
  content: string;
}

const ContentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'Blog' as const,
    platform: [] as string[],
    scheduledDate: '',
    content: ''
  });

  // Mock scheduled content
  useEffect(() => {
    const mockContent: ScheduledContent[] = [
      {
        id: '1',
        title: 'AI Marketing Trends 2024',
        type: 'Blog',
        platform: ['LinkedIn', 'Twitter'],
        scheduledDate: '2024-01-25',
        status: 'Scheduled',
        engagement: 8.5,
        viralScore: 9.1,
        content: 'Comprehensive guide to AI marketing trends...'
      },
      {
        id: '2',
        title: 'Success Mindset Meme',
        type: 'Meme',
        platform: ['Instagram', 'Facebook'],
        scheduledDate: '2024-01-26',
        status: 'Draft',
        engagement: 12.3,
        viralScore: 9.8,
        content: 'Motivational meme about success mindset...'
      },
      {
        id: '3',
        title: 'Digital Course Launch',
        type: 'Digital Product',
        platform: ['Email', 'LinkedIn'],
        scheduledDate: '2024-01-27',
        status: 'Scheduled',
        engagement: 15.7,
        viralScore: 8.9,
        content: 'Launch announcement for new digital course...'
      }
    ];
    setScheduledContent(mockContent);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getContentForDate = (date: string) => {
    return scheduledContent.filter(content => content.scheduledDate === date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddContent = () => {
    if (newContent.title && newContent.scheduledDate) {
      const content: ScheduledContent = {
        id: Date.now().toString(),
        title: newContent.title,
        type: newContent.type,
        platform: newContent.platform,
        scheduledDate: newContent.scheduledDate,
        status: 'Draft',
        engagement: Math.random() * 15 + 5,
        viralScore: Math.random() * 3 + 7,
        content: newContent.content
      };
      setScheduledContent([...scheduledContent, content]);
      setNewContent({ title: '', type: 'Blog', platform: [], scheduledDate: '', content: '' });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Blog': return '📝';
      case 'Social Media': return '📱';
      case 'Meme': return '😂';
      case 'Digital Product': return '💎';
      case 'PDF': return '📄';
      default: return '📄';
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Content Calendar
            </h1>
            <p className="text-gray-600">Plan, schedule, and track your content strategy</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Content</span>
          </button>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {emptyDays.map(day => (
                <div key={`empty-${day}`} className="h-24"></div>
              ))}
              {days.map(day => {
                const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                const dayContent = getContentForDate(dateStr);
                const isToday = dateStr === formatDate(new Date());
                
                return (
                  <div
                    key={day}
                    className={`h-24 border border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isToday ? 'bg-indigo-50 border-indigo-300' : ''
                    }`}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayContent.slice(0, 2).map(content => (
                        <div
                          key={content.id}
                          className="text-xs p-1 rounded bg-indigo-100 text-indigo-800 truncate"
                          title={content.title}
                        >
                          {getTypeIcon(content.type)} {content.title}
                        </div>
                      ))}
                      {dayContent.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayContent.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scheduled Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Content</h3>
            </div>
            <div className="p-6 space-y-4">
              {scheduledContent
                .filter(content => new Date(content.scheduledDate) >= new Date())
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .map(content => (
                  <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(content.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600">{content.scheduledDate}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{content.engagement.toFixed(1)}% engagement</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>{content.viralScore.toFixed(1)} viral score</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {content.platform.map(platform => (
                        <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Performance Insights</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Best Performing Days */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Best Performing Days</h4>
                <div className="space-y-2">
                  {['Tuesday', 'Thursday', 'Saturday'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-gray-700">{day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                            style={{ width: `${(3 - index) * 30 + 40}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{(3 - index) * 2 + 8}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Type Performance */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Content Type Performance</h4>
                <div className="space-y-2">
                  {[
                    { type: 'Memes', performance: 95 },
                    { type: 'Social Media', performance: 87 },
                    { type: 'Blogs', performance: 78 },
                    { type: 'Digital Products', performance: 82 }
                  ].map(item => (
                    <div key={item.type} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                            style={{ width: `${item.performance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-indigo-600" />
                  AI Recommendations
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Schedule more memes on weekends for higher engagement</li>
                  <li>• Post blog content on Tuesday mornings for best reach</li>
                  <li>• Add video content to boost overall performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Add Content Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule New Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter content title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newContent.type}
                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Blog">Blog</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Meme">Meme</option>
                    <option value="Digital Product">Digital Product</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={newContent.scheduledDate}
                    onChange={(e) => setNewContent({ ...newContent, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContent}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCalendar;