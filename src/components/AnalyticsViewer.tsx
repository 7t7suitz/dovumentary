import React, { useState } from 'react';
import { AnalyticsData, DocumentaryVersion } from '../types/preview';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock, 
  Download, 
  Calendar,
  Map,
  Smartphone,
  Laptop,
  Heart,
  Eye,
  Share2,
  MessageSquare,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsViewerProps {
  version: DocumentaryVersion;
  analytics: AnalyticsData;
  onRefresh: () => void;
  onExport: (format: 'csv' | 'pdf' | 'json') => void;
}

export const AnalyticsViewer: React.FC<AnalyticsViewerProps> = ({
  version,
  analytics,
  onRefresh,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'viewership' | 'engagement' | 'audience' | 'performance'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Total Views</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{analytics.viewership.totalViews.toLocaleString()}</p>
          <p className="text-sm text-blue-700 mt-1">{analytics.viewership.uniqueViewers.toLocaleString()} unique viewers</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-900">Avg. Watch Time</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{formatTime(analytics.viewership.averageWatchTime)}</p>
          <p className="text-sm text-green-700 mt-1">{Math.round(analytics.viewership.completionRate * 100)}% completion rate</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-purple-900">Engagement</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{Math.round(analytics.engagement.engagementRate * 100)}%</p>
          <p className="text-sm text-purple-700 mt-1">{analytics.engagement.commentCount} comments</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Share2 className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-900">Shares</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{analytics.engagement.shareCount}</p>
          <p className="text-sm text-yellow-700 mt-1">{analytics.engagement.likeCount} likes</p>
        </div>
      </div>

      {/* Views Over Time */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analytics.viewership.viewsByDate}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.audience.demographics[0]?.distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="label"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.audience.demographics[0]?.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${(value * 100).toFixed(2)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Segment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.engagement.engagementBySegment}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${(value * 100).toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="rate" fill="#8884d8">
                  {analytics.engagement.engagementBySegment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderViewershipTab = () => (
    <div className="space-y-6">
      {/* Viewership Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.viewership.totalViews.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Unique Viewers</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.viewership.uniqueViewers.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-purple-600">{Math.round(analytics.viewership.completionRate * 100)}%</p>
        </div>
      </div>

      {/* Views Over Time */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analytics.viewership.viewsByDate}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drop-off Points */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Viewer Drop-off Points</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={version.metrics.dropOffPoints}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => formatTime(value)}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => `${(value * 100).toFixed(2)}%`}
                labelFormatter={(value) => `Time: ${formatTime(value)}`}
              />
              <Legend />
              <Bar dataKey="rate" fill="#ef4444" name="Drop-off Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderEngagementTab = () => (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Comments</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{analytics.engagement.commentCount}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-gray-900">Likes</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{analytics.engagement.likeCount}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Share2 className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-gray-900">Shares</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{analytics.engagement.shareCount}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Engagement Rate</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{Math.round(analytics.engagement.engagementRate * 100)}%</p>
        </div>
      </div>

      {/* Emotional Response */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotional Response Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={version.metrics.emotionalResponseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => formatTime(value)}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => `${(value * 100).toFixed(0)}%`}
                labelFormatter={(value) => `Time: ${formatTime(value)}`}
              />
              <Legend />
              <Line type="monotone" dataKey="intensity" stroke="#8884d8" name="Emotional Intensity" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement by Segment */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Audience Segment</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.engagement.engagementBySegment}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${(value * 100).toFixed(2)}%`} />
              <Legend />
              <Bar dataKey="rate" fill="#8884d8" name="Engagement Rate">
                {analytics.engagement.engagementBySegment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAudienceTab = () => (
    <div className="space-y-6">
      {/* Demographics */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.audience.demographics.map((demographic, index) => (
            <div key={index}>
              <h4 className="font-medium text-gray-900 mb-3 capitalize">{demographic.category}</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographic.distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      nameKey="label"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {demographic.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${(value * 100).toFixed(2)}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geography */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Viewer Geography</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.audience.geographics}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Viewers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Devices */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Viewing Devices</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics.audience.devices}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
                nameKey="type"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {analytics.audience.devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `${(value * 100).toFixed(2)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <Smartphone className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Mobile</div>
            <div className="text-xs text-gray-500">{(analytics.audience.devices.find(d => d.type === 'Mobile')?.percentage || 0) * 100}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <Laptop className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Desktop</div>
            <div className="text-xs text-gray-500">{(analytics.audience.devices.find(d => d.type === 'Desktop')?.percentage || 0) * 100}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <Tablet className="w-6 h-6 text-gray-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Tablet</div>
            <div className="text-xs text-gray-500">{(analytics.audience.devices.find(d => d.type === 'Tablet')?.percentage || 0) * 100}%</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Load Time</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{analytics.performance.loadTime.toFixed(2)}s</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-gray-900">Buffering</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{analytics.performance.bufferingInstances}</p>
          <p className="text-xs text-gray-500">instances per session</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-gray-900">Error Rate</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{(analytics.performance.errorRate * 100).toFixed(2)}%</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Quality Switches</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{analytics.performance.qualitySwitches}</p>
          <p className="text-xs text-gray-500">per session</p>
        </div>
      </div>

      {/* Performance Over Time */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { date: '2023-01-01', loadTime: 2.3, bufferingInstances: 3, errorRate: 0.02 },
                { date: '2023-01-02', loadTime: 2.1, bufferingInstances: 2, errorRate: 0.015 },
                { date: '2023-01-03', loadTime: 1.9, bufferingInstances: 2, errorRate: 0.01 },
                { date: '2023-01-04', loadTime: 2.0, bufferingInstances: 1, errorRate: 0.005 },
                { date: '2023-01-05', loadTime: 1.8, bufferingInstances: 1, errorRate: 0.008 },
                { date: '2023-01-06', loadTime: 1.7, bufferingInstances: 0, errorRate: 0.003 },
                { date: '2023-01-07', loadTime: 1.6, bufferingInstances: 1, errorRate: 0.002 }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="loadTime" stroke="#3b82f6" name="Load Time (s)" />
              <Line yAxisId="right" type="monotone" dataKey="bufferingInstances" stroke="#eab308" name="Buffering Instances" />
              <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" name="Error Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance by Device */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Device</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { device: 'Mobile', loadTime: 2.5, bufferingInstances: 3, errorRate: 0.03 },
                { device: 'Desktop', loadTime: 1.2, bufferingInstances: 0.5, errorRate: 0.01 },
                { device: 'Tablet', loadTime: 1.8, bufferingInstances: 1.5, errorRate: 0.02 },
                { device: 'Smart TV', loadTime: 2.2, bufferingInstances: 2, errorRate: 0.025 },
                { device: 'Console', loadTime: 2.0, bufferingInstances: 1, errorRate: 0.015 }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="loadTime" fill="#3b82f6" name="Load Time (s)" />
              <Bar dataKey="bufferingInstances" fill="#eab308" name="Buffering Instances" />
              <Bar dataKey="errorRate" fill="#ef4444" name="Error Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600">Detailed metrics and insights for {version.name}</p>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => onExport('csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => onExport('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => onExport('json')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Filter Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geography
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Countries</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="au">Australia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Devices</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
                <option value="tv">Smart TV</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience Segment
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Segments</option>
                <option value="new">New Viewers</option>
                <option value="returning">Returning Viewers</option>
                <option value="subscribers">Subscribers</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'viewership', label: 'Viewership', icon: Eye },
            { id: 'engagement', label: 'Engagement', icon: Heart },
            { id: 'audience', label: 'Audience', icon: Users },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'viewership' && renderViewershipTab()}
        {activeTab === 'engagement' && renderEngagementTab()}
        {activeTab === 'audience' && renderAudienceTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
};

// Mock components
const AlertTriangle = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const XCircle = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const Tablet = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);