import React, { useState } from 'react';
import { DocumentaryPreview, DocumentaryVersion, FeedbackSession, Trailer, SocialContent, PitchMaterial, ABTestConfig } from '../types/preview';
import { PreviewGenerator } from './PreviewGenerator';
import { FeedbackCollector } from './FeedbackCollector';
import { AnalyticsViewer } from './AnalyticsViewer';
import { MarketingMaterialGenerator } from './MarketingMaterialGenerator';
import { DistributionPlanner } from './DistributionPlanner';
import { 
  Film, 
  MessageSquare, 
  BarChart2, 
  Share2, 
  Globe, 
  Split,
  Settings,
  Download,
  Plus,
  RefreshCw
} from 'lucide-react';

interface InteractivePreviewSystemProps {
  preview: DocumentaryPreview;
  onPreviewUpdate: (preview: DocumentaryPreview) => void;
}

export const InteractivePreviewSystem: React.FC<InteractivePreviewSystemProps> = ({
  preview,
  onPreviewUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'feedback' | 'analytics' | 'marketing' | 'distribution' | 'abtest'>('preview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleVersionCreate = (version: DocumentaryVersion) => {
    onPreviewUpdate({
      ...preview,
      versions: [...preview.versions, version],
      updatedAt: new Date()
    });
  };

  const handleVersionUpdate = (version: DocumentaryVersion) => {
    onPreviewUpdate({
      ...preview,
      versions: preview.versions.map(v => v.id === version.id ? version : v),
      updatedAt: new Date()
    });
  };

  const handleFeedbackFormCreate = (form: any) => {
    const session: FeedbackSession = {
      id: Math.random().toString(36).substring(2, 9),
      title: form.title,
      description: form.description,
      versionId: preview.versions[0]?.id || '',
      status: 'active',
      participants: [],
      questions: form.questions,
      responses: [],
      summary: {
        overallRating: 0,
        engagementScore: 0,
        emotionalImpactScore: 0,
        clarityScore: 0,
        technicalQualityScore: 0,
        keyInsights: [],
        wordCloud: {},
        sentimentAnalysis: {
          positive: 0,
          neutral: 0,
          negative: 0
        },
        improvementAreas: [],
        strengthAreas: []
      },
      createdAt: new Date()
    };

    onPreviewUpdate({
      ...preview,
      feedbackSessions: [...preview.feedbackSessions, session],
      updatedAt: new Date()
    });
  };

  const handleFeedbackFormUpdate = (form: any) => {
    // Implementation would update an existing feedback form
  };

  const handleTrailerCreate = (trailer: Trailer) => {
    onPreviewUpdate({
      ...preview,
      trailers: [...preview.trailers, trailer],
      updatedAt: new Date()
    });
  };

  const handleSocialContentCreate = (content: SocialContent) => {
    onPreviewUpdate({
      ...preview,
      socialContent: [...preview.socialContent, content],
      updatedAt: new Date()
    });
  };

  const handlePitchMaterialCreate = (material: PitchMaterial) => {
    onPreviewUpdate({
      ...preview,
      pitchMaterials: [...preview.pitchMaterials, material],
      updatedAt: new Date()
    });
  };

  const handleTrailerDelete = (id: string) => {
    onPreviewUpdate({
      ...preview,
      trailers: preview.trailers.filter(t => t.id !== id),
      updatedAt: new Date()
    });
  };

  const handleSocialContentDelete = (id: string) => {
    onPreviewUpdate({
      ...preview,
      socialContent: preview.socialContent.filter(c => c.id !== id),
      updatedAt: new Date()
    });
  };

  const handlePitchMaterialDelete = (id: string) => {
    onPreviewUpdate({
      ...preview,
      pitchMaterials: preview.pitchMaterials.filter(m => m.id !== id),
      updatedAt: new Date()
    });
  };

  const handleMarketAnalysisUpdate = (analysis: any) => {
    onPreviewUpdate({
      ...preview,
      marketAnalysis: analysis,
      updatedAt: new Date()
    });
  };

  const handleDistributionPlanUpdate = (plan: any) => {
    onPreviewUpdate({
      ...preview,
      distributionPlan: plan,
      updatedAt: new Date()
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // In a real implementation, this would refresh data from APIs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update metrics with some random changes
      const updatedVersions = preview.versions.map(version => ({
        ...version,
        metrics: {
          ...version.metrics,
          views: version.metrics.views + Math.floor(Math.random() * 50),
          completionRate: Math.min(1, version.metrics.completionRate + Math.random() * 0.05),
          engagementScore: Math.min(1, version.metrics.engagementScore + Math.random() * 0.03)
        }
      }));
      
      onPreviewUpdate({
        ...preview,
        versions: updatedVersions,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    // In a real implementation, this would export data in the specified format
    alert(`Exporting data in ${format.toUpperCase()} format`);
  };

  // Mock analytics data
  const mockAnalyticsData = {
    viewership: {
      totalViews: 1250,
      uniqueViewers: 875,
      averageWatchTime: 420, // in seconds
      completionRate: 0.68,
      viewsByDate: [
        { date: '2023-01-01', views: 50 },
        { date: '2023-01-02', views: 75 },
        { date: '2023-01-03', views: 120 },
        { date: '2023-01-04', views: 95 },
        { date: '2023-01-05', views: 110 },
        { date: '2023-01-06', views: 150 },
        { date: '2023-01-07', views: 180 }
      ]
    },
    engagement: {
      commentCount: 45,
      feedbackCount: 32,
      shareCount: 28,
      likeCount: 95,
      engagementRate: 0.12,
      engagementBySegment: [
        { segment: 'Film Enthusiasts', rate: 0.22 },
        { segment: 'Subject Fans', rate: 0.18 },
        { segment: 'General Audience', rate: 0.08 },
        { segment: 'Educational', rate: 0.15 }
      ]
    },
    audience: {
      demographics: [
        {
          category: 'age',
          distribution: [
            { label: '18-24', percentage: 0.15 },
            { label: '25-34', percentage: 0.35 },
            { label: '35-44', percentage: 0.25 },
            { label: '45-54', percentage: 0.15 },
            { label: '55+', percentage: 0.1 }
          ]
        },
        {
          category: 'gender',
          distribution: [
            { label: 'Male', percentage: 0.48 },
            { label: 'Female', percentage: 0.51 },
            { label: 'Other', percentage: 0.01 }
          ]
        }
      ],
      geographics: [
        { country: 'United States', count: 450 },
        { country: 'Canada', count: 120 },
        { country: 'United Kingdom', count: 95 },
        { country: 'Germany', count: 65 },
        { country: 'Australia', count: 45 },
        { country: 'Other', count: 100 }
      ],
      devices: [
        { type: 'Mobile', percentage: 0.45 },
        { type: 'Desktop', percentage: 0.35 },
        { type: 'Tablet', percentage: 0.15 },
        { type: 'Smart TV', percentage: 0.05 }
      ]
    },
    performance: {
      loadTime: 1.8, // seconds
      bufferingInstances: 1.2, // per session
      errorRate: 0.02,
      qualitySwitches: 2.5 // per session
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interactive Preview System</h1>
                <p className="text-sm text-gray-500">Create, test, and distribute your documentary</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Project:</span> {preview.title}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleExport('pdf')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Export"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'preview', label: 'Preview Generator', icon: Film },
              { id: 'feedback', label: 'Feedback Collection', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
              { id: 'marketing', label: 'Marketing Materials', icon: Share2 },
              { id: 'distribution', label: 'Distribution', icon: Globe },
              { id: 'abtest', label: 'A/B Testing', icon: Split }
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
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'preview' && (
          <PreviewGenerator
            versions={preview.versions}
            onVersionCreate={handleVersionCreate}
            onVersionUpdate={handleVersionUpdate}
          />
        )}
        
        {activeTab === 'feedback' && preview.versions.length > 0 && (
          <FeedbackCollector
            version={preview.versions[0]}
            onFeedbackFormCreate={handleFeedbackFormCreate}
            onFeedbackFormUpdate={handleFeedbackFormUpdate}
          />
        )}
        
        {activeTab === 'analytics' && preview.versions.length > 0 && (
          <AnalyticsViewer
            version={preview.versions[0]}
            analytics={mockAnalyticsData}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        )}
        
        {activeTab === 'marketing' && preview.versions.length > 0 && (
          <MarketingMaterialGenerator
            version={preview.versions[0]}
            trailers={preview.trailers}
            socialContent={preview.socialContent}
            pitchMaterials={preview.pitchMaterials}
            onTrailerCreate={handleTrailerCreate}
            onSocialContentCreate={handleSocialContentCreate}
            onPitchMaterialCreate={handlePitchMaterialCreate}
            onTrailerDelete={handleTrailerDelete}
            onSocialContentDelete={handleSocialContentDelete}
            onPitchMaterialDelete={handlePitchMaterialDelete}
          />
        )}
        
        {activeTab === 'distribution' && (
          <DistributionPlanner
            marketAnalysis={preview.marketAnalysis}
            distributionPlan={preview.distributionPlan}
            onMarketAnalysisUpdate={handleMarketAnalysisUpdate}
            onDistributionPlanUpdate={handleDistributionPlanUpdate}
          />
        )}
        
        {activeTab === 'abtest' && preview.versions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Split className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">A/B Testing</h2>
                <p className="text-sm text-gray-600">Compare different versions of your documentary</p>
              </div>
            </div>
            
            <div className="text-center py-12">
              <Split className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">A/B Testing Coming Soon</h3>
              <p className="text-gray-600 mb-4">This feature is currently in development</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Join Waitlist
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Interactive Preview System - Create, test, and distribute your documentary
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Powered by advanced analytics and audience feedback tools
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};