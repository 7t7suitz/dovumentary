import React, { useState } from 'react';
import { MarketAnalysis, DistributionPlan, AudienceSegment, DistributionChannel, MarketTrend } from '../types/preview';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Target,
  BarChart2,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';

interface DistributionPlannerProps {
  marketAnalysis: MarketAnalysis;
  distributionPlan: DistributionPlan;
  onMarketAnalysisUpdate: (analysis: MarketAnalysis) => void;
  onDistributionPlanUpdate: (plan: DistributionPlan) => void;
}

export const DistributionPlanner: React.FC<DistributionPlannerProps> = ({
  marketAnalysis,
  distributionPlan,
  onMarketAnalysisUpdate,
  onDistributionPlanUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'plan' | 'audiences' | 'channels'>('market');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['audiences', 'swot']));
  const [showAddAudience, setShowAddAudience] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newAudience, setNewAudience] = useState<Partial<AudienceSegment>>({
    name: '',
    demographics: {
      ageRange: '',
      gender: [],
      location: [],
      income: '',
      education: []
    },
    psychographics: {
      interests: [],
      values: [],
      behaviors: [],
      mediaConsumption: []
    },
    size: 0,
    reachability: 0,
    priority: 'secondary'
  });
  const [newChannel, setNewChannel] = useState<Partial<DistributionChannel>>({
    name: '',
    type: 'streaming',
    audienceReach: 0,
    revenueModel: '',
    requirements: [],
    competitiveness: 0,
    relevance: 0,
    costStructure: {
      entryFee: 0,
      revenueSplit: '',
      marketingRequirements: ''
    }
  });

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddAudience = () => {
    if (!newAudience.name) return;
    
    const audience: AudienceSegment = {
      id: Math.random().toString(36).substring(2, 9),
      name: newAudience.name || '',
      demographics: newAudience.demographics || {
        ageRange: '',
        gender: [],
        location: [],
        income: '',
        education: []
      },
      psychographics: newAudience.psychographics || {
        interests: [],
        values: [],
        behaviors: [],
        mediaConsumption: []
      },
      size: newAudience.size || 0,
      reachability: newAudience.reachability || 0,
      priority: newAudience.priority as any || 'secondary'
    };
    
    onMarketAnalysisUpdate({
      ...marketAnalysis,
      targetAudiences: [...marketAnalysis.targetAudiences, audience]
    });
    
    setShowAddAudience(false);
    setNewAudience({
      name: '',
      demographics: {
        ageRange: '',
        gender: [],
        location: [],
        income: '',
        education: []
      },
      psychographics: {
        interests: [],
        values: [],
        behaviors: [],
        mediaConsumption: []
      },
      size: 0,
      reachability: 0,
      priority: 'secondary'
    });
  };

  const handleAddChannel = () => {
    if (!newChannel.name || !newChannel.type) return;
    
    const channel: DistributionChannel = {
      id: Math.random().toString(36).substring(2, 9),
      name: newChannel.name || '',
      type: newChannel.type as any || 'streaming',
      audienceReach: newChannel.audienceReach || 0,
      revenueModel: newChannel.revenueModel || '',
      requirements: newChannel.requirements || [],
      competitiveness: newChannel.competitiveness || 0,
      relevance: newChannel.relevance || 0,
      costStructure: newChannel.costStructure || {
        entryFee: 0,
        revenueSplit: '',
        marketingRequirements: ''
      }
    };
    
    onMarketAnalysisUpdate({
      ...marketAnalysis,
      distributionChannels: [...marketAnalysis.distributionChannels, channel]
    });
    
    setShowAddChannel(false);
    setNewChannel({
      name: '',
      type: 'streaming',
      audienceReach: 0,
      revenueModel: '',
      requirements: [],
      competitiveness: 0,
      relevance: 0,
      costStructure: {
        entryFee: 0,
        revenueSplit: '',
        marketingRequirements: ''
      }
    });
  };

  const handleDeleteAudience = (id: string) => {
    onMarketAnalysisUpdate({
      ...marketAnalysis,
      targetAudiences: marketAnalysis.targetAudiences.filter(audience => audience.id !== id)
    });
  };

  const handleDeleteChannel = (id: string) => {
    onMarketAnalysisUpdate({
      ...marketAnalysis,
      distributionChannels: marketAnalysis.distributionChannels.filter(channel => channel.id !== id)
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderMarketTab = () => (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Total Market Size</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {marketAnalysis.targetAudiences.reduce((sum, audience) => sum + audience.size, 0).toLocaleString()}
            </p>
            <p className="text-sm text-blue-700 mt-1">Potential viewers across all segments</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Reachable Audience</h4>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(marketAnalysis.targetAudiences.reduce((sum, audience) => sum + (audience.size * audience.reachability), 0)).toLocaleString()}
            </p>
            <p className="text-sm text-green-700 mt-1">Estimated accessible viewers</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">Revenue Potential</h4>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(marketAnalysis.revenueProjections.reduce((sum, projection) => sum + projection.totalRevenue, 0))}
            </p>
            <p className="text-sm text-purple-700 mt-1">Projected across all channels</p>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('trends')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Market Trends
          </h3>
          {expandedSections.has('trends') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('trends') && (
          <div className="mt-4 space-y-4">
            {marketAnalysis.marketTrends.map((trend) => (
              <div 
                key={trend.id} 
                className={`p-4 rounded-lg border ${
                  trend.impact === 'positive' ? 'border-green-200 bg-green-50' :
                  trend.impact === 'negative' ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{trend.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trend.impact === 'positive' ? 'bg-green-100 text-green-800' :
                    trend.impact === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trend.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Relevance: {Math.round(trend.relevance * 100)}%</span>
                  <span>Duration: {trend.projectedDuration}</span>
                </div>
              </div>
            ))}
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 w-full justify-center">
              <Plus className="w-4 h-4" />
              <span>Add Market Trend</span>
            </button>
          </div>
        )}
      </div>

      {/* SWOT Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('swot')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-green-600" />
            SWOT Analysis
          </h3>
          {expandedSections.has('swot') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('swot') && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {marketAnalysis.swotAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs font-medium">S</span>
                    </div>
                    <span className="text-sm text-green-800">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-3">Weaknesses</h4>
              <ul className="space-y-2">
                {marketAnalysis.swotAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-medium">W</span>
                    </div>
                    <span className="text-sm text-red-800">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Opportunities</h4>
              <ul className="space-y-2">
                {marketAnalysis.swotAnalysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-medium">O</span>
                    </div>
                    <span className="text-sm text-blue-800">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-3">Threats</h4>
              <ul className="space-y-2">
                {marketAnalysis.swotAnalysis.threats.map((threat, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 text-xs font-medium">T</span>
                    </div>
                    <span className="text-sm text-yellow-800">{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Competitive Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('competition')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Competitive Analysis
          </h3>
          {expandedSections.has('competition') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('competition') && (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audience Overlap
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marketAnalysis.competitiveAnalysis.map((competitor) => (
                    <tr key={competitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{competitor.title}</div>
                        <div className="text-xs text-gray-500">{new Date(competitor.releaseDate).getFullYear()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{competitor.creator}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {competitor.platform.map((platform, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${competitor.audienceOverlap * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">{Math.round(competitor.audienceOverlap * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{competitor.performance.views.toLocaleString()} views</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span>{competitor.performance.audienceScore}/10</span>
                          </div>
                          <span className="mx-2">•</span>
                          <span>{competitor.performance.awards.length} awards</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 w-full justify-center mt-4">
              <Plus className="w-4 h-4" />
              <span>Add Competitor</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlanTab = () => (
    <div className="space-y-6">
      {/* Distribution Strategy */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Strategy</h3>
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <p className="text-gray-700">{distributionPlan.strategy}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Performance Indicators</h4>
            <div className="space-y-3">
              {distributionPlan.kpis.map((kpi, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900">{kpi.name}</h5>
                    <span className="text-sm text-gray-500">{kpi.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Target: {kpi.target}</span>
                    <span className="text-gray-600">Measured by: {kpi.measurement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Budget Allocation</h4>
            <div className="p-3 bg-gray-50 rounded-lg mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Total Budget</span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(distributionPlan.budget.total)}</span>
              </div>
              <div className="space-y-2">
                {distributionPlan.budget.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.category}</span>
                    <span className="text-sm text-gray-900">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 w-full justify-center">
              <Edit3 className="w-4 h-4" />
              <span>Edit Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Distribution Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('timeline')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Distribution Timeline
          </h3>
          {expandedSections.has('timeline') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('timeline') && (
          <div className="mt-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {distributionPlan.timeline.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex items-start">
                    <div className={`absolute left-8 w-3 h-3 rounded-full mt-1.5 -ml-1.5 border-2 border-white ${
                      milestone.status === 'completed' ? 'bg-green-500' :
                      milestone.status === 'in-progress' ? 'bg-blue-500' :
                      milestone.status === 'delayed' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`}></div>
                    
                    <div className="min-w-32 flex-shrink-0 flex flex-col items-center text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(milestone.date).toLocaleDateString('en-US', { year: 'numeric' })}
                      </div>
                    </div>
                    
                    <div className="ml-6 pb-6">
                      <div className={`p-4 rounded-lg ${
                        milestone.status === 'completed' ? 'bg-green-50 border border-green-200' :
                        milestone.status === 'in-progress' ? 'bg-blue-50 border border-blue-200' :
                        milestone.status === 'delayed' ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            milestone.status === 'delayed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                        {milestone.deliverables.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Deliverables:</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {milestone.deliverables.map((deliverable, idx) => (
                                <li key={idx} className="flex items-center space-x-1">
                                  <div className={`w-3 h-3 rounded-full ${
                                    milestone.status === 'completed' ? 'bg-green-500' :
                                    'bg-gray-300'
                                  }`}></div>
                                  <span>{deliverable}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 w-full justify-center mt-4">
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>
        )}
      </div>

      {/* Marketing Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('marketing')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-600" />
            Marketing Plan
          </h3>
          {expandedSections.has('marketing') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('marketing') && (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {distributionPlan.marketingPlan.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                        <div className="text-xs text-gray-500">{activity.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.type === 'social' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'pr' ? 'bg-purple-100 text-purple-800' :
                          activity.type === 'advertising' ? 'bg-green-100 text-green-800' :
                          activity.type === 'event' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(activity.budget)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 w-full justify-center mt-4">
              <Plus className="w-4 h-4" />
              <span>Add Marketing Activity</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAudiencesTab = () => (
    <div className="space-y-6">
      {/* Target Audiences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('audiences')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Target Audiences
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddAudience(true);
            }}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Audience</span>
          </button>
        </div>
        
        {expandedSections.has('audiences') && (
          <div className="mt-4 space-y-4">
            {showAddAudience ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-3">Add Target Audience</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Audience Name
                    </label>
                    <input
                      type="text"
                      value={newAudience.name}
                      onChange={(e) => setNewAudience(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Film Enthusiasts, Subject Matter Experts"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age Range
                      </label>
                      <select
                        value={newAudience.demographics?.ageRange}
                        onChange={(e) => setNewAudience(prev => ({
                          ...prev,
                          demographics: {
                            ...(prev.demographics || {}),
                            ageRange: e.target.value
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select age range</option>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45-54">45-54</option>
                        <option value="55-64">55-64</option>
                        <option value="65+">65+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newAudience.priority}
                        onChange={(e) => setNewAudience(prev => ({
                          ...prev,
                          priority: e.target.value as any
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="tertiary">Tertiary</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Size
                      </label>
                      <input
                        type="number"
                        value={newAudience.size || ''}
                        onChange={(e) => setNewAudience(prev => ({
                          ...prev,
                          size: parseInt(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Audience size"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reachability (0-1)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newAudience.reachability || ''}
                        onChange={(e) => setNewAudience(prev => ({
                          ...prev,
                          reachability: parseFloat(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.0 - 1.0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interests (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newAudience.psychographics?.interests.join(', ')}
                      onChange={(e) => setNewAudience(prev => ({
                        ...prev,
                        psychographics: {
                          ...(prev.psychographics || {}),
                          interests: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., documentaries, social issues, history"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowAddAudience(false)}
                      className="px-3 py-1 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAudience}
                      disabled={!newAudience.name}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Audience
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              marketAnalysis.targetAudiences.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Target Audiences</h4>
                  <p className="text-gray-600 mb-4">Define your target audiences to improve distribution strategy</p>
                  <button
                    onClick={() => setShowAddAudience(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Audience
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketAnalysis.targetAudiences.map((audience) => (
                    <div key={audience.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{audience.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            audience.priority === 'primary' ? 'bg-blue-100 text-blue-800' :
                            audience.priority === 'secondary' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {audience.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteAudience(audience.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Demographics</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Age:</span>
                              <span className="text-gray-900">{audience.demographics.ageRange}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="text-gray-900">{audience.demographics.gender.join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="text-gray-900">{audience.demographics.location.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Psychographics</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Interests:</span>
                              <span className="text-gray-900">{audience.psychographics.interests.join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Values:</span>
                              <span className="text-gray-900">{audience.psychographics.values.join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Behaviors:</span>
                              <span className="text-gray-900">{audience.psychographics.behaviors.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium text-gray-900">{audience.size.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Reachability:</span>
                          <span className="font-medium text-gray-900">{Math.round(audience.reachability * 100)}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Potential Reach:</span>
                          <span className="font-medium text-gray-900">{Math.round(audience.size * audience.reachability).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderChannelsTab = () => (
    <div className="space-y-6">
      {/* Distribution Channels */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('channels')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-green-600" />
            Distribution Channels
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddChannel(true);
            }}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Channel</span>
          </button>
        </div>
        
        {expandedSections.has('channels') && (
          <div className="mt-4 space-y-4">
            {showAddChannel ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-900 mb-3">Add Distribution Channel</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Channel Name
                    </label>
                    <input
                      type="text"
                      value={newChannel.name}
                      onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Netflix, PBS, Film Festivals"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Channel Type
                      </label>
                      <select
                        value={newChannel.type}
                        onChange={(e) => setNewChannel(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="streaming">Streaming</option>
                        <option value="theatrical">Theatrical</option>
                        <option value="broadcast">Broadcast</option>
                        <option value="festival">Festival</option>
                        <option value="educational">Educational</option>
                        <option value="community">Community</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Revenue Model
                      </label>
                      <input
                        type="text"
                        value={newChannel.revenueModel}
                        onChange={(e) => setNewChannel(prev => ({ ...prev, revenueModel: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Licensing, Revenue Share"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Audience Reach
                      </label>
                      <input
                        type="number"
                        value={newChannel.audienceReach || ''}
                        onChange={(e) => setNewChannel(prev => ({ ...prev, audienceReach: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Potential audience size"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entry Fee
                      </label>
                      <input
                        type="number"
                        value={newChannel.costStructure?.entryFee || ''}
                        onChange={(e) => setNewChannel(prev => ({
                          ...prev,
                          costStructure: {
                            ...(prev.costStructure || {}),
                            entryFee: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Cost to submit/enter"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newChannel.requirements?.join(', ')}
                      onChange={(e) => setNewChannel(prev => ({
                        ...prev,
                        requirements: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., DCP, Subtitles, Press Kit"
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowAddChannel(false)}
                      className="px-3 py-1 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddChannel}
                      disabled={!newChannel.name || !newChannel.type}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Channel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              marketAnalysis.distributionChannels.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Distribution Channels</h4>
                  <p className="text-gray-600 mb-4">Add distribution channels to plan your release strategy</p>
                  <button
                    onClick={() => setShowAddChannel(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Channel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketAnalysis.distributionChannels.map((channel) => (
                    <div key={channel.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{channel.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            channel.type === 'streaming' ? 'bg-blue-100 text-blue-800' :
                            channel.type === 'theatrical' ? 'bg-purple-100 text-purple-800' :
                            channel.type === 'festival' ? 'bg-yellow-100 text-yellow-800' :
                            channel.type === 'broadcast' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {channel.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Audience Reach:</span>
                          <span className="ml-1 font-medium text-gray-900">{channel.audienceReach.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue Model:</span>
                          <span className="ml-1 font-medium text-gray-900">{channel.revenueModel}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Relevance:</span>
                          <span className="ml-1 font-medium text-gray-900">{Math.round(channel.relevance * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Competitiveness:</span>
                          <span className="ml-1 font-medium text-gray-900">{Math.round(channel.competitiveness * 100)}%</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600">
                        <div className="font-medium text-gray-700 mb-1">Requirements:</div>
                        <div className="flex flex-wrap gap-1">
                          {channel.requirements.map((req, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Entry Fee: {formatCurrency(channel.costStructure.entryFee)}</span>
                          <span className="text-gray-600">Revenue Split: {channel.costStructure.revenueSplit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Planned Channels */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('planned')}
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Planned Releases
          </h3>
          {expandedSections.has('planned') ? 
            <ChevronDown className="w-5 h-5 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 text-gray-500" />
          }
        </div>
        
        {expandedSections.has('planned') && (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Launch Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audience
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {distributionPlan.channels.map((channel) => (
                    <tr key={channel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                        <div className="text-xs text-gray-500">{channel.strategy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {channel.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(channel.launchDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{channel.audience}</div>
                        <div className="text-xs text-gray-500">{channel.projectedReach.toLocaleString()} potential reach</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          channel.status === 'live' ? 'bg-green-100 text-green-800' :
                          channel.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          channel.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                          channel.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {channel.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 w-full justify-center mt-4">
              <Plus className="w-4 h-4" />
              <span>Add Planned Release</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Distribution Planner</h2>
          <p className="text-sm text-gray-600">Market analysis and distribution strategy</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'market', label: 'Market Analysis', icon: BarChart2 },
            { id: 'plan', label: 'Distribution Plan', icon: Calendar },
            { id: 'audiences', label: 'Target Audiences', icon: Users },
            { id: 'channels', label: 'Distribution Channels', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
        {activeTab === 'market' && renderMarketTab()}
        {activeTab === 'plan' && renderPlanTab()}
        {activeTab === 'audiences' && renderAudiencesTab()}
        {activeTab === 'channels' && renderChannelsTab()}
      </div>

      {/* Export & Share */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Distribution Strategy</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4" />
              <span>Export Plan</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock components
const Star = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);