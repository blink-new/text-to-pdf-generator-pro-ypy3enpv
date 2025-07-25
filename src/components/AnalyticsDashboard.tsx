import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart, Share2, Download, Calendar, Target, Zap, Globe, Clock } from 'lucide-react';

interface ContentMetrics {
  id: string;
  title: string;
  type: string;
  views: number;
  engagement: number;
  shares: number;
  conversions: number;
  revenue: number;
  viralScore: number;
  createdAt: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ContentMetrics[]>([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('views');

  // Mock data for demonstration
  useEffect(() => {
    const mockMetrics: ContentMetrics[] = [
      {
        id: '1',
        title: 'AI-Powered Marketing Strategies',
        type: 'Blog',
        views: 15420,
        engagement: 8.7,
        shares: 342,
        conversions: 89,
        revenue: 2340,
        viralScore: 9.2,
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Success Mindset Meme',
        type: 'Meme',
        views: 45230,
        engagement: 12.4,
        shares: 1205,
        conversions: 156,
        revenue: 890,
        viralScore: 9.8,
        createdAt: '2024-01-19'
      },
      {
        id: '3',
        title: 'Digital Course Blueprint',
        type: 'Digital Product',
        views: 8940,
        engagement: 15.2,
        shares: 234,
        conversions: 67,
        revenue: 4560,
        viralScore: 8.9,
        createdAt: '2024-01-18'
      },
      {
        id: '4',
        title: 'LinkedIn Growth Hack',
        type: 'Social Media',
        views: 23450,
        engagement: 9.8,
        shares: 567,
        conversions: 123,
        revenue: 1230,
        viralScore: 9.1,
        createdAt: '2024-01-17'
      }
    ];
    setMetrics(mockMetrics);
  }, []);

  const totalViews = metrics.reduce((sum, item) => sum + item.views, 0);
  const totalRevenue = metrics.reduce((sum, item) => sum + item.revenue, 0);
  const avgEngagement = metrics.reduce((sum, item) => sum + item.engagement, 0) / metrics.length;
  const totalShares = metrics.reduce((sum, item) => sum + item.shares, 0);

  const topPerformer = metrics.reduce((top, current) => 
    current.viralScore > top.viralScore ? current : top, metrics[0] || {} as ContentMetrics
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Track performance, analyze trends, and optimize your content strategy</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['24h', '7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+23.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</h3>
            <p className="text-gray-600">Total Views</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+18.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{avgEngagement.toFixed(1)}%</h3>
            <p className="text-gray-600">Avg Engagement</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+31.7%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalShares.toLocaleString()}</h3>
            <p className="text-gray-600">Total Shares</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-green-500 text-sm font-medium">+42.1%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-600">Revenue Generated</p>
          </div>
        </div>

        {/* Charts and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Performance Trends</h3>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="views">Views</option>
                <option value="engagement">Engagement</option>
                <option value="shares">Shares</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {metrics.map((item, index) => (
                <div key={item.id} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500"
                    style={{ 
                      height: `${(item[selectedMetric as keyof ContentMetrics] as number / Math.max(...metrics.map(m => m[selectedMetric as keyof ContentMetrics] as number))) * 200}px` 
                    }}
                  />
                  <span className="text-xs text-gray-600 mt-2 text-center">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performer */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performer</h3>
            {topPerformer.id && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Content:</span>
                  <span className="font-medium">{topPerformer.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">{topPerformer.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Viral Score:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${topPerformer.viralScore * 10}%` }}
                      />
                    </div>
                    <span className="font-bold text-green-600">{topPerformer.viralScore}/10</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-bold text-green-600">${topPerformer.revenue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Engagement:</span>
                  <span className="font-medium">{topPerformer.engagement}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Performance Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Content Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viral Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.views.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.engagement}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.shares}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                            style={{ width: `${item.viralScore * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.viralScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6" />
            <h3 className="text-xl font-bold">AI Insights & Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🔥 Trending Content Type</h4>
              <p className="text-sm opacity-90">Memes are performing 34% better than average. Consider creating more visual content.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">⏰ Optimal Posting Time</h4>
              <p className="text-sm opacity-90">Your audience is most active at 2-4 PM EST. Schedule content accordingly.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">💡 Content Gap</h4>
              <p className="text-sm opacity-90">Video content is underrepresented. Add video scripts to boost engagement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;