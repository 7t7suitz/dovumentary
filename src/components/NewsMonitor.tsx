import React, { useState, useEffect } from 'react';
import { NewsMonitoringAlert, Entity } from '../types/research';
import { 
  Bell, 
  Newspaper, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Calendar,
  Rss
} from 'lucide-react';

interface NewsMonitorProps {
  alerts: NewsMonitoringAlert[];
  entities: Entity[];
  onAlertRead: (alertId: string) => void;
  onAlertDelete: (alertId: string) => void;
  onAlertSave: (alertId: string) => void;
  onRefresh: () => void;
}

export const NewsMonitor: React.FC<NewsMonitorProps> = ({
  alerts,
  entities,
  onAlertRead,
  onAlertDelete,
  onAlertSave,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'relevance'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const filteredAlerts = alerts.filter(alert => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!alert.headline.toLowerCase().includes(query) && 
          !alert.summary.toLowerCase().includes(query) &&
          !alert.entityName.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Apply entity filter
    if (selectedEntity && alert.entityId !== selectedEntity) {
      return false;
    }
    
    // Apply read/unread filter
    if (showUnreadOnly && alert.read) {
      return false;
    }
    
    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      if (alert.publishDate < fromDate) {
        return false;
      }
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      if (alert.publishDate > toDate) {
        return false;
      }
    }
    
    // Apply sentiment filter
    if (selectedSentiment && alert.sentiment !== selectedSentiment) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return b.publishDate.getTime() - a.publishDate.getTime();
    } else {
      return b.relevance - a.relevance;
    }
  });

  const getUnreadCount = () => {
    return alerts.filter(alert => !alert.read).length;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">News Monitor</h2>
              <p className="text-sm text-gray-600">
                Tracking {alerts.length} alerts • {getUnreadCount()} unread
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news alerts..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div>
            <select
              value={selectedEntity || ''}
              onChange={(e) => setSelectedEntity(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Entities</option>
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="relevance">Sort by Relevance</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sentiment
                </label>
                <select
                  value={selectedSentiment || ''}
                  onChange={(e) => setSelectedSentiment(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sentiments</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  setDateRange({ from: '', to: '' });
                  setSelectedSentiment(null);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-200">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No News Alerts</h4>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedEntity || showUnreadOnly || dateRange.from || dateRange.to || selectedSentiment
                ? 'Try adjusting your search or filters'
                : 'No news alerts found for your monitored entities'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh News
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-6 ${!alert.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.headline}</h3>
                    {!alert.read && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{alert.summary}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(alert.publishDate)} at {formatTime(alert.publishDate)}
                    </span>
                    
                    <span className="flex items-center">
                      <Newspaper className="w-4 h-4 mr-1" />
                      {alert.source.title}
                    </span>
                    
                    <span className="flex items-center">
                      <Rss className="w-4 h-4 mr-1" />
                      Entity: {alert.entityName}
                    </span>
                    
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(alert.sentiment)}`}>
                      {alert.sentiment}
                    </span>
                    
                    <span className="flex items-center">
                      Relevance: {Math.round(alert.relevance * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 ml-4">
                  <button
                    onClick={() => onAlertRead(alert.id)}
                    className={`p-2 rounded-full ${
                      alert.read 
                        ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
                    }`}
                    title={alert.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => onAlertSave(alert.id)}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-full"
                    title="Save for later"
                  >
                    {alert.read ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                  
                  <a
                    href={alert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                    title="Open source"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  
                  <button
                    onClick={() => onAlertDelete(alert.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"
                    title="Delete alert"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};